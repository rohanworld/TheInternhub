import Image from 'next/image';
import React from 'react';

const StandOut = () => {
  return (
    <div className="py-16 bg-[#E8EAF6] dark:bg-gray-900 text-center">
      <h2 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] bg-clip-text text-transparent text-5xl font-bold text-black">Stand Out!</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">How InternHub Helps You</p>

      {/* Horizontal Scroll Section */}
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide p-4 mx-auto max-w-6xl justify-center">
        <div className="flex-shrink-0 w-80 h-80 py-8 px-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:scale-102 cursor-pointer">
          <div className="mb-6">
            <Image src="/standoutone.png" alt="Icon" width={40} height={40} />
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white dark:bg-[#1F2937] mb-2 bg-[#F3F4F6]">Find the right intern</h3>
          <p className="text-gray-500 dark:text-white dark:bg-[#1F2937]">Search or get recommendations for jobs that match what you&apos;re looking for.</p>
        </div>

        <div className="flex-shrink-0 w-80 h-80 py-8 px-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:scale-102 cursor-pointer">
          <div className="mb-6">
            <Image src="/standouttwo.png" alt="Icon" width={40} height={40} />
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white dark:bg-[#1F2937] mb-2 bg-[#F3F4F6]">Boost Your Career</h3>
          <p className="text-gray-500 dark:text-white dark:bg-[#1F2937]">Create a profile, get it to 100%, and immediately get noticed by the right recruiters.</p>
        </div>

        <div className="flex-shrink-0 w-80 h-80 py-8 px-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:scale-102 cursor-pointer">
          <div className="mb-6">
            <Image src="/standoutthree.png" alt="Icon" width={40} height={40} />
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white dark:bg-[#1F2937] mb-2 bg-[#F3F4F6]">Be the best candidate</h3>
          <p className="text-gray-500 dark:text-white dark:bg-[#1F2937]">Get access to career guidance and advice via the “Career Centre” and stand out from the rest.</p>
        </div>

      </div>
    </div>
  );
};

export default StandOut;
