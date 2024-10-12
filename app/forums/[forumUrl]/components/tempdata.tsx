export interface Post {
    id: number;
    title: string;
    content: string;
    interested: number;
    answers: number;
  }
  
  export interface Category {
    name: string;
    numberOfMembers: number;
    totalPosts: number;
    topic: number;
  
    samplePosts: Post[];
  }
  
  const tempData: Record<string, Category> = {
    "Internship Opportunities": {
      name: "Internship Opportunities",
      numberOfMembers: 120,
      totalPosts: 34,
      topic: 50,
      samplePosts: [
        {
          id: 1,
          title: "Internship at Google",
          content: "Exciting opportunity at Google for software interns.",
          interested: 10,
          answers: 1,
        },
        {
          id: 2,
          title: "Microsoft Internship",
          content: "Join Microsoft as a summer intern and learn from the best.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    "Training Programs": {
      name: "Training Programs",
      numberOfMembers: 85,
      totalPosts: 20,
      topic: 90,
      samplePosts: [
        {
          id: 3,
          title: "AWS Training",
          content: "Learn AWS from certified trainers.",
          interested: 10,
          answers: 1,
        },
        {
          id: 4,
          title: "React Bootcamp",
          content: "Intensive React training for all levels.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    "Application Tips": {
      name: "Application Tips",
      numberOfMembers: 95,
      totalPosts: 50,
      topic: 23,
      samplePosts: [
        {
          id: 5,
          title: "Resume Building",
          content: "Tips on building a standout resume.",
          interested: 10,
          answers: 1,
        },
        {
          id: 6,
          title: "Interview Tips",
          content: "How to ace your next job interview.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    Support: {
      name: "Support",
      numberOfMembers: 60,
      totalPosts: 15,
      topic: 10,
      samplePosts: [
        {
          id: 7,
          title: "Technical Issues",
          content: "Get help with technical issues here.",
          interested: 10,
          answers: 1,
        },
        {
          id: 8,
          title: "Community Support",
          content: "Ask the community for support and guidance.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    "Off-Topic": {
      name: "Off-Topic",
      numberOfMembers: 150,
      totalPosts: 100,
      topic: 4,
      samplePosts: [
        {
          id: 9,
          title: "General Discussion",
          content: "Chat about anything and everything.",
          interested: 10,
          answers: 1,
        },
        {
          id: 10,
          title: "Hobbies",
          content: "Share your hobbies and interests.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    Events: {
      name: "Events",
      numberOfMembers: 70,
      totalPosts: 25,
      topic: 2,
      samplePosts: [
        {
          id: 11,
          title: "Tech Conference",
          content: "Upcoming tech conferences in 2024.",
          interested: 10,
          answers: 1,
        },
        {
          id: 12,
          title: "Meetups",
          content: "Join local meetups and networking events.",
          interested: 10,
          answers: 1,
        },
      ],
    },
    "Job Postings": {
      name: "Job Postings",
      numberOfMembers: 130,
      totalPosts: 40,
      topic: 77,
      samplePosts: [
        {
          id: 13,
          title: "Frontend Developer",
          content: "Job opening for a frontend developer at XYZ company.",
          interested: 10,
          answers: 1,
        },
        {
          id: 14,
          title: "Backend Developer",
          content: "Looking for a backend developer with Node.js experience.",
          interested: 10,
          answers: 1,
        },
      ],
    },
  };
  
  export default tempData;
  