//  "use client"
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const notificationsData = [
//     {
//       id: 1,
//       title: "Profile Update Reminder",
//       message: "Update your profile to get viewed by other mentors...",
//       type: "Profile",
//       time: "5 mins ago",
//       isRead: false,
//       url: "/profilePage"
//     },
//     {
//       id: 2,
//       title: "New Mentors Joined",
//       message: "New mentors have joined the platform. View their profiles now...",
//       type: "Mentors",
//       time: "15 mins ago",
//       isRead: false,
//       url: "/Mentors"
//     },
//     {
//       id: 3,
//       title: "New Trainings Added",
//       message: "Check out the latest trainings added to our platform...",
//       type: "Training",
//       time: "30 mins ago",
//       isRead: false,
//       url: "/Internships"
//     },
//     {
//       id: 4,
//       title: "New Internships Available",
//       message: "New internship opportunities have been posted. Apply now!",
//       type: "Internships",
//       time: "1 hour ago",
//       isRead: false,
//       url: "/Internships"
//     }
//   ];

// const Notification: React.FC = () => {
//   const router = useRouter();
//   const [notifications, setNotifications] = useState(notificationsData);

//   const markAsRead = (id: number) => {
//     setNotifications(prevNotifications =>
//       prevNotifications.map(notification =>
//         notification.id === id
//           ? { ...notification, isRead: true }
//           : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications(prevNotifications =>
//       prevNotifications.map(notification => ({
//         ...notification,
//         isRead: true,
//       }))
//     );
//   };

//   const handleNotificationClick = (url: string) => {
//     router.push(url);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold dark:text-white">Notifications</h1>
//         <button
//           onClick={markAllAsRead}
//           className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
//         >
//           Mark all as read
//         </button>
//       </div>
//       <div className="space-y-4">
//         {notifications.map(notification => (
//           <div
//             key={notification.id}
//             className={`p-4 border-l-4 cursor-pointer transition-all duration-300 ${
//               notification.isRead
//                 ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-600'
//                 : 'bg-blue-100 dark:bg-gray-700 border-blue-500'
//             }`}
//           >
//             <div className="flex justify-between">
//               <div className="flex-grow" onClick={() => handleNotificationClick(notification.url)}>
//                 <h3 className="text-lg font-semibold text-gray-900 bg-blue-100 dark:text-white dark:bg-gray-700">
//                   {notification.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 truncate">
//                   {notification.message}
//                 </p>
//                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                   {notification.time}
//                 </span>
//                 <div>
//                   <button
//                     onClick={() => handleNotificationClick(notification.url)}
//                     className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
//                   >
//                     View More
//                   </button>
//                 </div>
//               </div>
//               <div className="flex-shrink-0 ml-4">
//                 <button
//                   onClick={() => markAsRead(notification.id)}
//                   className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
//                 >
//                   Mark as Read
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Notification;



















// asfasdf

"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { collection, getDocs, orderBy, query, doc, getDoc, updateDoc  } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Notification: React.FC = () => {
  const router = useRouter();
  const [notificationData, setNotificationData] = useState<any>([]);

  useEffect(() => {
        const FuncToFetchNotification = async () => {
          const user = auth?.currentUser?.uid;
          if (user) {
            const notificationsRef = collection(db, 'users', user,'notifications');
            const notificationsQuery = query(notificationsRef, orderBy('createdAt', 'desc'));
              try {
                const querySnapshot = await getDocs(notificationsQuery);
                let tempArr:any = [];
                querySnapshot.forEach((doc) => {
                  tempArr.push({id: doc.id, ...doc.data()});
                });
                setNotificationData(tempArr);

                // Update the viewed as true for all the notifications
                tempArr.forEach(async (notification: any) => {
                  if (!notification.isRead) {
                    const notificationRef = doc(db, 'users', user, 'notifications', notification.id);
                    // updateDoc
                    const notificationDoc = await getDoc(notificationRef);
                    if (notificationDoc.exists()) {
                      await updateDoc(notificationRef, {
                        viewed: true,
                      });
                    }
                  }
                });

                // Remove the Red Dot from the notification icon
                document.getElementsByClassName('notification-dot')[0]?.classList.add('hidden');

                console.log("Notifications: ", tempArr);
              } catch (error) {
                console.error("Error fetching notifications: ", error);
              }
            };
        }
      
        setTimeout(() => {
          FuncToFetchNotification();
        }, 500);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-screen-lg mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-xl font-semibold dark:text-white mb-2 md:mb-0">Notifications</h1>
        <button
          className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notificationData.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">No New Notifications</p>}
        {notificationData && notificationData.map((notification: any) => (
          <div
            key={notification.id}
            className={`p-4 border-l-4 cursor-pointer transition-all duration-300 ${notification.isRead
                ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-600'
                : 'bg-blue-100 dark:bg-gray-700 border-blue-500'
              }`} 
          > 
            <Link href={notification?.link || '/'}>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white dark:bg-gray-700">
                {notification.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 truncate">
                {notification.description}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {notification.time}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
