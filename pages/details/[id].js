import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'

export default function Details() {
  const router = useRouter()
  const quakeID = router.query.id
  // console.log()

  const [details, setDetails] = useState({})
  const [tectonic, setTectonic] = useState({})
  const [offshore, setOffshore] = useState({})
  const [loading, isLoading] = useState(false)

  let detailSearch =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventid=' +
    quakeID

  let tectonicSearch = 'https://earthquake.usgs.gov/ws/geoserve/regions.json?'

  useEffect(() => {
    fetch(detailSearch)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        // console.log(data)
        if (data.properties.products['general-text']) {
          setDetails(data)
        } else {
          tectonicSearch =
            tectonicSearch +
            'latitude=' +
            data.geometry.coordinates[1] +
            '&longitude=' +
            data.geometry.coordinates[0]

          // console.log(tectonicSearch)

          const fetchData = async () => {
            isLoading(true)
            const res = await fetch(tectonicSearch)
            const json = await res.json()
            // console.log(json)
            setTectonic(json.tectonic.features)
            setOffshore(json.offshore)
            isLoading(false)
          }
          fetchData()
          setDetails(data)
        }
      })
  }, [])

  let now = new Date()

  // console.log(details.properties.products)
  // console.log(offshore)

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
    <div className='bg-stone-300 w-full py-2'>
      <div className='flex font-semibold w-full text-center p-2 mt-5 h-20 align-middle overflow-hidden border-y border-stone-600 bg-stone-100'>
        <h1 className='lg:text-6xl md:text-5xl sm:text-3xl text-2xl w-full uppercase my-auto'>
          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 hidden sm:inline'
          />

          <a
            href='/'
            className='lg:text-6xl md:text-5xl sm:text-3xl text-2xl w-full uppercase text-black hover:no-underline'
          >
            {' '}
            USGS Earthquake Feed{' '}
          </a>

          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 hidden sm:inline'
          />
        </h1>
      </div>
      <main className=' md:max-w-4xl w-11/12 border my-5  border-stone-600 bg-stone-100 rounded-lg overflow-hidden shadow-lg m-auto'>
        {details.properties ? (
          <div className='px-5 text-left w-full py-2 '>
            <div className='text-sm text-stone-800 flex columns-2 justify-between'>
              <div className=''>
                {new Date(details.properties.time).customFormat(
                  '#MM#/#DD#/#YYYY# #hh#:#mm#:#ss# #AMPM#'
                )}
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
            {details.properties.alert === 'orange' ? (
              <a
                className='text-3xl font-bold  hover:text-orange-800 hover:underline pr-3 text-orange-600'
                href={details.properties.url}
                target='_blank'
              >
                {details.properties.title}
              </a>
            ) : details.properties.alert === 'red' ? (
              <a
                className='text-3xl font-bold  hover:text-red-900 hover:underline pr-3 text-red-700'
                href={details.properties.url}
                target='_blank'
              >
                {details.properties.title}
              </a>
            ) : details.properties.alert === 'yellow' ? (
              <a
                className='text-3xl font-bold  hover:text-amber-600 hover:underline pr-3 text-amber-400'
                href={details.properties.url}
                target='_blank'
              >
                {details.properties.title}
              </a>
            ) : (
              <a
                className='text-3xl font-bold  hover:text-green-900 hover:underline pr-3 text-green-700'
                href={details.properties.url}
                target='_blank'
              >
                {details.properties.title}
              </a>
            )}

            <div className='md:text-lg leading-8 align-middle text-md'>
              <div className='text-lg inline align-middle'>🗺 </div>
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
            <div className='leading-8 align-middle text-lg mb-2'>
              📝 {details.properties.felt != null ? details.properties.felt : 0}{' '}
              reports{' '}
              {(now - details.properties.time) / (1000 * 60 * 60 * 24) > 30 ? (
                ''
              ) : (
                <a
                  className='text-sm text-blue-600 hover:text-blue-800 hover:underline'
                  href={details.properties.url + '/tellus'}
                  target='_blank'
                >
                  Did you feel it?
                </a>
              )}
            </div>
            <div className='w-full'>
              {details.properties.products['shakemap'] ? (
                <img
                  className='max-h-[95vh] max-w-full h-auto object-cover m-auto border border-stone-600 mb-5 rounded-md'
                  src={`https://earthquake.usgs.gov/product/shakemap/${details.properties.products.shakemap[0].code}/${details.properties.products.shakemap[0].source}/${details.properties.products.shakemap[0].updateTime}/download/intensity.jpg`}
                />
              ) : (
                <div className='border border-stone-600 rounded-lg overflow-hidden m-auto mb-5 w-11/12 h-[400px] justify-center'>
                  <Map
                    provider={stamenTerrain}
                    dprs={[1, 2]}
                    height={400}
                    metaWheelZoom={true}
                    mouseEvents={false}
                    // touchEvents={false}
                    defaultCenter={[
                      details.geometry.coordinates[1],
                      details.geometry.coordinates[0],
                    ]}
                    defaultZoom={7}
                  >
                    <ZoomControl />
                    <Marker
                      color={details.properties.alert}
                      width={30}
                      hover={false}
                      anchor={[
                        details.geometry.coordinates[1],
                        details.geometry.coordinates[0],
                      ]}
                    />
                  </Map>
                </div>
              )}

              <div className='max-h-[600px] overflow-scroll p-4 mb-3 border border-stone-600 rounded-md bg-stone-200'>
                {details.properties.products['impact-text'] ? (
                  <div className=''>
                    <div className='text-2xl mb-1 font-bold'>Human Impact</div>
                    <div
                      className='text-sm mb-1'
                      dangerouslySetInnerHTML={{
                        __html:
                          details.properties.products['impact-text'][0]
                            .contents[''].bytes,
                      }}
                    ></div>
                  </div>
                ) : (
                  ''
                )}

                {(() => {
                  if (details.properties.products['general-text']) {
                    return (
                      <div>
                        <div className='text-2xl mb-1 font-bold'>
                          Tectonic Summary
                        </div>
                        {details.properties.products[
                          'general-text'
                        ][0].contents[''].bytes
                          .split('Tectonic Summary')[1]
                          .split('\n')
                          .filter(n => n)
                          .map((item, index) => {
                            return (
                              <div
                                key={index}
                                className='text-sm mb-1.5'
                                dangerouslySetInnerHTML={{
                                  __html: item,
                                }}
                              ></div>
                            )
                          })}
                      </div>
                    )
                  } else {
                    if (loading) {
                      return (
                        <div className='w-full border mb-4 border-stone-600 bg-stone-100 text-center align-middle'>
                          <div className='ldsripple mt-5'>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      )
                    } else if (tectonic.length > 0) {
                      // console.log(tectonic[0].properties.summary.length)
                      return (
                        <div>
                          <div className='text-2xl mb-1 font-bold'>
                            Tectonic Summary
                          </div>
                          <div
                            className='text-sm mb-1'
                            dangerouslySetInnerHTML={{
                              __html: tectonic[0].properties.summary,
                            }}
                          ></div>
                        </div>
                      )
                    } else if (offshore.features.length > 0) {
                      return (
                        <div>
                          <div className='text-2xl mb-1 font-bold'>
                            Offshore Region
                          </div>
                          <div>{offshore[0].name.description}</div>
                        </div>
                      )
                    } else {
                      return <div>No Information Available</div>
                    }
                  }
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full border mb-4 border-stone-600 bg-stone-100 text-center align-middle'>
            <div className='ldsripple mt-5'>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </main>
      <footer className='w-full border-y border-stone-600 p-5 text-center text-lg bg-stone-100'>
        <div>Data provided by the United States Geological Survey</div>
        <a
          href='https://earthquake.usgs.gov/fdsnws/event/1/'
          target='_blank'
          className='underline text-blue-600 hover:text-blue-900'
        >
          API Documentation
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {},
  }
}
