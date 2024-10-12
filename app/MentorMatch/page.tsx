// "use client"
// import React from 'react'
// import Image from 'next/image';
// import UpcomingSessions from './UpcomingSessions';
// import PastSessions from './PastSessions';
// import MentorFeedbackVideos from './MentorFeedbackVideos';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { toast } from '@/components/ui/use-toast';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { UserType } from '@/store/slice';
// import { db } from '@/utils/firebase';

// const page = () => {

//     const userData = useSelector((state: RootState) => state.user);

//     const handleJoinWaitingList = async () => {
//         if (userData) {
//             const docRef = await addDoc(collection(db, 'waitingList'), {
//                 uid: userData?.uid,
//                 name: userData?.name,
//                 email: userData.email,
//                 UserType: userData.userType,
//                 timeStamp: serverTimestamp(),
//             });
//             toast({
//                 title: "Added to waitlist",
//                 description: "Your details have been added to the waiting list",
//               });
//         } else {
//           console.log('No user data available');
//           toast({
//             title: "Please Sign In",
//             description: "You must be signed in to Join the waiting list",
//           });
//         }
//       };


//   return (
//     <>
//     <div className="p-10">
//         <div className="bg-[#E8EAF6] flex flex-col lg:flex-row justify-between ">
//             <h1 className="text-4xl font-bold text-black ">Mentor Match</h1>
//         </div>
//         <div className="pt-10 flex flex-col lg:flex-row justify-start w-full">
//             <div className="w-full lg:w-2/5">
//                 <Image 
//                 src="https://powertofly.com/up/media-library/two-cartoon-people-talking-as-mentor-and-mentee.png?id=33745786&width=1200&height=600&coordinates=0%2C0%2C0%2C28" 
//                 alt=""
//                 objectFit="cover"
//                 className="rounded-lg"
//                 width={700}
//                 height={300}
//                 />
//             </div>
//             <div className="lg:px-6 self-end">
//                 <h1 className="text-4xl font-bold text-black w-full lg:w-1/2 ">Get Matched with a Mentor</h1>
//                 <p className="text-black text-base lg:w-3/4 py-5">
//                 Join the waitlist to get matched with a mentor. We&apos;ll be in touch when we&apos;re ready to launch.
//                 </p>
//                 <div className="pt-5">
//                     <button onClick={handleJoinWaitingList} className="btn btn-info bg-blue-500 hover:bg-blue-600 text-white border-blue-600 border-spacing-4 px-7">Join the Waiting List</button>
//                 </div>
//             </div>
//         </div>
//         <div className="pt-10 flex flex-col lg:flex-row gap-2 ">
//             <div className="bg-white rounded-lg w-full lg:w-2/3 p-5 max-h-min space-y-3">
//                 <UpcomingSessions />
//                 <PastSessions />
//             </div>
//             <div className="bg-white rounded-lg w-full lg:w-1/3 max-h-min p-5">
//                 <MentorFeedbackVideos />
//             </div>
//         </div>
//     </div>
//     </>
//   )
// }

// export default page
















"use client"
import React from 'react'
import Image from 'next/image';
import UpcomingSessions from './UpcomingSessions';
import PastSessions from './PastSessions';
import MentorFeedbackVideos from './MentorFeedbackVideos';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from '@/components/ui/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { UserType } from '@/store/slice';
import { db } from '@/utils/firebase';

const Page = () => {

    const userData = useSelector((state: RootState) => state.user);

    const handleJoinWaitingList = async () => {
        if (userData) {
            const docRef = await addDoc(collection(db, 'waitingList'), {
                uid: userData?.uid,
                name: userData?.name,
                email: userData.email,
                UserType: userData.userType,
                timeStamp: serverTimestamp(),
            });
            toast({
                title: "Added to waitlist",
                description: "Your details have been added to the waiting list",
            });
        } else {
            console.log('No user data available');
            toast({
                title: "Please Sign In",
                description: "You must be signed in to Join the waiting list",
            });
        }
    };

    return (
        <>
            <div className="p-10 text-black dark:text-white">
                <div className=" flex flex-col lg:flex-row justify-between ">
                    <h1 className="text-4xl font-bold  p-1">Mentor Match</h1>
                </div>
                <div className="pt-10 flex flex-col lg:flex-row justify-start w-full">
                    <div className="w-full lg:w-2/5">
                        <Image 
                            src="https://powertofly.com/up/media-library/two-cartoon-people-talking-as-mentor-and-mentee.png?id=33745786&width=1200&height=600&coordinates=0%2C0%2C0%2C28" 
                            alt="Mentor and Mentee"
                            objectFit="cover"
                            className="rounded-lg"
                            width={700}
                            height={300}
                        />
                    </div>
                    <div className="lg:px-6 self-end">
                        <h1 className="text-4xl font-bold w-full lg:w-1/2">Get Matched with a Mentor</h1>
                        <p className="text-base lg:w-3/4 py-5">
                            Join the waitlist to get matched with a mentor. We&apos;ll be in touch when we&apos;re ready to launch.
                        </p>
                        <div className="pt-5">
                            <button 
                                onClick={handleJoinWaitingList} 
                                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-600 px-7 py-2 rounded"
                            >
                                Join the Waiting List
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-10 flex flex-col lg:flex-row gap-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-2/3 p-5 max-h-min space-y-3">
                        <UpcomingSessions />
                        <PastSessions />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-1/3 max-h-min p-5">
                        <MentorFeedbackVideos />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
