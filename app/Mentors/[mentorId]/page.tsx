"use client";
import React, { useEffect, useState } from 'react';
import { db, auth } from '@/utils/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import parse from 'html-react-parser';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface MentorProfileProps {
    params: { mentorId: string }; 
}

const MentorProfilePage = ({ params: { mentorId } }: MentorProfileProps) => {
  const [userData, setUserData] = useState<any>();
  const [isAno, setisAno] = useState<any>(true);
  const [mentorData, setMentorData] = useState<any>(null);
  const userRes = useSelector((state: RootState) => state.user);

  useEffect(() =>{
    const loadMentorData = async () => {
        if (mentorId) { // Ensure mentorId is not undefined or null
            const mentorRef = doc(db, 'mentors', mentorId);
            const mentorSnap = await getDoc(mentorRef);
            setMentorData(mentorSnap.data());
        }
    };
    loadMentorData();
  }, [mentorId]);

  useEffect(() => {
    const fetchUserData = async () => {
        const user = auth?.currentUser;
        setisAno(user?.isAnonymous);
        if (user) {
            const docRef = doc(db, 'users', user?.uid);
            const docSnap = await getDoc(docRef);
            setUserData(docSnap.data());
        }
    };

    setTimeout(() => {
        if(auth?.currentUser)fetchUserData();
    }, 1000);
  }, []);


  const handleConnect = async (mentorId: string) => {
    if(userRes.userType=="organization"){
      toast(`Account Type must be "student" to connect`);
      return;
    }
    const user = auth.currentUser;
    if (user) {
        const docRef = doc(db, 'users', user.uid);

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const connectedMentors = docSnap.data().connectedMentors || [];

                if (!connectedMentors.includes(mentorId)) {
                    await setDoc(docRef, {
                        connectedMentors: [...connectedMentors, mentorId],
                    }, { merge: true });
                    setUserData({ ...userData, connectedMentors: [...connectedMentors, mentorId] });
                    toast("Connected Sucessfully ✅");
                }else{
                    const updatedMentors = connectedMentors.filter((ment: string) => ment !== mentorId);
                    await setDoc(docRef, {
                        connectedMentors: updatedMentors,
                    }, { merge: true });

                    console.log(updatedMentors);
                    setUserData({ ...userData, connectedMentors: updatedMentors });
                    toast("Disconnected Sucessfully ✅");
                }
            }
        } catch (error) {
            console.error('Error connecting mentor:', error);
        }
    }
  }


  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center md:w-1/3 p-6">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-gray-300 dark:border-gray-600 bg-gray-200">
          <Image
            src={mentorData?.photoURL || '/anonymous2.png'} 
            alt="Mentor Image"
            width={160}
            height={160}
            className="object-cover"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-5">{mentorData?.name}</h1>

        {isAno ?
          <Link href="/auth/signin" className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full text-center block w-1/2 mb-4 dark:text-white dark:border-white">
              Connect
          </Link>
         :
         (userData?.connectedMentors?.includes(mentorId)) ?
            <button className="border border-black text-black font-semibold bg-gray-400 py-2 px-6 rounded-full block w-1/2 mb-4" onClick={() => handleConnect(mentorId)}>
              Connected
            </button>
            :
            <button className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full block w-1/2 mb-4 dark:text-white dark:border-white" onClick={() => handleConnect(mentorId)}>
              Connect
            </button>
        }

      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3 p-4">
        {/* First Row */}
        <div className="bg-white md:col-span-2 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl  font-semibold mb-2">About</h2>
          <p className='dark:text-gray-200'>{mentorData && parse(mentorData?.description)}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Organization</h2>
          <p className="dark:text-gray-200">{mentorData?.organisation}</p>
        </div>

        {/* Second Row */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Expertise</h2>
          <p className='dark:text-gray-200'>
            {mentorData?.expertise.join(', ')}
          </p>
        </div>
        <div className="bg-white  dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <p className='dark:text-gray-200'>{mentorData?.experience} years</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Fees</h2>
          <p className='dark:text-gray-200'>${mentorData?.fees}</p>
        </div>

        {/* Links Section */}
        <div className="bg-white dark:bg-gray-700 md:col-span-2 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Links</h2>
          <p className='dark:text-gray-200'><a href={mentorData?.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
          <p className='dark:text-gray-200'><a href={mentorData?.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>
          <p className='dark:text-gray-200'><a href={mentorData?.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MentorProfilePage;
