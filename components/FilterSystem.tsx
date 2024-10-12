
"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

interface FilterSystemProps {
  pathname: string;
  onFilterChange: (filters: string[]) => void;
}

const FilterSystem: React.FC<FilterSystemProps> = ({ pathname, onFilterChange }) => {
  const params = useSearchParams();
  const active = params.get("filter") || "";

  const filters = [
    "Frontend Developer", "Data & Analytics", "Data Scientist", "Consulting", "ML Engineer", 
    "Customer Service", "Backend Developer", "DevOps", "Education", "Finance", 
    "Full Stack Developer", "Marketing", "Product Management"
  ];

  const toggleMultipleQuery = (key: string, value: string) => {
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    if (values.includes(value)) {
      values = values.filter(v => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }
    return query;
  }

  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(active.split(","));
      console.log("Filter changed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="mb-1 pt-5 flex flex-wrap justify-center md:justify-start">
      {filters.map(filter => {
        const isActive = active.split(",").includes(filter);
        return (
          
          <Link
            key={filter}
            className={`py-1 mx-1 my-1 px-3 font-semibold rounded-full border transition-colors duration-300 
            ${isActive ? 
              'bg-selected-button-gradient-light text-black border-black dark:bg-selected-button-gradient-dark dark:text-white dark:border-white' : 
              'bg-custom-button-gradient-light  text-gray-600 hover:bg-black dark:bg-custom-button-gradient-dark dark:text-gray-300 dark:border-gray-800'
            }`}
            href={{
              pathname: pathname,
              query: toggleMultipleQuery("filter", filter),
            }}
          >
            {filter}
          </Link>
          
        );
      })}
    </div>
  );
}

export default FilterSystem;
