// app/mentors/page.js

import React, { Suspense } from 'react';
import TopDetails from './topDetails';
import Mentors from './mentorsList';

const mentors = () => {
  return (
    <>
    <div className=''>
      <Suspense>
        <TopDetails />
        <Mentors />
      </Suspense>
    </div>
    </>
  );
};

export default mentors;
