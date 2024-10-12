"use client";

import React, { useState, useRef, useEffect } from "react";

import parse from "html-react-parser";

import { MessageSquare } from "lucide-react";
import { Share } from "lucide-react";
import { Bookmark } from "lucide-react";
import ShareDialog from "./ShareDialog";
// import { Trash2 } from "lucide-react";
import { AiTwotoneDelete } from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
//import {Progress} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userCache, UserType } from "@/store/slice";
import { updateUserCache } from "@/store/slice";

import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress"

import PostVoteClient from "./post-vote/PostVoteClient";
import PostVoteClientPhone from "./post-vote/PostVoteClientPhone";
import { Avatar, AvatarFallback } from "./ui/avatar";

import { formatTimeToNow } from "@/lib/date";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserData = {
  following: Array<string>;
  followers: Array<string>;
  name: string;
  email: string;
};

type Props = {
  post: {
    id: string;
    title: string;
    name: string;
    description: string;
    profilePic: string;
    postImage: string;
    likes: number;
    comments: number;
    shares: number;
    options:Array<any>;
    questionImageURL: string;
    createdAt: any;
    anonymity: boolean;
    uid: string; // User ID of the post creator
    // ansNumbers: number
  };
  // children: Element
  // id: string
  isProfile?: boolean;
  othersProfile?: boolean;
  handleDelete?: Function;
};

