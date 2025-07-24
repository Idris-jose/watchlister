import logo from '../assets/logo.png';

export default function Nav (){
    return(
        <>
       <div className='flex justify-between items-center bg-gray-950/35 p-3  text-white'>

      
               <img src={logo} alt="WatchFinder Logo" className="w-40 " />


              <nav className='flex gap-4'>
                <h1>Home</h1>
                <h1>Support us</h1>
                <h1>Contact us</h1>
              </nav>

                 <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    Login/signup
                 </button>
          
        </div>
        </>
    )
}