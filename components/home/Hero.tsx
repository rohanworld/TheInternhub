
// import Image from 'next/image';
// import AnimatedText from './HeroTextAnimation';

// export const Hero = () => {
//   return (
//     // Dark mode code here
//     <div className="bg-[#E8EAF6]  dark:bg-[#1E1E1E] w-full flex flex-col items-center pt-10 pr-2 pb-2 pl-2">
//   <div className="w-full flex flex-col lg:flex-row">
//     <div className="bg-[#CFCFCF] dark:bg-[#3A3A3A]  w-full lg:w-1/2">
//       <Image src="https://powertofly.com/up/media-library/two-cartoon-people-talking-as-mentor-and-mentee.png?id=33745786&width=1200&height=600&coordinates=0%2C0%2C0%2C28" alt="image" layout="responsive" height={10000} width={10000} />
//     </div>
//     <div className="flex flex-col items-center w-full lg:pl-[88px] h-full lg:justify-center">
//       <div className="w-full px-4 lg:px-0 lg:w-auto">
//         <div className="flex flex-row gap-2 lg:gap-0 p-0">
//           <div>
//             <p className="font-jakarta  dark:text-white text-[32px] lg:text-[48px] font-semibold text-left text-black">
//               Discover
//             </p>
//           </div>
//           <div className="lg:pt-[6px]  dark:text-white pt-[1px] ">
//             <AnimatedText />
//           </div>
//         </div>
//         <div className="pt-2 lg:pt-[41px]">
//           <p className="text-black dark:text-white  font-jakarta text-[20px] lg:text-[24px] font-[525] leading-[25px] lg:leading-[30px]">
//             Future Pathways: Your Gateway to Success
//           </p>
//           <p className="text-black  dark:text-white font-sans text-[16px] lg:text-[20px] font-[525] leading-[20px] lg:leading-[25px] pt-2 lg:pt-[12px]">
//             Discover top internships, connect with expert mentors, and showcase your talents to industry leaders. Join Future Pathways today and start your journey to a brighter future!
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };




















import Image from 'next/image';
import AnimatedText from './HeroTextAnimation';

export const Hero = () => {
  return (
    <div className="bg-[#E8EAF6] dark:bg-gray-900 w-full flex flex-col items-center pt-10 pr-4 pb-4 pl-4 overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row">
        <div className="bg-[#CFCFCF] dark:bg-[#3A3A3A] w-full lg:w-1/2">
          <Image src="https://powertofly.com/up/media-library/two-cartoon-people-talking-as-mentor-and-mentee.png?id=33745786&width=1200&height=600&coordinates=0%2C0%2C0%2C28" alt="image" layout="responsive" height={600} width={1200} />
        </div>
        <div className="flex flex-col items-center w-full lg:pl-[32px] h-full lg:justify-center">
          <div className="w-full px-4 lg:px-0 lg:w-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-4 p-0">
              <p className="font-jakarta dark:text-white text-[28px] lg:text-[48px] text-[32px] font-semibold text-center lg:text-left text-black">
                Discover
              </p>
              <div className="dark:text-white lg:pt-[6px] pt-[2px]">
                <AnimatedText />
              </div>
            </div>
            <div className="pt-2 lg:pt-[20px]">
              <p className="text-black dark:text-white font-jakarta text-[18px] lg:text-[24px] font-[525] leading-[25px] lg:leading-[30px]">
                Future Pathways: Your Gateway to Success
              </p>
              <p className="text-black dark:text-white font-sans text-[14px] lg:text-[20px] font-[525] leading-[20px] lg:leading-[25px] pt-2 lg:pt-[12px]">
                Discover top internships, connect with expert mentors, and showcase your talents to industry leaders. Join Future Pathways today and start your journey to a brighter future!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
