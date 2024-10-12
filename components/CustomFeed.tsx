import React from 'react'

import PostFeed from './PostFeed'
import TopFeedCard from './TopFeedCard'
import ExploreBox from './ExploreBox'

type Props = {
  newPost: boolean
}

const CustomFeed = (props: Props) => {
  //console.log(props.newPost)
  return (
    <div className='w-full'>
        {/* <TopFeedCard/> */}
        {/* adding horizantal internships opportunitiy here */}
        <ExploreBox />
        
        <h2 className='text-[25px] font-semibold mt-3 bg-white dark:bg-gray-800'>Discussions</h2>
        <PostFeed newPost={props.newPost}/>
    </div>
  )
}

export default CustomFeed