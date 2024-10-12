// import React from 'react';

// const TopBar = () => {
//   return (
//     <div className="flex justify-between items-center py-4 px-14">
//       <div className="flex-grow">
//         <h1 className="text-2xl text-black font-bold">Internship Opportunities</h1>
//         <p className="text-gray-500 w-3/5">
//           Explore and apply for exciting internships, connect with companies, and collaborate on real-world projects. Kickstart your career journey now!
//         </p>
//       </div>
//       <button className="bg-gray-200 hover:bg-black mx-8 hover:text-white border border-black text-black font-bold py-2 px-4 rounded">
//         Post
//       </button>
//     </div>
//   );
// };

// export default TopBar;




import React from 'react';

const TopBar = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 md:px-14">
      <div className="flex-grow text-center md:text-left">
        <h1 className="text-xl md:text-2xl text-black font-bold">
          Internship Opportunities
        </h1>
        <p className="text-gray-500 mt-2 md:mt-1 mx-4 md:mx-0">
          Explore and apply for exciting internships, connect with companies, and collaborate on real-world projects. Kickstart your career journey now!
        </p>
      </div>
      <button className="bg-gray-200 hover:bg-black hover:text-white border border-black text-black font-bold py-2 px-4 rounded mt-4 md:mt-0">
        Post
      </button>
    </div>
  );
};

export default TopBar;
