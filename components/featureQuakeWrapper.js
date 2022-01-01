import { useState, useEffect } from 'react'
import Quake from './quake'

export default function FeatureQuakeWrapper() {
  const [quakes, setQuakes] = useState([])

  const fetchString =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=7'
  // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02

  useEffect(() => {
    fetch(fetchString)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setQuakes(data.features)
        // console.log(data.features)
      })
  }, [])

  return (
    <div className='block columns-1 px-2 pt-0 w-full lg:w-2/5 xl:w-2/5'>
      <div className='w-full text-center bg-amber-400 border border-stone-600 border-b-0 mt-5 text-2xl uppercase p-1'>
        Most Recent Quakes
      </div>
      {quakes.length > 0 ? (
        quakes.map(quake => {
          return <Quake quakeData={quake} key={quake.id} />
        })
      ) : (
        <div>Error Fetching Earthquakes</div>
      )}
    </div>
  )
}
