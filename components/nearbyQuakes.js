import { useState, useEffect } from 'react'
import Quake from './quake'

export default function NearbyQuakes({ latitude, longitude, currentId }) {
	const [quakes, setQuakes] = useState([])
	const [loading, isLoading] = useState(true)

	// console.log(data)

	const fetchString = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${latitude}&longitude=${longitude}&minradiuskm=1&maxradiuskm=160&limit=10`

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
