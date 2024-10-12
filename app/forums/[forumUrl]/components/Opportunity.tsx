// import Image from 'next/image';
// import React, { useState } from 'react';
// import { FiArrowUp, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';

// const Opportunity = ({ data }: any) => {
//     const [interestedCount, setInterestedCount] = useState(data.interested);

//     const handleInterestedClick = () => {
//         setInterestedCount(interestedCount + 1);
//     };
//     if(!data){
//         return <div>No Posts Found</div>

//     }

//     return (
//         <div className="bg-white text-black px-12 py-6 mt-4 my-4 rounded-lg shadow-md flex justify-between items-start sm:w-full  md:flex-row lg:flex-row flex-col">
//             {/* Left Section */}
//             <div className='bg-white'>
//                 <div className="flex items-center mb-2">
//                     <Image src="https://www.shutterstock.com/image-photo/male-business-coach-speaker-suit-600nw-1361250578.jpg" alt="Anonymous" className="h-8 w-8 rounded-full mr-2" width={1000} height={1000}/>
//                     <span className="text-sm font-semibold">Anonymous</span>
//                 </div>
//                 <h3 className="text-lg  font-bold mb-1 bg-white">{data.title}</h3>
//                 <p className="text-sm text-gray-600">{data.content}</p>
//             </div>

//             {/* Right Section */}
//             <div className="flex flex-col lg:flex-row">
//                 {/* Column 1: Interested Button */}
//                 <div className="flex items-center mt-auto mr-12">
//                     <button
//                         className="flex items-center bg-white text-md px-3 py-1 rounded-lg shadow-sm "
//                         onClick={handleInterestedClick}
//                     >
//                         <FiArrowUp className="mr-1" />
//                         Interested {interestedCount}
//                     </button>
//                 </div>

//                 {/* Column 2: Answers, Share, Save */}
//                 <div className="flex items-start space-y-2 flex-row lg:flex-col md:flex-col ">
//                     <div className="flex items-center space-x-1 lg:text-md text-black text-right sm:space-x-0 text-sm pt-2 pr-1">
//                         <FiMessageCircle />
//                         <span>{data.answers} Answers</span>
//                     </div>
//                     <div className="flex items-center space-x-1 lg:text-md text-black text-left sm:space-x-0 text-sm">
//                         <FiShare2 />
//                         <span>Share</span>
//                     </div>
//                     <div className="flex items-center space-x-1 lg:text-md text-black text-right sm:space-x-0 text-sm">
//                         <FiBookmark />
//                         <span>Save</span>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Opportunity;


















// Dark Mode
import Image from 'next/image';
import React, { useState } from 'react';
import { FiArrowUp, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';

const Opportunity = ({ data }: any) => {
    const [interestedCount, setInterestedCount] = useState(data.interested);

    const handleInterestedClick = () => {
        setInterestedCount(interestedCount + 1);
    };

    if (!data) {
        return <div className="dark:text-white">No Posts Found</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white px-12 py-6 mt-4 my-4 rounded-lg shadow-md flex justify-between items-start sm:w-full md:flex-row lg:flex-row flex-col">
            {/* Left Section */}
            <div>
                <div className="flex items-center mb-2">
                    <Image
                        src="https://www.shutterstock.com/image-photo/male-business-coach-speaker-suit-600nw-1361250578.jpg"
                        alt="Anonymous"
                        className="h-8 w-8 rounded-full mr-2"
                        width={1000}
                        height={1000}
                    />
                    <span className="text-sm font-semibold">Anonymous</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{data.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{data.content}</p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col lg:flex-row">
                {/* Column 1: Interested Button */}
                <div className="flex items-center mt-auto mr-12">
                    <button
                        className="flex items-center bg-white dark:bg-gray-700 dark:text-white text-md px-3 py-1 rounded-lg shadow-sm"
                        onClick={handleInterestedClick}
                    >
                        <FiArrowUp className="mr-1" />
                        Interested {interestedCount}
                    </button>
                </div>

                {/* Column 2: Answers, Share, Save */}
                <div className="flex items-start space-y-2 flex-row lg:flex-col md:flex-col">
                    <div className="flex items-center space-x-1 lg:text-md text-black dark:text-white text-right sm:space-x-0 text-sm pt-2 pr-1">
                        <FiMessageCircle />
                        <span>{data.answers} Answers</span>
                    </div>
                    <div className="flex items-center space-x-1 lg:text-md text-black dark:text-white text-left sm:space-x-0 text-sm">
                        <FiShare2 />
                        <span>Share</span>
                    </div>
                    <div className="flex items-center space-x-1 lg:text-md text-black dark:text-white text-right sm:space-x-0 text-sm">
                        <FiBookmark />
                        <span>Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Opportunity;
