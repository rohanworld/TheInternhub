"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import MentorProfileBox from './mentorProfile';
import FilterSystem from '@/components/FilterSystem';
import Loader from '@/components/ui/Loader';

const Mentors = () => {
  const [mentorsData, setMentorsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 8;  // Number of mentors per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);  // Total number of pages

  // Fetch mentors data from Firestore
  useEffect(() => {
    const fetchMentorsData = async () => {
      const collectionRef = collection(db, 'mentors');
      const querySnapshot = await getDocs(collectionRef);
      
      const mentorsArray: any[] = [];
      querySnapshot.forEach((doc) => {
        mentorsArray.push({ id: doc.id, ...doc.data() });
      });

      setMentorsData(mentorsArray);
      setFilteredData(mentorsArray);
      setTotalPages(Math.ceil(mentorsArray.length / itemsPerPage)); // Set total pages initially
      setLoading(false);
    };
    fetchMentorsData();
  }, []);

  // Filter the data and reset pagination
  const handleFilterChange = (activeFilters: any[]) => {
    if (activeFilters.length === 1 && activeFilters[0] === '') {
      setFilteredData(mentorsData);
    } else {
      const filtered = mentorsData.filter((mentor) =>
        activeFilters.some((filter: any) => mentor.expertise.includes(filter))
      );
      setFilteredData(filtered);
    }

    setCurrentPage(1);  // Reset to the first page after filtering
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));  // Recalculate total pages
  };

  // Get the mentors data for the current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Handle page click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className='px-6 md:px-16'>
        <FilterSystem pathname={'/Mentors'} onFilterChange={handleFilterChange} />
      </div>
      <div className="px-6 mt-[1rem] md:px-16 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.length > 0 ? (
          getCurrentPageData().map((mentor: { id: React.Key | null | undefined; photoURL: string | undefined; name: string; expertise: string[]; experience: number; }) => (
            <MentorProfileBox
              key={mentor.id}
              id={String(mentor.id)}
              imageSrc={mentor.photoURL}
              name={mentor.name}
              expertise={mentor.expertise}
              experience={mentor.experience}
            />
          ))
        ) : (
          <div className="text-center text-2xl font-semibold dark:text-white">
            {loading ? <Loader /> : "No Mentors Found"}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`px-4 py-2 mx-1 font-semibold ${
              currentPage === pageNumber ? 'bg-blue-500 dark:bg-blue-700 text-white' : 'bg-gray-300 dark:bg-blue-950'
            } rounded`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Mentors;
