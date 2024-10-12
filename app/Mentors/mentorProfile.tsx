import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MentorProfileBoxProps {
    id: string;
    imageSrc?: string;
    name: string;
    expertise: string[];
    experience: number;
}
const MentorProfileBox = ({ id, imageSrc, name, expertise, experience }: MentorProfileBoxProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <Link href={`Mentors/${id}`}>
            <div
                style={{ position: 'relative', height: '10rem', width: '10rem', marginBottom: '1rem' }}
                className="mx-auto"
            >
                <Image
                    src={imageSrc || "https://www.shutterstock.com/image-photo/male-business-coach-speaker-suit-600nw-1361250578.jpg"}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                />
            </div>
            <h4 className="text-lg text-center text-black dark:text-white font-semibold dark:bg-gray-800">{name}</h4>
            {/* <p className="text-center text-gray-700 dark:text-gray-300">{expertise.join(" | ")}</p> */}
            {/* Top 3 skills as tags*/}
            {Array.isArray(expertise) && expertise.length > 0 && (
                <div className="flex justify-center gap-2 mt-2">
                    {expertise.slice(0, 3).map((expertise, index) => (
                        <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full cursor-pointer">
                            {expertise}
                        </span>
                    ))}
                </div>
            )}
            <p className="text-center text-gray-500 dark:text-gray-400">{experience} years of experience</p>
            
                <button className="mt-2 mx-auto py-1 px-4 rounded-full border border-black dark:border-gray-500 text-black dark:text-white bg-white dark:bg-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black block">
                    View Profile
                </button>
            </Link>
        </div>
    );
};

export default MentorProfileBox;
