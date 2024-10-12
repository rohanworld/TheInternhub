"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchByMentorName } from '@/utils/firebaseQueries'; // Assume this function exists
import { debounce } from 'lodash';
import { selectUser, UserType } from '@/store/slice';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const TopDetails = () => {

  const user = useSelector(selectUser);

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const searchRef = useRef(null);

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const debouncedSearch = debounce(async (term) => {
    if (term.trim() !== "") {
      const searchResults = await searchByMentorName(term); // Assuming a similar function as students
      setResults(searchResults);
      setIsListVisible(true);
    } else {
      setResults([]);
      setIsListVisible(false);
    }
  }, 300);
  
  const goToProfile = (mentorId) => {
    router.push(`/Mentors/${mentorId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <div className="px-6 md:px-16 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-2/3 lg:w-2/4 mb-4 md:mb-0">
          <h2 className="text-[44px] font-semibold">Find a Mentor</h2>
          <p className="text-black dark:text-gray-300 text-base mb-5">
            Connect with industry experts for personalized guidance, career advice, and mentorship to help you achieve your professional goals.
          </p>

          <div ref={searchRef} className="relative w-full">
            <label className="input input-md flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full py-1 px-2 flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
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
                className="flex-1 text-black dark:text-gray-100 border-none p-2 rounded-full bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search for Mentors"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsListVisible(true)}
              />
            </label>

            {isListVisible && results.length > 0 ? (
              <ul className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {results.map((mentor) => (
                  <li
                    key={mentor.id}
                    onClick={() => goToProfile(mentor.id)}
                    className="cursor-pointer p-3 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <p className="text-black dark:text-white font-semibold">{mentor.name}</p>
                    {mentor.expertise && <p className="text-gray-500 dark:text-gray-400 text-sm">{mentor.expertise.join(" | ")}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm.trim() && isListVisible && (
                <ul className="absolute z-10 p-5 w-full bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  No results found
                </ul>
              )
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/3 bg-white dark:bg-gray-800 p-4 border border-white dark:border-gray-700 rounded-xl">
          {!user ? (
            // Render a placeholder or loading state until the user object is available
            <p>Loading...</p>
          ) : (
            <>
              {/* {user.userType === UserType.Guest ? (
                <Link href="/auth/signup/organizationSignUp" className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-black dark:text-white bg-clip-text text-2xl font-semibold mb-2">
                  Be a Mentor
                </Link>
              ) : (
                
              )} */}
              <h3 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text font-normal text-2xl mb-2">
                Be a Mentor
              </h3>
              <p className="text-black dark:text-gray-300 mb-4">
                Share your expertise, guide aspiring professionals, and make a lasting impact on the next generation of talent.
              </p>
            </>
          )}
        </div>


      </div>
    </div>
  );
};

export default TopDetails;
