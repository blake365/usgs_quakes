import { useState, useEffect } from 'react'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'

export default function FeaturedQuake() {
  const [quakes, setQuakes] = useState([])
  const [details, setDetails] = useState([])

  // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02

  // TODO: string builder for fetch request

  let today = ''
  function getDateString() {
    let date = new Date().toISOString().slice(0, 10)
    // console.log(typeof date)
    return date
  }

  today = getDateString()

  let startString =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&endtime='

  let fetchString = startString + today + '&minmagnitude=7&limit=1'

  useEffect(() => {
    fetch(fetchString)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setQuakes(data.features)
        console.log(data.features)
      })
  }, [])

  // let quakeTime = new Date(quakes.properties.time)

  //*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
  //*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
  Date.prototype.customFormat = function (formatString) {
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
    <section>
      <div className='flex flex-wrap items-center justify-around max-w-8xl mt-2 sm:w-full md:w-1/2'>
        {quakes.length > 0 ? (
          quakes.map(quake => {
            return (
              <div className='px-6 py-2 mt-4 text-left border border-yellow-400 rounded-none shadow-md bg-gradient-to-b from-yellow-400 to-white w-full'>
                <h2 className='text-center text-xl font-bold'>
                  Featured Quake
                </h2>

                <div className='flex justify-between'>
                  <h3 className='text-2xl font-bold inline'>
                    {quake.properties.place}
                  </h3>
                  <div
                    style={{
                      backgroundImage: "url('/icons/shockwave.svg')",
                    }}
                    className='inline w-15 h-15 py-1 px-2  text-blue-300 bg-auto bg-no-repeat bg-center font-bold'
                  >
                    {quake.properties.mag}
                  </div>
                </div>
                <h4>
                  {new Date(quake.properties.time).customFormat(
                    '#MM#/#DD#/#YYYY# #hh#:#mm#:#ss#'
                  )}
                </h4>
                <p className='mt-1 text-md'>
                  Tsunami Potential: {quake.properties.tsunami}
                </p>
                <p className='mt-1 text-md'>
                  location: {quake.geometry.coordinates[1]},{' '}
                  {quake.geometry.coordinates[0]}
                </p>

                <Map
                  provider={stamenTerrain}
                  dprs={[1, 2]}
                  height={200}
                  defaultCenter={[
                    quake.geometry.coordinates[1],
                    quake.geometry.coordinates[0],
                  ]}
                  defaultZoom={4}
                >
                  <ZoomControl />
                  <Marker
                    color={quake.properties.alert}
                    width={30}
                    anchor={[
                      quake.geometry.coordinates[1],
                      quake.geometry.coordinates[0],
                    ]}
                  />
                </Map>
              </div>
            )
          })
        ) : (
          <div>loading...</div>
        )}
      </div>
    </section>
  )
}
