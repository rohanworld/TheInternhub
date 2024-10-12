import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { selectUser } from "@/store/slice";
type Props = {
  // user: {
  //   photoURL?: string;
  //   displayName?: string;
  //   uid?: string; // Assuming user object contains the UID
  // } | null;
  user: any
};

const ProfileCard = ({user}: Props) => {

  console.log("User: ", user);
  const currentuser = useSelector(selectUser);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [name, setName] = useState<string>(user?.displayName);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  //fetching followers, following details
  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const following = userData?.following?.length;
          const followers = userData?.followers?.length;
          const realName = userData?.name||userData?.displayName||"Unknown";
          const bioo = userData?.bio;
          const profilePic = userData?.photoURL;
          // Assuming followers and following fields exist in user data
          setName(realName);
          setBio(bioo);
          if(user.uid==currentuser.uid){
            setProfilePic(currentuser.photoURL||"" );
          }
          else{
            setProfilePic(profilePic);
          }
          
          setFollowersCount(followers || 0);
          setFollowingCount(following || 0);
        }
      }
    };

    fetchFollowersAndFollowing();
  }, [user?.uid, user]);


  const otherUser:boolean=false;
  return (
    <div>
      <div className="flex mx-auto bg-[#FFFFFF] dark:bg-[#262626] p-5 rounded-lg font-dmsans">

        <div className="ml-5">
        <Image
          src={`${profilePic?profilePic:"https://firebasestorage.googleapis.com/v0/b/internhub-5.appspot.com/o/profileImage%2Fdummy-profile-pic.jpg?alt=media&token=d8674fc8-e35e-48fa-9997-cb239e4c39c1"}`}
          width={300}
          height={300}
          className=" lg:w-[7rem] lg:h-[7rem] w-[5rem] h-[5rem] rounded-full"
          alt="Profile Pic"
        />
        {/* <p className=" mt-4 text-sm">Write a description about yourself ...</p> */}
        </div>


        <div className="mx-5">
          <h1 className="text-2xl">{name}</h1>
          <h3 className=" font-thin">{user.userType}</h3>
          <div className={`${bio?"":"h-3"}`}></div>
          <div className="font-jakarta text-sm">{bio}</div>
          <div className="flex flex-col">
          <div className=" flex gap-x-2 mt-1 lg:text-base text-xs opacity-80">
          <p>{followersCount} Followers</p>
            <svg
              viewBox="0 0 48 48"
              className="lg:mt-2 lg:w-3 lg:h-3 w-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z"
                  fill="#333333"
                ></path>{" "}
              </g>
            </svg>

            <p>{followingCount} Following</p>
          </div>
          <div>
            {currentuser.uid==user.uid? <Link href="/profilePage/editProfile"><Button className="bg-blue-500 text-white dark:bg-blue-900">Edit Profile</Button></Link>:<span/>}
          </div>
          </div>

          {otherUser&&
          <Button variant='outline' className=" mt-4 rounded-3xl">Follow</Button>
          }

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
