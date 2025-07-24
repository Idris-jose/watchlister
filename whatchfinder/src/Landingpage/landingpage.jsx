import LandingNav from './Landingnav.jsx';
import background from '../assets/peakpx.jpg';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-black">
            <LandingNav />
            <main
                className="relative h-screen flex items-center justify-center text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `url(${background})`,
            }}
            >
                {/* Background overlay for better text readability */}
                <div className="absolute inset-0 bg-black/80 z-0"></div>

                <section className="relative z-10 flex flex-col text-center items-center px-4">
                    <div className="mb-6 p-3 rounded-full bg-amber-50 w-fit">
                        {/* Changed from h1 to p for semantic correctness */}
                        <p className='text-blue-600 font-medium'>Track.Discover.Enjoy</p>
                    </div>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>Your Ultimate Movie Tracker</h1>
                    <p className='text-lg text-gray-300 mb-8 max-w-2xl'>
                        Watchlister helps you build your personalized watchlist, track progress, view trailers, and explore new films.
                    </p>

                    <Link to="/Signup" className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                        Start your Watchlist <Play className='inline ml-2' />
                    </Link>
                </section>
            </main>
        </div>
    );
}
