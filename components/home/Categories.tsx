"use client";
import { useState, useEffect } from "react";

const jobPositions = [
  "All",
  "Health",
  "Finance",
  "Marketing",
  "Technology",
  "Education",
  "Engineering",
  "Sales",
  "Human Resources",
  "Customer Service",
  "Legal",
  "Operations",
  "Product Management",
  "Consulting",
  "Arts & Design",
  "Data & Analytics",
  "Supply Chain",
  "Hospitality",
  "Construction",
  "Retail",
  "Real Estate",
];

interface JobSearchCardProps {
  onSelect: (job: string) => void;
}

const JobSearchCard = ({ onSelect }: JobSearchCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");

  useEffect(() => {
    onSelect(selectedPosition);
  }, [selectedPosition, onSelect]);

  const filteredPositions = jobPositions.filter((position) =>
    position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full  bg-[#FDFDFD] shadow-lg rounded-lg overflow-hidden ">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#848484]">Categories</h2>
        <div className="relative pb-2">
          <input
            placeholder="Search..."
            className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-[100%] transition-all focus: outline-none bg-[#E4E4E4] text-[#848484]"
            name="search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="size-6 absolute top-3 right-3 text-[#848484]"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="/search-icon.svg"
          >
            <path
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </div>

        <div className="h-60 overflow-y-scroll">
          <ul className="list-none p-0">
            {filteredPositions.length > 0 ? (
              filteredPositions.map((position, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer ${
                    selectedPosition === position
                      ? "bg-[#E4E4E4] text-[#848484]  rounded-lg"
                      : "bg-white text-[#848484]"
                  }`}
                  onClick={() => setSelectedPosition(position)}
                >
                  {position}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No job positions found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobSearchCard;
