import { useState, useEffect } from 'react';
import { db, auth } from '@/utils/firebase';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from './ui/use-toast';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
type UserDetail = {
  name: string;
  email: string;
  profilePic: string;
  bio: string;
};

const UserDetails = ({ uid, type, handleFchange }: { uid: string, type: string, handleFchange: Function }) => {

  const [userDetail, setUserDetails] = useState<UserDetail | null>(null);
  // const [user1, loading] = useAuthState(auth);
  const user = useSelector((state: RootState) => state.user);

  //fetching user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("userdata:",userData);
          // Assuming the user document structure has 'name' and 'email' fields
          setUserDetails({
            name: userData.displayName || userData.name,
            email: userData.email,
            profilePic: userData.profilePic,
            bio: userData.bio||""
          });
        } else {
          console.log('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [uid]);
console.log('Userdetails:', userDetail);
  //for unfollowing user
  const handleUnfollow = async () => {
    if (!user||user.userType=='guest') {
      toast({
        title: " Please login to follow others ",
        variant: "destructive",
      });
      return;
    }
    if (!user.uid) {
      toast({
        title: "Error: Invalid user ID",
        variant: "destructive",
      });
      return;
    }
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        following: arrayRemove(uid) // Unfollow if already following
      });

      const followerRef = doc(db, "users", uid);
      await updateDoc(followerRef, {
        followers: arrayRemove(user.uid),
      });

      // Show toast notification based on follow/unfollow action
      toast({
        title: "You have unfollowed this user ❌",
        variant: "default",
      });

      handleFchange(uid);

    } catch (error) {
      console.error("Error updating following list:", error);
      toast({
        title: "Error updating following list",
        variant: "destructive",
      });
    }
  };

  //for removing followers
  const handleRemoveFollower = async()=>{
    if (!user||(user&&user.userType=='guest')) {
      toast({
        title: " Please login to follow others ",
        variant: "destructive",
      });
      return;
    }
    if (!user.uid) {
      toast({
        title: "Error: Invalid user ID",
        variant: "destructive",
      });
      return;
    }
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        followers: arrayRemove(uid) // Unfollow if already following
      });

      const followerRef = doc(db, "users", uid);
      await updateDoc(followerRef, {
        following: arrayRemove(user.uid),
      });

      // Show toast notification based on follow/unfollow action
      toast({
        title: "You have unfollowed this user ❌",
        variant: "default",
      });

      handleFchange(uid);

    } catch (error) {
      console.error("Error updating following list:", error);
      toast({
        title: "Error updating following list",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      {userDetail ? (
        <div>
        <div className="flex mx-auto bg-[#FFFFFF] dark:bg-[#262626] p-3 rounded-lg font-dmsans">
          <div>
          <Image
            src={userDetail.profilePic || '/nodp.webp'}
            width={100}
            height={100}
            className="w-[3rem] h-[3rem] rounded-full"
            alt="Profile Pic"
          />
          {/* <p className=" mt-4 text-sm">Write a description about yourself ...</p> */}
          </div>
          <div className='flex flex-col'>
          <div className='flex'>
          <div className="space-y-2 mx-5">
            <h1 className="font-style-1-headline text-base font-bold font-dmsans">{userDetail.name||"Unknown"}</h1>
  
          </div>
          <div className="text-blue-500 font-dmsans text-sm mt-[0.20rem] p-0 hover:underline cursor-pointer" onClick={type=="following"?handleUnfollow:handleRemoveFollower}>{type=="following"?"Unfollow":"Remove"}</div>
          </div>
          <div className='font-style-1-subtitle ml-5 text-sm mt-[0.20rem] opacity-80'>{userDetail.bio}</div>
          </div>
        </div>
        <Separator className='h-1'/>
      </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserDetails;
