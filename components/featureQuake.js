import { useState, useEffect } from 'react'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'

export default function FeaturedQuake() {
  const [quakes, setQuakes] = useState([])
  const [details, setDetails] = useState({})

  // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02

  let today = ''
  function getDateString() {
    let date = new Date().toISOString().slice(0, 10)
    // console.log(typeof date)
    return date
  }

  today = getDateString()

  let startString =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&alertlevel=red&minmagnitude=6.5&starttime=2020-01-01&limit=1'

  useEffect(() => {
    fetch(startString)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        // console.log(data)
        fetch(data.features[0].properties.detail)
          .then(function (response) {
            return response.json()
          })
          .then(function (data) {
            console.log(data.properties)
            setDetails(data)
          })
      })
  }, [])

  // console.log(details.properties)

  //earthquake.usgs.gov/product/shakemap/us7000f93v/us/1632532448210/download/intensity.jpg
  //earthquake.usgs.gov/product/shakemap/us7000f93v/us/1632532514552/download/intensity.jpg
  //earthquake.usgs.gov/product/shakemap/us7000f93v/us/1640260509523/download/intensity.jpg

  // details.properties.products.shakemap[0].code
  // details.properties.products.shakemap[0].updateTime

  // let quakeTime = new Date(quakes.properties.time)

  //*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
  //*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
  http: https: Date.prototype.customFormat = function (formatString) {
    var YYYY,
      YY,
      MMMM,
      MMM,
      MM,
      M,
      DDDD,
      DDD,
      DD,
      D,
      hhhh,
      hhh,
      hh,
      h,
      mm,
      m,
      ss,
      s,
      ampm,
      AMPM,
      dMod,
      th
    YY = ((YYYY = this.getFullYear()) + '').slice(-2)
    MM = (M = this.getMonth() + 1) < 10 ? '0' + M : M
    MMM = (MMMM = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][M - 1]).substring(0, 3)
    DD = (D = this.getDate()) < 10 ? '0' + D : D
    DDD = (DDDD = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][this.getDay()]).substring(0, 3)
    th =
      D >= 10 && D <= 20
        ? 'th'
        : (dMod = D % 10) == 1
        ? 'st'
        : dMod == 2
        ? 'nd'
        : dMod == 3
        ? 'rd'
        : 'th'
    formatString = formatString
      .replace('#YYYY#', YYYY)
      .replace('#YY#', YY)
      .replace('#MMMM#', MMMM)
      .replace('#MMM#', MMM)
      .replace('#MM#', MM)
      .replace('#M#', M)
      .replace('#DDDD#', DDDD)
      .replace('#DDD#', DDD)
      .replace('#DD#', DD)
      .replace('#D#', D)
      .replace('#th#', th)
    h = hhh = this.getHours()
    if (h == 0) h = 24
    if (h > 12) h -= 12
    hh = h < 10 ? '0' + h : h
    hhhh = hhh < 10 ? '0' + hhh : hhh
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase()
    mm = (m = this.getMinutes()) < 10 ? '0' + m : m
    ss = (s = this.getSeconds()) < 10 ? '0' + s : s
    return formatString
      .replace('#hhhh#', hhhh)
      .replace('#hhh#', hhh)
      .replace('#hh#', hh)
      .replace('#h#', h)
      .replace('#mm#', mm)
      .replace('#m#', m)
      .replace('#ss#', ss)
      .replace('#s#', s)
      .replace('#ampm#', ampm)
      .replace('#AMPM#', AMPM)
  }

  return (
    <section className='px-2 lg:w-3/5 xl:w-3/5'>
      {details.properties ? (
        <section className='w-full  columns-1 border mt-5 border-stone-600 bg-stone-100 '>
          <div className='p-1 text-center w-full border-b border-stone-600 text-2xl bg-amber-400 uppercase'>
            Featured quake
          </div>
          <div className='px-5 text-left w-full py-2 '>
            <div className='text-sm text-stone-800 flex columns-2 justify-between'>
              <div className=''>
                {new Date(details.properties.time).customFormat(
                  '#MM#/#DD#/#YYYY# #hh#:#mm#:#ss#'
                )}{' '}
                UTC
              </div>
              {details.properties.status === 'reviewed' ? (
                <div className='pr-1 text-green-700'>
                  {details.properties.status}
                </div>
              ) : (
                <div className='pr-1 text-stone-700'>
                  {details.properties.status.substring(0, 4)}
                </div>
              )}
            </div>
            <a
              className='text-lg font-bold block hover:text-red-900 hover:underline pr-3 text-red-700'
              href={details.properties.url}
              target='_blank'
            >
              {details.properties.title}
            </a>

            <div className='text-lg leading-8 align-middle'>
              <img src='/icons/shockwave.svg' className='w-7 h-7 inline' />{' '}
              {Math.round(Math.abs(details.geometry.coordinates[1]) * 1000) /
                1000}
              &deg;
              {details.geometry.coordinates[1] < 0 ? 'S' : 'N'},{' '}
              {Math.round(Math.abs(details.geometry.coordinates[0]) * 1000) /
                1000}
              &deg;
              {details.geometry.coordinates[0] < 0 ? 'W' : 'E'},{' '}
              {Math.round(details.geometry.coordinates[2] * 100) / 100} km deep
            </div>

            <div className='leading-8 align-middle text-lg'>
              <img src='/icons/waveform 1.svg' className='w-7 h-7 inline' />{' '}
              {details.properties.mag} {details.properties.magType}
            </div>
            <div className='leading-8 align-middle text-lg'>
              {details.properties.felt != null ? details.properties.felt : 0}{' '}
              reports{' '}
              <a
                className='text-sm text-blue-600 hover:text-blue-800 hover:underline'
                href={details.properties.url + '/tellus'}
                target='_blank'
              >
                Did you feel it?
              </a>
            </div>
            {/*}
            <Map
              provider={stamenTerrain}
              dprs={[1, 2]}
              height={300}
              defaultCenter={[
                details.geometry.coordinates[1],
                details.geometry.coordinates[0],
              ]}
              defaultZoom={6}
            >
              <ZoomControl />
              <Marker
                color={details.properties.alert}
                width={30}
                anchor={[
                  details.geometry.coordinates[1],
                  details.geometry.coordinates[0],
                ]}
              />
              </Map> */}
            <div className='w-full'>
              <img
                className='w-10/12 max-w-lg h-auto object-cover m-auto'
                src={`https://earthquake.usgs.gov/product/shakemap/${details.properties.products.shakemap[0].code}/us/${details.properties.products.shakemap[0].updateTime}/download/intensity.jpg
          `}
              />
              {details.properties.products['general-text'] ? (
                <div
                  className='text-sm max-w-fit'
                  dangerouslySetInnerHTML={{
                    __html:
                      details.properties.products['general-text'][0].contents[
                        ''
                      ].bytes,
                  }}
                ></div>
              ) : (
                ''
              )}
            </div>
          </div>
        </section>
      ) : (
        <div>loading</div>
      )}
    </section>
  )
}
