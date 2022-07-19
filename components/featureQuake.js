import { useState, useEffect, useCallback } from 'react'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { stamenTerrain } from 'pigeon-maps/providers'
import { maptiler } from 'pigeon-maps/providers'

import { BiRefresh, BiLinkExternal } from 'react-icons/bi'
import { BsPinMapFill } from 'react-icons/bs'
import { GoReport } from 'react-icons/go'

export default function FeaturedQuake() {
	const [details, setDetails] = useState({})
	const [tectonic, setTectonic] = useState({})
	const [loading, isLoading] = useState(false)
	const [version, upVersion] = useState(1)

	let today = ''
	function getDateString() {
		let date = new Date().toISOString().slice(0, 10)
		// console.log(typeof date)
		return date
	}

	today = getDateString()

	const maptilerProvider = maptiler('MaTKi78CrHEEExK4dS8x', 'topo')

	const randomFeature = (max) => {
		return Math.floor(Math.random() * (max - 0)) + 0
	}

	let redString =
		'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&alertlevel=red&minmagnitude=6&starttime=2021-01-01&limit=10'

	let orangeString =
		'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&alertlevel=orange&minmagnitude=6&starttime=2021-01-01&limit=10'

	let sigString =
		'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

	let fetchStrings = [sigString, sigString, redString]

	const randomFetchString = () => {
		return Math.floor(Math.random() * (3 - 0)) + 0
	}

	let tectonicSearch = 'https://earthquake.usgs.gov/ws/geoserve/regions.json?'

	useEffect(() => {
		let featureDetails = JSON.parse(sessionStorage.getItem('feature'))
		let tectonicDetails = JSON.parse(sessionStorage.getItem('tectonic'))

		if (featureDetails) {
			setDetails(featureDetails)
			if (tectonicDetails) {
				setTectonic(tectonicDetails)
			}
		} else {
			fetch(fetchStrings[randomFetchString()])
				.then(function (response) {
					return response.json()
				})
				.then(function (data) {
					// console.log(data)
					fetch(
						data.features[randomFeature(data.features.length)].properties.detail
					)
						.then(function (response) {
							return response.json()
						})
						.then(function (data) {
							if (data.properties.products['general-text']) {
								setDetails(data)
								sessionStorage.setItem('feature', JSON.stringify(data))
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
									sessionStorage.setItem(
										'tectonic',
										JSON.stringify(json.tectonic.features)
									)
									isLoading(false)
								}
								fetchData()

								setDetails(data)
								sessionStorage.setItem('feature', JSON.stringify(data))
							}
						})
				})
		}
	}, [version])

	let now = new Date()

	const refresh = useCallback(() => {
		sessionStorage.removeItem('feature')
		sessionStorage.removeItem('tectonic')
		upVersion((s) => s + 1)
	}, [])

	// console.log(version)

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
		<section className='px-2 lg:w-3/5 xl:w-3/5 '>
			<section className='w-full mt-5 overflow-hidden border rounded-lg shadow-lg columns-1 border-stone-600 bg-stone-100'>
				<div className='flex w-full p-1 border-b border-stone-600 bg-amber-400'>
					<div className='flex-none invisible place-self-right'>
						<button
							type='submit'
							className='px-1 py-1 m-1 text-2xl text-center border rounded-md hover:bg-stone-50 bg-stone-200 border-stone-700'
							onClick={refresh}
						>
							<BiRefresh />
						</button>
					</div>
					<div className='flex-grow text-2xl text-center uppercase place-self-center'>
						Featured quake
					</div>
					<div className='flex-none place-self-right'>
						<button
							type='submit'
							className='px-1 py-1 m-1 text-2xl text-center border rounded-md hover:bg-stone-50 bg-stone-200 border-stone-700'
							onClick={refresh}
							aria-label='Refresh featured earthquake'
						>
							<BiRefresh />
						</button>
					</div>
				</div>
				{details.properties ? (
					<div className='w-full py-2 text-left '>
						<div className='w-full px-5 pb-1 mb-3 border-b shadow-md border-stone-600'>
							<div className='flex justify-between text-sm text-stone-800 columns-2'>
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
									className='text-3xl font-bold text-orange-600 hover:text-orange-800 hover:underline'
									// href={details.properties.url}
									href={`/details/${details.id}`}
								>
									{details.properties.title}{' '}
								</a>
							) : details.properties.alert === 'red' ? (
								<a
									className='text-3xl font-bold text-red-700 hover:text-red-900 hover:underline'
									// href={details.properties.url}
									href={`/details/${details.id}`}
								>
									{details.properties.title}{' '}
								</a>
							) : details.properties.alert === 'yellow' ? (
								<a
									className='text-3xl font-bold hover:text-amber-600 hover:underline text-amber-500'
									// href={details.properties.url}
									href={`/details/${details.id}`}
								>
									{details.properties.title}{' '}
								</a>
							) : (
								<a
									className='text-3xl font-bold text-green-700 hover:text-green-900 hover:underline'
									// href={details.properties.url}
									href={`/details/${details.id}`}
								>
									{details.properties.title}{' '}
								</a>
							)}

							<div className='flex items-center leading-8 align-middle md:text-lg'>
								<div className='pr-2 text-lg text-green-700 align-middle'>
									<BsPinMapFill />
								</div>
								<div className='font-normal text-md'>
									{Math.round(
										Math.abs(details.geometry.coordinates[1]) * 1000
									) / 1000}
									&deg;
									{details.geometry.coordinates[1] < 0 ? 'S' : 'N'},{' '}
									{Math.round(
										Math.abs(details.geometry.coordinates[0]) * 1000
									) / 1000}
									&deg;
									{details.geometry.coordinates[0] < 0 ? 'W' : 'E'},{' '}
									{Math.round(details.geometry.coordinates[2] * 100) / 100} km
									deep
								</div>
							</div>
							<div className='flex justify-between leading-8 text-stone-800 columns-2'>
								<div className='flex items-center pb-1 font-normal text-md'>
									<div className='pr-2 text-lg text-purple-700 '>
										<GoReport />
									</div>
									{details.properties.felt != null
										? details.properties.felt
										: 0}{' '}
									reports{' '}
									{(now - details.properties.time) / (1000 * 60 * 60 * 24) >
									30 ? (
										''
									) : (
										<a
											className='pl-2 text-blue-600 hover:text-blue-800 hover:underline'
											href={details.properties.url + '/tellus'}
											target='_blank'
										>
											Did you feel it?
										</a>
									)}
								</div>
								<div className='pr-1 text-sm place-self-center sm:text-lg '>
									<a
										href={details.properties.url}
										className='px-1 font-bold text-green-800 border border-green-800 rounded-sm hover:bg-green-800 hover:text-white hover:no-underline'
										target='_blank'
										rel='noreffer'
									>
										USGS
									</a>
								</div>
							</div>
						</div>
						<div className='w-full px-5'>
							{details.properties.products['shakemap'] ? (
								<img
									className='max-h-[95vh] max-w-full h-auto object-cover m-auto border border-stone-600 mb-5 rounded-md'
									src={`https://earthquake.usgs.gov/product/shakemap/${details.properties.products.shakemap[0].code}/${details.properties.products.shakemap[0].source}/${details.properties.products.shakemap[0].updateTime}/download/intensity.jpg`}
									alt={`Shake map for ${details.properties.title} showing shaking intensity and report locations around the epicenter.`}
								/>
							) : (
								<div className='border border-stone-600 rounded-lg overflow-hidden m-auto mb-5 w-11/12 h-[400px] justify-center safari-rounded'>
									<Map
										className=''
										provider={maptilerProvider}
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
											color={
												details.properties.alert === null
													? 'green'
													: details.properties.alert
											}
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
							{/* <img
								className='max-h-[95vh] max-w-full h-auto object-cover m-auto border border-stone-600 mb-5 rounded-md'
								src={`https://earthquake.usgs.gov/product/shakemap/${details.properties.products.shakemap[0].code}/${details.properties.products.shakemap[0].source}/${details.properties.products.shakemap[0].updateTime}/download/intensity.jpg`}
              /> */}

							<div className='max-h-[600px] overflow-scroll p-4 mb-3 border border-stone-600 rounded-md bg-stone-200'>
								{details.properties.products['impact-text'] ? (
									<div className=''>
										<div className='mb-1 text-2xl font-bold'>Human Impact</div>
										<div
											className='mb-1 text-sm'
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
												<div className='mb-1 text-2xl font-bold'>
													Tectonic Summary
												</div>
												{details.properties.products[
													'general-text'
												][0].contents[''].bytes
													.split('Tectonic Summary')[1]
													.split('\n')
													.filter((n) => n)
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
												<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
													<div className='mt-5 ldsripple'>
														<div></div>
														<div></div>
													</div>
												</div>
											)
										} else if (tectonic.length > 0) {
											// console.log(tectonic[0].properties.summary.length)
											return (
												<div>
													<div className='mb-1 text-2xl font-bold'>
														Tectonic Summary
													</div>
													<div
														className='mb-1 text-sm'
														dangerouslySetInnerHTML={{
															__html: tectonic[0].properties.summary,
														}}
													></div>
												</div>
											)
										} else {
											return <div>No Information Found</div>
										}
									}
								})()}
							</div>
						</div>
					</div>
				) : (
					<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
						<div className='mt-5 ldsripple'>
							<div></div>
							<div></div>
						</div>
					</div>
				)}
			</section>
		</section>
	)
}
