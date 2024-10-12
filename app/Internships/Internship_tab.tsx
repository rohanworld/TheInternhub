"use client"

import FilterSystem from '@/components/FilterSystem';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { getDocs, collection } from 'firebase/firestore';
import InternshipBox from './InternshipBox';
import Loader from '@/components/ui/Loader';
import parse from 'html-react-parser';

const Internship_tab: React.FC = () => {

  const [Interndata, setInternData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const itemsPerPage = 4;  // Number of internships per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);  // Total number of pages

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, 'internships');
      const querySnapshot = await getDocs(collectionRef);
      
      const internshipsArray: any[] = [];

      querySnapshot.forEach((doc) => {
        internshipsArray.push({ id: doc.id, ...doc.data() });
      });

      setInternData(internshipsArray);
      setFilteredData(internshipsArray);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Recalculate total pages when filteredData changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData]);

  // Handle filter changes
  const handleFilterChange = (activeFilters: any[]) => {
    if (activeFilters.length === 1 && activeFilters[0] === '') {
      // If all filters are cleared, show all internships
      setFilteredData(Interndata);
    } else {
      const filtered = Interndata.filter((intern) =>
        activeFilters.some((filter: any) => intern.category.includes(filter))
      );
      setFilteredData(filtered);
    }

    setCurrentPage(1);  // Reset to the first page after filtering
  };

  // Get internships data for the current page
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
    <>
      <div className="flex-row">
        <FilterSystem
          pathname="Internships"
          onFilterChange={handleFilterChange}
        />
        <div className="w-full min-h-screen rounded-lg text-black dark:text-white">
          {filteredData.length > 0 ? (
            getCurrentPageData().map((internship) => (
              <InternshipBox
                key={internship.id}
                id={internship.id}
                category={internship.category}
                internshipName={internship.title}
                imageUrl={internship.profilePic}
                stipend={internship.stipend}
                duration={internship.duration}
                location={internship.location}
                description={internship.description}
              />
            ))
          ) : (
            <div className="text-center text-2xl font-extralight dark:text-white">
              {loading ? <Loader /> : "No Internships Found"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>
    </>
  );
};

export default Internship_tab;
