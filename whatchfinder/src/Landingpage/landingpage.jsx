import Nav from './Landingnav.jsx';
import background from '../assets/peakpx.jpg';
import React from 'react'; 

export default function LandingPage(){
    return(
        <>
        <Nav />
        <div 
            className="relative h-screen flex items-center justify-center bg-black text-white"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
           
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

           
            <div className="relative z-10 text-center items-center justify-center px-4">
                <div className="mb-6 p-3 rounded-full bg-amber-50 w-fit items-center justify-center">
                    <h1 className='text-blue-600 font-medium'> Track.Discover.Enjoy</h1>
                    </div>
                <h1 className='text-4xl font-bold mb-4'>Your Ultimate Movie Tracker</h1>
                <p className='text-lg text-gray-300 mb-8'>
                    Watchlister helps you build your personalized watchlist, track progress, view trailers, and explore new films.
                </p>
                <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    Start your Watchlist
                </button>
            </div>
        </div>
        </>
    );
}
