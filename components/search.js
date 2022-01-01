import { useState } from 'react'

export default function Search(props) {
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

  const [fetchString, setFetchString] = useState('')

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
    } else {
      startDateString = ''
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
      '&limit=100'

    console.log(longString)
    props.handleFetchChange = fetchString
  }

  return (
    <form className=''>
      <div className='m-2 block '>
        <label className='p-1'>
          Min Magnitude:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='number'
            value={minMag}
            min='0'
            max='10'
            placeholder='3'
            onChange={e => setMinMag(e.target.value)}
          />
        </label>
        <label className='p-1'>
          Max Magnitude:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='number'
            value={maxMag}
            min='0'
            max='10'
            placeholder='8'
            onChange={e => setMaxMag(e.target.value)}
          />
        </label>
      </div>
      <div className='m-2 block '>
        <label className='p-1'>
          Latitude:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='number'
            value={latitude}
            min='-90'
            max='90'
            placeholder='0'
            onChange={e => setLat(e.target.value)}
          />
        </label>
        <label className='p-1'>
          Longitude:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='number'
            value={longitude}
            min='-180'
            max='180'
            placeholder='0'
            onChange={e => setLong(e.target.value)}
          />
        </label>
        <label className='p-1'>
          Radius (km):{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='number'
            value={radius}
            min='1'
            max='10000'
            placeholder='500'
            onChange={e => setRadius(e.target.value)}
          />
        </label>
      </div>
      <div className='m-2 block '>
        <label className='p-1'>
          Start Date:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='date'
            value={start}
            //   min='1'
            //   max='10000'
            placeholder=''
            onChange={e => setStart(e.target.value)}
          />
        </label>
        <label className='p-1'>
          End Date:{' '}
          <input
            className='bg-slate-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
            type='date'
            value={end}
            //   min='1'
            //   max='10000'
            placeholder={today}
            onChange={e => setEnd(e.target.value)}
          />
        </label>
      </div>
      <div className='m-2 block text-center'>
        <button
          type='submit'
          className='bg-blue-200 rounded-md border border-blue-700 hover:bg-blue-100 px-1 text-center'
          onClick={() => handleFetchChange}
        >
          Filter
        </button>
      </div>
    </form>
  )
}
