import { useState, useEffect } from 'react'
import Quake from './quake'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'
import Search from './search'

export default function QuakeWrapper() {
  let today = ''
  let startDefault = ''

  function getDateString() {
    let date = new Date().toISOString().slice(0, 10)
    return date
  }

  function getStartDateString() {
    let startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    startDate = startDate.toISOString().slice(0, 10)
    return startDate
  }

  today = getDateString()
  startDefault = getStartDateString()

  const [minMag, setMinMag] = useState(0)
  const [maxMag, setMaxMag] = useState(10)
  const [latitude, setLat] = useState('')
  const [longitude, setLong] = useState('')
  const [radius, setRadius] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState(today)
  const [sort, setSort] = useState('time')

  const [fetchString, setFetch] = useState(
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=6&limit=5'
  )
  const [quakes, setQuakes] = useState([])

  // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02

  // TODO: string builder for fetch request

  useEffect(() => {
    fetch(fetchString)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setQuakes(data.features)
        // console.log(data.features)
      })
  }, [fetchString])

  // const handleSortChange = e => {
  //   const { sort, value } = e.target

  //   setSort({
  //     sort: value,
  //   })
  // }

  const startString =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&'

  const handleFetchChange = evt => {
    evt.preventDefault()
    let latString = ''
    let longString = ''
    let radiusString = ''
    let startDateString = ''
    let endDateString = ''
    let minMagString = minMag.toString()
    let maxMagString = maxMag.toString()
    let orderString = ''

    if (latitude != '' && longitude != '' && radius != '') {
      latString = '&latitude=' + latitude
    } else {
      latString = ''
    }
    if (longitude != '' && latitude != '' && radius != '') {
      longString = '&longitude=' + longitude
    } else {
      longString = ''
    }
    if (radius != '' && longitude != '' && latitude != '') {
      radiusString = '&maxradiuskm=' + radius
    } else {
      radiusString = ''
    }
    if (start != '') {
      startDateString = '&starttime=' + start
      orderString = '&orderby=time-asc'
    } else {
      startDateString = ''
      orderString = '&orderby=magnitude'
    }
    if (end != null) {
      endDateString = '&endtime=' + end
    } else {
      endDateString = ''
    }

    let fetchString =
      startString +
      'minmagnitude=' +
      minMagString +
      '&maxmagnitude=' +
      maxMagString +
      latString +
      longString +
      radiusString +
      startDateString +
      endDateString +
      '&limit=100' +
      orderString

    setFetch(fetchString)
  }

  return (
    <div className='sm:columns-2 xl:columns-auto columns-1 gap-5 p-5 md:min-w-full'>
      <div className='border border-stone-500 p-2 pb-0 text-center bg-stone-100'>
        <h3 className='font-bold text-lg'>Earthquake Search Filter:</h3>
        <p className='text-stone-600 text-sm'>Limited to 100 results</p>
        <form className='font-bold'>
          <div className='m-2 block border-y py-2 border-stone-600 text-center'>
            <label className='p-1 inline-block'>
              Min Magnitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='number'
                value={minMag}
                min='0'
                max='10'
                step='0.25'
                placeholder='3'
                onChange={e => setMinMag(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block'>
              Max Magnitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='number'
                value={maxMag}
                min='0'
                max='10'
                step='0.25'
                placeholder='8'
                onChange={e => setMaxMag(e.target.value)}
              />
            </label>
          </div>
          <div className='m-2 block border-b pb-2 border-stone-600 text-center'>
            <label className='p-1 inline-block'>
              Latitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='number'
                step='0.001'
                value={latitude}
                min='-90'
                max='90'
                placeholder='0'
                onChange={e => setLat(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block'>
              Longitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='number'
                step='0.001'
                value={longitude}
                min='-180'
                max='180'
                placeholder='0'
                onChange={e => setLong(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block'>
              Radius (km):{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='number'
                value={radius}
                min='500'
                max='20000'
                placeholder='5000'
                onChange={e => setRadius(e.target.value)}
              />
            </label>
            <p className='text-stone-600 text-sm font-normal'>
              Must include all fields to use location search
            </p>
          </div>
          <div className='m-2 block border-b pb-2 border-stone-600 text-center'>
            <label className='p-1 inline-block'>
              Start Date:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='date'
                value={start}
                //   min='1'
                //   max='10000'
                placeholder=''
                onChange={e => setStart(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block'>
              End Date:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-center'
                type='date'
                value={end}
                //   min='1'
                //   max='10000'
                placeholder={today}
                onChange={e => setEnd(e.target.value)}
              />
            </label>
            <p className='text-stone-600 text-sm font-normal'>
              Defaults to previous 30 days
            </p>
          </div>
          {/*
          <div className='m-2 block border-b pb-2 border-stone-600 text-center'>
            <p>Order By:</p>
            <label className='p-1'>
              Time:{' '}
              <input
                type='radio'
                name='order'
                value='time'
                checked
                onChange={handleSortChange}
              />
            </label>
            <label className='p-1'>
              Magnitude:{' '}
              <input
                type='radio'
                name='order'
                value='magnitude'
                onChange={handleSortChange}
              />
            </label>
          </div> */}
          <div className='m-2 mb-1 block text-center'>
            <button
              type='submit'
              className='bg-blue-200 rounded-md border border-blue-700 hover:bg-blue-50 px-2 py-1 text-center'
              onClick={handleFetchChange}
            >
              Find Earthquakes
            </button>
          </div>
          <div className='text-stone-600 text-sm font-normal m-2'>
            {quakes.length} Earthquakes found
          </div>
        </form>
      </div>

      {quakes.length > 0 ? (
        quakes.map(quake => {
          return <Quake quakeData={quake} key={quake.id} />
        })
      ) : (
        <div>
          No Earthquakes Found
          <Map
            provider={stamenTerrain}
            dprs={[1, 2]}
            height={300}
            defaultCenter={[latitude, longitude]}
            defaultZoom={4}
          >
            <ZoomControl />
            <Marker width={30} anchor={[latitude, longitude]} />
          </Map>
        </div>
      )}
    </div>
  )
}
