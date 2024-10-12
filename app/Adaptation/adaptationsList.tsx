"use client";

import React, { useState, useEffect } from 'react';
import MentorProfileBox from './adaptationProfile';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from '@/utils/firebase';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FilterSystem from '@/components/FilterSystem';

interface Student {
  id: any;
  name: string;
  college: string;
  resumeURL?: string;
  photoURL?: string;
  skills: string[];
}

const Students = () => {
  const [adaptationData, setAdaptationData] = useState<Student[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  
  const searchText = useSelector((state: RootState) => state.adaptationSearch);

  useEffect(() => {
    console.log("T: ", searchText);
  }, [searchText]);

  const fetchMentors = async () => {
    setLoading(true);

    const q = query(
      collection(db, "adaptation-list"),
      orderBy("name")
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map(doc => {
      const docData = doc.data() as Student;
      return {
        id: doc.id,
        name: docData.name ?? 'Unknown Name',
        college: docData.college,
        resumeURL: docData.resumeURL,
        photoURL: docData.photoURL,
        skills: docData.skills,
      };
    });

    setAdaptationData(data);
    setFilteredData(data);
    
    // Set total pages based on the full data initially
    setTotalPages(Math.ceil(data.length / itemsPerPage));
    
    setLoading(false);
  };

  useEffect(() => {
    fetchMentors(); // Initial load
  }, []);

  const handleFilterChange = (activeFilters: any[]) => {
    let filtered: Student[] = [];

    if (activeFilters.length === 1 && activeFilters[0] === '') {
      filtered = adaptationData;
    } else {
      filtered = adaptationData.filter((student) =>
        activeFilters.some((filter: any) => student.skills.includes(filter))
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
    setTotalPages(Math.ceil(filtered.length / itemsPerPage)); // Recalculate total pages after filtering
  };

  // Get students for the current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='px-6 md:px-16'>
      <FilterSystem pathname="/Adaptation" onFilterChange={handleFilterChange} />
      <div className="mt-[1rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.length === 0 && !loading && (
          <div className=" text-xl font-extralight dark:text-white">
            No students match the filters applied.
          </div>
        )}

        {getCurrentPageData().map(student => (
          <MentorProfileBox
            key={student.id}
            id={student.id}
            name={student.name}
            college={student.college}
            resume={student.resumeURL}
            imageSrc={student.photoURL}
            skills={student.skills}
          />
        ))}
        {loading && <div className='mt-[1rem] text-center text-xl font-bold dark:text-white'>Loading...</div>}
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

export default Students;
