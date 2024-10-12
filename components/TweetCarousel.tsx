import React from 'react'


const TweetCarousel = () => {
  return (
    <div className='flex justify-center dark:bg-[#111827] '>
      <div className="carousel rounded-box w-[1040px] h-[300px] bg-[#A6B2FF] relative dark:bg-[#1F2937]">
        <div className="carousel-item w-[100%] flex items-center relative">
          <div className='relative flex flex-auto w-full'>
            <div className='w-full h-[300px] rounded-tl-[24px] flex justify-between p-10 items-center'>
             
              <div className='w-[500px] h-auto flex flex-col'>
                <p className='text-white font-dm-sans text-[32px] font-bold leading-[32px] tracking-[-0.02em] text-left'>
                  Tweet
                </p>
                <p className='text-white font-dm-sans text-[20px] font-medium leading-[26px] tracking-[-0.02em] text-left mt-4'>
                  Join our newsletter and get the latest job listings and career insights delivered straight to your inbox.
                </p>
              </div>
          
              <div className="flex items-center justify-end">
                <button className='bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] btn-primary bg-white text-white w-[138px] h-[48px] rounded-lg dark:text-white dark:bg-[#2563EB] text-lg font-semibold'>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item w-[100%] flex items-center relative">
          <div className='relative flex flex-auto w-full'>
            <div className='w-full h-[300px] rounded-tl-[24px] flex justify-between p-10 items-center'>
              <div className='w-[500px] h-auto flex flex-col'>
                <p className='text-white font-dm-sans text-[32px] font-bold leading-[32px] tracking-[-0.02em] text-left'>
                  Explore Opportunities
                </p>
                <p className='text-white font-dm-sans text-[20px] font-medium leading-[26px] tracking-[-0.02em] text-left mt-4'>
                  Discover top internships, fellowships, and programs tailored to help you grow your career.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button className='btn-primary bg-white w-[138px] h-[48px] rounded-lg  dark:text-white dark:bg-[#2563EB]  text-lg text-black '>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item w-[100%] flex items-center relative">
          <div className='relative flex flex-auto w-full'>
            <div className='w-full h-[300px] rounded-tl-[24px] flex justify-between p-10 items-center'>
              <div className='w-[500px] h-auto flex flex-col'>
                <p className='text-white font-dm-sans text-[32px] font-bold leading-[32px] tracking-[-0.02em] text-left'>
                  Stay Informed
                </p>
                <p className='text-white font-dm-sans text-[20px] font-medium leading-[26px] tracking-[-0.02em] text-left mt-4'>
                  Get regular updates about the latest trends in your industry and career development tips.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button className='btn-primary bg-white w-[138px] h-[48px] rounded-lg  dark:text-white dark:bg-[#2563EB] text-lg text-black '>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweetCarousel
