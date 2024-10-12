import React, { Suspense } from 'react';
import TopDetails from './topDetails';
import Students from './adaptationsList';


const adaptation = () => {
  return (
    <>
    <div className='pb-[1rem]'>
      <Suspense fallback={<div>Loading...</div>}>
          <TopDetails />
          <Students />
      </Suspense>
    </div>
    </>
  );
};

export default adaptation;
