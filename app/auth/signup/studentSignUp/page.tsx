"use client"
import React, { useEffect, useState } from 'react'
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { auth, db, storage } from '@/utils/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { selectUser, setUser, UserType } from '@/store/slice';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { Stick_No_Bills } from 'next/font/google';

interface FormData {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    password: string;
    userType: UserType;
    college: string;
    branch: string;
    academicYear: string;
    bio: string;
    wowFactor: string;
    portfolioLink: string;
    projects: string;
    skills: string[];
    interests: string;
    achievements: string;
  }

  interface Category {
    id: string;
    name: string;
  }

const StudentSignUp = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [formData, setFormData] = useState<FormData>({
    uid: "",
    name: currentUser.name || '',
    email: currentUser.email || '',
    photoURL: currentUser.photoURL || '',
    password: '',
    userType: UserType.Student,
    college: "",
    branch: "",
    academicYear: "",
    bio:"",
    wowFactor: "",
    portfolioLink: "",
    projects: "",
    skills: [],
    interests: "",
    achievements: "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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

  const handleCategoryChange = (newValue: string | undefined) => {
    if (newValue && !selectedCategories.includes(newValue)) {
      setSelectedCategories(prev => [...prev, newValue]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const loginMethod = localStorage.getItem("loginMethod");
    console.log("hello "+ loginMethod);
    if (loginMethod == "google") {
      setIsReadOnly(true);
      console.log("isReadOnly is set to true");
    } else {
      setIsReadOnly(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log('Submitting form', formData, profileImage, resumeFile);

        let user;

        if (!isReadOnly) {
            // Create email/password user when it's not Google Sign-In
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            user = userCredential.user;
        } else {
            // Use the existing Google-authenticated user
            user = currentUser;

            // Ensure that no password is being sent in the request
            setFormData((prev) => ({ ...prev, password: '' }));
        }
        console.log('User created:', user);

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

        let resumeURL = "";
        if (resumeFile) {
            const storageRef = ref(storage, `resumes/${resumeFile.name}`);
            await uploadBytes(storageRef, resumeFile);
            resumeURL = await getDownloadURL(storageRef);
            console.log('Resume URL:', resumeURL);
        }

        await setDoc(newUserRef, {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            userType: formData.userType,
            photoURL: profileImageURL,
            timestamp: new Date().toISOString()
        });

        dispatch(setUser({
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            userType: formData.userType,
            photoURL: profileImageURL,
        }));

        const newProfileRef = doc(db, 'adaptation-list', user.uid);
        const dataToStore = {
            ...formData,
            uid: user.uid,
            skills: selectedCategories,
            resumeURL,
            photoURL: profileImageURL,
            timestamp: new Date().toISOString()
        };

        await setDoc(newProfileRef, dataToStore);

        router.push(`/`);
        toast({
            title: "Student Signed in successfully",
            description: "Profile has been posted.",
        });
    } catch (error) {
        console.error('Error in handleSubmit:', error);

        if (error instanceof FirebaseError) {
            // Check for specific Firebase auth errors and show appropriate messages
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast({
                        title: "Email Already in Use",
                        description: "The email address is already associated with another account. Please use a different email address.",
                    });
                    break;
                case 'auth/invalid-email':
                    toast({
                        title: "Invalid Email",
                        description: "The email address entered is invalid. Please provide a valid email address.",
                    });
                    break;
                case 'auth/weak-password':
                    toast({
                        title: "Weak Password",
                        description: "The password is too weak. Please choose a stronger password.",
                    });
                    break;
                case 'auth/network-request-failed':
                    toast({
                        title: "Network Error",
                        description: "There was a network error. Please check your internet connection and try again.",
                    });
                    break;
                default:
                    toast({
                        title: "Submission Error",
                        description: "There was an error submitting your form. Please try again.",
                    });
                    break;
            }
        } else {
            // General error handling for unknown errors
            toast({
                title: "Submission Error",
                description: "An unexpected error occurred. Please try again.",
            });
        }

        router.push(`/auth/signup/studentSignUp`);
    }
};


const handleReadOnlyClick = () => {
    if(isReadOnly){
        toast({
            title: "Cannot edit information",
            description: "Information loaded from google signin.",
        });
    }
  }



  return (
    <div className=" py-5 min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className=" w-full pt-1 min-h-screen mx-4 md:mx-12 mb-10 rounded-lg text-black dark:text-white flex flex-col"
      >
        <div className="p-2 md:p-14">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Signup as Student
          </h1>
          <p className="text-black dark:text-gray-300">
            Showcase your Skills and projects to connect with mentors for
            personalized career guidance and development opportunities.
          </p>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 px-4 md:px-14 ">
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
                  onChange={handleInputChange}
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
                          height={20}
                          width={20}
                        />
                        <span className="label-text text-gray-600 dark:text-gray-400 ml-4 cursor-pointer">
                        (Read-only)
                        </span>
                    </div>
                    ) : (
                    <>
                        {profileImage ? (
                        <div className="label">
                            <span className="label-text text-gray-600 dark:text-gray-400">Image Selected</span>
                        </div>
                        ) : (
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
                        )}
                    </>
                    )}
                </label>

            </div>
            <div className="flex flex-row gap-4 pt-5">
              <label className="form-control w-full">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">College</span>
                </div>
                <input
                  type="text"
                  name="college"
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                  value={formData.college}
                  onChange={handleInputChange}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Branch</span>
                </div>
                <input
                  type="text"
                  name="branch"
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                  value={formData.branch}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">Academic Year</span>
              </div>
              <input
                type="text"
                name="academicYear"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.academicYear}
                onChange={handleInputChange}
              />
            </label>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">One-line Bio</span>
              </div>
              <input
                type="text"
                name="bio"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.bio}
                onChange={handleInputChange}
              />
              <div className="label">
                <span className="label-text text-gray-600 dark:text-gray-400">
                  Briefly describe your career aspirations and what you aim to achieve professionally
                </span>
              </div>
            </label>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">WoW Factor Line</span>
              </div>
              <input
                type="text"
                name="wowFactor"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.wowFactor}
                onChange={handleInputChange}
              />
              <div className="label">
                <span className="label-text text-gray-600 dark:text-gray-400">
                  What makes you stand out from others in your field
                </span>
              </div>
            </label>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">Portfolio Link</span>
              </div>
              <input
                type="text"
                name="portfolioLink"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.portfolioLink}
                onChange={handleInputChange}
              />
              <div className="label">
                <span className="label-text text-gray-600 dark:text-gray-400">Your Online Presence</span>
              </div>
            </label>
          </div>
          <div className="w-full md:w-1/2 px-4 md:px-14 pb-14">
              <label className="form-control w-full ">
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Email</span>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                  required
                  readOnly={isReadOnly}
                  onClick={handleReadOnlyClick}
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
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                  required={!isReadOnly}
                  readOnly={isReadOnly}
                  onClick={handleReadOnlyClick}
                />
              </label>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">Projects</span>
              </div>
              <input
                type="text"
                name="projects"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.projects}
                onChange={handleInputChange}
              />
            </label>
            {/* beginning */}
            
            <label>
                <div className="label">
                  <span className="font-bold text-black dark:text-gray-300">Skills</span>
                </div>
                <Select value={undefined} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500">
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


            {/* end */}
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">Areas of Interest</span>
              </div>
              <input
                type="text"
                name="interests"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.interests}
                onChange={handleInputChange}
              />
            </label>
            <label className="form-control w-full pt-5">
              <div className="label">
                <span className="font-bold text-black dark:text-gray-300">Achievements</span>
              </div>
              <input
                type="text"
                name="achievements"
                className="input input-bordered w-full bg-white dark:bg-gray-950 border-gray-800 dark:border-gray-600 text-black dark:text-white focus:border-gray-800 dark:focus:border-gray-500"
                value={formData.achievements}
                onChange={handleInputChange}
              />
            </label>
            <label className="form-control w-full pt-5">
                <div className="label">
                    <button
                    type="button"
                    className="underline cursor-pointer"
                    style={{ textDecorationColor: "black", paddingBottom: "2px" }}
                    onClick={() => {
                        const fileInput = document.getElementById("resume-upload");
                        if (fileInput) {
                        fileInput.click();
                        }
                    }}
                    >
                    Upload Your Resume
                    </button>
                </div>
                <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                />
                {resumeFile && (
                    <div className="label mt-2">
                    <span className="label-text">Selected file: {resumeFile.name}</span>
                    </div>
                )}
            </label>
          </div>
        </div>
        <div className="flex justify-center items-center py-6">
          <button
            type="submit"
            className="btn btn-primary w-1/2 md:w-1/3 text-white bg-black dark:bg-black hover:bg-gray-900 dark:hover:bg-gray-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
  

};

export default StudentSignUp;