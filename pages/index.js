import Head from 'next/head'
import FeaturedQuake from '../components/featureQuake'
import FeatureQuakeWrapper from '../components/featureQuakeWrapper'
import QuakeWrapper from '../components/quakeWrapper'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-2 bg-stone-300'>
			<Head>
				<title>USGS Earthquake Feed</title>
				<link rel='icon' href='/icons/waveform 1.svg' />
				<meta
					name='description'
					content='A feed of recent earthquakes and search filter for past earthquakes using data provided by the US Geological Survey. Detailed descriptions for each earthquake show the shake map, human impacts, and tectonic summary which explains the geology behind the earthquake.'
				/>
			</Head>
			<div className='flex w-full h-20 p-2 mt-5 overflow-hidden font-semibold text-center align-middle border-y border-stone-600 bg-stone-100'>
				<h1 className='w-full my-auto text-2xl uppercase lg:text-6xl md:text-4xl sm:text-3xl'>
					<img
						src='/icons/waveform 1.svg'
						className='hidden w-10 h-10 md:w-20 md:h-20 sm:inline'
					/>{' '}
					USGS Earthquake Feed{' '}
					<img
						src='/icons/waveform 1.svg'
						className='hidden w-10 h-10 md:w-20 md:h-20 sm:inline'
					/>
				</h1>
			</div>
			<main className='w-full sm:w-11/12'>
				<div className='flex flex-col lg:flex-row'>
					<FeaturedQuake />
					<FeatureQuakeWrapper />
				</div>
				<QuakeWrapper />
			</main>

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
