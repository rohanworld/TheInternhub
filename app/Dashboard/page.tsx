// Dark Mode
"use client"

import { Bell, Calendar, Users2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { db, auth } from '@/utils/firebase';
import { getDoc, doc } from 'firebase/firestore';
import InternshipBox from '../Internships/InternshipBox';
import TrainingsBox from '../Internships/TrainingsBox';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
  const [userData, setUserData] = useState<any>();
  const [savedInternships, setsavedInternships] = useState<any>();
  const [savedTrainings, setsavedTrainings] = useState<any>();

  useEffect(() => {
    const getUser = async () => {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            }
          });
        }
    }

    setTimeout(() => {
      getUser();
    }, 500);

  }, []);

  useEffect(() => {
    const fetchInternshipsAndTraining = async () => {
      if (userData?.savedInternships) {
        const internships = await Promise.all(
          userData.savedInternships?.map(async (internshipId: string) => {
            const docRef = doc(db, 'internships', internshipId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
          })
        );
        setsavedInternships(internships.filter(Boolean));
      }

      if(userData?.savedTrainings){
        const training = await Promise.all(
          userData.savedTrainings.map(async (trainingId: string) => {
            const docRef = doc(db, 'trainings', trainingId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
          })
        );
        setsavedTrainings(training.filter(Boolean));
      }
    };
  
    fetchInternshipsAndTraining();
  }, [userData]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="px-6 md:px-14 w-full min-h-screen mt-10 mx-5 md:mx-20 mb-10 rounded-lg text-black flex flex-col">
        <div className='pb-5'>
          <h2 className="text-[44px] font-semibold mb-2">Your Dashboard</h2>
          <p className="text-black dark:text-gray-300 text-base lg:mr-96 lg:pr-24">
            Oversee your mentorship activities, manage mentees.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/notifications" className='flex items-center py-2 mx-2 px-3 font-semibold rounded-full border transition-colors duration-300 hover:bg-black hover:text-white dark:border-gray-700 dark:hover:bg-white dark:hover:text-black bg-white text-black dark:bg-gray-800 dark:text-white'>
            <Bell /> Notifications
          </Link>
          <Link href="/MentorMatch" className='flex items-center py-1 mx-1 px-3 font-semibold rounded-full border transition-colors duration-300 hover:bg-black hover:text-white dark:border-gray-700 dark:hover:bg-white dark:hover:text-black bg-white text-black dark:bg-gray-800 dark:text-white'>
            <Calendar /> Upcoming Sessions
          </Link>
          <Link href="/Mentors" className='flex items-center py-1 mx-1 px-3 font-semibold rounded-full border transition-colors duration-300 hover:bg-black hover:text-white dark:border-gray-700 dark:hover:bg-white dark:hover:text-black bg-white text-black dark:bg-gray-800 dark:text-white'>
            <Users2 /> Mentees
          </Link>
        </div>
        <div className="my-5">
          <h2 className="text-[30px] font-normal">Recommended Actions</h2>
          <div className="pt-5">
            <div className="px-4 py-6 mb-5 flex flex-col md:flex-row justify-between border-2 rounded-2xl border-[#9F9F9F] dark:border-gray-700 w-full">
              <div className="flex flex-col mb-4 md:mb-0">
                <p className='font-semibold dark:text-white'>Complete your profile</p>
                <p className='text-[#637587] dark:text-gray-300'>Add a bio, profile photo and more</p>
              </div>
              <div className="flex items-center">
                <Link href="/settings" className='w-full md:w-52 flex justify-center py-1 rounded-lg border border-black dark:border-gray-700 text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'>Go to Profile</Link>
              </div>
            </div>
            <div className="px-4 py-6 flex flex-col md:flex-row justify-between border-2 rounded-2xl border-[#9F9F9F] dark:border-gray-700 w-full">
              <div className="flex flex-col mb-4 md:mb-0">
                <p className='font-semibold dark:text-white'>Set your availability</p>
                <p className='text-[#637587] dark:text-gray-300'>Help mentees know when you&apos;re available</p>
              </div>
              <div className="flex items-center">
                <div onClick={() => toast("Feature Coming Soon")} className='w-full cursor-pointer md:w-52 flex justify-center py-1 rounded-lg border border-black dark:border-gray-700 text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'>Set Availability</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-10">
          {savedInternships?.length > 0 && <h2 className="text-[30px] font-normal mb-4">Saved Internships</h2>}
          <div className='overflow-y-auto'>
            {savedInternships?.length > 0 && savedInternships.map((internship: any) => {
              return (
                <InternshipBox
                  key={internship.id}
                  id={internship.id}
                  category={internship.category}
                  internshipName={internship.title}
                  imageUrl={internship.profilePic}
                  stipend={internship.stipend}
                  duration={internship.duration}
                  location={internship.location}
                  description={internship.description}
                />
              )})}
          </div>
          {savedTrainings?.length > 0 && <h1 className="text-[30px] font-normal my-4">Saved Trainings</h1>}
          <div className='overflow-y-auto'>
            {savedTrainings?.length > 0 && savedTrainings.map((training: any) => {
              return (
                <TrainingsBox
                  key={training.id}
                  id={training.id}
                  category={training.category}
                  TrainingsName={training.title}
                  imageUrl={training.profilePic}
                  duration={training.duration}
                  location={training.location}
                  description={training.description}
                />
              )
            })}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Page
