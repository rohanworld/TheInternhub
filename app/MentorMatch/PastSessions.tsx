// import Image from 'next/image';
// import React from 'react';

// interface PastSession {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
//   day: string;
//   mentor: string;
// }

// interface PastSessionItemProps {
//   session: PastSession;
// }

// const PastSessionItem: React.FC<PastSessionItemProps> = ({ session }) => {
//   return (
//     <div className="bg-white hover:bg-slate-100 space-x-3 text-black transform transition-transform duration-200 hover:scale-102 rounded-full mb-3 flex flex-row">
//       <div className="self-center pl-2">
//         <Image
//           src="https://img.freepik.com/premium-photo/man-with-face-circle-with-word-man-it_798164-934.jpg"
//           alt="picture"
//           layout="round"  
//           height={100}
//           width={50}
//           className="rounded-full"
//         />
//       </div>
//       <div>
//         <h2 className="font-semibold text-xl">{session.title}</h2>
//         <div className="flex space-x-4">
//           <span className="text-gray-700">{session.mentor}</span>
//           <span className="text-gray-600">{session.day}, {session.date}, {session.time}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface PastSessionsListProps {
//   sessions: PastSession[];
// }

// const PastSessionsList: React.FC<PastSessionsListProps> = ({ sessions }) => {
//   return (
//     <div className="pb-2 space-2">
//       {sessions.map((session) => (
//         <PastSessionItem key={session.id} session={session} />
//       ))}
//     </div>
//   );
// };

// const PastSessions: React.FC = () => {
//   // Mock data
//   const mockPastSessions: PastSession[] = [
//     { id: 1, title: "Session 1", date: "2023-07-20", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
//     { id: 2, title: "Session 2", date: "2023-07-21", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
//     { id: 3, title: "Session 3", date: "2023-07-22", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
//   ];

//   return (
//     <div className="space-y-2">
//       <h1 className="font-semibold text-2xl text-black">Past Sessions</h1>
//       <div className="mt-3">
//         <PastSessionsList sessions={mockPastSessions} />
//       </div>
//     </div>
//   );
// };

// export default PastSessions;


























import Image from 'next/image';
import React from 'react';

interface PastSession {
  id: number;
  title: string;
  date: string;
  time: string;
  day: string;
  mentor: string;
}

interface PastSessionItemProps {
  session: PastSession;
}

const PastSessionItem: React.FC<PastSessionItemProps> = ({ session }) => {
  return (
    <div className="bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 space-x-3 text-black dark:text-white transform transition-transform duration-200 hover:scale-102 rounded-full mb-3 flex flex-row">
      <div className="self-center pl-2">
        <Image
          src="https://img.freepik.com/premium-photo/man-with-face-circle-with-word-man-it_798164-934.jpg"
          alt="picture"
          layout="intrinsic"  
          height={100}
          width={50}
          className="rounded-full"
        />
      </div>
      <div>
        <h2 className="font-semibold text-xl">{session.title}</h2>
        <div className="flex space-x-4">
          <span className="text-gray-700 dark:text-gray-300">{session.mentor}</span>
          <span className="text-gray-600 dark:text-gray-400">{session.day}, {session.date}, {session.time}</span>
        </div>
      </div>
    </div>
  );
};

interface PastSessionsListProps {
  sessions: PastSession[];
}

const PastSessionsList: React.FC<PastSessionsListProps> = ({ sessions }) => {
  return (
    <div className="pb-2 space-2">
      {sessions.map((session) => (
        <PastSessionItem key={session.id} session={session} />
      ))}
    </div>
  );
};

const PastSessions: React.FC = () => {
  // Mock data
  const mockPastSessions: PastSession[] = [
    { id: 1, title: "Session 1", date: "2023-07-20", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
    { id: 2, title: "Session 2", date: "2023-07-21", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
    { id: 3, title: "Session 3", date: "2023-07-22", time: "2:00 pm", day: "Wednesday", mentor: "Mentor 1" },
  ];

  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-2xl text-black dark:text-white">Past Sessions</h1>
      <div className="mt-3 cursor-pointer">
        <PastSessionsList sessions={mockPastSessions} />
      </div>
    </div>
  );
};

export default PastSessions;
