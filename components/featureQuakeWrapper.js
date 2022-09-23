import { useState, useEffect } from 'react'
import Quake from './quake'
import useSWR from 'swr'
import QuakeCard from './quakeCard'
import { BiGridAlt, BiListUl } from 'react-icons/bi'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const fetchString =
	'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&limit=10'

function useQuakes() {
	const { data, error } = useSWR(fetchString, fetcher, {
		refreshInterval: 60000,
	})

	return {
		quakes: data,
		isLoading: !error && !data,
		isError: error,
	}
}

export default function FeatureQuakeWrapper() {
	const { quakes, isLoading, isError } = useQuakes()

	const [size, setSize] = useState('large')

	// console.log(size)

	return (
		<div className='block w-full px-2 pt-0 mt-5 columns-1 lg:w-2/5 xl:w-2/5'>
			<div className='w-full text-center text-stone-700 bg-sky-200 border border-stone-400 rounded-lg mb-2.5 p-1 dark:bg-sky-600 dark:text-zinc-100 dark:border-zinc-600'>
				<div className='flex justify-center align-middle'>
					<div className='flex flex-col invisible dark:text-stone-700 grow-0'>
						<button
							onClick={() => setSize('large')}
							className='h-6 px-1 m-1 text-center border rounded-md text-md bg-stone-200 hover:bg-stone-50 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200'
							disabled={size === 'large'}
						>
							<BiGridAlt />
						</button>
						<button
							onClick={() => setSize('compact')}
							className='h-6 px-1 m-1 mt-0 text-center border rounded-md text-md hover:bg-stone-50 bg-stone-200 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200 '
							disabled={size === 'compact'}
						>
							<BiListUl />
						</button>
					</div>
					<div className='content-center my-auto grow'>
						<h4 className='mb-0 text-2xl uppercase'>
							10 Most Recent Quakes: M {'>'} 2.5
						</h4>
						<div className='block text-sm dark:text-zinc-300 text-stone-600'>
							Checks for new earthquakes every minute
						</div>
					</div>
					<div className='flex flex-col content-end justify-end my-auto dark:text-stone-700 grow-0'>
						<button
							onClick={() => setSize('large')}
							className='h-6 px-1 m-1 mb-0 text-center border rounded-t-md text-md bg-stone-200 hover:bg-stone-50 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200'
							disabled={size === 'large'}
						>
							<BiGridAlt />
						</button>
						<button
							onClick={() => setSize('compact')}
							className='h-6 px-1 m-1 mt-0 text-center border border-t-0 rounded-b-md text-md hover:bg-stone-50 bg-stone-200 border-stone-700 disabled:text-sky-600 disabled:hover:bg-stone-200 '
							disabled={size === 'compact'}
						>
							<BiListUl />
						</button>
					</div>
				</div>
			</div>
			<div className='flex flex-wrap justify-between gap-4'>
				{isLoading ? (
					<div className='w-full mb-4 text-center align-middle border border-stone-400 bg-stone-200'>
						<div className='mt-5 ldsripple'>
							<div></div>
							<div></div>
						</div>
					</div>
				) : (
					quakes.features.map((quake) => {
						if (size === 'large') {
							return <QuakeCard quakeData={quake} key={quake.id} />
						} else {
							return <Quake quakeData={quake} key={quake.id} />
						}
					})
				)}
			</div>
		</div>
	)
}
