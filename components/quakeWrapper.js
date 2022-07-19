import { useState, useEffect } from 'react'
import Quake from './quake'

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

	const [minMag, setMinMag] = useState(6)
	const [maxMag, setMaxMag] = useState(10)
	const [latitude, setLat] = useState('')
	const [longitude, setLong] = useState('')
	const [radius, setRadius] = useState(500)
	const [start, setStart] = useState('')
	const [end, setEnd] = useState(today)
	const [sort, setSort] = useState('date')
	const [direction, setDir] = useState('desc')

	const [fetchString, setFetch] = useState(
		'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=6&limit=10&orderby=magnitude'
	)

	const [quakes, setQuakes] = useState([])
	const [meta, setMeta] = useState([])
	const [loading, isLoading] = useState(false)

	useEffect(() => {
		const fetchData = async (string) => {
			isLoading(true)
			const res = await fetch(string)
			const json = await res.json()
			// console.log(json)
			setQuakes(json.features)
			sessionStorage.setItem('quakes', JSON.stringify(json.features))
			setMeta(json.metadata)
			sessionStorage.setItem('metadata', JSON.stringify(json.metadata))
			isLoading(false)
		}

		// if (
		// 	sessionStorage.getItem('url') !== '' &&
		// 	sessionStorage.getItem('url') !== fetchString
		// ) {
		// 	fetchData(sessionStorage.getItem('url'))
		// } else {
		// 	fetchData(fetchString)
		// }

		let min = sessionStorage.getItem('min')
		let max = sessionStorage.getItem('max')
		let lat = sessionStorage.getItem('lat')
		let long = sessionStorage.getItem('long')
		let rad = sessionStorage.getItem('radius')
		let start = sessionStorage.getItem('start')
		let end = sessionStorage.getItem('end')
		let sort = sessionStorage.getItem('sort')
		let dir = sessionStorage.getItem('dir')

		min ? setMinMag(min) : setMinMag(6)
		max ? setMaxMag(max) : setMaxMag(10)
		lat ? setLat(lat) : setLat('')
		long ? setLong(long) : setLong('')
		rad ? setRadius(rad) : setRadius(500)
		start ? setStart(start) : setStart('')
		end ? setEnd(end) : setEnd(today)
		sort ? setSort(sort) : setSort('date')
		dir ? setDir(dir) : setDir('desc')

		if (
			sessionStorage.getItem('quakes') &&
			sessionStorage.getItem('metadata') &&
			sessionStorage.getItem('url') !== fetchString
		) {
			setQuakes(JSON.parse(sessionStorage.getItem('quakes')))
			setMeta(JSON.parse(sessionStorage.getItem('metadata')))
		} else {
			fetchData(fetchString)
		}
	}, [fetchString])

	const handleSortChange = (e) => {
		// console.log(e.target)
		const { value } = e.target
		setSort(value)
		sessionStorage.setItem('sort', value)
	}

	const handleDirChange = (e) => {
		// console.log(e.target)
		const { value } = e.target
		setDir(value)
		sessionStorage.setItem('dir', value)
	}

	const handleResetFields = (evt) => {
		evt.preventDefault()
		// sessionStorage.clear()
		setMinMag(0)
		sessionStorage.setItem('min', 0)
		setMaxMag(10)
		sessionStorage.setItem('max', 10)
		setLat('')
		sessionStorage.setItem('lat', '')
		setLong('')
		sessionStorage.setItem('long', '')
		setRadius('')
		sessionStorage.setItem('radius', '')
		setStart('')
		sessionStorage.setItem('start', '')
		setEnd(today)
		sessionStorage.setItem('end', today)
	}

	const handleLocationRequest = (evt) => {
		evt.preventDefault()
		navigator.geolocation.getCurrentPosition((position) => {
			setLat(position.coords.latitude)
			sessionStorage.setItem('lat', position.coords.latitude)
			setLong(position.coords.longitude)
			sessionStorage.setItem('long', position.coords.longitude)
			setRadius(500)
			sessionStorage.setItem('radius', 500)
		})
	}

	const startString =
		'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&'

	const handleFetchChange = (evt) => {
		evt.preventDefault()
		sessionStorage.removeItem('url')
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
			// orderString = '&orderby=time-asc'
		} else {
			startDateString = ''
			// orderString = '&orderby=magnitude'
		}
		if (end != null) {
			endDateString = '&endtime=' + end
		} else {
			endDateString = ''
		}
		if (sort == 'date') {
			orderString = '&orderby=time'
			if (direction == 'asc') {
				orderString += '-asc'
			}
		} else if (sort == 'magnitude') {
			orderString = '&orderby=magnitude'
			if (direction == 'asc') {
				orderString += '-asc'
			}
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

		// console.log(fetchString)
		sessionStorage.setItem('url', fetchString)

		setFetch(fetchString)
	}

	return (
		<div className='w-full gap-4 p-2 mt-5 columns-1 min-h-max'>
			<div className='pb-0 mb-5 overflow-hidden text-center border rounded-md border-stone-500 bg-stone-50'>
				<div className='flex justify-between p-1 bg-amber-400'>
					<button
						type='submit'
						className='invisible px-1 m-1 text-center bg-orange-200 border border-orange-700 rounded-md hover:bg-orange-50'
						onClick={handleResetFields}
					>
						Clear
					</button>
					<div>
						<h4 className='block text-2xl uppercase '>
							Earthquake Search Filter
						</h4>
						<p className='block text-sm text-stone-600'>
							Limited to 100 results
						</p>
					</div>
					<div className='h-auto my-auto align-middle'>
						<button
							type='submit'
							className='px-1 m-1 text-center border rounded-md bg-stone-200 border-stone-700 hover:bg-stone-50'
							onClick={handleResetFields}
						>
							Clear
						</button>
					</div>
				</div>
				<form className='font-bold'>
					<div className='block py-2 text-center border-y border-stone-600'>
						<label className='inline-block p-1 xs:block'>
							Min Magnitude:{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-14'
								type='number'
								value={minMag}
								min='0'
								max='10'
								step='0.25'
								placeholder='3'
								onChange={(e) => {
									setMinMag(e.target.value)
									sessionStorage.setItem('min', e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							Max Magnitude:{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-14'
								type='number'
								value={maxMag}
								min='0'
								max='10'
								step='0.25'
								placeholder='8'
								onChange={(e) => {
									setMaxMag(e.target.value)
									sessionStorage.setItem('max', e.target.value)
								}}
							/>
						</label>
					</div>
					<div className='block py-2 text-center border-b border-stone-600'>
						<label className='inline-block p-1 xs:block'>
							Latitude:{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-28'
								type='number'
								step='0.001'
								value={latitude}
								min='-90'
								max='90'
								placeholder='0'
								onChange={(e) => {
									setLat(e.target.value)
									sessionStorage.setItem('lat', e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							Longitude:{' '}
							<input
								className='w-32 px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='number'
								step='0.001'
								value={longitude}
								min='-180'
								max='180'
								placeholder='0'
								onChange={(e) => {
									setLong(e.target.value)
									sessionStorage.setItem('long', e.target.value)
								}}
							/>
						</label>

						<label className='inline-block p-1 xs:block'>
							Radius (km):{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='number'
								value={radius}
								min='100'
								max='20000'
								placeholder='500'
								onChange={(e) => {
									setRadius(e.target.value)
									sessionStorage.setItem('radius', e.target.value)
								}}
							/>
						</label>
						<div className='inline mb-1 text-center '>
							<button
								type='submit'
								className='px-1 py-1 text-xl text-center'
								onClick={handleLocationRequest}
							>
								📍
							</button>
						</div>
						<p className='text-sm font-normal text-stone-600'>
							Must include all fields to use location search
						</p>
					</div>
					<div className='block py-2 text-center border-b border-stone-600'>
						<label className='inline-block p-1 xs:block'>
							Start Date:{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='date'
								value={start}
								//   min='1'
								//   max='10000'
								placeholder=''
								onChange={(e) => {
									setStart(e.target.value)
									sessionStorage.setItem('start', e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							End Date:{' '}
							<input
								className='px-1 text-right border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='date'
								value={end}
								//   min='1'
								//   max='10000'
								placeholder={today}
								onChange={(e) => {
									setEnd(e.target.value)
									sessionStorage.setItem('end', e.target.value)
								}}
							/>
						</label>
						<p className='text-sm font-normal text-stone-600'>
							Defaults to previous 30 days
						</p>
					</div>

					<div className='flex pb-2 m-2 text-center border-b justify-evenly border-stone-600'>
						<div>
							<div>Order By:</div>
							<label className='p-1 font-normal'>
								Date:{' '}
								<input
									type='radio'
									name='order'
									value='date'
									checked={sort === 'date'}
									onChange={handleSortChange}
								/>
							</label>
							<label className='p-1 font-normal'>
								Magnitude:{' '}
								<input
									type='radio'
									name='order'
									value='magnitude'
									checked={sort === 'magnitude'}
									onChange={handleSortChange}
								/>
							</label>
						</div>
						<div>
							<div>Direction:</div>
							<label className='p-1 font-normal'>
								Descending:{' '}
								<input
									type='radio'
									name='direction'
									value='desc'
									checked={direction === 'desc'}
									onChange={handleDirChange}
								/>
							</label>
							<label className='p-1 font-normal'>
								Ascending:{' '}
								<input
									type='radio'
									name='direction'
									value='asc'
									checked={direction === 'asc'}
									onChange={handleDirChange}
								/>
							</label>
						</div>
					</div>
					<div className='block m-2 mb-1 text-center'>
						<button
							type='submit'
							className='px-2 py-1 text-center border-2 rounded-md bg-amber-400 border-stone-700 hover:bg-amber-200'
							onClick={handleFetchChange}
						>
							Find Earthquakes
						</button>
					</div>
					<div className='m-2 text-sm font-normal text-red-600'>
						{meta.error}
					</div>
					<div className='m-2 text-sm font-normal text-stone-600'>
						{loading ? (
							<div>Searching...</div>
						) : (
							<div>{quakes.length} Earthquakes found</div>
						)}
					</div>
				</form>
			</div>

			{loading ? (
				<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
					<div className='mt-5 ldsripple'>
						<div></div>
						<div></div>
					</div>
				</div>
			) : quakes.length > 0 ? (
				quakes.map((quake) => {
					return <Quake quakeData={quake} key={quake.id} />
				})
			) : (
				<div className='block w-full p-5 mt-5 mb-4 text-center align-middle border rounded-lg shadow-md border-stone-600 bg-stone-100'>
					No Earthquakes Found
				</div>
			)}
		</div>
	)
}
