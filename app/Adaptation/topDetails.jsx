"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchByCollegeOrName } from '@/utils/firebaseQueries';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectUser, UserType } from '@/store/slice';

const TopDetails = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const searchRef = useRef(null);

  const debouncedSearch = debounce(async (term) => {
    if (term.trim() !== "") {
      const searchResults = await searchByCollegeOrName(term);
      setResults(searchResults);
    } else {
      setResults([]);
    }
    setIsListVisible(term.trim() !== ""); // Ensure visibility matches search term
  }, 300);

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
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
          <h2 className='text-[44px] font-semibold mb-2'>Adaptation List</h2>
          <p className="text-black dark:text-gray-300 text-base mb-5">
            Showcase your skills and projects to connect with mentors for academic and career guidance.
          </p>

          <div ref={searchRef} className="relative w-full">
            <label className="input input-md flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full py-1 px-2 flex-1">
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
                className="flex-1 text-black dark:text-gray-100 border-none p-2 rounded-full bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search for Students"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsListVisible(true)}
              />
            </label>

            {isListVisible && results.length > 0 ? (
              <ul className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {results.map((student) => (
                  <li
                    key={student.id}
                    onClick={() => goToProfile(student.id)}
                    className="cursor-pointer p-3 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <p className="text-black dark:text-white font-semibold">{student.name}</p>
                    {student.college && <p className="text-gray-500 dark:text-gray-400 text-sm">{student.college}</p>}
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
        <div className="w-full md:w-1/3 lg:w-1/3 bg-white dark:bg-gray-800 p-4 border border-white dark:border-gray-600 rounded-xl">
        {/* {user.userType == UserType.Guest ? (
            <Link href={'/auth/signup/studentSignUp'} className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text text-2xl font-semibold mb-2">List Your Profile</Link>
          ):(
            <h3 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text text-2x font-semibold mb-2">List Your Profile</h3>
          )} */}
          <h3 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text text-2xl font-normal mb-2">List Your Profile</h3>
          <p className="text-black dark:text-gray-300 mb-4">
            Highlight your skills and projects to connect with mentors for guidance and career development.
          </p>

          {/* <Link
            href="/Adaptation/ListMyProfile"
            className="font-bold inline-block md:w-2/3 lg:w-2/4 max-w-xs text-center bg-white dark:bg-gray-700 text-black dark:text-white border-2 border-black dark:border-gray-500 py-2 px-4 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Register
          </Link> */}

        </div>
      </div>

      
    </div>
  );
};


export default TopDetails;
