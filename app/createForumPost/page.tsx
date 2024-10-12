import React from "react";
import { Separator } from "@/components/ui/separator";
import CreateQuePage from "./createForumPost-form";

type Props = {};

const CreateForumPost = (props: Props) => {
  return (
    // <div className="space-y-6 font-dmsans">
    <div className="space-y-6 font-dmsans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <CreateQuePage />
    </div>
  );
};

export default CreateForumPost;
