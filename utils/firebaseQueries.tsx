import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";





export const searchByCollegeOrName = async (searchTerm: string) => {
  const studentRef = collection(db, 'adaptation-list');
  
  const q = query(
    studentRef,
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff')
  );
  
  const collegeQuery = query(
    studentRef,
    where('college', '>=', searchTerm),
    where('college', '<=', searchTerm + '\uf8ff')
  );

  const nameSnapshot = await getDocs(q);
  const collegeSnapshot = await getDocs(collegeQuery);

  const nameResults = nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const collegeResults = collegeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Merge results and remove duplicates (if needed)
  const combinedResults = Array.from(new Map([...nameResults, ...collegeResults].map(item => [item.id, item])).values());

  return combinedResults;
};

export const searchByCollegeOrNameInLowerCase = async (searchTerm: string) => {
  const lowerCaseTerm = searchTerm.toLowerCase();
  const studentRef = collection(db, 'adaptation-list');

  // Adjust queries to work with lowercase fields
  const nameQuery = query(
    studentRef,
    where('name_lower', '>=', lowerCaseTerm),
    where('name_lower', '<=', lowerCaseTerm + '\uf8ff')
  );

  const collegeQuery = query(
    studentRef,
    where('college_lower', '>=', lowerCaseTerm),
    where('college_lower', '<=', lowerCaseTerm + '\uf8ff')
  );

  const nameSnapshot = await getDocs(nameQuery);
  const collegeSnapshot = await getDocs(collegeQuery);

  const nameResults = nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const collegeResults = collegeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Merge results and remove duplicates
  const combinedResults = Array.from(new Map([...nameResults, ...collegeResults].map(item => [item.id, item])).values());

  return combinedResults;
};

export const searchByMentorName = async (searchTerm: string) => {
  const mentorRef = collection(db, 'mentors'); // Assuming your collection is named 'mentors'

  // Create a query to search by mentor name
  const nameQuery = query(
    mentorRef,
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff')
  );

  // Fetch the documents based on the query
  const nameSnapshot = await getDocs(nameQuery);

  // Map the results to include document ID and data
  const nameResults = nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return nameResults;
};

export const searchInternships = async (searchTerm: string) => {
  const internshipRef = collection(db, 'internships');
  const internshipQuery = query(
    internshipRef,
    where('title', '>=', searchTerm),
    where('title', '<=', searchTerm + '\uf8ff')
  );

  const snapshot = await getDocs(internshipQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Search function for trainings
export const searchTrainings = async (searchTerm: string) => {
  const trainingRef = collection(db, 'trainings');
  const trainingQuery = query(
    trainingRef,
    where('title', '>=', searchTerm),
    where('title', '<=', searchTerm + '\uf8ff')
  );

  const snapshot = await getDocs(trainingQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};