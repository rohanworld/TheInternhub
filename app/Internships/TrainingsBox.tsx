import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { auth } from '@/utils/firebase';
import { db } from '@/utils/firebase';
import { doc, setDoc, getDoc, deleteField, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserType } from '@/store/slice';

type TrainingsProps = {
  id: string;
  imageUrl: string;
  TrainingsName: string;
  category: string[];
  location: string;
  duration: string;
  description: string;
};

const TrainingsBox: React.FC<TrainingsProps> = ({
  id,
  imageUrl,
  TrainingsName,
  category,
  duration,
  location,
  description,
}) => {
  const [userData, setUserData] = useState<any>({});
  const userCheck = auth.currentUser;
  const userRes = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });
    }
  }, []);

  const ApplyTraining = async (id: string) => {
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
                const appliedTrainings = docSnap.data().appliedTraining || [];
                const appliedTrainingIds = docSnap.data().appliedTrainingIds || [];

                const trainingIndex = appliedTrainings.findIndex((training: any) => training.id === id);

                if (trainingIndex === -1) {
                    const newTraining = { id, hired: false };

                    await setDoc(docRef, {
                        appliedTraining: [...appliedTrainings, newTraining],
                        appliedTrainingIds: [...appliedTrainingIds, id],
                    }, { merge: true });

                    setUserData({
                        ...userData,
                        appliedTraining: [...appliedTrainings, newTraining],
                        appliedTrainingIds: [...appliedTrainingIds, id],
                    });

                    toast("Registered Successfully ✅");
                } else {
                    const updatedTrainings = appliedTrainings.filter((training: any) => training.id !== id);
                    const updatedTrainingIds = appliedTrainingIds.filter((trainingId: string) => trainingId !== id);

                    await updateDoc(docRef, {
                        appliedTraining: updatedTrainings.length > 0 ? updatedTrainings : deleteField(),
                        appliedTrainingIds: updatedTrainingIds.length > 0 ? updatedTrainingIds : deleteField(),
                    });

                    setUserData({
                        ...userData,
                        appliedTraining: updatedTrainings,
                        appliedTrainingIds: updatedTrainingIds,
                    });

                    toast("Application Cancelled");
                }
            } else {
                toast("Login to apply");
                console.log("User not found");
            }
        } catch (error) {
            console.error('Error applying for training:', error);
        }
    }
};

  
  

  const saveTrain = async (id: string) => {
    if (userRes.userType === "organization") {
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
            setUserData({ ...userData, savedTrainings: [...savedTrainings, id] });
            toast("Training Saved on Dashboard ✅");
          } else {
            // Remove the id from appliedInternships and userData
            const updatedTrainings = savedTrainings.filter((trainingId: string) => trainingId !== id);
            await setDoc(docRef, {
              savedTrainings: updatedTrainings,
            }, { merge: true });
            setUserData({ ...userData, savedTrainings: updatedTrainings });
            toast("Removed from saved ");
          }
        } else {
          toast("Login to save");
          console.log("User Not found");
        }
        
        console.log('Training saved successfully!');
      } catch (error) {
        console.error('Error saving training:', error);
      }
    }
  };

  const isRegistered = userData.appliedTraining?.some((training: any) => training.id === id);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 w-full">
      <Link href={`training/${id}`} className="flex flex-col md:flex-row items-center w-full md:w-[80%] h-full">
        <div className="w-full md:w-[20%] mb-4 md:mb-0">
          <Image
            src={imageUrl}
            alt={TrainingsName}
            className="w-full h-full max-md:h-40 object-cover rounded-lg"
            height={5000}
            width={5000}
            quality={100}
          />
        </div>
        <div className="flex flex-col w-full md:w-[80%] md:ml-5 h-full">
          <h3 className="text-lg font-semibold text-black dark:bg-gray-800 dark:text-white">{TrainingsName}</h3>
          <div className="mt-2">
            <p
              className="text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: description
                  .replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, '')
                  .slice(0, 100) + '...',
              }}
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400"><b>Duration:</b> {duration}</p>
          <p className="text-gray-600 dark:text-gray-400"><b>Location:</b> {location}</p>

          <div className="flex flex-wrap mt-2">
            {category.map((cat: string, ind: number) => (
              <span
                key={ind}
                className="text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mr-2 mt-2"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex flex-col max-md:space-y-2 space-y-5 w-full mt-4 md:mt-0 md:w-[20%]">
        {userCheck ? (
          <div className='w-full'>
            {!isRegistered ? (
              <button
                className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg"
                onClick={() => ApplyTraining(id)}
              >
                Register
              </button>
            ) : (
              <button
                className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-black text-lg"
                onClick={() => ApplyTraining(id)}
              >
                Registered
              </button>
            )}
          </div>
        ) : (
          <Link href="/auth/signin">
            <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg">
              Register
            </button>
          </Link>
        )}
        {userCheck ? (
          <div className='w-full'>
            {!(userData.savedTrainings?.includes(id)) ? (
              <button
                className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg"
                onClick={() => saveTrain(id)}
              >
                Save
              </button>
            ) : (
              <button
                className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-black text-lg"
                onClick={() => saveTrain(id)}
              >
                Saved
              </button>
            )}
          </div>
        ) : (
          <Link href="/auth/signin">
            <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg">
              Save
            </button>
          </Link>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default TrainingsBox;
