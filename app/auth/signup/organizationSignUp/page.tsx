// Dark Mode// Dark Mode
"use client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { loadUserFromLocalStorage, selectUser, setUser, UserType } from '@/store/slice';
import { auth, db, storage } from '@/utils/firebase';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { addDoc, arrayUnion, collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';


interface FormData {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  password: string;
  userType: UserType;
  description: string;
  organisation: string;
  experience: string;
  linkedin: string;
  github: string;
  portfolio: string;
  fees: string;
}

interface Category {
  id: string;
  name: string;
}

const Page = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [formData, setFormData] = useState<FormData>({
    uid: '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
    password: '',
    userType: UserType.Organization,
    description: '',
    organisation: '',
    experience: '',
    linkedin: '',
    github: '',
    portfolio: '',
    fees: ''
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'meta-data', 'v1', 'filter-categories'));
      const categoryData: Category[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name as string
      }));
      console.log('Fetched Categories:', categoryData);
      setCategories(categoryData);
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (newValue: string | undefined) => {
    if (newValue && !selectedCategories.includes(newValue)) {
      setSelectedCategories(prev => [...prev, newValue]);
    }
  };

  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const loginMethod = localStorage.getItem("loginMethod");
    console.log("hello "+ loginMethod);
    if (loginMethod == "google") {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

        
        let user;

        if (currentUser.userType==UserType.Guest) {
            // Create email/password user when it's not Google Sign-In
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            user = userCredential.user;
        } else {
            // Use the existing Google-authenticated user
            user = currentUser;

            // Ensure that no password is being sent in the request
            setFormData((prev) => ({ ...prev, password: '' }));
        }

        if (!user.uid) {
          throw new Error("User ID is undefined");
        }

        const newUserRef = doc(db, 'users', user.uid);
        
        let profileImageURL = "";
        if (currentUser.photoURL) {
            profileImageURL = currentUser.photoURL;
          } else if (profileImage) {
            // If the user uploaded a profile image, upload it to Firebase Storage
            const storageRef = ref(storage, `profileImage/${profileImage.name}`);
            const snapshot = await uploadBytes(storageRef, profileImage);
            profileImageURL = await getDownloadURL(snapshot.ref);
          }

        await setDoc(newUserRef, {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            userType: formData.userType,
            photoURL: profileImageURL,
            timestamp: new Date().toISOString()
        });

        const mentorRef = await setDoc(doc(db, 'mentors', user.uid), {
            ...formData,
            uid: user.uid,
            photoURL: profileImageURL,
            expertise: selectedCategories,
            timestamp: new Date().toISOString()
        });

        const batch = writeBatch(db);
        selectedCategories.forEach((categoryId) => {
            const categoryDocRef = doc(db, 'meta-data', 'v1', 'filter-categories', categoryId);
            batch.update(categoryDocRef, {
                mentors: arrayUnion(user.uid)
            });
        });
        await batch.commit();

        dispatch(setUser({
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            userType: formData.userType,
            photoURL: profileImageURL,
        }));


        router.push(`/`);
        toast({
            title: "Organization Signed in successfully",
            description: "Mentor data has been posted.",
        });
    } catch (error: any) {
        console.error('Error during form submission: ', error);
    
        // Firebase Authentication Errors
        if (error.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast({
                        title: "Error",
                        description: "The email address is already in use.",
                    });
                    break;
                case 'auth/invalid-email':
                    toast({
                        title: "Error",
                        description: "The email address is invalid.",
                    });
                    break;
                case 'auth/weak-password':
                    toast({
                        title: "Error",
                        description: "The password is too weak.",
                    });
                    break;
                case 'auth/network-request-failed':
                    toast({
                        title: "Error",
                        description: "Network error. Please check your internet connection.",
                    });
                    break;
                default:
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again.",
                    });
                    break;
            }
        } else {
            toast({
                title: "Error",
                description: "Some error occurred, please try again.",
            });
        }
    }
    
  };


  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const handleReadOnlyClick = () => {
    if(isReadOnly){
        toast({
            title: "Cannot edit information",
            description: "Information loaded from google signin.",
        });
    }
  }

  useEffect(() => {
    // Load the user from localStorage when the app loads
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isReadOnly) {
      setFormData({
        ...formData,
        name: currentUser.name || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
      });
    }
  }, [isReadOnly, currentUser]);
  

  return (
    <>
      <div className="text-black dark:text-white py-5 min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full pt-1 min-h-screen mx-4 md:mx-12 mb-10 rounded-lg flex flex-col">
          <div className='p-5 md:p-14'>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Sign Up as Organization</h1>
            <p className="text-black dark:text-gray-300">
              Share your expertise and empower the next generation of professionals. Join our mentorship program to make a lasting impact on aspiring talent&apos;s careers.
            </p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 px-4 md:px-14">
            <div className="w-full flex gap-4">
              <label className="form-control lg:w-[73%] w-[50%]">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Name</span>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your Name (Government verified)"
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                  onClick={handleReadOnlyClick}
                />
              </label>
              <label className="form-control lg:w-[27%] w-[50%]">
                <div className="label">
                    <span className="font-bold text-black dark:text-gray-300">Profile Image</span>
                </div>
                {currentUser?.userType !== UserType.Guest && currentUser?.photoURL ? (
                    <div className="label">
                    <Image
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover"
                        onClick={handleReadOnlyClick}
                        width={20}
                        height={20}
                    />
                    <span
                        className="label-text text-gray-600 dark:text-gray-400 ml-4 cursor-pointer"
                        onClick={handleReadOnlyClick}
                    >
                        (Read-only)
                    </span>
                    </div>
                ) : (
                    <>
                    {profileImage && (
                        <div className="label">
                        <span className="label-text text-gray-600 dark:text-gray-400">Image Selected</span>
                        </div>
                    )}
                    <label className="form-control w-full">
                        <div className="label">
                        <button
                            type="button"
                            className="underline cursor-pointer text-black dark:text-white"
                            style={{ textDecorationColor: "black", paddingBottom: "2px" }}
                            onClick={() => {
                            const fileInput = document.getElementById("image-upload");
                            if (fileInput) {
                                fileInput.click();
                            }
                            }}
                        >
                            Upload Profile Image
                        </button>
                        </div>
                        <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        />
                    </label>
                    </>
                )}
            </label>

            </div>
              
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Description</span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input input-bordered w-full h-20 bg-white dark:bg-gray-950 resize-none border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
                <div className="label">
                  <span className="label-text text-gray-600 dark:text-gray-400">Give a brief description about yourself.</span>
                </div>
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Organisation</span>
                </div>
                <input
                  type="text"
                  name="organisation"
                  value={formData.organisation}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
                <div className="label">
                  <span className="label-text text-gray-600 dark:text-gray-400">Name of the organisation which you are currently working in.</span>
                </div>
              </label>
              {/*add code for "expertise" input to be selected(multiple categories can be selected) and set according to filtration rules in earlier page*/ }
              <label>
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Expertise</span>
                </div>
                <Select value={undefined} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select categories" className="normal-case" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-auto"> 
                    <SelectGroup>
                      <SelectLabel className="font-bold">Categories</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="text-lg text-black bg-white dark:hover:bg-gray-800 dark:text-white dark:bg-gray-900 hover:bg-gray-200"
                        >
                          {category.id}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCategories.map((category) => (
                    <span key={category} className='bg-slate-300 text-slate-800 rounded-xl p-1 text-sm flex items-center'>
                      {category}
                      <span
                        className="ml-1 cursor-pointer text-slate-800 hover:text-slate-900"
                        onClick={() => setSelectedCategories(prev => prev.filter(cat => cat !== category))}
                      >
                        &times;
                      </span>
                    </span>
                  ))}
                </div>
              </label>


              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Experience Level (in years)</span>
                </div>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
                <div className="label">
                  <span className="label-text text-gray-600 dark:text-gray-400">How would you rate your experience in your expertise area?</span>
                </div>
              </label>
            </div>
            <div className="w-full md:w-1/2 px-4 md:px-14 pb-14">
              <label className="form-control w-full">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Email</span>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  readOnly={isReadOnly}
                  onClick={handleReadOnlyClick}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Password</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required={!isReadOnly}
                  readOnly={isReadOnly}
                  onClick={handleReadOnlyClick}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">LinkedIn Profile</span>
                </div>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Github Profile</span>
                </div>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Portfolio Link</span>
                </div>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
              </label>
              <label className="form-control w-full pt-5">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Mentorship Fees</span>
                </div>
                <input
                  type="text"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                />
                <div className="label">
                  <span className="label-text text-gray-600 dark:text-gray-400">Enter your mentorship rate per session to empower aspiring professionals.</span>
                </div>
              </label>
            </div>
          </div>
          <Suspense>
            <div className="flex justify-center p-5">
              <button
                type="submit"
                className="font-bold  w-full sm:w-1/2 max-w-xs text-center bg-black text-white border-2 border-gray-600 py-2 rounded-lg hover:bg-gray-700 hover:border-gray-500"
              >
                Submit
              </button>
            </div>
          </Suspense>
        </form>
      </div>
    </>
  );

}

export default Page
