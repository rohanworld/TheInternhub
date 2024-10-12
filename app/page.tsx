"use client";

import React, { useEffect, useState, Suspense } from "react";
import CustomFeed from "@/components/CustomFeed";
import Loader from "@/components/ui/Loader";
import { db } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Sidebar } from "@/components/DesktopSidebar";
import { loadUserFromLocalStorage, UserType } from "@/store/slice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const router = useRouter();
  const [newPost, setNewPost] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState<string>(user?.name || "loading...");

  useEffect(() => {
    // Load user from localStorage when the app starts
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const NotificationRef = collection(db, "users", user.uid, "notifications");

        const userDoc = await getDoc(userRef);
        const notData = await getDocs(NotificationRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const realName = userData?.name;

          setName(realName || "loading...");
        }
      }
      setLoading(false);
    };

    fetchFollowersAndFollowing();
  }, [user?.uid]);


  if (loading) {
    return (
      <div className="w-[10%] items-center justify-center flex mx-auto md:container md:max-w-7xl md:mx-auto">
        <Loader />
      </div>
    );
  } else {
    return (
      <Suspense>
        <div className="px-3 md:px-6 pt-8">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/5 md:sticky top-20 md:h-screen md:overflow-y-auto">
              <Sidebar playlists={[]} />
            </div>

            {/* Content Area */}
            <div className="w-full md:w-2/3 lg:w-4/5 rounded-lg overflow-y-auto">
              <CustomFeed newPost={newPost} />
            </div>
          </div>
        </div>

      </Suspense>
    );
  }
}
