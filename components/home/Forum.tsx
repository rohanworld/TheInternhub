// components/ForumCard.tsx

import Link from "next/link";
import { useState } from "react";
const forums = [
  "Internship Opportunities",
  "Training Programs",
  "Application Tips",
  "Support",
  "Off-Topic",
  "Events",
  "Job Postings",
];
interface ForumCardProps {
  onSelect: (selectedForum: string) => void;
}


const ForumCard = () => {
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const handleClick = (forum: string) => {
    setSelectedForum(forum);
   
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-bold text-[#848484]">Forums</h2>
      </div>
      <div className="h-48 overflow-y-auto">
        <ul className="divide-y divide-gray-200 text-[#848484]">
          {forums.map((forum, index) => (
            <Link
            
            key={forum}
            className={`p-4 cursor-pointer flex
            ${selectedForum === forum ? "bg-[#E4E4E4] rounded-lg " : ""}`}
            
            href={`/Forum/${forum}`}
          >
            {forum}
          </Link>
          //   <Link href={{
             
          //     pathname:'/',
          //    query: { forum },

          //  }}>
           
          //   {forum}
          
          // </Link>
            
            // <li
            //   key={index}
            //   className={`p-4 cursor-pointer ${
            //     selectedForum === forum ? "bg-[#E4E4E4] rounded-lg " : ""
            //   }`}
            //   onClick={() => handleSelect(forum)}
            // >
            //  <link
            //  href={{
            //   pathname: '/',
            //   query: { name: 'test' },
            // }}
            //  >{forum}</link>
            // </li>
            
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ForumCard;
