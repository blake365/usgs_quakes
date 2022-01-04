// import React from 'react'
import Link from 'next/link'

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

  // console.log(props.quakeData.properties.title)

  return (
    <section className='w-full flex columns-2 border mb-4 border-stone-600 bg-stone-100 rounded-lg shadow-md overflow-hidden'>
      {props.quakeData.properties.mag < 4 ? (
        <div className=' w-5 bg-green-400'></div>
      ) : props.quakeData.properties.mag >= 6.5 ? (
        <div className=' w-5 bg-red-500 '></div>
      ) : props.quakeData.properties.mag >= 5 ? (
        <div className=' w-5 bg-orange-500 '></div>
      ) : (
        <div className=' w-5 bg-yellow-300 '></div>
      )}

      <div className='pl-3 p-1 text-left w-full border-l border-stone-600'>
        <div className='text-sm text-stone-800 flex columns-2 justify-between'>
          <div className=''>
            {' '}
            {new Date(props.quakeData.properties.time).customFormat(
              '#MM#/#DD#/#YYYY# #hh#:#mm#:#ss# #AMPM#'
            )}
          </div>
          {props.quakeData.properties.status === 'reviewed' ? (
            <div className='pr-1 text-green-700'>
              {props.quakeData.properties.status}
            </div>
          ) : (
            <div className='pr-1 text-stone-700'>
              {props.quakeData.properties.status.substring(0, 4)}
            </div>
          )}
        </div>
        <a
          className='text-lg font-bold hover:text-blue-900 hover:underline pr-3 text-blue-700'
          href={props.quakeData.properties.url}
          target='_blank'
        >
          {props.quakeData.properties.title}
        </a>

        <div className='md:text-lg leading-8 align-middle text-sm'>
          <div className='text-lg inline align-middle'>🗺 </div>
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
        {/*<div className='leading-8 align-middle text-lg'>
          <img src='/icons/waveform 1.svg' className='w-7 h-7 inline' />{' '}
          {props.quakeData.properties.mag} {props.quakeData.properties.magType}
          </div>*/}
        <div className='text-sm text-stone-800 flex columns-2 justify-between leading-8 align-middle'>
          <div className='pb-1 text-lg'>
            📝{' '}
            {props.quakeData.properties.felt != null
              ? props.quakeData.properties.felt
              : 0}{' '}
            reports{' '}
            {(now - props.quakeData.properties.time) / (1000 * 60 * 60 * 24) >
            30 ? (
              ''
            ) : (
              <a
                className='text-sm text-blue-600 hover:text-blue-800 hover:underline'
                href={props.quakeData.properties.url + '/tellus'}
                target='_blank'
              >
                Did you feel it?
              </a>
            )}
          </div>
          <div className='align-middle pb-0 pr-2 text-sm sm:text-lg '>
            <Link className='' href={`/details/${props.quakeData.id}`}>
              <a className=' text-stone-600 hover:text-stone-800 underline'>
                show details
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
