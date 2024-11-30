
export default function Footer() {
  return (
    			<footer className='flex flex-col w-full gap-2 p-5 mt-5 text-lg text-center text-stone-700 border-y border-stone-400 bg-sky-200 dark:bg-sky-600 dark:text-zinc-100 dark:border-zinc-600'>
				<div>
				<div>Data provided by the United States Geological Survey: <a
					href='https://earthquake.usgs.gov/fdsnws/event/1/'
					target='_blank'
					className='underline text-sky-600 hover:text-sky-900 dark:text-zinc-100 dark:hover:text-zinc-300'
				>
					API Documentation
				</a></div>
				
				</div>
				<div>
					Created by Blake, more projects at{' '}
					<a
						href='https://www.blakemorgan.rocks'
						target='_blank'
						className='underline text-sky-600 hover:text-sky-900 dark:text-zinc-100 dark:hover:text-zinc-300'
					>
						blakemorgan.rocks
					</a>
				</div>
			</footer>
  )
}
