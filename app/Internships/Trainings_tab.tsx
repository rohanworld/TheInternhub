"use client";

import FilterSystem from '@/components/FilterSystem';
import React, { useEffect, useState } from 'react';
import TrainingsBox from './TrainingsBox';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Loader from '@/components/ui/Loader';

const Trainings_tab: React.FC = () => {
  const [TrainingData, setTrainingData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const itemsPerPage = 4;  // Number of trainings per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);  // Total number of pages

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, 'trainings');
      const querySnapshot = await getDocs(collectionRef);

      const trainingsArray: any[] = []; // Temporary array to hold the documents

      querySnapshot.forEach((doc) => {
        trainingsArray.push({ id: doc.id, ...doc.data() }); // Add each document to the array
      });

      setTrainingData(trainingsArray); // Update state with the accumulated array
      setFilteredData(trainingsArray); // Initialize filtered data with all trainings
      setLoading(false);
    };
    fetchData();
  }, []);

  // Recalculate total pages when filteredData changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData]);

  const handleFilterChange = (activeFilters: any[]) => {
    if (activeFilters.length === 1 && activeFilters[0] === '') {
      setFilteredData(TrainingData);
    } else {
      const filtered = TrainingData.filter((training) =>
        activeFilters.some((filter: any) => training.category.includes(filter))
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);  // Reset to the first page after filtering
  };

  // Get trainings data for the current page
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
            getCurrentPageData().map((training) => (
              <TrainingsBox
                key={training.id}
                id={training.id}
                category={training.category}
                TrainingsName={training.title}
                imageUrl={training.profilePic}
                duration={training.duration}
                location={training.location}
                description={training.description}
              />
            ))
          ) : (
            <div className="text-center text-2xl font-extralight dark:text-white">
              {loading ? <Loader /> : "No Trainings Found"}
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

export default Trainings_tab;
