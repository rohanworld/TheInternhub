// // "use client";
// // import React from 'react';

// // const LeftBoxes = () => {
// //   return (
// //     <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 xl:w-1/5 py-4 sm:py-6 mx-auto sm:mx-4 lg:mx-12 space-y-4">
// //       <div className=" bg-white text-black p-4 shadow-md rounded-md">
// //         <h2 className="text-base sm:text-lg font-bold">1.5K members</h2>
// //         <p className="text-sm sm:text-base">Over 1000 members are interested in this forum and looking for opportunities</p>
// //       </div>
// //       <div className="bg-white p-4 text-black shadow-md rounded-md">
// //         <h2 className="text-base sm:text-lg font-bold">60 posts</h2>
// //         <p className="text-sm sm:text-base">Join the conversation and share your thoughts, find insights from professionals</p>
// //       </div>
// //       <div className="bg-white p-4 text-black shadow-md rounded-md">
// //         <h2 className="text-base sm:text-lg font-bold">Interested</h2>
// //         <ul className="text-sm sm:text-base space-y-2">
// //           <li>• Lorem</li>
// //           <li>• Ipsum</li>
// //           <li>• Amet</li>
// //           <li>• Amet</li>
// //           <li>• Amet</li>
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LeftBoxes;

// "use client";
// import React from "react";

// const LeftBoxes = ({ Members, Posts }: any) => {
//   return (
//     <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 xl:w-1/5 mx-auto sm:mx-4 lg:mx-12 space-y-4">
//       <div className="bg-white text-black p-4 shadow-md rounded-md">
//         <h2 className="text-base sm:text-lg font-bold">{Members} members</h2>
//         <p className="text-sm sm:text-base">
//           Over 1000 members are interested in this forum and looking for
//           opportunities
//         </p>
//       </div>
//       <div className="bg-white p-4 text-black shadow-md rounded-md">
//         <h2 className="text-base sm:text-lg font-bold">{Posts} posts</h2>
//         <p className="text-sm sm:text-base">
//           Join the conversation and share your thoughts, find insights from
//           professionals
//         </p>
//       </div>
//       {/* <div className="bg-white p-4 text-black shadow-md rounded-md">
//         <h2 className="text-base sm:text-lg font-bold">Interested</h2>
//         <ul className="text-sm sm:text-base space-y-2">
//           <fieldset>
//             <legend className="sr-only">Checkboxes</legend>

//             <div className="space-y-2">
//               <label className="flex cursor-pointer items-start gap-4 rounded-lg border  p-4 transition hover:bg-gray-50 has-[:checked]:bg-blue-50">
//                 <div className="flex items-center">
//                   ​
//                   <input
//                     id="Option1"
//                     className="size-4  border-gray-300  rounded "
//                     type="checkbox"
//                   />
//                 </div>

//                 <div>
//                   <strong className="font-medium text-gray-900"> Lorem</strong>
//                 </div>
//               </label>

//               <label className="flex cursor-pointer items-start gap-4 rounded border border-gray-200 p-4 transition hover:bg-gray-50 has-[:checked]:bg-blue-50">
//                 <div className="flex items-center">
//                   ​
//                   <input
//                     id="Option2"
//                     className="size-4  border-gray-300  rounded"
//                     type="checkbox"
//                   />
//                 </div>

//                 <div>
//                   <strong className="font-medium text-gray-900"> Ipsum </strong>
//                 </div>
//               </label>

//               <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 has-[:checked]:bg-blue-50">
//                 <div className="flex items-center">
//                   ​
//                   <input
//                     id="Option3"
//                     className="size-4 rounded border-gray-300 "
//                     type="checkbox"
//                   />
//                 </div>

//                 <div>
//                   <strong className="text-pretty font-medium text-gray-900">
//                     amet
//                   </strong>
//                 </div>
//               </label>
              
//             </div>
//           </fieldset>
//         </ul>
       
        

//       </div> */}
//     </div>
//   );
// };

// export default LeftBoxes;































// Dark Mode
"use client";
import React from "react";

const LeftBoxes = ({ Members, Posts }: any) => {
  return (
    <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 xl:w-1/5 mx-auto sm:mx-4 lg:mx-12 space-y-4">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 shadow-md rounded-md">
        <h2 className="text-base sm:text-lg font-bold">{Members} members</h2>
        <p className="text-sm sm:text-base">
          Over 1000 members are interested in this forum and looking for
          opportunities
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 text-black dark:text-white shadow-md rounded-md">
        <h2 className="text-base sm:text-lg font-bold">{Posts} posts</h2>
        <p className="text-sm sm:text-base">
          Join the conversation and share your thoughts, find insights from
          professionals
        </p>
      </div>
    </div>
  );
};

export default LeftBoxes;
