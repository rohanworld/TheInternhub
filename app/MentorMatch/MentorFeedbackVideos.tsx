// import Image from 'next/image';
// import React from 'react';

// // Define type for feedback item
// interface Feedback {
//   id: number;
//   title: string;
//   date: string;
//   description: string;
// }

// // Define type for props of MentorFeedbackItem
// interface MentorFeedbackItemProps {
//   Feedback: Feedback;
// }

// const MentorFeedbackItem: React.FC<MentorFeedbackItemProps> = ({ Feedback }) => {
//   return (
//     <div className="bg-white hover:bg-slate-100 space-x-3 text-black transform transition-transform duration-200 hover:scale-102 rounded-md mb-3 flex flex-col lg:flex-row">
//       <div className="w-full lg:w-1/2 pl-2">
//         <Image
//           src="https://i.pinimg.com/736x/02/7f/82/027f8203453c31ae95a10bfee7dd62d2.jpg"
//           alt="picture"
//           height={200}
//           width={400}
//           className="rounded-lg"
//         />
//       </div>
//       <div className="self-center">
//         <h2 className="font-semibold text-xl">{Feedback.title}</h2>
//         <div className="flex space-x-4">
//           <span className="text-gray-600">{Feedback.date}</span>
//         </div>
//         <span className="text-gray-700">{Feedback.description}</span>
//       </div>
//     </div>
//   );
// };

// // Define type for props of MentorFeedbackList
// interface MentorFeedbackListProps {
//   Feedbacks: Feedback[];
// }

// const MentorFeedbackList: React.FC<MentorFeedbackListProps> = ({ Feedbacks }) => {
//   return (
//     <div className="pb-2 space-2">
//       {Feedbacks.map((feedback) => (
//         <MentorFeedbackItem key={feedback.id} Feedback={feedback} />
//       ))}
//     </div>
//   );
// };

// const MentorFeedbacks: React.FC = () => {
//   // Mock data
//   const mockMentorFeedbackVideos: Feedback[] = [
//     { id: 1, title: "Feedback 1", date: "2023-07-20", description: "Resume review 1" },
//     { id: 2, title: "Feedback 2", date: "2023-07-21", description: "Resume review 2" },
//   ];

//   return (
//     <div className="space-y-2">
//       <h1 className="font-semibold text-2xl text-black">Mentor Feedback Videos</h1>
//       <div className="mt-3">
//         <MentorFeedbackList Feedbacks={mockMentorFeedbackVideos} />
//       </div>
//     </div>
//   );
// };

// export default MentorFeedbacks;



























import Image from 'next/image';
import React from 'react';

// Define type for feedback item
interface Feedback {
  id: number;
  title: string;
  date: string;
  description: string;
}

// Define type for props of MentorFeedbackItem
interface MentorFeedbackItemProps {
  feedback: Feedback;
}

const MentorFeedbackItem: React.FC<MentorFeedbackItemProps> = ({ feedback }) => {
  return (
    <div className="bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 space-x-3 text-black dark:text-white transform transition-transform duration-200 hover:scale-102 rounded-md mb-3 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 pl-2">
        <Image
          src="https://i.pinimg.com/736x/02/7f/82/027f8203453c31ae95a10bfee7dd62d2.jpg"
          alt="picture"
          height={200}
          width={400}
          className="rounded-lg"
        />
      </div>
      <div className="self-center p-4">
        <h2 className="font-semibold text-xl">{feedback.title}</h2>
        <div className="flex space-x-4">
          <span className="text-gray-600 dark:text-gray-400">{feedback.date}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{feedback.description}</p>
      </div>
    </div>
  );
};

// Define type for props of MentorFeedbackList
interface MentorFeedbackListProps {
  feedbacks: Feedback[];
}

const MentorFeedbackList: React.FC<MentorFeedbackListProps> = ({ feedbacks }) => {
  return (
    <div className="pb-2 space-y-2">
      {feedbacks.map((feedback) => (
        <MentorFeedbackItem key={feedback.id} feedback={feedback} />
      ))}
    </div>
  );
};

const MentorFeedbacks: React.FC = () => {
  // Mock data
  const mockMentorFeedbacks: Feedback[] = [
    { id: 1, title: "Feedback 1", date: "2023-07-20", description: "Resume review 1" },
    { id: 2, title: "Feedback 2", date: "2023-07-21", description: "Resume review 2" },
  ];

  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-2xl text-black dark:text-white">Mentor Feedback Videos</h1>
      <div className="mt-3 cursor-pointer">
        <MentorFeedbackList feedbacks={mockMentorFeedbacks} />
      </div>
    </div>
  );
};

export default MentorFeedbacks;
