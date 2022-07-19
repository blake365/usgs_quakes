import { useState, useEffect } from 'react'
import Quake from './quake'
// import useSWR from 'swr'

// const fetcher = (...args) => fetch(...args).then((res) => res.json())

// const fetchString =
// 	'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&limit=10'

// function useQuakes() {
// 	const { data, error } = useSWR(fetchString, fetcher, {
// 		refreshInterval: 60000,
// 	})

// 	return {
// 		quakes: data,
// 		isLoading: !error && !data,
// 		isError: error,
// 	}
// }

export default function NearbyQuakes({ latitude, longitude, currentId }) {
	const [quakes, setQuakes] = useState([])
	const [loading, isLoading] = useState(true)

	// console.log(data)

	// const { quakes, isLoading, isError } = useQuakes()

	const fetchString = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${latitude}&longitude=${longitude}&minradiuskm=1&maxradiuskm=100&limit=10`

	useEffect(() => {
		const fetchData = async () => {
			isLoading(true)
			const res = await fetch(fetchString)
			// console.log(res)
			const json = await res.json()
			// console.log(json)
			// console.log(json)
			setQuakes(json)
			isLoading(false)
		}
		fetchData()
	}, [fetchString])

	// console.log(quakes)

	// const countQuakes = (id, arr) => {
	// 	// console.log(quakesArr)
	// 	let filtered = arr.filter((quake) => {
	// 		quake.id !== id
	// 	})
	// 	console.log(filtered)
	// 	let count = filtered.length
	// 	console.log(count)
	// 	return count
	// }

	return (
		<div>
			{loading ? (
				<div className='w-full mb-4 text-center align-middle border border-stone-600 bg-stone-100'>
					<div className='mt-5 ldsripple'>
						<div></div>
						<div></div>
					</div>
				</div>
			) : quakes.features.length > 0 ? (
				quakes.features.map((quake) => {
					if (quake.id === currentId) {
						return
					} else {
						return <Quake quakeData={quake} key={quake.id} />
					}
				})
			) : (
				<div className='block w-full p-5 mt-5 mb-4 text-center align-middle border rounded-lg shadow-md border-stone-600 bg-stone-100'>
					No Earthquakes Found
				</div>
			)}
		</div>
	)
}
