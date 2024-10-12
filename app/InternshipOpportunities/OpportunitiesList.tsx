// "use client"
// import React from 'react';
// import Opportunity from './Opportunity';

// const OpportunitiesList = ({ opportunities }: any) => {
//     return (
//         <div className="w-full lg:w-2/3 bg-white p-4 space-y-4">
//             {opportunities.map((opportunity: any, index: number) => (
//                 <Opportunity key={index} data={opportunity} />
//             ))}
//         </div>
//     );
// };

// export default OpportunitiesList;

"use client";
import React from 'react';
import Opportunity from './Opportunity';

const OpportunitiesList = ({ opportunities }: any) => {
  return (
    <div className="w-full lg:w-2/3 bg-white p-4 space-y-4 rounded-lg">
      {opportunities.map((opportunity: any, index: number) => (
        <Opportunity key={index} data={opportunity} />
      ))}
    </div>
  );
};

export default OpportunitiesList;
