"use client";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { initialUserState, setUser } from "@/store/slice";
import { UserType } from '@/store/slice';
import Image from "next/image";
import { updateEmail, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, db, storage } from "@/utils/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { deleteObject } from "firebase/storage";
import { signOut } from "firebase/auth";
const Page = () => {
  const router = useRouter();
  const dispatch=useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    uid: user.uid || "",
    name: user.name || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
  });
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setNewProfileImage(file); // Store the file for uploading later
    }
  };

  // Handle input changes for name and email
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to update profile

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
   
  try {
    let photoURL = formData.photoURL;

    // If a new profile image is uploaded, delete the old image and upload the new one
    if (newProfileImage) {
      if (formData.photoURL) {
        // Delete the old image from Firebase Storage
        const oldImageRef = ref(storage, formData.photoURL);
        await deleteObject(oldImageRef)
          .then(() => console.log("Old profile image deleted successfully"))
          .catch((error) => console.error("Error deleting old profile image:", error));
      }

      // Upload the new profile image
      const storageRef = ref(storage, `profileImage/${newProfileImage.name}`);
      const snapshot = await uploadBytes(storageRef, newProfileImage);
      photoURL = await getDownloadURL(snapshot.ref);
    }

    // Update Firebase Authentication profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: photoURL,
      });

      // Update email if changed
      if (auth.currentUser.email !== formData.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      // Update Firestore with new data
      const userRef = doc(db, "users", formData.uid);
      await updateDoc(userRef, {
        name: formData.name,
        email: formData.email,
        photoURL: photoURL,
      });
      if(user.userType==UserType.Student){
        const adaptationRef=doc(db, "adaptation-list", formData.uid);
        await updateDoc(adaptationRef, {
          name: formData.name,
          email: formData.email,
          photoURL: photoURL,
          
        });
       }
       else if(user.userType==UserType.Organization){
        const mentorRef=doc(db, "mentors", formData.uid);
        await updateDoc(mentorRef, {
          name: formData.name,
          email: formData.email,
          photoURL: photoURL,
        })
       }
      // Dispatch the updated user information to Redux
      dispatch(setUser({
        ...user,
        uid: auth.currentUser.uid,
        name: formData.name,
        email: formData.email,
        userType: user.userType, // Preserving the existing user type
        photoURL: photoURL,
      }));

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

      router.push("/"); // Redirect after successful update
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast({
      title: "Update Error",
      description: "An error occurred while updating your profile. Please try again.",
    });
  }
};


const handleDeleteUser = async () => {
  try {

    if (auth.currentUser) {
      const password = prompt("Please enter your password to confirm deletion:");
      if (!password) throw new Error("Password is required to reauthenticate.");

      const credential = EmailAuthProvider.credential(auth.currentUser.email!, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Delete the user from Firebase Authentication
      await deleteUser(auth.currentUser);
      
      // Proceed to delete Firestore documents
      if (user.uid) {
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);

        if (user.userType === UserType.Student) {
          const adaptationRef = doc(db, "adaptation-list", user.uid);
          await deleteDoc(adaptationRef);
        } else if (user.userType === UserType.Organization) {
          const mentorRef = doc(db, "mentors", user.uid);
          await deleteDoc(mentorRef);
        }
      }

      // Log out the user after account deletion
      await signOut(auth); 

      // Reset user state to initial state after deletion
      dispatch(setUser(initialUserState));

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });

      router.push("/");
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    toast({
      title: "Delete Error",
      description: error.message || "An error occurred while deleting your account. Please try again.",
    });
  }
};

  return (
    <div className=" pt-5 flex items-center justify-center">
      <form onSubmit={handleSubmit} className=" w-full pt-1 mx-4 md:mx-12 rounded-lg text-black dark:text-white flex flex-col">
        <div className="p-2 md:p-14">
          <h1 className="text-transparent bg-clip-text text-3xl md:text-4xl font-bold">
            Edit Profile Info
          </h1>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 px-4 md:px-14">
            <div className="w-full flex flex-col gap-4">
              <label className="form-control lg:w-full w-full">
                <div className="label">
                  <h2 className="font-semibold">Name</h2>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter new Name (Government verified)"
                  className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-800 dark:border-gray-600 text-black dark:text-white"
                  required
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <h2 className="font-semibold">Email</h2>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter new email"
                  className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-800 dark:border-gray-600 text-black dark:text-white"
                  required
                />
              </label>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 md:px-14 pb-14">
            <label className="form-control lg:w-[50%] w-full">
              <div className="label">
                <h2 className="font-semibold">Upload new Profile image</h2>
              </div>
              <label className="form-control w-full">
                <div className="label">
                  <button
                    type="button"
                    className="underline cursor-pointer text-black dark:text-white"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Add Image
                  </button>
                </div>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </label>
            {profileImage ? (
              <Image src={profileImage} alt="profile photo" width={200} height={200} />
            ) : (
              <Image src={formData.photoURL} alt="profile photo" width={20} height={20} />
            )}
          </div>
          
        </div>
        <div className="flex justify-center items-center py-12 gap-5 flex-col lg:flex-row">
          <button type="submit" className="bg-gradient-custom btn btn-primary w-1/2 md:w-1/6 text-white bg-black dark:bg-gray-600">
            Submit
          </button>
          <button
            type="button"
            onClick={handleDeleteUser}
            className="btn btn-error w-1/2 md:w-1/6"
          >
            Delete User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
