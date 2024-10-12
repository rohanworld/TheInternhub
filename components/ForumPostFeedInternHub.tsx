  



import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/utils/firebase";
import ForumPost from './ForumPost';

import Loader from "./ui/Loader";

interface ForumPosts {
    
        id: string;
        title: string;
        name: string;
        description: string;
        profilePic: string;
        postImage: string;
        likes: number;
        comments: number;
        shares: number;
        questionImageURL: string;
        createdAt: any;
        anonymity: boolean;
        uid: string; // User ID of the post creator
        // ansNumbers: number
      
}

interface ForumPostsProps {
    forumUrl: string;
}

const ForumPostFeedInternHub: React.FC<ForumPostsProps> = ({ forumUrl }) => {
    const [posts, setPosts] = useState<ForumPosts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'forumPosts'),
                    where('forumName', '==', forumUrl)
                );
                const querySnapshot = await getDocs(q);
                const fetchedPosts: ForumPosts[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({
                        id: doc.id,
                        ...doc.data(),
                    } as ForumPosts);
                });
                setPosts(fetchedPosts);
            } catch (err) {
                console.error('Error fetching forum posts:', err);
                setError('Failed to load forum posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [forumUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
console.log("posts:",posts)
    return (
        <div>
           
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) :  <div className=" w-[100%]">
                
            <ul className=" flex flex-col col-span-2 mb-[4px] mt-[7px] w-full">
                
              {posts.map((post, index) => (
                <li key={index}>
                  {/* <ForumPostInternhub post={post}  /> */}
                  <ForumPost post={post}  />
                </li>
                
              ))}
             
            </ul>
            </div>
          
            
          }
        </div>
    );
};




export default ForumPostFeedInternHub
