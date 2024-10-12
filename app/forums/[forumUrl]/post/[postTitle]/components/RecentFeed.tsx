import { RecentPosts } from '@/lib/data'
import React, { useEffect, useState } from 'react'

// import RecentFeedCard from './RecentFeedCard'
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { Separator } from '@/components/ui/separator'
import parse from "html-react-parser"

type Props = {}

type PostType = {
  title: string;
  description: string;
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const RecentFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);
  const params = useParams();
  const forumUrl = params.forumUrl


 //fetching latest forum posts
  useEffect(() => {

    const collectionRef = collection(db, 'forumPosts');
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(5));

    const unsub = onSnapshot(q, async(snapshot) => {
      const postsData =[];

      for (const doc of snapshot.docs) {
    
        // Add the total number of answers to the question data
        const questionData = { ...doc.data() } as PostType;
    
        postsData.push(questionData);
      }
  
      //console.log(postsData)
      setPosts(postsData);
    })

    return () => {
      unsub()
    }
  }, [])
  
  return (      
    <div className='max-h-[40rem] p-2 overflow-auto bg-white rounded-2xl dark:bg-gray-800 '>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" text-left dark:text-white"><h2>Latest Posts</h2></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow key={index}>
              <Link className='flex flex-col' href={`/forums/${forumUrl}/post/${encodeURIComponent(post?.title?.split(" ").join("-"))}`}>
                <TableCell className="text-[1"><h3 className='bg-gradient-custom font-semibold dark:text-gray-300'>{post.title.length>70?post.title.substring(0, 69)+"...":post.title}</h3></TableCell>
                <TableCell className="text-[14px]"><h3 className='font-normal dark:text-gray-700'>{post.description.length>1000?parse(post.description.substring(0, 99))+"...":parse(post.description)}</h3></TableCell>
              </Link>
              {index!=4&&
              <Separator/>
              }
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell>Ask Question...</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  )
}

export default RecentFeed