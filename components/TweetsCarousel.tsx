import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tweet } from 'react-tweet';


const TweetsCarousel = () => {

    const tweetIds = [
        "1839542925715472470",
        "1839542805108314597",
        "1839542761625944190",
        "1839542699864789474",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % tweetIds.length);
        }, 5000); // Change tweet every 5 seconds
        return () => clearInterval(interval);
    }, [tweetIds.length]);


    return (
        <div className="flex items-center justify-center h-screen bg-[#E8EAF6] dark:bg-[#111827]">
            <div className="tweet-carousel text-center">
            <h1 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] bg-clip-text text-transparent text-2xl font-extrabold mb-4">Discover Our Story Through Tweets</h1> 
               <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="py-4">  
                        <Tweet id={tweetIds[currentIndex]} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
export default TweetsCarousel
















// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Tweet } from 'react-tweet';

// const TweetsCarousel = () => {
//   const tweetIds = [
//     "1628832338187636740",
//     "1839163726639018075",
//     "1839004342948688122",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % tweetIds.length);
//     }, 5000); // Change tweet every 5 seconds
//     return () => clearInterval(interval);
//   }, [tweetIds.length]);

//   return (
//     <div className="flex items-center justify-center h-screen bg-[#E8EAF6]">
//       <div className="tweet-carousel">
//         <motion.div
//           key={currentIndex}
//           initial={{ opacity: 0, x: 50, scale: 0.9 }} // Start with reduced scale
//           animate={{ opacity: 1, x: 0, scale: 1 }} // Scale to full size
//           exit={{ opacity: 0, x: -50, scale: 0.9 }} // Scale down on exit
//           transition={{
//             duration: 0.5,
//             type: 'spring',
//             stiffness: 200, // Adjust stiffness for a bouncier effect
//             damping: 20, // Control the damping effect
//           }}
//           className="flex justify-center shadow-lg rounded-lg bg-white p-4" // Add shadow and padding
//         >
//           <Tweet id={tweetIds[currentIndex]} />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TweetsCarousel;
