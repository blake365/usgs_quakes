// import React from 'react'
import Link from 'next/link'
import { BsPinMapFill } from 'react-icons/bs'
import { GoReport } from 'react-icons/go'

export default function Quake(props) {
	//   const [detailsLink, setDetailsLink] = useState('')
	//   const [details, setDetails] = useState([])
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

	// console.log(props.quakeData.properties.time)

	let timeSince = (now - props.quakeData.properties.time) / 3600000
	// let quakeBgColor = ''

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

	return (
		<section className='flex w-full overflow-hidden border rounded-lg shadow-md columns-2 dark:border-zinc-800 border-stone-400 bg-stone-100 dark:bg-zinc-600 dark:text-zinc-100 text-stone-700'>
			{props.quakeData.properties.mag < 4 ? (
				<div className='w-5 bg-green-400 '></div>
			) : props.quakeData.properties.mag >= 6.5 ? (
				<div className='w-5 bg-red-500 '></div>
			) : props.quakeData.properties.mag >= 5 ? (
				<div className='w-5 bg-orange-500 '></div>
			) : (
				<div className='w-5 bg-yellow-300 '></div>
			)}

			{/* <div className={`w-5 bg-${quakeBgColor}-400 `}></div> */}

			<div className='w-full p-1 pl-3 text-left border-l border-stone-400 dark:border-zinc-800'>
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

					{props.quakeData.properties.status === 'reviewed' ? (
						<div className='pr-1 text-green-700 dark:text-green-500'>
							{props.quakeData.properties.status}
						</div>
					) : (
						<div className='pr-1'>
							{props.quakeData.properties.status.substring(0, 4)}
						</div>
					)}
				</div>
				<Link href={`/details/${props.quakeData.id}`}>
					<a className='pr-3 text-lg font-bold text-sky-700 hover:text-sky-900 hover:underline dark:text-sky-300 dark:hover:text-sky-500'>
						{props.quakeData.properties.title}
					</a>
				</Link>
				<div className='flex items-center leading-8 align-middle md:text-lg'>
					<div className='pr-2 text-lg text-green-700 align-middle dark:text-green-200'>
						<BsPinMapFill />
					</div>
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
				{/*<div className='text-lg leading-8 align-middle'>
          <img src='/icons/waveform 1.svg' className='inline w-7 h-7' />{' '}
          {props.quakeData.properties.mag} {props.quakeData.properties.magType}
          </div>*/}
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
		</section>
	)
}
