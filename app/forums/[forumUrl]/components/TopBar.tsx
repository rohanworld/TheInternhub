// import Link from 'next/link';
// import React from 'react';
// interface ForumName{
//   name:string;
// }

// const TopBar = ({ Name,Description }:any) => {
//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 md:px-14 ">
//       <div className="flex-grow text-center md:text-left">
//         <h1 className="text-[2rem] md:text-2xl text-black font-bold">
//           {Name}
//         </h1>
//         <p className="text-gray-500 mt-2 md:mt-1 mx-4 md:mx-0">
//           {Description}
//         </p>
//       </div>
      
//     </div>
//   );
// };

// export default TopBar;





// Dark Mode
import React from 'react';

interface ForumName {
  name: string;
}

const TopBar = ({ Name, Description }: any) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 md:px-14">
      <div className="flex-grow text-center md:text-left">
        <h1 className="text-[2rem] md:text-2xl text-black dark:text-white font-bold">
          {Name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 md:mt-1 mx-4 md:mx-0">
          {Description}
        </p>
      </div>
    </div>
  );
};

export default TopBar;
