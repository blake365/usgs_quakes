import Head from 'next/head'
import FeaturedQuake from '../components/featureQuake'
import QuakeWrapper from '../components/quakeWrapper'
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center  py-2 bg-stone-300 min-h-screen'>
      <Head>
        <title>USGS Earthquakes</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='font-bold w-full text-center md:p-5 p-2'>
        <h1 className='md:text-6xl text-3xl w-full'>
          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 inline'
          />
          USGS Earthquake Feed
          <img
            src='/icons/waveform 1.svg'
            className='md:w-20 md:h-20 w-10 h-10 hidden sm:inline'
          />
        </h1>
      </div>
      <main className='h-full'>
        {/*<FeaturedQuake />*/}
        <QuakeWrapper parameters={3} />
      </main>

      <footer className=''></footer>
    </div>
  )
}
