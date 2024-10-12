import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { auth } from '@/utils/firebase';
import { db } from '@/utils/firebase';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserType } from '@/store/slice';


type InternshipProps = {
  id: string;
  imageUrl: string;
  category: string[];
  internshipName: string;
  location: string;
  stipend: string;
  duration: string;
  description: string;
};

const InternshipBox: React.FC<InternshipProps> = ({
  id,
  imageUrl,
  internshipName,
  category,
  stipend,
  location,
  duration,
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
  
  
  
  
  const saveIntern = async (id: string) => {
    if (userRes.userType === UserType.Organization) {
      toast(`Account Type must be "student" to save`);
      return; // Return early if the user is not a student
    }
    
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
  
      try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const savedInternships = docSnap.data().savedInternships || [];
          
          if (!savedInternships.includes(id)) {
            // Optimistically update the UI
            const newSavedInternships = [...savedInternships, id];
            setUserData({ ...userData, savedInternships: newSavedInternships });
            
            // Now, save to Firestore
            await setDoc(docRef, { savedInternships: newSavedInternships }, { merge: true });
            toast("Internship Saved to Dashboard ✅");
          } else {
            // Remove the id from savedInternships and userData
            const updatedInternships = savedInternships.filter((internshipId: string) => internshipId !== id);
            setUserData({ ...userData, savedInternships: updatedInternships });
  
            // Now, save to Firestore
            await setDoc(docRef, { savedInternships: updatedInternships }, { merge: true });
            toast("Internship Removed");
          }
        } else {
          toast("Login to save");
          console.log("User Not found");
        }
  
        console.log('Internship saved successfully!');
      } catch (error) {
        console.error('Error saving internship:', error);
        toast("Error saving internship, please try again.");
      }
    } else {
      toast("User is not logged in.");
    }
  };
  

  function truncateHTML(htmlContent: string, maxLength: number) {
    let plainText = htmlContent.replace(/<br\s*\/?>/gi, '');

    if (plainText.length > maxLength) {
      plainText = plainText.slice(0, maxLength) + '...';
    }

    return parse(plainText);
  }
  

  return (
    <div className="dark:bg-gray-800 flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-lg p-4 mb-4 w-full">
      <Link href={`Internships/${id}`} className="flex flex-col md:flex-row items-center w-full md:w-[80%]">
        <div className="w-full md:w-[20%] h-full mb-4 md:mb-0">
          <Image src={imageUrl} alt={internshipName} className="w-full h-full max-md:h-40 rounded-lg object-cover" height={5000} width={5000} quality={100} />
        </div>
        <div className="flex flex-col w-full md:w-[80%] md:ml-5 h-auto">
          <h3 className="text-lg font-semibold dark:bg-gray-800 dark:text-white">{internshipName}</h3>
          <div className="flex-auto mt-2">
            <p
              className="text-gray-600 dark:text-gray-400"
            >
              {truncateHTML(description, 100)}
            </p>
            <p className="text-gray-600 dark:text-gray-400"><b>Stipend:</b> {stipend}</p>
            <p className="text-gray-600 dark:text-gray-400"><b>Duration:</b> {duration}</p>
            <p className="text-gray-600 dark:text-gray-400"><b>Location:</b> {location}</p>
          </div>
          <div className="flex flex-wrap mt-2">
            {category.map((cat, ind) => (
              <span key={ind} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mr-2 mt-2">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex flex-col max-md:space-y-2 space-y-5 w-full mt-4 md:mt-0 md:w-[20%]">
  {userCheck ? (
    <div className='w-full'>
      {!(userData.appliedInternships?.some((internship: any) => internship.id === id)) ? 
        <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg" onClick={() => ApplyIntern(id)}>
          Apply
        </button> : 
        <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-black text-lg" onClick={() => ApplyIntern(id)}>
          Applied
        </button>
      }
    </div>
  ) : (
    <Link href="/auth/signin">
      <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg">
        Apply
      </button>
    </Link>
  )}

  {userCheck ? (
    <div className='w-full'>
      {!(userData.savedInternships?.includes(id)) ? ( // Use includes here
        <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-black text-lg" onClick={() => saveIntern(id)}>
          Save
        </button>
      ) : (
        <button className="font-semibold py-2 px-4 w-full rounded-full border border-black dark:border-white text-black dark:text-white bg-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-black text-lg" onClick={() => saveIntern(id)}>
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


    </div>
  );
};

export default InternshipBox;
