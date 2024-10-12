"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { setUser, UserType } from '@/store/slice';
import { useDispatch } from 'react-redux';
import { FaGoogle } from 'react-icons/fa';
import { FirebaseError } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignUpPage = () => {

  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();    
  const dispatch = useDispatch();
  

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    localStorage.setItem("loginMethod", "google");
    console.log("Stored login method: " + localStorage.getItem("loginMethod"));

  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if user already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        // if user exists, sign them in without checking user type
        const userData = userSnap.data();
        dispatch(setUser({
          uid: user.uid,
          email: userData.email,
          name: userData.name,
          photoURL: userData.photoURL,
          userType: userType as UserType,
        }));
        router.push('/'); 
      } else {
        // New user
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          userType: userType as UserType,
        }));
        if (userType === UserType.Student) {
          router.push("/auth/signup/studentSignUp");
        } else if (userType === UserType.Organization) {
          router.push("/auth/signup/organizationSignUp");
        } else {
          setError(`You dont have an account , Please select an Account Type`);
        }
      }
    } catch (err) {
      const error = err as FirebaseError;
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      console.error("Google Sign-In Error:", {
        code: errorCode,
        message: errorMessage,
        email: email,
        credential: credential
      });
  
      setError(`Google Sign-In Error: ${errorMessage}`);
    }
  };
  

  const handleSubmit = async (e?: { preventDefault: () => void; }) => {
    if (e) e.preventDefault();
    if (!userType) {
      setError("Please select an account type!");
      return;
    }
    localStorage.setItem("loginMethod", "email");
    console.log("Stored login method: " + localStorage.getItem("loginMethod"));
    if (userType === UserType.Student) {
      router.push("/auth/signup/studentSignUp");
    } else if (userType === UserType.Organization) {
      router.push("/auth/signup/organizationSignUp");
    }
  };

  return (
    <div className="page-no-scroll dark:bg-grey-800 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-md px-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="font-jakarta bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg flex flex-col space-y-6 h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Sign Up</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose your account type</p>
          </div>
          
          <div className="flex justify-center gap-4 mt-6 w-full">
            <label className="flex-grow items-center cursor-pointer">
              <input
                type="radio"
                required
                name="user-type"
                value={UserType.Student}
                className="sr-only peer"
                onChange={(e) => setUserType(e.target.value)}
              />
              <div className="relative flex items-center justify-center w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg transform transition-transform duration-300 peer-checked:scale-110">
                <span className="text-lg font-semibold">Student</span>
              </div>
            </label>

            <label className="flex-grow items-center cursor-pointer">
              <input
                type="radio"
                required
                name="user-type"
                value={UserType.Organization}
                className="sr-only peer"
                onChange={(e) => setUserType(e.target.value)}
              />
              <div className="relative flex items-center justify-center w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg transform transition-transform duration-300 peer-checked:scale-110">
                <span className="text-lg font-semibold">Organization</span>
              </div>
            </label>
          </div>


          <Button
            type="submit"
            className="w-full font-semibold bg-black text-white hover:bg-black-700 dark:bg-black dark:hover:bg-black transition duration-100 ease-in-out focus:outline-none mt-6"
          >
            Create Account
          </Button>

          <div className="flex items-center justify-center mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out flex items-center justify-center gap-2 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
              onClick={() => signInWithGoogle()}
            >
              <FaGoogle className="text-lg" />
              Sign Up with Google
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-indigo-500 hover:underline dark:text-indigo-400">
              Sign in
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-indigo-500 hover:underline dark:text-indigo-400">
              Terms and Conditions
            </Link>
          </div>

          {error && (
            <div className="text-red-500 text-center mt-4">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
