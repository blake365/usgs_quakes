import { useState, useEffect } from 'react'
import Quake from './quake'
import useSWR from 'swr'

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
	// const [quakes, setQuakes] = useState([])
	// const [loading, isLoading] = useState(false)

	// console.log(data)

	const { quakes, isLoading, isError } = useQuakes()

	// useEffect(() => {
	//   // const fetchData = async () => {
	//   //   isLoading(true)
	//   //   const res = await fetch(fetchString)

	//   //   // console.log(res)
	//   //   const json = await res.json()
	//   //   // console.log(json)
	//   //   setQuakes(json.features)
	//   //   isLoading(false)
	//   // }
	//   // fetchData()

	// }, [])

	// console.log(quakes)

	return (
		<div className='block w-full px-2 pt-0 mt-5 columns-1 lg:w-2/5 xl:w-2/5'>
			<div className='w-full text-center bg-amber-400 border border-stone-600 rounded-lg mb-2.5 p-1 '>
				<div className='text-xl uppercase md:text-2xl'>
					10 Most Recent Quakes: M {'>'} 2.5
				</div>
				<div className='block text-sm text-stone-600'>
					Automatically refreshes every minute
				</div>
			</div>
			{isLoading ? (
				<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
					<div className='mt-5 ldsripple'>
						<div></div>
						<div></div>
					</div>
				</div>
			) : (
				quakes.features.map((quake) => {
					return <Quake quakeData={quake} key={quake.id} />
				})
			)}
		</div>
	)
}
