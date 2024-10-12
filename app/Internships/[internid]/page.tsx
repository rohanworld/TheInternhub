"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { auth, db } from '@/utils/firebase'
import { getDoc, doc, setDoc, deleteField, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import parse from 'html-react-parser'
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { selectUser, UserType } from '@/store/slice'

const ViewTraining = ({ params: { internid } }: { params: { internid: string } }) => {
    const [data, setData] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const userRes = useSelector(selectUser);

    // Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            if (userRes.uid) {
                const docRef = doc(db, 'users', userRes.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };

        const fetchData = async () => {
            const docRef = doc(db, 'internships', internid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
            }
        };

        fetchData();
        fetchUserData();
    }, [internid, userRes.uid]);

    // Apply for Internship
    const ApplyIntern = async (id: string) => {
        if (userRes.userType === UserType.Organization) {
          toast(`Account Type must be "Student" to apply`);
          return;
        }
      
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
      
          try {
            const docSnap = await getDoc(docRef);
      
            if (docSnap.exists()) {
              const appliedInternships = docSnap.data().appliedInternships || [];
              const appliedInternshipIds = docSnap.data().appliedInternshipIds || [];
      
              const internshipIndex = appliedInternships.findIndex((internship: any) => internship.id === id);
      
              if (internshipIndex === -1) {
                const newInternship = { id, hired: false };
      
                await setDoc(docRef, {
                  appliedInternships: [...appliedInternships, newInternship],
                  appliedInternshipIds: [...appliedInternshipIds, id],
                }, { merge: true });
      
                setUserData({ 
                  ...userData, 
                  appliedInternships: [...appliedInternships, newInternship],
                  appliedInternshipIds: [...appliedInternshipIds, id],
                });
      
                toast("Applied Successfully ✅");
              } else {
                const updatedInternships = appliedInternships.filter((internship: any) => internship.id !== id);
                const updatedInternshipIds = appliedInternshipIds.filter((internshipId: string) => internshipId !== id);
      
                await updateDoc(docRef, {
                  appliedInternships: updatedInternships.length > 0 ? updatedInternships : deleteField(),
                  appliedInternshipIds: updatedInternshipIds.length > 0 ? updatedInternshipIds : deleteField(),
                });
      
                setUserData({ 
                  ...userData, 
                  appliedInternships: updatedInternships,
                  appliedInternshipIds: updatedInternshipIds,
                });
      
                toast("Application Cancelled");
              }
            } else {
              toast("Login to apply");
              console.log("User not found");
            }
          } catch (error) {
            console.error('Error applying for internship:', error);
          }
        }
      };

    // Save Internship
    const saveIntern = async (id: string) => {
        if (userRes.userType === UserType.Organization) {
            toast(`Account Type must be "student" to save`);
            return;
        }
        if (userRes.uid) {
            const docRef = doc(db, 'users', userRes.uid);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const savedInternships = docSnap.data().savedInternships || [];
                    if (!savedInternships.includes(id)) {
                        await setDoc(docRef, {
                            savedInternships: [...savedInternships, id],
                        }, { merge: true });
                        setUserData({ ...userData, savedInternships: [...savedInternships, id] });
                        toast("Internship Saved to Dashboard ✅");
                    } else {
                        const updatedInternships = savedInternships.filter((internshipId: string) => internshipId !== id);
                        await setDoc(docRef, { savedInternships: updatedInternships }, { merge: true });
                        setUserData({ ...userData, savedInternships: updatedInternships });
                        toast("Internship Removed ");
                    }
                }
            } catch (error) {
                console.error('Error saving internship:', error);
            }
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="font-jakarta flex flex-col p-6 md:flex-row min-h-screen">
            {/* Left Section */}
            <div className="flex flex-col items-center md:items-center md:w-1/3 p-6">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-gray-300 dark:border-gray-600 bg-gray-200">
                    {data?.profilePic && (
                        <Image
                            src={data?.profilePic}
                            alt="Candidate Image"
                            width={160}
                            height={160}
                            className="object-cover"
                        />
                    )}
                </div>
                <h2 className="text-2xl font-semibold mb-5">{data?.title}</h2>
                {userRes.userType === UserType.Student && userData && (
                    <div className="w-1/2">
                        {userRes ? (
                            <>
                                {/* Apply Button */}
                                {!(userData?.appliedInternships?.includes(internid)) ? (
                                    <button
                                        className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white"
                                        onClick={() => ApplyIntern(internid)}
                                    >
                                        Apply
                                    </button>
                                ) : (
                                    <button
                                        className="border border-black text-black bg-gray-300 font-semibold hover:bg-gray-300 py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white"
                                        onClick={() => ApplyIntern(internid)}
                                    >
                                        Applied
                                    </button>
                                )}

                                {/* Save Button */}
                                {!(userData?.savedInternships?.includes(internid)) ? (
                                    <button
                                        className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white"
                                        onClick={() => saveIntern(internid)}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className="border border-black text-black bg-gray-300 font-semibold hover:bg-gray-300 py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white"
                                        onClick={() => saveIntern(internid)}
                                    >
                                        Saved
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin" className="w-1/2">
                                    <button className="border border-black text-black font-semibold hover:bg-black hover:text-white py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white">
                                        Apply
                                    </button>
                                </Link>
                                <Link href="/auth/signin">
                                    <button className="border border-black text-black bg-white-300 font-semibold dark:hover:bg-black py-2 px-6 rounded-full block w-full mb-4 dark:border-white dark:text-white">
                                        Save
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3 p-4">
                {/* First Row */}
                <div className="bg-white md:col-span-2 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p>{data && parse(data?.description)}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Stipend</h2>
                    <p className='text-base'>{data?.stipend}</p>
                </div>

                {/* Second Row */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                    <p className='text-base'>{data?.category.join(", ")}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Mode of work</h2>
                    <p className='text-base'>{data?.mode}</p>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ViewTraining;
