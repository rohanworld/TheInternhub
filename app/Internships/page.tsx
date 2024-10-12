// Dark Mode
import Top from '@/app/Internships/Top'
import React, { Suspense } from 'react'
import Internship_tab from './Internship_tab'
import Trainings_tab from './Trainings_tab'
import toast, { Toaster } from 'react-hot-toast';

export default function Internships() {
  return (
    <div className="text-black dark:text-white min-h-screen px-6 md:px-16 pt-12">
      <Top />
      <Toaster/>
    </div>
  )
}
