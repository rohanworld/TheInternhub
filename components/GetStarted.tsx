import Image from 'next/image';
import Link from 'next/link';



const GetStartedUI = () => {
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#E8EAF6] dark:bg-gray-900">
      {/* Left section */}
      <div className="w-full md:w-1/2 flex md:flex-col h-full">
        {/* Top text */}
        <div className="text-center w-full">
          <h1 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] bg-clip-text text-transparent text-4xl font-bold text-black md:p-16 dark:text-white">
            We make it easy to hire right and grow your business.
          </h1>
        </div>

        {/* Image */}
        <div className="invisible md:visible flex justify-center items-center">
          <Image 
            src="/bigimagegetstarted.png" 
            alt="Human characters"
            width={400} 
            height={200}
            className="object-contain"
          />
        </div>

        {/* Bottom text */}
        <div className="text-right mt-auto invisible md:visible flex flex-col">
          <h2 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] bg-clip-text text-transparent text-2xl font-semibold text-black dark:text-white">
            Also to get hired, if that&apos;s your goal.
          </h2>
          <Link href={'/auth/signin'} className="max-w-40 items-center mt-6 px-6 py-3 bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-white rounded-md text-lg hover:bg-blue-600" >
            Get Started
          </Link>
        </div>
      </div>

      {/* Right section with boxes */}
      <div className="w-full md:w-1/2 flex flex-col md:grid md:grid-cols-1 md:pl-44 gap-8">
        {/* Box 1 */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-lg max-w-sm mb-4">
          <Image 
            src="/getstrartedbox1.png" // Replace with the actual image path
            alt="Reliable Icon"
            width={50}
            height={50}
            className="mb-4"
          />
          <h3 className="text-xl font-bold text-black mb-4 bg-blue-100">Reliable</h3>
          <p className="text-black">
            Our high recruitment success rate is because we have over 600,000 top-quality candidates in Ghana, who are targeted with your job vacancies that match their profile.
          </p>
        </div>

        {/* Box 2 */}
        <div className="bg-red-100 p-4 rounded-lg shadow-lg max-w-sm mb-4">
          <Image 
            src="/getstrartedbox2.png" // Replace with the actual image path
            alt="Efficient Icon"
            width={50}
            height={50}
            className="mb-4"
          />
          <h3 className="text-xl font-bold text-black mb-4 bg-red-100">Efficient</h3>
          <p className="text-black">
            Our All-In-One Applicant management system allows you to easily filter through qualified candidates and gives you lifetime access for subsequent hires.
          </p>
        </div>

        {/* Box 3 */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow-lg max-w-sm mb-4">
          <Image 
            src="/getstrartedbox3.png" // Replace with the actual image path
            alt="Easy to Use Icon"
            width={50}
            height={50}
            className="mb-4"
          />
          <h3 className="text-xl font-bold text-black mb-4 bg-yellow-100">Easy to Use</h3>
          <p className="text-black">
            No matter your skill level, our platform is easy to use, so you can do it yourself. With our concierge products, we take the work off your plate and all you do is make the hiring decision.
          </p>
        </div>

        {/* Box 4 */}
        <div className="bg-green-100 p-4 rounded-lg shadow-lg max-w-sm mb-4">
          <Image 
            src="/getstrartedbox4.png" // Replace with the actual image path
            alt="Effective Icon"
            width={50}
            height={50}
            className="mb-4"
          />
          <h3 className="text-xl font-bold text-black mb-4 bg-green-100">Effective</h3>
          <p className="text-black">
            Join our newsletter and get the latest job listings and career insights delivered straight to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedUI;





























// uncomment this for horizantal scrollbar responsiveness

// import Image from 'next/image';

// const GetStartedUI = () => {
//   return (
//     <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white dark:bg-[#111827]">
//       {/* Left section */}
//       <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
//         {/* Top text */}
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-black mb-6 dark:text-white">
//             We make it easy to hire right and grow your business.
//           </h1>
//         </div>

//         {/* Image */}
//         <div className="flex justify-center items-center">
//           <Image 
//             src="/bigimagegetstarted.png" 
//             alt="Human characters"
//             width={400} 
//             height={200}
//             className="object-contain"
//           />
//         </div>

//         {/* Bottom text */}
//         <div className="text-right mt-auto">
//           <h2 className="text-2xl font-semibold text-black dark:text-white">
//             Also to get hired, if that's your goal.
//           </h2>
//         </div>
//       </div>

//       {/* Right section with boxes (unchanged) */}
//       <div className="w-full md:w-1/2 grid grid-cols-1 gap-4 ml-16">
//         {/* Box 1 */}
//         <div className="bg-blue-100 p-4 rounded-lg shadow-lg max-w-sm ml-16">
//           <Image 
//             src="/getstrartedbox1.png" // Replace with the actual image path
//             alt="Reliable Icon"
//             width={50}
//             height={50}
//             className="mb-4"
//           />
//           <h3 className="text-xl font-bold text-black mb-4 bg-blue-100">Reliable</h3>
//           <p className="text-black">
//             Our high recruitment success rate is because we have over 600,000 top-quality candidates in Ghana, who are targeted with your job vacancies that match their profile.
//           </p>
//         </div>

//         {/* Box 2 */}
//         <div className="bg-red-100 p-4 rounded-lg shadow-lg max-w-sm ml-16">
//           <Image 
//             src="/getstrartedbox2.png" // Replace with the actual image path
//             alt="Efficient Icon"
//             width={50}
//             height={50}
//             className="mb-4"
//           />
//           <h3 className="text-xl font-bold text-black mb-4 bg-red-100">Efficient</h3>
//           <p className="text-black">
//             Our All-In-One Applicant management system allows you to easily filter through qualified candidates and gives you lifetime access for subsequent hires.
//           </p>
//         </div>

//         {/* Box 3 */}
//         <div className="bg-yellow-100 p-4 rounded-lg shadow-lg max-w-sm ml-16">
//           <Image 
//             src="/getstrartedbox3.png" // Replace with the actual image path
//             alt="Easy to Use Icon"
//             width={50}
//             height={50}
//             className="mb-4"
//           />
//           <h3 className="text-xl font-bold text-black mb-4 bg-yellow-100">Easy to Use</h3>
//           <p className="text-black">
//             No matter your skill level, our platform is easy to use, so you can do it yourself. With our concierge products, we take the work off your plate and all you do is make the hiring decision.
//           </p>
//         </div>

//         {/* Box 4 */}
//         <div className="bg-green-100 p-4 rounded-lg shadow-lg max-w-sm ml-16">
//           <Image 
//             src="/getstrartedbox4.png" // Replace with the actual image path
//             alt="Effective Icon"
//             width={50}
//             height={50}
//             className="mb-4"
//           />
//           <h3 className="text-xl font-bold text-black mb-4 bg-green-100">Effective</h3>
//           <p className="text-black">
//             Join our newsletter and get the latest job listings and career insights delivered straight to your inbox.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GetStartedUI;
