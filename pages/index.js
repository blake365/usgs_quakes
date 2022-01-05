import Head from 'next/head'
import FeaturedQuake from '../components/featureQuake'
import FeatureQuakeWrapper from '../components/featureQuakeWrapper'
import QuakeWrapper from '../components/quakeWrapper'

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center py-2 bg-stone-300 min-h-screen'>
      <Head>
        <title>USGS Earthquakes</title>
        <link rel='icon' href='/icons/waveform 1.ico' />
      </Head>
      <div className='flex font-semibold w-full text-center p-2 mt-5 h-20 align-middle overflow-hidden border-y border-stone-600 bg-stone-100'>
        <h1 className='lg:text-6xl md:text-5xl sm:text-3xl text-2xl w-full uppercase my-auto'>
          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 hidden sm:inline'
          />{' '}
          USGS Earthquake Feed{' '}
          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 hidden sm:inline'
          />
        </h1>
      </div>
      <main className='sm:w-11/12 w-full'>
        <div className='flex lg:flex-row flex-col'>
          <FeaturedQuake />
          <FeatureQuakeWrapper />
        </div>
        <QuakeWrapper />
      </main>

      <footer className='w-full border-y border-stone-600 p-5 text-center text-lg bg-stone-100'>
        <div>Data provided by the United States Geological Survey</div>
        <a
          href='https://earthquake.usgs.gov/fdsnws/event/1/'
          target='_blank'
          className='underline text-blue-600 hover:text-blue-900'
        >
          API Documentation
        </a>
      </footer>
    </div>
  )
}
