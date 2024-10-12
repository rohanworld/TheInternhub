"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { profileEnd } from 'console'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import toast, { Toaster } from 'react-hot-toast'

const ViewProfile = ({ params : { profileId } }: { params: { profileId: string } }) => {
    
    const [profileData, setProfileData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        setLoading(true);
        // Replace "document-id-of-your-adaptation-list" with the actual document ID
        const docRef = doc(db, "adaptation-list", profileId);

// Get the document data
getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
      //console.log("Document data: ", doc.data());
      setProfileData(doc.data());
      setLoading(false);
    } else {
      console.log("No such document!");
      toast("Please try again... ❌")
    }
  })
  .catch((error) => {
    console.error("Error getting document:",   
 error);
 toast("Please try again... ❌")
  });
    }, [profileId]);

    if(loading)return <div className='h-screen w-full flex items-center justify-center font-bold text-xl'>Loading...</div>

    return (
        <div className="font-jakarta flex flex-col md:flex-row p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
            {/* Left Section */}
            <div className="flex flex-col items-center md:items-center md:w-1/3 p-6">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-gray-300 dark:border-gray-600 bg-gray-200">
                    <Image
                        src={`${profileData.profileImageURL?profileData.profileImageURL:"https://avatar.iran.liara.run/public/48"}`}
                        alt="Candidate Image"
                        width={160}
                        height={160}
                        className="object-cover"
                    />
                </div>

                <h1 className="text-3xl font-bold mb-4 text-center">{profileData.name||""}</h1>
                <p className="text-xl italic mb-6 text-center">{profileData.wowFactor||""}</p>
                <Link href={profileData.resumeURL||""} target='_blank' passHref>
                    <button
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 block w-full"
                    >
                        View Resume
                    </button>
                </Link>
            </div>

            {/* Right Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3 p-4">
                {/* First Row */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">One-Line Bio</h2>
                    <p>{profileData.bio||""}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Education</h2>
                    <p>Academic Year: {profileData.academicYear||""}</p>
                    <p>Branch: {profileData.branch||""}</p>
                    <p>College: {profileData.college||""}</p>
                </div>

                {/* Second Row */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    <p>{profileData.skills||""}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Interests</h2>
                    <p>{profileData.interests||""}</p>
                </div>

                {/* Third Row (Larger Boxes) */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">Projects</h2>
                    <ul className="list-disc list-inside">
                        {profileData.projects||""}
                    </ul>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">Achievements</h2>
                    <ul className="list-disc list-inside">
                        {profileData.achievements||""}
                    </ul>
                </div>
            </div>
            <Toaster/>
        </div>
    );
}

export default ViewProfile;
