"use client";
import React, { useEffect, useRef, useState } from 'react';
import Trainings_tab from './Trainings_tab';
import Internship_tab from './Internship_tab';
import { searchInternships, searchTrainings } from '@/utils/firebaseQueries';
import { debounce } from 'lodash';
import Link from 'next/link';

const Top = () => {
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
      const internshipResults = await searchInternships(term);
      const trainingResults = await searchTrainings(term);

      const combinedResults = [
        ...internshipResults.map(result => ({ ...result, type: 'Internship' })),
        ...trainingResults.map(result => ({ ...result, type: 'Training' })),
      ];

      setResults(combinedResults);
      setIsListVisible(true);
    } else {
      setResults([]);
      setIsListVisible(false);
    }
  }, 300);

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
    <>
      <div className=''>
        <div className="flex flex-col lg:flex-row justify-between w-full">
          <div className=''>
            <h2 className='text-[44px] font-semibold'>
              Discover Internships and Trainings
            </h2>
            <p className="text-black dark:text-gray-300 text-base lg:w-5/6">
              Explore a variety of internships and training programs designed to provide hands-on experience and boost your skills. Connect with top companies and embark on your path to career success.
            </p>
          </div>

          <div className="lg:w-1/2 py-5 relative" ref={searchRef}>
            <label className="input input-md flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full p-2 flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 text-black dark:text-white">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd" />
              </svg>
              <input 
                type="text" 
                className="flex-1 text-black dark:text-gray-100 border-none p-2 rounded-full bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                placeholder="Search here" 
                onChange={handleSearch}
                onFocus={() => setIsListVisible(true)}
              />
            </label>

            {isListVisible && results.length > 0 && (
              <div className="absolute z-10 right-0 top-12 w-full  mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((item) => (
                    <Link href={`/Internships/${item.id}`} key={item.id}>
                      <li
                        className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <p className="text-black dark:text-white font-semibold">{item.title}</p>
                        <div className="flex justify-between text-sm">
                          <p className="text-gray-500 dark:text-gray-400">{item.type}</p>
                          <p className="text-gray-500 dark:text-gray-400">{item.location}</p>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <p className="text-gray-500 dark:text-gray-400">Stipend: {item.stipend}</p>
                          <p className="text-gray-500 dark:text-gray-400">Duration: {item.duration}</p>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.category.join(' | ')}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div role="tablist" className="tabs tabs-bordered pt-5">
          <input 
            type="radio" 
            name="my_tabs_1" 
            role="tab" 
            className="tab text-black dark:text-white text-lg" 
            aria-label="Internships" 
            defaultChecked 
          />
          <div role="tabpanel" className="tab-content">
            <Internship_tab />
          </div>
          
          <input 
            type="radio" 
            name="my_tabs_1" 
            role="tab" 
            className="tab text-black dark:text-white text-lg" 
            aria-label="Trainings" 
          />
          <div role="tabpanel" className="tab-content">
            <Trainings_tab />
          </div>
        </div>
      </div>
    </>
  );
}

export default Top;
