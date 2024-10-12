import React from "react";
import CreateTrainingForm from "./Createtrainingform";


type Props = {};

const CreateTraining = (props: Props) => {
  return (
    <div className="space-y-6 font-dmsans">
      <div className="space-y-0.5">
        <h2 className="font-bold tracking-tight font-style-1-headline">Post your Training here</h2>
        <p className="text-muted-foreground font-style-1-subtitle">
        Fill the form to post your Training.
        </p>
      </div>
      <CreateTrainingForm />
    </div>
  );
};

export default CreateTraining;
