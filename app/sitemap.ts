

import { MetadataRoute } from "next";

import { collection , query , getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

type Post = {
    title: string;
}

type ForumPost = {
    title: string;
    forumName: string;
}

type internshipWithId = {
    id: string;
    title: string;
    description: string;
  };

  type internshipsPost = {
    title: string;
    description: string;
  };

  type trainingWithId = {
    id: string;
    title: string;
    description: string;
  };

  type trainingPost = {
    title: string;
    description: string;
  };

//Fetch all posts from firestore
export async function getPosts(){
    const postsRef = collection(db, "questions");
    const q = query(postsRef);

    const posts = <any>[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        posts.push(doc.data() as Post);
    });

    return posts;
}

export async function getPolls(){
    const pollsRef = collection(db, "polls");
    const q = query(pollsRef);

    const polls = <any>[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        polls.push(doc.data() as Post);
    });

    return polls;
}

export async function getForumsPosts(){
    const forumsRef = collection(db, "forumPosts");
    const q = query(forumsRef);

    const forumsP = <any>[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        forumsP.push(doc.data() as ForumPost);
    });

    return forumsP;
}

export async function getInternships(): Promise<internshipWithId[]> {
    const internshipsP: internshipWithId[] = [];
    const internRef = collection(db, "internships");
    const q = query(internRef);
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const internshipData = doc.data() as internshipsPost;
      internshipsP.push({
        id: doc.id,
        ...internshipData, // Spread operator to include existing properties
      });
    });
  
    return internshipsP;
  }

  export async function getTrainings(): Promise<trainingWithId[]> {
    const trainingsP: trainingWithId[] = [];
    const trainingRef = collection(db, "trainings");
    const q = query(trainingRef);
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const trainingData = doc.data() as trainingPost;
      if (!trainingData.title || !trainingData.description) {
        console.warn(`Document ${doc.id} in "trainings" collection is missing required properties.`);
        return; 
      }
  
      trainingsP.push({
        id: doc.id,
        ...trainingData,
      });
    });
  
    return trainingsP;
  }

export default async function sitemap(){

    const baseUrl = "https://internhub-05.vercel.app/";

    const posts = await getPosts();
    
    const postsUrls = posts?.map((post:any) => {
        return{
            url: `${baseUrl}/${post.title.split(" ").join("-")}`,
            lastModified: new Date().toISOString(),
        }
    }) ?? [];

    const polls = await getPolls();

    const pollsUrls = polls?.map((poll:any) => {
        return{
            url: `${baseUrl}/poll/${poll.title.split(" ").join("-")}`,
            lastModified: new Date().toISOString(),
        }
    }) ?? [];

    const forumPostss = await getForumsPosts();

    const forumPostsUrls = forumPostss?.map((fpost:any) => {
        return{
            url: `${baseUrl}/forums/${fpost?.forumName?.split(" ")?.join("-")}/post/${fpost.title.split(" ").join("-")}`,
            lastModified: new Date().toISOString(),
        }
    }) ?? [];

    const internshipPosts = await getInternships();

    const internPostsUrls = internshipPosts?.map((iPost:any) => {
        return{
            url: `${baseUrl}/Internships/${iPost.id}`,
            lastModified: new Date().toISOString(),
        }
    }) ?? [];

    const trainingPosts = await getTrainings();

    const trainingPostUrls = trainingPosts?.map((tPost:any) => {
        return{
            url: `${baseUrl}/training/${tPost.id}`,
            lastModified: new Date().toISOString(),
        }
    }) ?? [];
    
    return[
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
        },
        ...postsUrls,
        ...pollsUrls,
        ...forumPostsUrls,
        ...internPostsUrls,
        ...trainingPostUrls,
    ]
    
}