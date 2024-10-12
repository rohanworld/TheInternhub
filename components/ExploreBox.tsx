// ExploreBox.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { internships } from '../app/Internships/DemoData';
import { db } from '../utils/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import parse from 'html-react-parser';

const ExploreBox: React.FC = () => {

  const [Interndata, setInternData] = useState<any[]>([]);
  const [TrainingData, setTrainingData] = useState<any[]>([]);

  function truncateHTML(htmlContent: string, maxLength: number) {
    let plainText = htmlContent.replace(/<br\s*\/?>/gi, '');

    if (plainText.length > maxLength) {
      plainText = plainText.slice(0, maxLength) + '...';
    }

    return parse(plainText);
  }

  useEffect(() => {
    const fetchData = async () => {
      // Fetching data from internships collection
      const internshipsRef = collection(db, 'internships');
      const internshipsQuery = query(internshipsRef, orderBy('createdAt', 'desc'), limit(5));
      const internshipsSnapshot = await getDocs(internshipsQuery);

      const internshipsArray: any[] = [];
      internshipsSnapshot.forEach((doc) => {
        internshipsArray.push({ id: doc.id, ...doc.data() });
      });

      // Fetching data from trainings collection
      const trainingsRef = collection(db, 'trainings');
      const trainingsQuery = query(trainingsRef, orderBy('createdAt', 'desc'), limit(5));
      const trainingsSnapshot = await getDocs(trainingsQuery);

      const trainingsArray: any[] = [];
      trainingsSnapshot.forEach((doc) => {
        trainingsArray.push({ id: doc.id, ...doc.data() });
      });

      // Update state with the fetched data
      setInternData(internshipsArray);
      setTrainingData(trainingsArray);

      // Optionally log the data
      console.log('Internships:', internshipsArray);
      console.log('Trainings:', trainingsArray);
    };

    fetchData();
  }, []);



  return (
    <div className="scrollbar-hide flex flex-col  w-full ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[25px] font-semibold">Explore Trainings/Internships</h2>
        <Link href="/Internships" className="text-gray-500 hover:underline dark:text-gray-400">
          View more
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {Interndata.map((internship) => (
          <Link
            href={`/Internships/${internship.id}`}
            key={internship.id}
            className="flex-none w-[340px] max-sm:w-4/5 max-md:w-1/2 p-4 rounded-lg shadow-md bg-white transition-transform duration-200 transform hover:scale-102 dark:bg-gray-700"
          >
            <Image
              src={internship.profilePic}
              alt={internship.internshipName || 'Internship image'}
              className="w-full h-44 object-cover rounded-md mb-4"
              height={5000}
              width={5000}
              quality={100}
            />
            <h4 className="text-lg font-semibold dark:bg-gray-700 text-gray-800 dark:text-white bg-white">{internship.title}</h4>
            <div className="h-24 flex flex-col justify-between flex-grow">
              <span className=" text-sm my-2">
                {truncateHTML(internship.description, 50)}
              </span>
              <div className="flex justify-between flex-grow">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <b>Stipend:</b> {internship.stipend}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <b>Duration:</b> {internship.duration}
                </p>
              </div>
            </div>
            <div className="pt-3">
              <span className="bg-selected-button-gradient-light text-black border-black dark:bg-selected-button-gradient-dark dark:text-white dark:border-white text-sm px-2 py-1 rounded-full font-normal">
                Internship
              </span>
            </div>
          </Link>
        
        ))}
        {TrainingData.map((training) => (
          <Link
          href={`/training/${training.id}`}
          key={training.id}
          className="flex-none w-[340px] max-sm:w-4/5 max-md:w-1/2 p-4 rounded-lg shadow-md bg-white transition-transform duration-200 transform hover:scale-102 dark:bg-gray-700"
          >
            <Image
              src={training.profilePic}
              alt={training.trainingName || 'Training image'}
              className="w-full h-44 object-cover rounded-md mb-4"
              height={5000}
              width={5000}
              quality={100}
            />
            <h3 className="text-lg font-semibold dark:bg-gray-700 text-gray-800 dark:text-white">{training.title}</h3>
            <div className="h-24 flex flex-col justify-between flex-grow">
              <span className="text-gray-600 dark:text-white text-xs my-2">
                {truncateHTML(training.description, 50)}
              </span>
          
              <div className="flex justify-between">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <b>Duration:</b> {training.duration}
                </p>
              </div>
            </div>
            <div className="pt-3">
              <span className="bg-selected-button-gradient-light text-black border-black dark:bg-selected-button-gradient-dark dark:text-white dark:border-white text-sm px-2 py-1 rounded-full font-normal">
                Training
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreBox;
