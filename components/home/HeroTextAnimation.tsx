

// const AnimatedText= () => {
//     return (
//       <div className="lg:h-16 h-12 overflow-hidden">
//         <div className="h-full lg:animate-slide animate-smslide flex flex-col content-start items-start">
//           <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left  dark:text-white text-black pl-1 sm:text-center">
//             Internships
//           </div>
//           <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left text-black  dark:text-white pl-1 sm:text-center">
//             Trainings
//           </div>
//           <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left text-black  dark:text-white pl-1 sm:text-center">
//             Mentorships
//           </div>
//         </div>
//       </div>
//     );
//   }; 
  
//   export default AnimatedText;
  













const AnimatedText = () => {
  return (
    <div className="lg:h-16 h-12 overflow-hidden">
      <div className="h-full lg:animate-slide animate-smslide flex flex-col items-center lg:items-start">
        <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left dark:text-white text-black pl-1 sm:text-center">
          Internships
        </div>
        <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left dark:text-white text-black pl-1 sm:text-center">
          Trainings
        </div>
        <div className="lg:h-16 h-12 flex items-center justify-center font-sans lg:text-[48px] text-[32px] font-[600] text-left dark:text-white text-black pl-1 sm:text-center">
          Mentorships
        </div>
      </div>
    </div>
  );
};

export default AnimatedText;
