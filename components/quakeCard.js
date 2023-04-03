// import React from 'react'
import Link from 'next/link'
import { BsPinMapFill } from 'react-icons/bs'
import { GoReport } from 'react-icons/go'
import { Map, Marker, ZoomControl } from 'pigeon-maps'
import { maptiler } from 'pigeon-maps/providers'
import { useEffect, useState } from 'react'

export default function QuakeCard(props) {
	//   const [detailsLink, setDetailsLink] = useState('')
	//   const [details, setDetails] = useState([])
	const [place, setPlace] = useState(props.quakeData.properties.place)
	// let quakeTime = new Date(props.quakeData.properties.time)

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

	let now = new Date()
	const maptilerProvider = maptiler('MaTKi78CrHEEExK4dS8x', 'topo')
	// console.log(
	// 	props.quakeData.geometry.coordinates[1]
	// 	// props.quakeData.geometry.coordinates[0]
	// )

	let timeSince = (now - props.quakeData.properties.time) / 3600000
	// let quakeBgColor = ''
	// console.log(props.quakeData.properties)
	// if (props.quakeData.properties.mag < 4) {
	// 	quakeBgColor = 'green'
	// } else if (props.quakeData.properties.mag >= 6.5) {
	// 	quakeBgColor = 'red'
	// } else if (props.quakeData.properties.mag >= 5) {
	// 	quakeBgColor = 'orange'
	// } else {
	// 	quakeBgColor = 'yellow'
	// }
	// console.log(props.quakeData.properties.title)
	let tectonicSearch = 'https://earthquake.usgs.gov/ws/geoserve/regions.json?'
	let tectonicDetails = null
	const newLat = props.quakeData.geometry.coordinates[1] - 0.5

	useEffect(() => {
		if (!props.quakeData.properties.place) {
			const fetchData = async () => {
				tectonicSearch =
					tectonicSearch +
					'latitude=' +
					props.quakeData.geometry.coordinates[1] +
					'&longitude=' +
					props.quakeData.geometry.coordinates[0]
				const tectonicRes = await fetch(tectonicSearch)
				const tectonicJson = await tectonicRes.json()

				tectonicDetails = tectonicJson.tectonic?.features
				// console.log(tectonicDetails)
				if (tectonicDetails[0]) {
					setPlace(tectonicDetails[0].properties.name)
				} else {
					setPlace(props.quakeData.properties.title)
				}
			}
			fetchData()
		}
	}, [])
	// console.log(newLat)

	let placeLength = place?.length
	// console.log(placeLength)

	return (
		<section className='mx-auto border rounded-lg shadow-md w-[355px] dark:border-zinc-800 border-stone-400 bg-stone-100 dark:bg-zinc-600 dark:text-zinc-100 text-stone-700 grow h-auto overflow-hidden safari-rounded'>
			<div className='relative'>
				<div className='safari-rounded rounded-md  border-stone-400 overflow-hidden m-auto h-[300px] justify-center  bg-stone-500 shadow-md dark:border-zinc-800'>
					<Map
						className=''
						provider={maptilerProvider}
						dprs={[1, 2]}
						metaWheelZoom={false}
						mouseEvents={false}
						touchEvents={false}
						attributionPrefix={false}
						attribution={
							<a
								href='https://www.maptiler.com'
								target='_blank'
								style={{ display: 'inline-block', marginBottom: '-4px' }}
							>
								<img
									src='https://api.maptiler.com/resources/logo.svg'
									alt='MapTiler logo'
								/>
							</a>
						}
						// touchEvents={false}
						defaultCenter={[newLat, props.quakeData.geometry.coordinates[0]]}
						defaultZoom={6}
					>
						<Marker
							color={
								props.quakeData.properties.alert === null
									? 'green'
									: props.quakeData.properties.alert
							}
							width={30}
							hover={false}
							anchor={[
								props.quakeData.geometry.coordinates[1],
								props.quakeData.geometry.coordinates[0],
							]}
						/>
					</Map>
				</div>
				<div className='absolute flex items-center px-3 leading-8 align-middle border shadow-md z-2 top-1 left-1 rounded-3xl md:text-lg bg-zinc-100 dark:bg-zinc-600/80 bg-stone-100/80 border-stone-400 dark:border-zinc-800'>
					{/* <div className='pr-2 text-lg text-green-700 align-middle dark:text-green-200'>
						<BsPinMapFill />
					</div> */}
					<div className='font-normal text-md'>
						{Math.round(
							Math.abs(props.quakeData.geometry.coordinates[1]) * 1000
						) / 1000}
						&deg;
						{props.quakeData.geometry.coordinates[1] < 0 ? 'S' : 'N'},{' '}
						{Math.round(
							Math.abs(props.quakeData.geometry.coordinates[0]) * 1000
						) / 1000}
						&deg;
						{props.quakeData.geometry.coordinates[0] < 0 ? 'W' : 'E'},{' '}
						{Math.round(props.quakeData.geometry.coordinates[2] * 100) / 100} km
						deep
					</div>
				</div>
				{props.quakeData.properties.mag < 4 ? (
					<div className='absolute z-10 flex items-center justify-center w-12 h-12 px-5 text-white bg-green-500 border rounded-full shadow-md top-[140px] border-stone-400 left-5 dark:border-zinc-700 font-bold'>
						{props.quakeData.properties.mag}
					</div>
				) : props.quakeData.properties.mag >= 6.5 ? (
					<div className='absolute z-10 flex items-center justify-center w-12 h-12 px-5 text-white bg-red-500 border rounded-full shadow-md top-[140px] border-stone-400 left-5 dark:border-zinc-700 font-bold'>
						{props.quakeData.properties.mag}
					</div>
				) : props.quakeData.properties.mag >= 5 ? (
					<div className='absolute z-10 flex items-center justify-center w-12 h-12 px-5 text-white bg-orange-500 border rounded-full shadow-md top-[140px] border-stone-400 left-5 dark:border-zinc-700 font-bold'>
						{props.quakeData.properties.mag}
					</div>
				) : (
					<div className='absolute z-10 flex items-center justify-center w-12 h-12 px-5 bg-yellow-300 border rounded-full shadow-md text-stone-700 top-[140px] border-stone-400 left-5 dark:border-zinc-700 font-bold'>
						{props.quakeData.properties.mag}
					</div>
				)}

				<div
					className={`absolute w-full p-1 pl-3 text-left h-[45%] border-stone-400 dark:border-zinc-700 bottom-0 border-t bg-stone-100/80 dark:bg-zinc-600/80 pt-6 flex flex-col`}
				>
					<div className='flex justify-end -mt-5'>
						{props.quakeData.properties.status === 'reviewed' ? (
							<div className='pr-1 text-sm text-green-700 dark:text-green-500'>
								{props.quakeData.properties.status}
							</div>
						) : (
							<div className='pr-1 text-sm'>
								{props.quakeData.properties.status.substring(0, 4)}
							</div>
						)}
					</div>
					<div className='flex justify-between text-sm columns-2'>
						{timeSince <= 24 ? (
							<div className='text-md '>
								{Math.round(timeSince * 10) / 10} hours ago
							</div>
						) : (
							<div className='text-md '>
								{new Date(props.quakeData.properties.time).customFormat(
									'#MM#/#DD#/#YYYY# #hh#:#mm#:#ss# #AMPM#'
								)}
							</div>
						)}
					</div>
					<Link href={`/details/${props.quakeData.id}`}>
						<a
							className={` font-bold text-sky-700 hover:text-sky-900 hover:underline dark:text-sky-300 dark:hover:text-sky-500 ${'text-lg'} grow`}
						>
							{props.quakeData.properties.place
								? props.quakeData.properties.place
								: place}
						</a>
					</Link>

					<div className='flex justify-between leading-8 columns-2'>
						<div className='flex items-center pb-1 font-normal text-md '>
							<div className='pr-2 text-lg text-purple-700 dark:text-purple-400'>
								<GoReport />
							</div>
							{props.quakeData.properties.felt != null
								? props.quakeData.properties.felt
								: 0}{' '}
							reports
							{(now - props.quakeData.properties.time) / (1000 * 60 * 60 * 24) >
							30 ? (
								''
							) : (
								<a
									className='pl-2 text-sky-600 hover:text-sky-800 hover:underline dark:text-sky-500 dark:hover:text-sky-600'
									href={props.quakeData.properties.url + '/tellus'}
									target='_blank'
								>
									Did you feel it?
								</a>
							)}
						</div>
						<div className='pr-1 text-sm place-self-center sm:text-lg '>
							<a
								href={props.quakeData.properties.url}
								className='px-1 font-bold text-green-800 border border-green-800 rounded-sm hover:bg-green-800 hover:text-white hover:no-underline dark:bg-green-800 dark:text-zinc-100 dark:border-zinc-100'
								target='_blank'
								rel='noreffer'
							>
								USGS
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
