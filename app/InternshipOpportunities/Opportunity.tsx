import Image from 'next/image';
import React, { useState } from 'react';
import { FiArrowUp, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';

const Opportunity = ({ data }: any) => {
    const [interestedCount, setInterestedCount] = useState(data.interested);

    const handleInterestedClick = () => {
        setInterestedCount(interestedCount + 1);
    };

    return (
        <div className="bg-gray-100 text-black px-12 py-6 mt-4 my-4 rounded-lg shadow-md flex justify-between items-start">
            {/* Left Section */}
            <div>
                <div className="flex items-center mb-2">
                    <Image src="https://www.shutterstock.com/image-photo/male-business-coach-speaker-suit-600nw-1361250578.jpg" alt="Anonymous" className="h-8 w-8 rounded-full mr-2" width={1000} height={1000}/>
                    <span className="text-sm font-semibold">Anonymous</span>
                </div>
                <h3 className="text-lg  font-bold mb-1">{data.title}</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
            </div>

            {/* Right Section */}
            <div className="flex">
                {/* Column 1: Interested Button */}
                <div className="flex items-center mt-auto mr-12">
                    <button
                        className="flex items-center bg-white text-md px-3 py-1 rounded-lg shadow-sm"
                        onClick={handleInterestedClick}
                    >
                        <FiArrowUp className="mr-1" />
                        Interested {interestedCount}
                    </button>
                </div>

                {/* Column 2: Answers, Share, Save */}
                <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-1 text-md text-black text-right">
                        <FiMessageCircle />
                        <span>{data.answers} Answers</span>
                    </div>
                    <div className="flex items-center space-x-1 text-md text-black text-left">
                        <FiShare2 />
                        <span>Share</span>
                    </div>
                    <div className="flex items-center space-x-1 text-md text-black text-right">
                        <FiBookmark />
                        <span>Save</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Opportunity;
