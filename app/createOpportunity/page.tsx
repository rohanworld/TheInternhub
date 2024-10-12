import React from "react";
import CreateInternshipPage from "./createInternship-form";

type Props = {};

const CreateInternship = (props: Props) => {
  return (
    <div className="space-y-6 font-dmsans">
      <div className="space-y-0.5">
        <h2 className="font-bold tracking-tight font-style-1-headline">Post your Internship here</h2>
        <p className="text-muted-foreground font-style-1-subtitle">
        Fill the form to post your Internship.
        </p>
      </div>
      <CreateInternshipPage />
    </div>
  );
};

export default CreateInternship;
