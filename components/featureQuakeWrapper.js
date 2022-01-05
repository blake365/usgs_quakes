import { useState, useEffect } from 'react'
import Quake from './quake'

export default function FeatureQuakeWrapper() {
  const [quakes, setQuakes] = useState([])
  const [loading, isLoading] = useState(false)

  const fetchString =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&limit=10'

  useEffect(() => {
    const fetchData = async () => {
      isLoading(true)
      const res = await fetch(fetchString)

      // console.log(res)
      const json = await res.json()
      // console.log(json)
      setQuakes(json.features)
      isLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className='block columns-1 px-2 pt-0 w-full lg:w-2/5 xl:w-2/5 mt-5'>
      <div className='w-full text-center bg-amber-400 border border-stone-600 rounded-lg mb-2.5 md:text-2xl uppercase p-1 text-xl'>
        10 Most Recent Quakes: M {'>'} 2.5
      </div>
      {loading ? (
        <div className='w-full border mb-4 border-stone-600 bg-stone-100 text-center align-middle'>
          <div className='ldsripple mt-5'>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        quakes.map(quake => {
          return <Quake quakeData={quake} key={quake.id} />
        })
      )}
    </div>
  )
}
