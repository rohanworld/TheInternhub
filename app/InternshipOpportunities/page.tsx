import TopBar from './TopBar';
import LeftBoxes from './LeftBoxes';
import OpportunitiesList from './OpportunitiesList';

const opportunitiesData = [
  {
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },
  {
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },
  {
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },{
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },{
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },{
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  },{
    title: "What happens in afterlife?",
    description: "hello, what happens when one dies",
    interested: 10,
    answers: 1
  }
  // Add more data as needed
];

export default function Home() {
  return (
    <div className="bg-[#E8EAF6] min-h-screen p-8">
      <TopBar />
      <div className="flex flex-col lg:flex-row mt-8 space-y-4 lg:space-y-0 lg:space-x-4">
        <LeftBoxes />
        <OpportunitiesList opportunities={opportunitiesData} />
      </div>
    </div>
  );
}
