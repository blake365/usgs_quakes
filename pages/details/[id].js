// import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

// import intensity from '../../public/images/intensity.jpeg'

import { Map, Marker, ZoomControl } from 'pigeon-maps'
// import { stamenTerrain } from 'pigeon-maps/providers'

import { maptiler } from 'pigeon-maps/providers'

import { BsPinMapFill } from 'react-icons/bs'
import { GoReport } from 'react-icons/go'
// import { BiLinkExternal } from 'react-icons/bi'
import NearbyQuakes from '../../components/nearbyQuakes'

let detailSearch =
	'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventid='

let tectonicSearch = 'https://earthquake.usgs.gov/ws/geoserve/regions.json?'

export default function Details({
	quakeDetails,
	tectonicDetails,
	offshoreDetails,
	// blurDataURL,
}) {
	let now = new Date()

	const [loaded, setLoaded] = useState(true)

	const maptilerProvider = maptiler('MaTKi78CrHEEExK4dS8x', 'topo')

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
		<div className='flex flex-col items-center justify-center min-h-screen py-2 bg-stone-300'>
			<Head>
				<title>{quakeDetails.properties.title}</title>
				<link rel='icon' href='/icons/waveform 1.svg' />
				<meta
					name='description'
					content={`Detailed description for the ${quakeDetails.properties.title} earthquake with the shake map, human impacts, and tectonic summary which explains the geology behind the earthquake (when available) . Also includes nearby earthquakes within the last month. Data provided by the United States Geological Survey.`}
				/>
			</Head>
			<div className='flex w-full h-20 p-2 mt-5 overflow-hidden font-semibold text-center align-middle border-y border-stone-600 bg-stone-100'>
				<h1 className='w-full my-auto text-2xl uppercase lg:text-6xl md:text-5xl sm:text-3xl'>
					<img
						src='/icons/waveform 1.svg'
						className='hidden w-10 h-10 md:w-20 md:h-20 sm:inline'
					/>
					<Link href='/'>
						<a className='w-full text-2xl text-black uppercase lg:text-6xl md:text-5xl sm:text-3xl hover:no-underline'>
							{' '}
							USGS Earthquake Feed{' '}
						</a>
					</Link>
					<img
						src='/icons/waveform 1.svg'
						className='hidden w-10 h-10 md:w-20 md:h-20 sm:inline'
					/>
				</h1>
			</div>
			<main className='w-full min-h-screen sm:w-11/12'>
				<div className='flex flex-col lg:flex-row'>
					{/* selected quake */}
					<section className='px-2 min-h-max lg:w-3/5 xl:w-3/5'>
						<div className='w-full mt-5 overflow-hidden border rounded-lg shadow-lg columns-1 border-stone-600 bg-stone-100'>
							{quakeDetails.properties ? (
								<div className='w-full py-2 m-0 text-left'>
									<div className='w-full px-5 pb-1 mb-3 border-b shadow-md border-stone-600'>
										{/* time */}
										<div className='flex justify-between text-sm text-stone-800 columns-2'>
											<div className=''>
												{new Date(quakeDetails.properties.time).customFormat(
													'#MM#/#DD#/#YYYY# #hh#:#mm#:#ss# #AMPM#'
												)}
											</div>
											{quakeDetails.properties.status === 'reviewed' ? (
												<div className='pr-1 text-green-700'>
													{quakeDetails.properties.status}
												</div>
											) : (
												<div className='pr-1 text-stone-700'>
													{quakeDetails.properties.status.substring(0, 4)}
												</div>
											)}
										</div>
										{/* title */}
										{quakeDetails.properties.alert === 'orange' ? (
											<div className='text-3xl font-bold text-orange-600 '>
												{quakeDetails.properties.title}
											</div>
										) : quakeDetails.properties.alert === 'red' ? (
											<div className='flex text-3xl font-bold text-red-700 '>
												{quakeDetails.properties.title}
											</div>
										) : quakeDetails.properties.alert === 'yellow' ? (
											<div className='flex text-3xl font-bold text-amber-400'>
												{quakeDetails.properties.title}
											</div>
										) : (
											<div className='flex text-3xl font-bold text-green-700 '>
												{quakeDetails.properties.title}
											</div>
										)}

										<div className='flex items-center leading-8 align-middle md:text-lg'>
											<div className='pr-2 text-lg text-green-700 align-middle'>
												<BsPinMapFill />
											</div>
											<div className='font-normal text-md'>
												{Math.round(
													Math.abs(quakeDetails.geometry.coordinates[1]) * 1000
												) / 1000}
												&deg;
												{quakeDetails.geometry.coordinates[1] < 0
													? 'S'
													: 'N'},{' '}
												{Math.round(
													Math.abs(quakeDetails.geometry.coordinates[0]) * 1000
												) / 1000}
												&deg;
												{quakeDetails.geometry.coordinates[0] < 0
													? 'W'
													: 'E'},{' '}
												{Math.round(
													quakeDetails.geometry.coordinates[2] * 100
												) / 100}{' '}
												km deep
											</div>
										</div>
										<div className='flex justify-between leading-8 text-stone-800 columns-2'>
											<div className='flex items-center pb-1 font-normal text-md'>
												<div className='pr-2 text-lg text-purple-700 '>
													<GoReport />
												</div>
												{quakeDetails.properties.felt != null
													? quakeDetails.properties.felt
													: 0}{' '}
												reports{' '}
												{(now - quakeDetails.properties.time) /
													(1000 * 60 * 60 * 24) >
												30 ? (
													''
												) : (
													<a
														className='pl-2 text-blue-600 hover:text-blue-800 hover:underline'
														href={quakeDetails.properties.url + '/tellus'}
														target='_blank'
													>
														Did you feel it?
													</a>
												)}
											</div>
											<div className='pr-1 text-sm place-self-center sm:text-lg '>
												<a
													href={quakeDetails.properties.url}
													className='px-1 font-bold text-green-800 border border-green-800 rounded-sm hover:bg-green-800 hover:text-white hover:no-underline'
													target='_blank'
													rel='noreffer'
												>
													USGS
												</a>
											</div>
										</div>
									</div>
									<div className='w-full px-5 mt-4'>
										{quakeDetails.properties.products['shakemap'] ? (
											<div className='m-auto max-w-[700px] mb-5 border rounded-md border-stone-600 bg-stone-500'>
												<Image
													layout='responsive'
													width={787}
													height={1003}
													priority
													loading='eager'
													// placeholder='blur'
													// blurDataURL={blurDataURL}
													className='border rounded-md border-stone-600'
													// onLoad={() => setLoaded(true)}
													src={`https://earthquake.usgs.gov/product/shakemap/${quakeDetails.properties.products.shakemap[0].code}/${quakeDetails.properties.products.shakemap[0].source}/${quakeDetails.properties.products.shakemap[0].updateTime}/download/intensity.jpg`}
													alt={`Shake map for ${quakeDetails.properties.title} showing shaking intensity and report locations around the epicenter.`}
												/>
											</div>
										) : (
											<div className='border border-stone-600 rounded-lg overflow-hidden m-auto mb-5 w-11/12 h-[400px] md:h-[700px] justify-center safari-rounded bg-stone-500'>
												<Map
													className=''
													provider={maptilerProvider}
													dprs={[1, 2]}
													metaWheelZoom={true}
													mouseEvents={false}
													attributionPrefix={false}
													attribution={
														<a
															href='https://www.maptiler.com'
															target='_blank'
															style={{ display: 'inline-block' }}
														>
															<img
																src='https://api.maptiler.com/resources/logo.svg'
																alt='MapTiler logo'
															/>
														</a>
													}
													center={[
														quakeDetails.geometry.coordinates[1],
														quakeDetails.geometry.coordinates[0],
													]}
													onBoundsChanged={({ center }) => {
														center = center
													}}
													defaultZoom={7}
												>
													<ZoomControl />
													<Marker
														color={
															quakeDetails.properties.alert === null
																? 'green'
																: quakeDetails.properties.alert
														}
														width={30}
														hover={false}
														anchor={[
															quakeDetails.geometry.coordinates[1],
															quakeDetails.geometry.coordinates[0],
														]}
													/>
												</Map>
											</div>
										)}

										<div className='max-h-[600px] overflow-scroll p-4 mb-3 border border-stone-600 rounded-md bg-stone-200'>
											{quakeDetails.properties.products['impact-text'] ? (
												<div className=''>
													<div className='mb-1 text-2xl font-bold'>
														Human Impact
													</div>
													<div
														className='mb-1 text-sm'
														dangerouslySetInnerHTML={{
															__html:
																quakeDetails.properties.products[
																	'impact-text'
																][0].contents[''].bytes,
														}}
													></div>
												</div>
											) : (
												''
											)}

											{(() => {
												if (quakeDetails.properties.products['general-text']) {
													return (
														<div>
															<div className='mb-1 text-2xl font-bold'>
																Tectonic Summary
															</div>
															{quakeDetails.properties.products[
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
													if (tectonicDetails.length > 0) {
														// console.log(tectonic[0].properties.summary.length)
														return (
															<div>
																<div className='mb-1 text-2xl font-bold'>
																	Tectonic Summary
																</div>
																<div
																	className='mb-1 text-sm'
																	dangerouslySetInnerHTML={{
																		__html:
																			tectonicDetails[0].properties.summary,
																	}}
																></div>
															</div>
														)
													} else if (offshoreDetails.features.length > 0) {
														return (
															<div>
																<div className='mb-1 text-2xl font-bold'>
																	Offshore Region
																</div>
																<div>{offshoreDetails[0].name.description}</div>
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
								<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
									<div className='mt-5 ldsripple'>
										<div></div>
										<div></div>
									</div>
								</div>
							)}
						</div>
					</section>
					{/* nearby quakes component */}
					<div className='block w-full px-2 pt-0 mt-5 columns-1 lg:w-2/5 xl:w-2/5'>
						<div className='w-full text-center bg-amber-400 border border-stone-600 rounded-lg mb-2.5 p-1 '>
							<div className='text-xl uppercase md:text-2xl'>
								Recent Nearby Earthquakes
							</div>
							<div className='block text-sm text-stone-600'>
								Searches a 160 km radius in the past month
							</div>
						</div>
						{quakeDetails.geometry ? (
							<NearbyQuakes
								latitude={quakeDetails.geometry.coordinates[1]}
								longitude={quakeDetails.geometry.coordinates[0]}
								currentId={quakeDetails.id}
							/>
						) : (
							<div className='block w-full px-2 pt-0 mt-5 mb-4 text-center align-middle border rounded-lg border-stone-600 bg-stone-100'>
								<div className='w-full mt-5 ldsripple'>
									<div></div>
									<div></div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<div className='h-4'></div>
			<footer className='w-full p-5 text-lg text-center border-y border-stone-600 bg-stone-100'>
				<div>Data provided by the United States Geological Survey</div>
				<a
					href='https://earthquake.usgs.gov/fdsnws/event/1/'
					target='_blank'
					className='text-blue-600 underline hover:text-blue-900'
				>
					API Documentation
				</a>
			</footer>
		</div>
	)
}

export async function getServerSideProps(context) {
	// console.log(context.params.id)
	let pageId = context.params.id

	let search = detailSearch + pageId

	const quakeRes = await fetch(search)
	const quakeDetails = await quakeRes.json()

	let tectonicDetails = null
	let offshoreDetails = null

	if (!quakeDetails.properties.products['general-text']) {
		tectonicSearch =
			tectonicSearch +
			'latitude=' +
			quakeDetails.geometry.coordinates[1] +
			'&longitude=' +
			quakeDetails.geometry.coordinates[0]
		const tectonicRes = await fetch(tectonicSearch)
		const tectonicJson = await tectonicRes.json()
		tectonicDetails = tectonicJson.tectonic.features
		offshoreDetails = tectonicJson.offshore
	}

	// console.log(quakeDetails)

	return {
		props: { quakeDetails, tectonicDetails, offshoreDetails },
	}
}

// export const getStaticProps = async () => {
// 	const { base64, img } = await getPlaiceholder(
// 		'../../public/images/intensity.jpeg'
// 	)

// 	return {
// 		props: {
// 			blurDataURL: base64,
// 		},
// 	}
// }
