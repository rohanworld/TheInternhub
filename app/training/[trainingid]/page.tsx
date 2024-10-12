"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { db, auth } from '@/utils/firebase'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import parse from 'html-react-parser'
import toast, { Toaster } from 'react-hot-toast';
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { UserType } from '@/store/slice'

const ViewIntern = ({ params: { trainingid } }: { params: { trainingid: string } }) => {
    // Sample Data
    const [data, setData] = useState<any>();
    const [userData, setUserData] = useState<any>();
    const userRes = useSelector((state: RootState) => state.user);


    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                setUserData(docSnap.data());
            }
        };

        const fetchData = async () => {
            const docRef = doc(db, 'trainings', trainingid);
            const docSnap = await getDoc(docRef);
            setData(docSnap.data());
        };

        fetchData();

        setTimeout(() => {
            fetchUserData();
        }, 1000);
    }, [trainingid]);


    const ApplyTraining = async (id: string) => {
        if(userRes.userType=="organization"){
            toast(`Account Type must be "student" to register`);
            return;
          }
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, 'users', user.uid);

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    const appliedTraining = docSnap.data().appliedTraining || [];

                    if (!appliedTraining.includes(id)) {
                        await setDoc(docRef, {
                            appliedTraining: [...appliedTraining, id],
                        }, { merge: true });
                        setUserData({ ...userData, appliedTraining: [...appliedTraining, id] });
                        toast("Registered Sucessfully");
                    } else {
                        // Remove the id from appliedInternships and userData
                        const updatedTrainings = appliedTraining.filter((trainingId: string) => trainingId !== id);
                        await setDoc(docRef, {
                            appliedTraining: updatedTrainings,
                        }, { merge: true });
                        setUserData({ ...userData, appliedTraining: updatedTrainings });
                        toast("Application Cancelled ");
                    }
                } else {
                    toast("Login to register");
                    console.log("User Not found")
                }

                console.log('Training applied successfully!');
            } catch (error) {
                console.error('Error applying for internship:', error);
            }
        }
    };

    const saveTrain = async (id: string) => {
        if(userRes.userType=="organization"){
            toast(`Account Type must be "student" to save`);
            return;
          }
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
    
          try {
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              
              const savedTrainings = docSnap.data().savedTrainings || [];
              
              if (!savedTrainings.includes(id)) {
                await setDoc(docRef, {
                  savedTrainings: [...savedTrainings, id],
                }, { merge: true });
                setUserData({...userData, savedTrainings:[...savedTrainings, id]});
                toast("Saved Sucessfully");
              }else {
                // Remove the id from appliedInternships and userData
                const updatedTrainings = savedTrainings.filter( (trainingId: string) => trainingId !== id );
                await setDoc(docRef, {
                    savedTrainings: updatedTrainings,
                }, { merge: true });
                setUserData({ ...userData, savedTrainings: updatedTrainings });
                toast("Removed from saved ");
            }
            } else {
              toast("Login to save");
              console.log("User Not found")
            }
            
            console.log('Training saved successfully!');
          } catch (error) {
            console.error('Error saving training:', error);
          }
        }
      }

    console.log(data);
    return (
        <div className="flex flex-col md:flex-row p-6 min-h-screen">
            {/* Left Section */}
            <div className="flex flex-col items-center md:items-center md:w-1/3 p-6">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-gray-300 dark:border-gray-600 bg-gray-200">
                    <Image
                        src={data?.profilePic}
                        alt="Candidate Image"
                        width={160}
                        height={160}
                        className="object-cover"
                    />
                </div>

                <h2 className="text-2xl font-semibold mb-5">{data?.title}</h2>
                
                {userRes?.userType === UserType.Student ? (
                    <div className='w-1/2'>
                        {!(userData?.appliedTraining?.includes(trainingid)) ? (
                            <button className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 w-full rounded-full block mb-4 dark:border-white dark:text-white" onClick={() => ApplyTraining(trainingid)}>
                                Register
                            </button>
                        ) : (
                            <button className="border border-black text-black bg-gray-300 dark:bg-gray-900 font-semibold hover:bg-gray-300 py-2 px-6 w-full rounded-full block mb-4 dark:border-white dark:text-white" onClick={() => ApplyTraining(trainingid)}>
                                Registered
                            </button>
                        )}
                    </div>
                ) : null}

                {userRes?.userType === UserType.Student ? (
                    <div className='w-1/2'>
                        {!(userData?.savedTrainings?.includes(trainingid)) ? (
                            <button className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white" onClick={() => saveTrain(trainingid)}>
                                Save
                            </button>
                        ) : (
                            <button className="border border-black text-black bg-gray-300 dark:bg-gray-900 font-semibold hover:bg-gray-300 py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white" onClick={() => saveTrain(trainingid)}>
                                Saved
                            </button>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Right Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3 p-4">
                {/* First Row */}
                <div className="bg-white md:col-span-2 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p>{data && parse(data?.description)}</p>
                </div>

                {/* Second Row */}
                {data?.category.length > 0 && <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Training About</h2>
                    <p className='text-base'>{data?.category.join(", ")}</p>
                </div>}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Duration</h2>
                    <p className='text-base'>{data?.duration}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Location</h2>
                    <p className='text-base'>{data?.location}</p>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default ViewIntern;