const Post = ({ post, isProfile = false, othersProfile , handleDelete = () => {} }: Props) => {
  const pRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const userCacheData = useSelector(userCache);
  //console.log("Answer Posr: ", post);
  const { toast } = useToast();

  const isAnonymous = post.anonymity;

  //for displaying 'more' button
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  //needed to send it to PostVoteClientPhone so that it can get the current user's vote
  const user = useSelector(selectUser);

  //saving the post funcitonality
  const [savedState, setSavedState] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false); // State to track if the user is following this post's creator
  const [isCurrentUser, setIsCurrentUser] = useState(false); // State to track if the post's creator is the current user

  const fetchQuestion = async () => {
    //console.log("hii ", post.title, post.uid);
    if (post.title == undefined) {
      if (post.uid) {
        const questionRef = doc(db, "questions", post.uid);
        const questionDoc = await getDoc(questionRef);

        console.log(questionDoc, " * ", questionDoc.exists());
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          console.log(questionData);
        }
      }
    }
  };

  const HandleDelete = () => {
    handleDelete(post.id);
  };

  const handleSave = async () => {
    if (!user || user.userType == UserType.Guest) {
      toast({
        title: " Please sign in to save posts ",
        variant: "destructive",
      });
      return;
    }
    if(user.uid){
      const userRef = doc(db, "users", user.uid);
      if (savedState) {
        //post is currently saved remove it from saved posts
        await updateDoc(userRef, {
          savedPosts: arrayRemove(post.id),
        });
        toast({
          title: " Post removed from saved ",
          variant: "default",
        });
      } else {
        //post is currently not saved add it to saved posts
        await updateDoc(userRef, {
          savedPosts: arrayUnion(post.id),
        });
        toast({
          title: " Post saved ",
          variant: "default",
        });
      }

      setSavedState(!savedState);
    };
  }

  useEffect(() => {
    if (pRef.current) {
      setIsOverflowing(pRef.current.scrollHeight > pRef.current.clientHeight);
    }
  }, [pRef]);

  
  useEffect(() => {
    // Check if the current user is following the post's creator
    if(isProfile==false){
    if (post.uid && !userCacheData[post.uid]) {
      const fetchUserData = async () => {
        if (user.uid) {
          const userRef = doc(db, "users", user.uid);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data() as UserData;
              setIsFollowing(userData.following?.includes(post.uid)); // Update isFollowing based on the following list
              setIsCurrentUser(user.uid === post.uid); // Check if the post's creator is the current user
              dispatch(updateUserCache({ uid: post.uid, userData }));
            }
          });

          return () => unsubscribe();
        }
        //const userData = {id: post.uid};
      };
      fetchUserData();
    } else {
      //console.log("FollowCache: ", userCacheData[post.uid]);
      setIsFollowing(userCacheData[post.uid]?.following?.includes(post.uid));
      if (user) {
        setIsCurrentUser(user.uid === post.uid);
      }
    }
  }
  }, [post.uid, userCacheData, dispatch]);

  //fetching savedPosts from user's document
  useEffect(() => {
    const fetchUser = async () => {
      if (user.uid){
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const savedPosts = userData.savedPosts;

          // If the post is in the savedPosts array, set savedState to true
          if (savedPosts?.includes(post.id)) {
            setSavedState(true);
          } else {
            // If the post is not in the savedPosts array, set savedState to false
            // unless it's the recently saved post (post.id === savedPostId)
            // setSavedState(post.id === savedPostId);
          }
        }
      }
    };

    fetchUser();
  }, [post.id, user]);

  //for displaying 'more' button
  useEffect(() => {
    // Assuming a line height of around 20px
    const maxHeight = 25 * 3;

    if (pRef.current && pRef.current.offsetHeight > maxHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [post.description]);

  //console.log("Id: ", post.uid, " ",  post.title);

  const handleFollow = async () => {
    if (user.userType==UserType.Guest) {
      toast({
        title: " Please login to follow others ",
        variant: "destructive",
      });
      return;
    }
    if(user.uid){
      const userRef = doc(db, "users", user.uid);

      try {
        await updateDoc(userRef, {
          following: isFollowing
            ? arrayRemove(post.uid) // Unfollow if already following
            : arrayUnion(post.uid), // Follow if not following
        });

        setIsFollowing(!isFollowing); // Update isFollowing state

        // Update followers list of the post's creator
        const postUserRef = doc(db, "users", post.uid);
        await updateDoc(postUserRef, {
          followers: isFollowing
            ? arrayRemove(user.uid) // Remove follower if unfollowing
            : arrayUnion(user.uid), // Add follower if following
        });

        // Show toast notification based on follow/unfollow action
        toast({
          title: isFollowing
            ? "You have unfollowed this user ❌"
            : "You are now following this user ✅",
          variant: "default",
        });
      } catch (error) {
        console.error("Error updating following list:", error);
        toast({
          title: "Error updating following list",
          variant: "destructive",
        });
      }
    }
  };
  const [pollData, setPollData] = useState<any>(null);
  const [userVote, setUserVote] = useState(null);

  //fetching poll data
  useEffect(() => {
    const fetchPollData = async () => {
      const pollDoc = await getDoc(doc(db, 'polls', post.id));
      if (pollDoc.exists()) {
        setPollData(pollDoc.data());
      } else {
        //console.error('Poll document not found');
      }
    };

    const fetchUserVote = async () => {
      if (user.uid) {
        const userVoteDoc = await getDoc(doc(db, 'polls', post.id, 'pollvotes', user.uid));
        if (userVoteDoc.exists()) {
          setUserVote(userVoteDoc.data().option);
          //console.log("UserV: ", userVoteDoc.data().option);
        }
        
      }
    };

    fetchPollData();
    fetchUserVote();
  }, [post.id, user]);

  let totalVotes = 0;
  let isPoll = false;
  if(pollData?.options!=null){
    //console.log("PstCmnt: ", post.comments);
    isPoll = true;
    const vt = pollData.options.reduce((acc:any, option:any) => {
      const optionKey = Object.keys(option)[0];
      return acc + option[optionKey];
    }, 0);
    totalVotes=vt
  }

  //for voting and unvoting
  const handleVote = async (optionKey: any) => {
    if (!user) {
      toast({
        title: "Login to vote",
        variant: "destructive",
      });
      console.error('User not logged in');
      return;
    }
  
    const pollRef = doc(db, 'polls', post.id);
    if(user.uid){
      const userVoteRef = doc(db, 'polls', post.id, 'pollvotes', user.uid);
    
      const updatedOptions = pollData.options.map((option: any) => {
        const key = Object.keys(option)[0];
        const value = option[key];
    
        if (key === optionKey) {
          if (userVote === optionKey) {
            return { [key]: value - 1 }; // Unvote if the same option is clicked
          } else {
            return { [key]: value + 1 }; // Vote for the new option
          }
        } else if (key === userVote) {
          return { [key]: value - 1 }; // Remove vote from the previous option
        }
    
        return option;
      });
    
      // Update the Firestore document
      await updateDoc(pollRef, { options: updatedOptions });
    
      // Update the user's vote
      if (userVote === optionKey) {
        await deleteDoc(userVoteRef); // Unvote if the same option is clicked
        setUserVote(null);
        toast({
          title: "Unvoted",
          variant: "default",
        });
      } else {
        await setDoc(userVoteRef, { option: optionKey });
        setUserVote(optionKey);
        toast({
          title: "Voted",
          variant: "default",
        });
      }
    
      // Update the local state
      setPollData((prevPollData: any) => ({
        ...prevPollData,
        options: updatedOptions,
      }));
    };
  }

  let dateString;
  if (post.createdAt) {
    let date;
    // console.log('Type of post.dateOfEvent:', typeof post.createdAt);
    // console.log('Value of post.dateOfEvent:', post.createdAt);
    if (typeof post.createdAt === 'string') {
      date = new Date(post.createdAt);
    } else if (typeof post.createdAt === 'number') {
      date = new Date(post.createdAt * 1000); // Multiply by 1000 if your timestamp is in seconds
    } else if (post.createdAt.toDate !== undefined) {
      date = post.createdAt.toDate();
    } else {
      console.error('post.dateOfEvent is neither a string, a number, nor a Timestamp');
      // Handle this case as appropriate for your application
    }
    if (date) {
      dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  console.log("Post: ", post);
  return (
    <>
      {post.uid ? (
        // <div className="bg-[#ffffff] dark:bg-[#111827] font-style-6-post font-jakarta mb-3 my-[14px] fade-in dark:border border-white border-[1px] rounded-md">     
        <div className="bg-white dark:bg-gray-800 font-style-6-post font-jakarta mb-0 my-0 fade-in  rounded-md">            
          <div className="px-3 sm:px-6 py-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 rounded-[4px]">
            <div className="w-full sm:w-0 sm:flex-1 break-normal overflow-hidden">
              
                {!isProfile && (
                  <div className="flex max-h-40 mt-1 space-x-2 text-xs items-center">
                    <Avatar>
                      <div className="relative w-full h-full aspect-square">
                        <Image
                          className="fade-in"
                          src={(user.userType === UserType.Guest) ? "/nodp.webp" : (post.profilePic ? post.profilePic : "/anonymous2.png")}
                          alt="profile picture"
                          width="200"
                          height="200"
                        />
                      </div>
                    </Avatar>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <span className="font-style-5-username font-dmsans text-[#0c0c0c] dark:text-yellow-50">
                        {isAnonymous ? (
                          "Anonymous"
                        ) : (
                          <Link href={`/profile/${post.uid}`} className="hover:underline cursor-pointer">
                            {post.name}
                          </Link>
                        )}
                      </span>
                      {isAnonymous || isCurrentUser || !user ? null : (
                        <div className="flex space-x-1 mt-1 sm:mt-0">
                          <svg viewBox="0 0 48 48" className="w-1 h-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z" fill="#333333"></path>
                          </svg>
                          <button className="font-style-4 font-dmsans text-[14px] text-blue-500 p-0 hover:underline cursor-pointer" onClick={handleFollow}>
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Link href={`${isPoll ? `poll/${post?.id}` : `/${post?.id}`}`} prefetch>
                  <div className={`${post.title ? "" : "hidden"}`}>
                    <h1 className={`font-style-2 font-dmsans py-2 leading-6 dark:text-white ${isExpanded ? "hover:underline" : ""}`}>
                      {post.title}
                    </h1>
                  </div>
                  {post.questionImageURL && (
                    <div className="relative w-full h-60">
                      <Image src={post.questionImageURL} className="fade-in" alt="post image" layout="fill" objectFit="cover" />
                    </div>
                  )}
                  <div className={`relative max-h-20 w-full overflow-clip ${isExpanded ? "max-h-none expand-content" : ""}`} ref={pRef}>
                    <span onClick={fetchQuestion} className="font-style-3 font-jakarta dark:text-white">
                      {parse(post.description)}
                    </span>
                    {!isExpanded && isOverflowing && (
                      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/95 dark:from-[#262626] to-transparent"></div>
                    )}
                    {!isExpanded && isOverflowing && (
                      <div className="absolute bottom-0 left-0 w-full text-right">
                        <button className="hover:underline w-full md:w-auto backdrop-blur-none bg-white/50 dark:bg-transparent text-right text-sm" onClick={() => setIsExpanded(true)}>
                          (more)
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              
              {isPoll && (
            <div className="mt-[1rem]">
              {pollData?.options?.map((option:any, index:any) => {
                const optionKey = Object.keys(option)[0];
                const optionValue = option[optionKey];
                const progressValue = totalVotes ? (optionValue / totalVotes) * 100 : 0;
                return (
                  <div key={index} className="w-full sm:w-[95%] flex flex-row items-center mb-2 gap-2">
                    <div className="relative flex-grow">
                      <Progress value={progressValue} className="h-[2rem] font-style-2 font-dmsans border-2 border-black" />
                      <div className="absolute inset-0 flex items-center justify-center font-style-3-vote font-jakarta text-xs sm:text-sm dark:text-black">
                        {optionKey}<span className="ml-[1rem] text-blue-500">{`${progressValue.toFixed(1)}% Votes`}</span>
                      </div>
                    </div>
                    <div className="w-24 min-w-[96px]">
                      {(user.userType == UserType.Guest) ? (
                        <Button className="w-full rounded-3xl font-style-3-vote font-jakarta border-2 text-center border-black h-[2rem] bg-transparent dark:text-white hover:text-black text-black hover:bg-[#e4dcdc] text-xs dark:hover:bg-gray-800" onClick={() => {
                          toast({
                            title: "Sign in to Vote",
                            variant: "destructive",
                          });
                        }}>Vote</Button>
                      ) : (
                        <Button className={`w-full rounded-3xl border-2 font-style-3-vote font-jakarta text-center text-white hover:text-white border-black h-[2rem] ${userVote == optionKey ? "bg-gray-300 text-black hover:text-black hover:text-md" : "bg-transparent text-black dark:text-white hover:text-black hover:bg-[#e4dcdc] dark:hover:bg-gray-800"} text-xs `} onClick={() => handleVote(optionKey)}>Vote</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
              )}
            </div>
            <div className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-6 items-center justify-center">
              <button className=" w-fit flex items-center gap-2">
                <ShareDialog postLink={`/${post?.id}`} />
              </button>
              <button className="w-fit flex items-center gap-2" onClick={handleSave}>
                <Bookmark className={`h-4 w-4 ${savedState ? "text-black fill-black" : ""}`} />
                <span className="hidden sm:block text-black dark:text-white">
                  {savedState ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
          <div className="rounded-b-md bg-[#e7e7e7] dark:bg-[#1A1A1B]/65 z-20 flex flex-col sm:flex-row gap-3 text-sm px-3 py-3 sm:px-6">
            <PostVoteClientPhone postId={post.id} postType={post.options != null ? "polls" : "questions"} userId={user?.uid!} />
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
              <Link href={`/${isPoll ? `poll/${post?.id}` : (post?.id)}`} className="w-fit flex items-center gap-2">
                <MessageSquare className="h-4 w-4 postvotec" />
                <span className="font-style-4 font-dmsans postvotec text-black dark:text-white">
                  {post.comments} Answers
                </span>
              </Link>
              <div className="flex justify-between sm:justify-center gap-3 items-center">
                <div className="text-xs sm:text-sm">Posted on: {dateString}</div>
                {isProfile && !othersProfile && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-fit flex items-center gap-2">
                        <AiTwotoneDelete className="text-xl" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your post and remove the data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={HandleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Post;