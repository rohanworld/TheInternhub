import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StudentProfile {
    id: string;
    imageSrc?: string;
    name: string;
    college?: string;
    resume?: string;
    skills: string[];
}

const MentorProfileBox = ({ id, imageSrc, name, college, resume, skills }: StudentProfile) => {
    return (
        <div className="bg-white dark:bg-gray-800 px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <Link href={`/Adaptation/ViewProfile/${id}`} className="block">
                <div
                    style={{ position: 'relative', height: '10rem', width: '10rem', marginBottom: '1rem' }}
                    className="mx-auto"
                >
                    <Image
                        src={imageSrc || "https://avatar.iran.liara.run/public/48"}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-full"
                    />
                </div>
                <h4 className="text-lg text-center text-black dark:text-white font-semibold dark:bg-gray-800">{name}</h4>
                <p className="text-center text-gray-700 dark:text-gray-300">{college}</p>
                {/* Top 3 skills as tags */}
                {Array.isArray(skills) && skills.length > 0 && (
                    <div className="flex justify-center gap-2 mt-2">
                        {skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full cursor-pointer">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
                {resume ? (
                    <a
                        href={resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-gray-500 dark:text-gray-400 cursor-pointer hover:underline block"
                    >
                        View Resume
                    </a>
                ) : (
                    <span className="text-center text-gray-500 dark:text-gray-400 block">Resume not uploaded</span>
                )}
                {/* This button is now part of the link */}
                <button className="mt-2 mx-auto py-1 px-4 rounded-full border border-black dark:border-gray-500 text-black dark:text-white bg-white dark:bg-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black block">
                    View Profile
                </button>
            </Link>
        </div>
    );
};

export default MentorProfileBox;
