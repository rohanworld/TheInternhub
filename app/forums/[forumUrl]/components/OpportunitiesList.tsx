// "use client";
// import React from 'react';
// import Opportunity from './Opportunity';

// const OpportunitiesList = ({ opportunities }: any) => {
//   if(!opportunities){
//     opportunities=[]
//   }
//   return (
//     <div className="w-full lg:w-2/3 bg-white p-4 space-y-4 rounded-lg sm:w-full">
//       {/* {opportunities.map(

//         (opportunity: any, index: number) => (
//         <Opportunity key={index} data={opportunity} />
//       ))} */}
//       {Object.keys(opportunities).map((keys)=>{
//         return <Opportunity key={keys} data={opportunities[keys]} />
//       })}
//     </div>
//   );
// };

// export default OpportunitiesList;
















// Dark Mode
"use client";
import React from 'react';
import Opportunity from './Opportunity';

const OpportunitiesList = ({ opportunities }: any) => {
  if (!opportunities) {
    opportunities = [];
  }
  return (
    <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-4 space-y-4 rounded-lg sm:w-full">
      {Object.keys(opportunities).map((key) => (
        <Opportunity key={key} data={opportunities[key]} />
      ))}
    </div>
  );
};

export default OpportunitiesList;
