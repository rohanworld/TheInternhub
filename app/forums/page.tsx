'use client';
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserType } from "@/store/slice";
const Filters = ["Most Recent", "Popular", "Most Viewed"];

const Page = () => {
  const [forums, setForums] = useState<any[]>([]);
  const [filteredForums, setFilteredForums] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const user = useSelector((state: RootState) => state.user);
  // const [user, loading] = useAuthState(auth);
  const { toast } = useToast();

  // Fetch forums from Firestore
  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(db, "forums");
        const forumsSnapshot = await getDocs(forumsCollection);

        const forumsData: any[] = [];
        forumsSnapshot.forEach((doc) => {
          const forumDetails = {
            uniqueForumName: doc.data().uniqueForumName,
            title: doc.data().name,
            noOfMembers: doc.data().noOfMembers,
            description: doc.data().description,
            imageURL: doc.data().imageURL,
            numOfPosts: doc.data().numOfPosts,
            lastPosted: doc.data().lastPosted,
          };
          forumsData.push(forumDetails);
        });

        setForums(forumsData);
        setFilteredForums(forumsData); // Initialize filteredForums with all forums
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, []);

  // Function to calculate time difference for "Last Posted"
  function calculateTimeDifference(lastPosted: Timestamp): string {
    const postedDate = lastPosted.toDate();
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - postedDate.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays} days`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours} hours`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes} minutes`;
    } else if (differenceInSeconds > 0) {
      return `${differenceInSeconds} seconds`;
    } else {
      return 'just now';
    }
  }

  // Apply selected filter to forums
  useEffect(() => {
    let sortedForums = [...forums];

    if (selectedFilter === "Most Recent") {
      sortedForums.sort((a, b) => b.lastPosted?.toDate() - a.lastPosted?.toDate());
    } else if (selectedFilter === "Popular") {
      sortedForums.sort((a, b) => b.noOfMembers - a.noOfMembers);
    } else if (selectedFilter === "Most Viewed") {
      sortedForums.sort((a, b) => b.numOfPosts - a.numOfPosts);
    }

    setFilteredForums(sortedForums);
  }, [selectedFilter, forums]);

  const handleFilterChange = (activeFilters: string[]) => {
    let filtered = [...forums];

    // Handle "Most Recent" separately if it's a default view
    if (activeFilters.includes("Most Recent")) {
      filtered.sort((a, b) => b.lastPosted?.toDate() - a.lastPosted?.toDate());
    }

    // Apply "Popular" filter
    if (activeFilters.includes("Popular")) {
      filtered = filtered.filter(forum => forum.noOfMembers >= 100);
    }

    // Apply "Most Viewed" filter
    if (activeFilters.includes("Most Viewed")) {
      filtered = filtered.filter(forum => forum.numOfPosts >= 50);
    }

    // If no filters are selected, reset to all forums
    if (activeFilters.length === 0) {
      filtered = forums;
    }

    setFilteredForums(filtered);
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = forums.filter(forum =>
      forum.title.toLowerCase().includes(query) ||
      forum.description.toLowerCase().includes(query)
    );
    setFilteredForums(filtered);
  };

  return (
    <div className="dark:text-white py-5 min-h-screen items-center justify-center">
      <div className="flex flex-col p-4 md:px-14 pb-14 mx-4 md:mx-12 rounded-lg text-black dark:text-white">
        <header>
          <h2 className='text-[44px] font-semibold'>Forums</h2>
          <p className="text-black dark:text-gray-300 text-base">
          Forums provide a platform for students to discuss internship opportunities, share experiences, and seek advice from peers. Users can engage in conversations about application tips, interview experiences, and industry trends.
          </p>
        </header>
        {/* <header>
          <h1 className="text-4xl font-bold text-black dark:text-white pt-2">Forums</h1>
          <p className="text-black dark:text-gray-300 pt-3">
            Discuss, ask questions and collaborate with peers and mentors.
          </p>

          
          <div className="bg-transparent dark:bg-transparent font-jakarta text-lg md:text-xl mb-4 px-1 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-black dark:text-gray-300">
            <p> This is a Forum Description
              A forum is a place where you can ask questions, share your experiences,brainstorm ideas, discuss topics of mutual interest and collaborate with peers and mentors.
            </p>
          </div>
        </header> */}

        {/* <div className="py-2 pb-8">
          <Suspense fallback={<div>Loading...</div>}>
            <FilterSystem pathname="Forum" onFilterChange={handleFilterChange} />
          </Suspense>
        </div> */}
        <div className="mt-4">
          <Suspense>
          <div className="flex flex-col lg:flex-row justify-between pr-1 gap-3">
            <div className="flex flex-col">
              <h3 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text text-2xl font-semibold mb-4">Filter by</h3>
              <div className="flex gap-4 mb-4 ">
                {Filters.map((filter, index) => (
                  <div
                    key={index}
                    className={`btn rounded-full w-auto border-black  
                      bg-selected-button-gradient-light text-black
                      dark:bg-selected-button-gradient-dark dark:text-white dark:border-white 
                      hover:bg-custom-button-gradient-light 
                        
                       flex items-center justify-center cursor-pointer`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 mb-6 bg-gradient-custom text-white flex items-center justify-center w-48 font-semibold rounded-md cursor-pointer">
              {user.userType === UserType.Guest ? (
                <div
                  onClick={() => {
                    toast({
                      title: "Login to Create Forum",
                      description: "You need to login to create forum",
                    });
                  }}
                >
                  <span>Create New Forum</span>
                </div>
              ) : (
                <Link href="/createForum">
                  <span>Create New Forum</span>
                </Link>
              )}
            </div>
          </div>
          </Suspense>

          <div className="flex w-full lg:w-3/5 mb-6">
            <label className="input input-md flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full py-1 px-2 flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="#000"
                className="h-4 w-4 opacity-70 text-black dark:text-white ml-2"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="placeholder-black dark:placeholder-gray-300 font-semibold w-full text-black dark:text-white border-black dark:border-gray-700 py-1 px-2 rounded-full"
                placeholder="Search for Forums"
                value={searchQuery} // Bind search query state to input field
                onChange={handleSearch} // Trigger search on input change
              />
            </label>
          </div>

          <div className="w-full lg:w-4/5 max-h-min rounded-lg border-2  border-[#d9d9d9] dark:border-gray-700 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-4 px-7 text-left text-black dark:text-white">Forum</th>
                  <th className="py-4 px-7 text-left text-black dark:text-white">Members</th>
                  <th className="py-4 px-7 text-left text-black dark:text-white">Posts</th>
                  <th className="py-4 px-7 text-left text-black dark:text-white">Last Posted</th>
                </tr>
              </thead>
              <tbody>
                {filteredForums.length > 0 ? (
                  filteredForums.map((forum, index) => (
                    <tr key={index} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 overflow-scroll">
                      <td className="py-4 px-7">
                        <Link href={`/forums/${forum.uniqueForumName}`} className="text-black dark:text-white">
                          {forum.title}
                        </Link>
                      </td>
                      <td className="py-4 px-7">
                        <Link href={`/forums/${forum.uniqueForumName}`} className="text-black dark:text-white">
                          {forum.noOfMembers}
                        </Link>
                      </td>
                      <td className="py-4 px-7">
                        <Link href={`/forums/${forum.uniqueForumName}`} className="text-black dark:text-white">
                          {!forum.numOfPosts ? "0" : forum.numOfPosts}
                        </Link>
                      </td>
                      <td className="py-4 px-7">
                        <Link href={`/forums/${forum.uniqueForumName}`} className="text-black dark:text-white">
                          {!forum.lastPosted ? "No posts" : calculateTimeDifference(forum.lastPosted) + " ago"}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

