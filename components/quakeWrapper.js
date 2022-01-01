import { useState, useEffect } from 'react'
import Quake from './quake'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'
import Search from './search'
// import styles from './styles.css'

export default function QuakeWrapper() {
  // let locationAvailable

  // if ('geolocation' in navigator) {
  //   locationAvailable = true
  // } else {
  //   locationAvailable = false
  // }

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

  const [minMag, setMinMag] = useState(6)
  const [maxMag, setMaxMag] = useState(10)
  const [latitude, setLat] = useState('')
  const [longitude, setLong] = useState('')
  const [radius, setRadius] = useState(500)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState(today)
  const [sort, setSort] = useState('time')

  const [fetchString, setFetch] = useState(
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=6&limit=10&orderby=magnitude'
  )
  const [quakes, setQuakes] = useState([])
  const [meta, setMeta] = useState([])
  const [loading, isLoading] = useState(false)

  // useEffect(() => {
  //   fetch(fetchString)
  //     .then(function (response) {
  //       return response.json()
  //     })
  //     .then(function (data) {
  //       setQuakes(data.features)
  //       setMeta(data.metadata)
  //       // console.log(data.features)
  //     })
  // }, [fetchString])

  useEffect(() => {
    const fetchData = async () => {
      isLoading(true)
      const res = await fetch(fetchString)
      const json = await res.json()
      // console.log(json)
      setQuakes(json.features)
      setMeta(json.metadata)
      isLoading(false)
    }
    fetchData()
  }, [fetchString])

  // const handleSortChange = e => {
  //   const { sort, value } = e.target

  //   setSort({
  //     sort: value,
  //   })
  // }

  const handleResetFields = evt => {
    evt.preventDefault()
    setMinMag(0)
    setMaxMag(10)
    setLat('')
    setLong('')
    setRadius('')
    setStart('')
    setEnd(today)
  }

  const handleLocationRequest = evt => {
    evt.preventDefault()
    navigator.geolocation.getCurrentPosition(position => {
      setLat(position.coords.latitude)
      setLong(position.coords.longitude)
      setRadius(100)
    })
  }

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
      orderString +
      '&jsonerror=true'

    setFetch(fetchString)
  }

  return (
    <div className=' columns-1 gap-4 pt-4 w-full min-h-max p-2'>
      <div className='border border-stone-500 pb-0 text-center bg-stone-100 mb-5'>
        <div className='flex justify-between bg-amber-400 p-1'>
          <button
            type='submit'
            className='bg-orange-200 rounded-md border border-orange-700 hover:bg-orange-50 px-1 text-center invisible'
            onClick={handleResetFields}
          >
            Reset
          </button>
          <div>
            <h3 className=' text-2xl block uppercase'>
              Earthquake Search Filter
            </h3>
            <p className='text-stone-600 text-sm block'>
              Limited to 100 results
            </p>
          </div>
          <button
            type='submit'
            className='bg-stone-200 rounded-md border h-fit align-middle border-stone-700 hover:bg-stone-50 px-1 text-center m-3'
            onClick={handleResetFields}
          >
            Reset
          </button>
        </div>
        <form className='font-bold'>
          <div className=' block border-y py-2 border-stone-600 text-center'>
            <label className='p-1 inline-block xs:block'>
              Min Magnitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right w-10'
                type='number'
                value={minMag}
                min='0'
                max='10'
                step='0.25'
                placeholder='3'
                onChange={e => setMinMag(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block xs:block'>
              Max Magnitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right w-12'
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
          <div className=' block border-b py-2 border-stone-600 text-center'>
            <label className='p-1 inline-block xs:block'>
              Latitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right w-28'
                type='number'
                step='0.001'
                value={latitude}
                min='-90'
                max='90'
                placeholder='0'
                onChange={e => setLat(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block xs:block'>
              Longitude:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right w-32'
                type='number'
                step='0.001'
                value={longitude}
                min='-180'
                max='180'
                placeholder='0'
                onChange={e => setLong(e.target.value)}
              />
            </label>

            <label className='p-1 inline-block xs:block'>
              Radius (km):{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right'
                type='number'
                value={radius}
                min='100'
                max='20000'
                placeholder='500'
                onChange={e => setRadius(e.target.value)}
              />
            </label>
            <div className=' mb-1 inline text-center'>
              <button
                type='submit'
                className='px-1 py-1 text-center text-xl'
                onClick={handleLocationRequest}
              >
                📍
              </button>
            </div>
            <p className='text-stone-600 text-sm font-normal'>
              Must include all fields to use location search
            </p>
          </div>
          <div className=' block border-b py-2 border-stone-600 text-center'>
            <label className='p-1 inline-block xs:block'>
              Start Date:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right'
                type='date'
                value={start}
                //   min='1'
                //   max='10000'
                placeholder=''
                onChange={e => setStart(e.target.value)}
              />
            </label>
            <label className='p-1 inline-block xs:block'>
              End Date:{' '}
              <input
                className='bg-stone-200 rounded-md border border-stone-700 hover:bg-blue-50 px-1 text-right'
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
          <div className='text-red-600 text-sm font-normal m-2'>
            {meta.error}
          </div>
          <div className='text-stone-600 text-sm font-normal m-2'>
            {loading ? (
              <div>Searching...</div>
            ) : (
              <div>{quakes.length} Earthquakes found</div>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className='w-full border mb-4 border-stone-600 bg-stone-100 text-center align-middle'>
          <div className='ldsripple mt-5'>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        quakes.map(quake => {
          return <Quake quakeData={quake} key={quake.id} />
        })
      )}
    </div>
  )
}
