import React from 'react'

const HowWorks = () => {
  return (
    <div className='w-full max-h-fit md:h-[500px] my-6  border-2 bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700  '>
    {/* heading */}
    <div className='pb-10'> 
        <h1 className=' text-3xl lg:text-4xl font-serif font-bold text-center pt-10 text-white  '>How It Works</h1>
        <p className='text-center text-gray-200 mt-2 mb-8'>
         Get started in three simple steps  and begin your volunteering journey today
        </p>
    </div>
    {/* content */}
      <div className='w-full max-h-fit md:h-[300px] flex flex-col md:flex-row items-center justify-around  px-4 py-10 gap-x-2-2 gap-y-6 '>
        {/* step 1 */}
        <div className='flex flex-col shrink-0  hover:border-[2px] hover:bg-gray-200 justify-center w-[320px] border-[1px] border-cyan-300  rounded-xl h-full px-2 py-5 text-center bg-white '>
         <h1 className='text-center font-extrabold text-orange-500 text-4xl pb-3 '>1</h1>
         <h1 className='font-bold text-xl py-2 '>Create Profile</h1>
         <p>sign up and tell us about your skills, <br/> interests and avilability  </p>
        </div>
        
        {/* step 2 */}
        <div className='flex flex-col shrink-0  hover:border-[2px] hover:bg-gray-200 justify-center w-[320px] border-[1px] border-cyan-300  rounded-xl h-full px-2 py-5 text-center bg-white '>
         <h1 className='text-center font-extrabold text-orange-500 text-4xl pb-3 '>2</h1>
         <h1 className='font-bold text-xl py-2 '>Explore Opportunities</h1>
         <p>Browser verified NGO opportunities<br/> tailored to your profile.  </p>
        </div>

        {/* step 3 */}
        <div className='flex flex-col shrink-0  hover:border-[2px] hover:bg-gray-200 w-[320px] border-[1px] border-cyan-300  rounded-xl h-full px-2 py-5 justify-center text-center bg-white '>
         <h1 className='text-center font-extrabold text-orange-500 text-4xl pb-3 '>3</h1>
         <h1 className='font-bold text-xl py-2 '>Start Volunteering</h1>
         <p>Connect with NGOs and begin making a <br/> meaningful impact </p>
        </div>
      </div>

    </div>
  )
}

export default HowWorks
