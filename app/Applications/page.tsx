"use client"
// Dark Mode
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { db, auth } from '@/utils/firebase';
import { getDoc, doc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import InternshipBox from '../Internships/InternshipBox';
import TrainingsBox from '../Internships/TrainingsBox';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import Image from 'next/image';
import { selectUser, UserType } from '@/store/slice';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { findIndex } from 'lodash';


interface Internship {
  title: string;
  category: string[];
}

interface Training {
  title: string;
  category: string[];
}


const Page = () => {
  const [userData, setUserData] = useState<any>();
  const [appliedInternships, setAppliedInternships] = useState<any>();
  const [appliedTraining, setAppliedTraining] = useState<any>();
  const [connectedMentors, setConnectedMentors] = useState<any>();
  const [applicantsonIntern, setApplicantsonIntern] = useState<any>();
  const [applicantsonTrain, setApplicantsonTrain] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);

 
  

  const user = useSelector(selectUser);


  useEffect(() => {
    setLoading(true);
    const getUser = async () => {

      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });

        setLoading(false);
      }
    }

    setTimeout(() => {
      getUser();
    }, 500);

  }, []);
  

  useEffect(() => {
    const fetchInternshipsAndTraining = async () => {
      if (userData?.appliedInternshipIds) {
        const internships = await Promise.all(
          userData.appliedInternshipIds.map(async (internshipId: string) => {
            const docRef = doc(db, 'internships', internshipId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
          })
        );
        setAppliedInternships(internships.filter(Boolean));
      }

      if (userData?.appliedTrainingIds) {
        const training = await Promise.all(
          userData.appliedTrainingIds.map(async (trainingId: string) => {
            const docRef = doc(db, 'trainings', trainingId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
          })
        );
        setAppliedTraining(training.filter(Boolean));
      }
    };

    const fetchMentorshipData = async () => {
      if (userData?.connectedMentors) {
        const connectedMentors = await Promise.all(
          userData.connectedMentors.map(async (mentorshipId: string) => {
            const docRef = doc(db, 'mentors', mentorshipId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
          })
        );
        setConnectedMentors(connectedMentors.filter(Boolean));
      }
    }

    if (userData?.userType === 'student') {
      fetchInternshipsAndTraining();
      fetchMentorshipData();
    }
  }, [userData]);

 

  useEffect(() => {
    // fetch the data of the user who has applied on the internship organized by current organizer

    if (userData?.userType === UserType.Organization) {
      const fetchApplicants = async () => {
        try {
          const user = auth?.currentUser;

          if (!user) {
            console.log('User not authenticated');
            return;
          }

          const internshipsRef = collection(db, 'internships');
          const q = query(internshipsRef, where('uid', '==', user.uid));

          const querySnapshot = await getDocs(q);

          const Internships = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Internship
          }));

          setAppliedInternships(Internships);

          const trainingsRef = collection(db, 'trainings');
          const qtt = query(trainingsRef, where('uid', '==',  user.uid));

          const querySnapshot1 = await getDocs(qtt);

          const Trainings = querySnapshot1.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Training
          }));

          setAppliedTraining(Trainings);

          // Fetch applicants for each internship
          const applicantsOnIntern = await Promise.all(
            Internships.map(async (internship) => {
              const applicantsQuery = query(
                collection(db, 'users'),
                where('appliedInternshipIds', 'array-contains', internship.id)
              );
              const applicantsSnapshot = await getDocs(applicantsQuery);

              return {
                internshipId: internship.id,
                internshipName: internship.title,
                internshipCategory: internship.category.join(', '),
                applicants: applicantsSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
              };
            })
          );
          setApplicantsonIntern(applicantsOnIntern);

          // Fetch applicants for each training
          const applicantsOnTrain = await Promise.all(
            Trainings.map(async (training) => {
              const applicantsQuery = query(
                collection(db, 'users'),
                where('appliedTrainingIds', 'array-contains', training.id)
              );
              const applicantsSnapshot = await getDocs(applicantsQuery);
              return {
                trainingId: training.id,
                trainingName: training.title,
                trainingCategory: training.category.join(', '),
                applicants: applicantsSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
              };
            })
          );
          setApplicantsonTrain(applicantsOnTrain);
          setLoading(false);


        } catch (error) {
          console.error('Error fetching applicants:', error);
        }
      };

      setLoading(true);
      setTimeout(() => {
        fetchApplicants();
      }, 1000);

    }

  }, [userData,applicants]);
  
    const hireForInternship = async (studentId: string, internshipId: string) => {
      try {
        const docRef = doc(db, 'users', studentId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const appliedInternships = docSnap.data().appliedInternships || [];
  
          
          const internshipIndex = appliedInternships.findIndex(
            (internship: any) => internship.id === internshipId
          );
  
          if (internshipIndex !== -1) {
            const currentStatus = appliedInternships[internshipIndex].hired;
            appliedInternships[internshipIndex].hired = !currentStatus;
            await updateDoc(docRef, {
              appliedInternships: appliedInternships,
            });
            
            const message = currentStatus ? 'Student un-hired successfully!' : 'Student hired successfully!';
            toast(message);
            const updatedApplicants = applicants.map((applicant) =>
              applicant.id === studentId
                ? {
                    ...applicant,
                    appliedInternships: appliedInternships.map((internship: any) =>
                      internship.id === internshipId
                        ? { ...internship, hired: !currentStatus }
                        : internship
                    ),
                  }
                : applicant
            );
            setApplicants([...updatedApplicants]); // Spread operator forces state update
            
           
          } else {
            toast('Internship not found for the student');
          }
        } else {
          toast('Student not found');
        }
      } catch (error) {
        console.error('Error hiring student:', error);
        toast('Error hiring student');
      }
    };
    const getInternshipIndex = ( internshipId: string) => {
      return applicantsonIntern.findIndex((internship: any) => internship.id === internshipId);
    };




  const hireForTraining = async (studentId: string, trainingId: string) => {
    try {
      const docRef = doc(db, 'users', studentId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const appliedTrainings = docSnap.data().appliedTraining || [];
  
        // Find the training in the student's appliedTrainings array
        const trainingIndex = appliedTrainings.findIndex(
          (training: any) => training.id === trainingId
        );
  
        if (trainingIndex !== -1) {
          // Toggle the hired status
          const currentStatus = appliedTrainings[trainingIndex].hired;
          appliedTrainings[trainingIndex].hired = !currentStatus;
  
          await updateDoc(docRef, {
            appliedTraining: appliedTrainings,
          });
          const updatedApplicants = applicants.map((applicant) =>
            applicant.id === studentId
              ? {
                  ...applicant,
                  appliedInternships: appliedInternships.map((training: any) =>
                    training.id === trainingId
                      ? { ...training, hired: !currentStatus }
                      : training
                  ),
                }
              : applicant
          );
          setApplicants([...updatedApplicants]); // Spread operator forces state update
         
          const message = currentStatus ? 'Student un-hired successfully!' : 'Student hired successfully!';
          toast(message);
        } else {
          toast('Training not found for the student');
        }
      } else {
        toast('Student not found');
      }
    } catch (error) {
      console.error('Error hiring student for training:', error);
      toast('Error hiring student for training');
    }
  };
  





  // console.log(userData);
  console.log(appliedInternships);
  console.log(appliedTraining);
  
  return (
    <>
      <div className="pt-2 min-h-screen flex items-center justify-center">
        <div className="px-6 md:px-14 w-full min-h-screen mt-10 mx-5 md:mx-20 mb-10 rounded-lg text-black flex flex-col">
          <div className='pb-5'>
            <h2 className="text-[44px] font-semibold mb-2">{user.userType === UserType.Student ? "Applications" : "Applicants"}</h2>
            <p className="text-black dark:text-gray-300 text-base lg:mr-96 lg:pr-24">
            {user.userType === UserType.Student ? "View the status of your Applications and requests to mentors." : "View the Students who have applied for your posted internships."}
            </p>
          </div>

          <div className="flex justify-start mb-2">
            <label className="input input-md flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full py-1 px-2 max-w-md w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="#000"
                className="h-4 w-4 opacity-70 dark:text-white ml-2"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="placeholder-gray-500 dark:placeholder-white font-semibold w-full text-black dark:text-white border-black dark:border-gray-600 py-1 px-2 rounded-full"
                placeholder="Search Here"
              />
            </label>
          </div>

          <div className="mt-3">
            <Suspense>
              <div role="tablist" className="tabs tabs-bordered">
                <input type="radio" name="my_tabs_1" role="tab" className="tab text-black dark:text-white text-lg" aria-label="Applications" defaultChecked />
                <div role="tabpanel" className="tab-content">
                  {userData?.userType === 'student' ?
                    <>
                      <div className='mt-6 m-4'>
                        {appliedInternships?.length > 0 && <h2 className="text-[30px] font-normal mb-4">Applied Internships</h2>}
                        {loading && <Loader />}
                        <div className='mt-3 overflow-y-auto'>
                          {appliedInternships?.length > 0 && appliedInternships.map((internship: any) => {
                             const internshipIndex = getInternshipIndex(internship.id);
                            return (
                              <div key={internship.id} className="rounded-lg overflow-hidden">
                                <div className="dark:shadow-lg"> {/* Optional: Add a background color */}
                                  <InternshipBox
                                    id={internship.id}
                                    category={internship.category}
                                    internshipName={internship.title}
                                    imageUrl={internship.profilePic}
                                    stipend={internship.stipend}
                                    duration={internship.duration}
                                    location={internship.location}
                                    description={internship.description}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {appliedTraining?.length > 0 && <h2 className="text-[30px] font-normal my-4">Applied Trainings</h2>}
                        {loading && <Loader />}
                        <div className='mt-3 overflow-y-auto'>
                          {appliedTraining?.length > 0 && appliedTraining.map((training: any) => {
                            return (
                              <TrainingsBox
                                key={training.id}
                                id={training.id}
                                category={training.category}
                                TrainingsName={training.title}
                                imageUrl={training.profilePic}
                                // stipend={training.stipend}
                                duration={training.duration}
                                // typeOfInternship={training.typeOfInternship}
                                location={training.location}
                                description={training.description}
                              // nosOfApplicants={training.nosOfApplicants}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </>
                    :
                    userData?.userType === UserType.Organization ?
                      <>
                        <div className='mt-6'>
                          {loading && <Loader />}
                          <div className='mt-5 overflow-y-auto'>
                          <h2 className="text-[30px] font-normal mb-4">Applicants for Internships</h2>
                          {applicantsonIntern?.map((internshipGroup: any) => (
                           
                            <div key={internshipGroup.internshipId} className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
                              
                              <div className="px-3 flex w-full justify-between items-center">
                                <Link href={`/Internships/${internshipGroup.internshipId}`}><h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">📋 {internshipGroup.internshipName}</h2></Link>
                                <p className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 font-medium">Category: {internshipGroup.internshipCategory}</p>
                              </div>
                              
                              <div className="px-3">
                                {internshipGroup.applicants.length > 0 ? (
                                  internshipGroup.applicants.map((applicant: any) => (
                                   
                                    <div key={applicant.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 dark:border-gray-700 py-4">
                                      
                                      <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
                                        <Image src={applicant.photoURL || '/anonymous2.png'} alt="Applicant image" height={50} width={50} className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                                        <div className="ml-4">
                                          <h3 className="text-sm text-gray-700 dark:text-gray-200">👤 {applicant.name}</h3>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">✉️ {applicant.email}</div>
                                        </div>
                                      </div>
                                      <div className='flex gap-x-2'>
                                        <button onClick={()=>hireForInternship(applicant.id, internshipGroup.internshipId)} className="cursor-pointer px-4 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 dark:text-gray-200 text-gray-700">
                                          
                                        {applicant.appliedInternships.findIndex((internship: any) => internship.id === internshipGroup.internshipId) !== -1 && applicant.appliedInternships[applicant.appliedInternships.findIndex((internship: any) => internship.id === internshipGroup.internshipId)]?.hired ? 'Hired' : 'Hire'}
                                      
                                        </button>
                                        <Link href={`/profile/${applicant.id}`} className="px-4 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 dark:text-gray-200 text-gray-700">
                                          View Profile
                                        </Link>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm mt-2 text-gray-500 dark:text-gray-400">No applicants found for this internship.</div>
                                )}
                              </div>
                            </div>
                          ))}
                          <h2 className="text-[30px] font-normal mb-4">Applicants for Trainings</h2>
                          {applicantsonTrain?.map((trainingGroup: any) => (
                            <div key={trainingGroup.trainingId} className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
                              
                              <div className="px-3 flex w-full justify-between items-center">
                                <Link href={`/training/${trainingGroup.trainingId}`}><h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">🎓 {trainingGroup.trainingName}</h2></Link>
                                <p className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 font-medium">Category: {trainingGroup.trainingCategory}</p>
                              </div>
                              
                              <div className="px-4">
                                {trainingGroup.applicants.length > 0 ? (
                                  trainingGroup.applicants.map((applicant: any) => (
                                   
                                    <div key={applicant.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 dark:border-gray-700 py-4">
                                      <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
                                        <Image src={applicant.photoURL || '/anonymous2.png'} alt="Applicant image" className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600" width={48} height={48} />
                                        <div className="ml-4">
                                          <h3 className="text-sm text-gray-700 dark:text-gray-200">👤 {applicant.name}</h3>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">✉️ {applicant.email}</div>
                                        </div>
                                      </div>
                                      <div className='flex gap-x-2'>
                                        <button onClick={()=>hireForTraining(applicant.id, trainingGroup.trainingId)} className="cursor-pointer px-4 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 dark:text-gray-200 text-gray-700">
                                        {applicant.appliedTraining.findIndex((training: any) => training.id === trainingGroup.trainingId) !== -1 &&applicant.appliedTraining[applicant.appliedTraining.findIndex((training: any) => training.id === trainingGroup.trainingId)]?.hired? 'Hired': 'Hire'}
                                        </button>
                                        <Link href={`/profile/${applicant.id}`} className="px-4 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 dark:text-gray-200 text-gray-700">
                                          View Profile
                                        </Link>
                                        </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm mt-2 text-gray-500 dark:text-gray-400">No applicants found for this training.</div>
                                )}
                              </div>
                            </div>
                          ))}
                          </div>
                        </div>
                      </>
                      :
                      <>
                        {loading && <Loader />}
                      </>
                  }
                </div>



                {userData?.userType === "student" &&
                  <>
                    <input type="radio" name="my_tabs_1" role="tab" className="tab text-black dark:text-white text-lg" aria-label="Mentorship Request" />
                    <div role="tabpanel" className="tab-content">
                      <div className="mt-6 m-4">
                        {connectedMentors?.length > 0 && <h2 className="text-[30px] font-normal mb-4">Connected Mentors</h2>}
                        {connectedMentors?.length === 0 && <div className='text-black dark:text-white text-lg font-medium'>No Connected Mentors</div>}
                        <div className='mt-3 overflow-y-auto'>
                          {connectedMentors?.length > 0 && connectedMentors.map((mentor: any) => {
                            return (
                              <div key={mentor.id} className='mt-4 flex gap-4 h-16 justify-between'>
                                <div className='flex '>
                                  <div>
                                    <Image src={mentor.profilePic || '/anonymous2.png'} alt="mentor" className='h-16 w-16 rounded-full' width="200" height="200" />
                                  </div>
                                  <div className='flex h-full justify-center flex-col ml-5'>
                                    <div className='font-semibold'>{mentor.name}</div>
                                    <p className='text-sm opacity-80'>{mentor.expertise}</p>
                                  </div>
                                </div>
                                <div className='flex justify-center items-center h-full mr-10'>
                                  <Link href={`/Mentors/${mentor.id}`} className='py-1 px-4 rounded-full border border-black'>
                                    View Profile
                                  </Link>
                                </div>
                              </div>
                            )
                          })
                          }
                        </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            </Suspense>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default Page;

