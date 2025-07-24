import logo from '../assets/logo.png';

export default function LandingNav() {
    return (
        // Use <header> for semantic meaning and make it absolute to overlay the hero section
        <header className='absolute top-0 left-0 right-0 z-20 flex justify-between items-center bg-gray-950/35 p-3 text-white'>
            {/* Logo is now a link to the homepage */}
            <a href="/" aria-label="Go to WatchFinder homepage">
                <img src={logo} alt="WatchFinder Logo" className="w-40" />
            </a>

            {/* Use <a> tags for navigation links for accessibility. Hidden on mobile. */}
            <nav className='hidden md:flex items-center gap-6'>
                <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
                <a href="#support" className="hover:text-blue-400 transition-colors">Support Us</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </nav>

            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                Login / Signup
            </button>
        </header>
    );
}