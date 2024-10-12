"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, UserType } from '@/store/slice';
import { FaGoogle, FaFacebook, FaUserSecret } from 'react-icons/fa';
import { FirebaseError } from 'firebase/app';
import { toast } from '@/components/ui/use-toast';

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  const signInWithEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userTypeToSet = userData.userType as UserType;

        dispatch(setUser({
          uid: user.uid,
          email: userData.email,
          name: userData.displayName,
          photoURL: userData.photoURL,
          userType: userTypeToSet,
        }));
  
        console.log(userData.userType);

        router.push('/');
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });
      } else {
        setError("No such user exists.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to sign in. Please check your credentials.");
    }
  };
  

  const signInWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      let userTypeToSet: UserType;
  
      if (userDoc.exists()) {
        const existingUserData = userDoc.data();
        userTypeToSet = existingUserData.userType as UserType;
      } else {
        if (!userType || !Object.values(UserType).includes(userType as UserType)) {
          setError("You do not have an account, Please signUp first!");
          return;
        }
  
        userTypeToSet = userType as UserType;
  
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email || "",
          profilePic: user.photoURL || "",
          userType: userTypeToSet,
        });
      }
  
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        userType: userTypeToSet,
      }));
  
      router.push("/");
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
    signInWithEmail();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center justify-center h-screen  p-4">
        <div className="font-jakarta bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col max-w-4xl w-full relative overflow-hidden sm:mx-4 sm:my-6">
          <div className="w-full h-48 relative">
            <Image
              src="/BG.png"
              alt="background"
              fill
              objectFit=""
              className="absolute inset-0 object-cover rounded-lg"
              // width={1000}
              // height={600}
            />
          </div>
          <div className="flex flex-col lg:flex-row">
            {/* Left Column: Sign-In Form */}
            <div className="w-full lg:w-1/2 p-6 flex flex-col gap-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sign In</h1>
                <p className="text-gray-600 dark:text-gray-400">Please enter your credentials</p>
              </div>
              <div className="grid gap-4">
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 shadow-md outline-none placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 shadow-md outline-none placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" className="w-full font-semibold bg-black text-white hover:bg-black-700 hover:font-bold transition duration-100 ease-in-out focus:outline-none">
                  Sign In
                </Button>
              </div>
              {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-indigo-500 hover:underline dark:text-indigo-400">
                  Sign up
                </Link>
              </div>
            </div>
            {/* <Separator orientation="vertical" className="h-[17.5rem] lg:block hidden bg-black" /> */}
            <Separator orientation="vertical" className="h-[17.5rem] lg:block hidden border-gray-300 dark:border-gray-600" />

            {/* Right Column: Social Sign-In */}
            <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-gray-900 p-6 flex flex-col gap-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Continue With</h2>
              </div>
              <div className=" gap-4">
                <Button type="button" variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out flex items-center justify-center gap-2" onClick={() => signInWithGoogle()}>
                  <FaGoogle className="text-lg" />
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Page;
