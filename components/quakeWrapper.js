import { useState, useEffect } from 'react'
import Quake from './quake'
import QuakeCard from './quakeCard'
import Globe from './globe'

import { BiGridAlt, BiListUl, BiGlobe } from 'react-icons/bi'

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
		'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=6&orderby=magnitude'
	)

	const [quakes, setQuakes] = useState([])
	const [meta, setMeta] = useState([])
	const [loading, isLoading] = useState(false)
	const [size, setSize] = useState('compact')
	const [showGlobe, setShowGlobe] = useState(false)

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const urlMin = params.get('min')
		const urlMax = params.get('max') 
		const urlLat = params.get('lat')
		const urlLong = params.get('long')
		const urlRadius = params.get('radius')
		const urlStart = params.get('start')
		const urlEnd = params.get('end')
		const urlSort = params.get('sort')
		const urlDir = params.get('dir')

		setMinMag(urlMin || 6)
		setMaxMag(urlMax || 10)
		setLat(urlLat || '')
		setLong(urlLong || '')
		setRadius(urlRadius || 500)
		setStart(urlStart || '')
		setEnd(urlEnd || today)
		setSort(urlSort || 'date')
		setDir(urlDir || 'desc')

		if (params.toString()) {
			const startString = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&'
			let latString = ''
			let longString = ''
			let radiusString = ''
			let startDateString = ''
			let endDateString = ''
			let minMagString = urlMin || '6'
			let maxMagString = urlMax || '10'
			let orderString = ''

			if (urlLat && urlLong && urlRadius) {
				latString = `&latitude=${urlLat}`
				longString = `&longitude=${urlLong}`
				radiusString = `&maxradiuskm=${urlRadius}`
			}

			if (urlStart) {
				startDateString = `&starttime=${urlStart}`
			}

			if (urlEnd) {
				endDateString = `&endtime=${urlEnd}`
			}

			if ((urlSort || 'date') === 'date') {
				orderString = `&orderby=time${(urlDir || 'desc') === 'asc' ? '-asc' : ''}`
			} else {
				orderString = `&orderby=magnitude${(urlDir || 'desc') === 'asc' ? '-asc' : ''}`
			}

			const newFetchString = `${startString}minmagnitude=${minMagString}&maxmagnitude=${maxMagString}${latString}${longString}${radiusString}${startDateString}${endDateString}&limit=200${orderString}&jsonerror=true`
			fetchQuakeData(newFetchString)
		} else {
			const defaultFetchString = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=6&maxmagnitude=10&orderby=time&limit=200&jsonerror=true'
			fetchQuakeData(defaultFetchString)
		}
	}, [])

	const fetchQuakeData = async (fetchString) => {
		try {
			isLoading(true)
			const res = await fetch(fetchString)
			const json = await res.json()
			setQuakes(json.features)
			setMeta(json.metadata)
		} catch (error) {
			setMeta({ error: 'Failed to fetch earthquake data' })
			setQuakes([])
		} finally {
			isLoading(false)
		}
	}

	const handleSortChange = (e) => {
		const { value } = e.target
		setSort(value)
	}

	const handleDirChange = (e) => {
		const { value } = e.target
		setDir(value)
	}

	const handleResetFields = (evt) => {
		evt.preventDefault()
		setMinMag(6)
		setMaxMag(10)
		setLat('')
		setLong('')
		setRadius(500)
		setStart('')
		setEnd(today)
		setSort('date')
		setDir('desc')
		
		window.history.replaceState({}, '', window.location.pathname)
	}

	const handleLocationRequest = (evt) => {
		evt.preventDefault()
		navigator.geolocation.getCurrentPosition((position) => {
			setLat(position.coords.latitude)
			setLong(position.coords.longitude)
			setRadius(500)
		})
	}

	const handleFetchChange = (evt) => {
		evt.preventDefault()
		
		const startString = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&'
		let latString = ''
		let longString = ''
		let radiusString = ''
		let startDateString = ''
		let endDateString = ''
		let minMagString = minMag.toString()
		let maxMagString = maxMag.toString()
		let orderString = ''

		if (latitude !== '' && longitude !== '' && radius !== '') {
			latString = `&latitude=${latitude}`
			longString = `&longitude=${longitude}`
			radiusString = `&maxradiuskm=${radius}`
		}

		if (start !== '') {
			startDateString = `&starttime=${start}`
		}

		if (end !== null) {
			endDateString = `&endtime=${end}`
		}

		if (sort === 'date') {
			orderString = `&orderby=time${direction === 'asc' ? '-asc' : ''}`
		} else if (sort === 'magnitude') {
			orderString = `&orderby=magnitude${direction === 'asc' ? '-asc' : ''}`
		}

		const newFetchString = `${startString}minmagnitude=${minMagString}&maxmagnitude=${maxMagString}${latString}${longString}${radiusString}${startDateString}${endDateString}&limit=200${orderString}&jsonerror=true`

		const params = new URLSearchParams()
		if (minMag) params.set('min', minMag)
		if (maxMag) params.set('max', maxMag)
		if (latitude) params.set('lat', latitude)
		if (longitude) params.set('long', longitude)
		if (radius) params.set('radius', radius)
		if (start) params.set('start', start)
		if (end) params.set('end', end)
		if (sort) params.set('sort', sort)
		if (direction) params.set('dir', direction)

		const newUrl = `${window.location.pathname}?${params.toString()}`
		window.history.replaceState({}, '', newUrl)

		fetchQuakeData(newFetchString)
	}

	return (
		<div className='w-full gap-4 p-2 mt-5 columns-1 min-h-max'>
			<div className='pb-0 mb-5 overflow-hidden text-center border rounded-md border-stone-500 bg-stone-50 dark:bg-zinc-700 dark:text-zinc-100 text-stone-700'>
				<div className='flex justify-between p-1 bg-sky-200 dark:bg-sky-600 dark:text-zinc-100'>
					<button
						type='submit'
						className='invisible px-1 m-1 text-center bg-orange-200 border border-orange-700 rounded-md hover:bg-orange-50'
						onClick={handleResetFields}
					>
						Clear
					</button>
					<div>
						<h4 className='block mb-0 text-2xl uppercase'>
							Earthquake Search Filter
						</h4>
						<p className='block text-sm text-stone-600 dark:text-zinc-300'>
							Limited to 200 results
						</p>
					</div>
					<div className='h-auto my-auto align-middle'>
						<button
							type='submit'
							className='px-1 m-1 text-center border rounded-md bg-stone-200 border-stone-700 hover:bg-stone-50 dark:bg-zinc-500 dark:hover:bg-zinc-400'
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
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-14'
								type='number'
								value={minMag}
								min='0'
								max='10'
								step='0.25'
								placeholder='3'
								onChange={(e) => {
									setMinMag(e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							Max Magnitude:{' '}
							<input
								
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-14'
								type='number'
								value={maxMag}
								min='0'
								max='10'
								step='0.25'
								placeholder='8'
								onChange={(e) => {
									setMaxMag(e.target.value)
								}}
							/>
						</label>
					</div>
					<div className='block py-2 text-center border-b border-stone-600'>
						<label className='inline-block p-1 xs:block'>
							Latitude:{' '}
							<input
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50 w-28'
								type='number'
								step='0.001'
								value={latitude}
								min='-90'
								max='90'
								placeholder='0'
								onChange={(e) => {
									setLat(e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							Longitude:{' '}
							<input
								className='w-32 px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='number'
								step='0.001'
								value={longitude}
								min='-180'
								max='180'
								placeholder='0'
								onChange={(e) => {
									setLong(e.target.value)
								}}
							/>
						</label>

						<label className='inline-block p-1 xs:block'>
							Radius (km):{' '}
							<input
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='number'
								value={radius}
								min='100'
								max='20000'
								placeholder='500'
								onChange={(e) => {
									setRadius(e.target.value)
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
						<p className='text-sm font-normal text-stone-600 dark:text-zinc-300'>
							Must include all fields to use location search
						</p>
					</div>
					<div className='block py-2 text-center border-b border-stone-600'>
						<label className='inline-block p-1 xs:block'>
							Start Date:{' '}
							<input
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='date'
								value={start}
								placeholder=''
								onChange={(e) => {
									setStart(e.target.value)
								}}
							/>
						</label>
						<label className='inline-block p-1 xs:block'>
							End Date:{' '}
							<input
								className='px-1 text-right text-black border rounded-md bg-stone-200 border-stone-700 hover:bg-blue-50'
								type='date'
								value={end}
								placeholder={today}
								onChange={(e) => {
									setEnd(e.target.value)
								}}
							/>
						</label>
						<p className='text-sm font-normal text-stone-600 dark:text-zinc-300'>
							Defaults to previous 30 days
						</p>
					</div>

					<div className='flex justify-center px-2 my-2 text-center border-stone-600'>
						<div className='w-[230px]'>
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
						<div className='w-[230px]'>
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
					<div className='flex justify-between align-middle border-t border-stone-600'>
						<div className='flex flex-col invisible ml-2 dark:text-stone-700 grow-0'>
							<div className="w-[34px]"/>
						</div>
						<div>
							<div className='block m-2 mb-1 text-center'>
								<button
									type='submit'
									className='px-2 py-1 text-center border rounded-md bg-sky-300 border-stone-700 hover:bg-sky-200 dark:bg-sky-500 dark:hover:bg-sky-400'
									onClick={handleFetchChange}
								>
									Find Earthquakes
								</button>
							</div>
							<div className='m-2 text-sm font-normal text-red-600'>
								{meta.error}
							</div>

							<div className='m-2 text-sm font-normal text-stone-600 dark:text-stone-200'>
								{loading ? (
									<div>Searching...</div>
								) : (
									<div>{quakes.length} Earthquakes found</div>
								)}
							</div>
						</div>
						<div className='flex flex-col content-end justify-end my-auto mr-2 dark:text-stone-700 grow-0'>
							<button
								type='button'
								onClick={() => setSize('large')}
								className='h-6 px-1 m-1 mb-0 text-center border rounded-t-md text-md bg-stone-200 hover:bg-stone-50 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200'
								disabled={size === 'large'}
							>
								<BiGridAlt />
							</button>
							<button
								type='button'
								onClick={() => setSize('compact')}
								className='h-6 px-1 m-1 mt-0 text-center border border-t-0 rounded-b-md text-md hover:bg-stone-50 bg-stone-200 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200 '
								disabled={size === 'compact'}
							>
								<BiListUl />
							</button>
							<button
								type='button'
								onClick={() => setShowGlobe(!showGlobe)}
								className={`h-6 px-1 m-1 mt-0 text-center border rounded-md text-md hover:bg-stone-50 bg-stone-200 border-stone-700 ${showGlobe ? 'text-sky-600 hover:bg-stone-200' : ''}`}
							>
								<BiGlobe />
							</button>
						</div>
					</div>
				</form>
			</div>
			{showGlobe === true ? <Globe markers={quakes.reduce((acc, quake) => {
					acc.push({ location: [quake.geometry.coordinates[1], quake.geometry.coordinates[0]], size: quake.properties.mag / 100 })
					return acc
					}, [])}
				/>
			 : null}
			<div className='flex flex-wrap justify-between gap-4'>
				{loading ? (
					<div className='w-full mb-4 text-center align-middle border rounded-lg shadow-md dark:border-zinc-800 border-stone-400 bg-stone-100 dark:bg-zinc-600 dark:text-zinc-100 text-stone-700'>
						<div className='mt-5 ldsripple'>
							<div></div>
							<div></div>
						</div>
					</div>
				) : quakes.length > 0 ? (
					quakes.map((quake) => {
						if (size === 'large') {
							return <QuakeCard quakeData={quake} key={quake.id} />
						} 
						return <Quake quakeData={quake} key={quake.id} />
					})
				) : (
					<div className='block w-full p-5 mt-5 mb-4 text-center align-middle border rounded-lg shadow-md border-stone-600 bg-stone-100'>
						No Earthquakes Found
					</div>
				)}
			</div>
		</div>
	)
}
