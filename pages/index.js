import Head from 'next/head'
import FeaturedQuake from '../components/featureQuake'
import FeatureQuakeWrapper from '../components/featureQuakeWrapper'
import QuakeWrapper from '../components/quakeWrapper'
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center  py-2 bg-stone-300 min-h-screen'>
      <Head>
        <title>USGS Earthquakes</title>
        <link rel='icon' href='/icons/waveform 1.ico' />
      </Head>
      <div className='font-bold w-full text-center p-2 pb-0'>
        <h1 className='lg:text-6xl md:text-4xl text-3xl w-full uppercase'>
          <img
            src='/icons/waveform 1.svg'
            className='lg:w-20 lg:h-20 w-10 h-10 hidden sm:inline'
          />{' '}
          USGS Earthquake Feed{' '}
          <img
            src='/icons/waveform 1.svg'
            className='lg:w-20 lg:h-20 w-10 h-10 hidden sm:inline'
          />
        </h1>
      </div>
      <main className='w-11/12'>
        <div className='flex lg:flex-row flex-col'>
          <FeaturedQuake />
          <FeatureQuakeWrapper />
        </div>
        <QuakeWrapper />
      </main>

      <footer className=''></footer>
    </div>
  )
}
