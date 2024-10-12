"use client";

import { Tiptap } from "@/components/TipTapAns"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/ui/Loader"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { TrainingType } from "@/schemas/training"
import { UserType } from "@/store/slice"
import { RootState } from "@/store/store"
import { db, storage } from "@/utils/firebase"
import imageCompression from "browser-image-compression"
import { addDoc, arrayUnion, collection, doc,getDoc, getDocs, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LuXCircle } from "react-icons/lu"
import { useSelector } from "react-redux"
import { z } from "zod"


type Input = z.infer<typeof TrainingType>;

type Props = {}


const CreateTrainingForm = (props: Props) => {

    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.user);
    const [mainUser, setmainUser] = useState<any>();

    const { toast } = useToast();

    type SelectedCategoriesType = Record<string, string[]>;
    type MyMapType = {
        [key: string]: number;
    };


    const [imageUpload , setImageUpload] = useState<File | null>(null);
    const [tempSubCategory, setTempSubCategory] = useState<any>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [previewImg, setPreviewImg] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [progress , setProgress] = useState<number | null>(0);
    const [selectC, setSelectC] = useState<any>([]);
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategoriesType>({});
    const [selectCategory, setSelectCategory] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);


    const uploadImage = async(file: any) => {
        if(file == null) return;
    
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target) {
              const imageUrl = event.target.result;
              setPreviewImg(imageUrl);
            } else {
              console.error('Error reading file:', file);
              setPreviewImg(null);
            }
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewImg(null);
        }
    
        const storageRef = ref(storage, `trainings/${file.name}`);
    
        try {
          // Set compression options
        const options = {
          maxSizeMB: 1, // Max size in megabytes
          maxWidthOrHeight: 800, // Max width or height
          useWebWorker: true, // Use web worker for better performance (optional)
        };
      
          // Compress the image
          
          const compressedFile = await imageCompression(file, options);
    
        //uploading compressed file
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);
    
        uploadTask.on('state_changed', 
        (snapshot:any) => {
          // You can use this to display upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setProgress(progress);
        }, 
        (error: any) => {
          // Handle unsuccessful uploads
          console.log('Upload failed', error);
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            // Save the URL to state or wherever you want to keep it
            setImageUrl(downloadURL);
          });
        }
      );}catch(err){
        console.error('Error compressing or uploading image:', err);
      }
    
      }


      useEffect(()=>{
        const getCat=async()=>{
          try {
            const eventCategoriesRef = collection(db, 'meta-data', 'v1', 'forum-categories');
            const snapshot = await getDocs(eventCategoriesRef);
        
            const eventCategories:any = [];
            snapshot.forEach(doc => {
              eventCategories.push({ id: doc.id, ...doc.data() });
            });
        
            return eventCategories;
          } catch (error) {
            console.error('Error fetching event categories:', error);
            return [];
          }
        }
        const category = getCat().then(categories => {
            setSelectCategory(categories);
        }).catch(error => {
            console.error('Error:', error);
        });
      }, [])


    const handleMainCategoryChange = (newValue: string) => {
    setTempSubCategory([]);
    if(!selectC.includes(newValue)){
        setSelectC((prev:any)=>{
        return [...prev, newValue]
        })
    }
    setSelectedMainCategory(newValue);
    handleCategorySelectChange(newValue, undefined);
    };


    const handleCategorySelectChange = (category: string, subcategory: string | undefined) => {
        setSelectedCategories((prev: any) => {
          const updatedCategories = { ...prev };
          if (!updatedCategories[category]) {
            updatedCategories[category] = [];
          }
          if (subcategory && !updatedCategories[category].includes(subcategory)) {
            updatedCategories[category].push(subcategory);
          }
          return updatedCategories;
        });
        console.log(selectedCategories);
      };
    
      const delCategories = (category:string)=>{
        let newCategory=selectC.filter((cat:any)=>{
          console.log(cat, " ", category);
          return cat!=category;
        })
      setSelectC(newCategory);
      delete selectedCategories[category]
      //console.log(selectedCategories);
    }





    async function createTrainingPost(data: Input) {
        
        //console.log("creating");
    
        const docRef = await addDoc(collection(db, "trainings"), {
          title: data.title,
          description: data.description,
          uid: mainUser?.uid,
          profilePic: mainUser?.photoURL,
          name: mainUser?.name,
          createdAt: serverTimestamp(),
          questionImageURL: imageUrl,
          category: selectC,
          location : data.location,
          anonymity: data.anonymity,
          stipend: data.stipend,
          duration: data.duration,
          applyBy: data.applyBy,
          // ansNumbers: 0,
        });
    
        const trainingId = docRef.id;
    
        toast({
          title: "Training Posted",
          description: "Your Training has been posted successfully.",
        });

        router.push(`/`);
    
        try {
          for (const [mainCategory, subcategories] of Object.entries(selectedCategories)) {
            // Update Firestore for main category
            await updateDoc(doc(db, 'meta-data', 'v1', 'post-categories', mainCategory), {
              Posts: arrayUnion(docRef.id),
            });
      
            // Update Firestore for each subcategory
            for (const subcategory of subcategories) {
              await updateDoc(doc(db, 'meta-data', 'v1', 'post-categories', mainCategory), {
                [subcategory]: arrayUnion(docRef.id),
              });
            }
          }
      
          // Clear selected categories after submission
          setSelectedCategories({});
        } catch (error) {
          console.error('Error updating Firestore:', error);
        }
    
        try {
          console.log("keyword Gen.....")
          const docRef = await addDoc(collection(db, 'keywords'), {
            prompt: `Generate some keywords and hashtags on topic ${data.title} and give it to me in "**Keywords:**["Keyword1", "Keyword2",...] **Hashtags:**["Hashtag1", "Hashtag2",...]" this format`,
          });
          console.log('Keyword Document written with ID: ', docRef.id);
      
          // Listen for changes to the document
          const unsubscribe = onSnapshot(doc(db, 'keywords', docRef.id), async(snap) => {
            const data = snap.data();
            if (data && data.response) {
              console.log('RESPONSE: ' + data.response);
              const keywordsStr = `${data.response}`;
    
              const cleanedString = keywordsStr.replace(/\*|\`/g, '');
    
              const splitString = cleanedString.split("Keywords:");
              const keywordsString = splitString[1].split("Hashtags:")[0].trim();
              const hashtagsString = splitString[1].split("Hashtags:")[1].trim();
    
              const keywordsArray = JSON.parse(keywordsString);
              const hashtagsArray = JSON.parse(hashtagsString);
    
              const questionDocRef = doc(db, 'internships', trainingId);
              await updateDoc(questionDocRef, {
              keywords: keywordsArray,
              hashtags: hashtagsArray // Add your keywords here
          });
            }
          });
      
          // Stop listening after some time (for demonstration purposes)
          setTimeout(() => unsubscribe(), 60000);
        } catch (error) {
          console.error('Error adding document: ', error);
        }


        try {
          
          const followers = mainUser.followers;
          const notification = {
            title: `New Training : ${data.title}`,
            description: `${mainUser?.name} has posted a new Training`,
            link: `/training/${trainingId}`,
            viewed : false,
            createdAt: new Date().toISOString(),
          };

          for (const follower of followers) {
            const notificationRef = collection(db, 'users', follower, 'notifications');
            await addDoc(notificationRef, notification);
          }

        } catch (error) {
          console.error('Error updating Firestore:', error);
        }
    
        console.log("Document written with ID: ", docRef.id);
        //console.log(data);
      }

    
      useEffect(() => {
        // Assuming currentUser gets populated asynchronously
        if (currentUser !== undefined) {
          setIsLoading(false); // CurrentUser has been loaded
        }

        
        const func = async () => {
          const userRef = doc(db, 'users', currentUser?.uid ?? '');
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          console.log(userData);
          setmainUser(userData);
        }

        func();

      }, [currentUser]);
    
      useEffect(() => {
        if (!isLoading) {
          if (!currentUser?.uid) {
            router.push("/auth/signin");
          } 
          else if (currentUser.userType !== UserType.Organization) {
            router.push("/");
            toast({
              title: "You cannot create an training post",
              description: "You must be logged in as an organization to post an training.",
            });
          }
        }
      }, [isLoading, currentUser, router]);
    
    

//       const handleGuest = async ()=>{function InternshipForm() {
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      postType: '',
      location: '',
      stipend: '',
      duration: '',
      applyBy: '',
      anonymity: false,
    },
  });
  const onSubmit = (data: any) => {
    const formData = {
        ...data,
        createdAt: new Date().toISOString(), // Add the createdAt field here
      };
    
      createTrainingPost(formData);
    };



    return (
        <div className="w-full cursor-pointer">
    <Form {...form}>
        <form
        className="relative space-y-9"
        onSubmit={form.handleSubmit(onSubmit)}
        >
        {/* Title */}
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                <Input
                    placeholder="Training title"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Description */}
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <div className="border-black border-[1.2px] rounded-lg">
                <FormControl>
                <Tiptap
            {...field}
            setImageUpload={setImageUpload}
            uploadImage={uploadImage}
            progress={progress}
            />
                </FormControl>
                </div>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Category */}
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={""} onValueChange={handleMainCategoryChange} >
        <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Category" className="normal-case" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <div>
                {
                    selectCategory?
                    selectCategory.map((categoryD:any, index:any)=>(
                    <div key={index}>
                        <SelectItem value={categoryD.id}>{categoryD.id.split("|").join("/")}</SelectItem>
                    </div>
                    )):
                    <div><Loader/></div>
                }
                </div>
            <SelectItem value="Others">Others</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
        <div className="flex">
                {
                    selectC.map((category:string, index:number)=>{
                    return <span className='bg-slate-300 text-slate-800 rounded-xl p-1 text-sm flex mr-1 mt-3' key={index}>{category.split("|").join("/")} <span onClick={()=>{delCategories(category)}} className="mt-[0.27rem] ml-1 cursor-pointer text-slate-800 hover:text-slate-900"><LuXCircle /></span></span>
                    })
                }
                </div>  
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Location */}
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                <Input
                    placeholder="Location of the training"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Stipend */}
        <FormField
            control={form.control}
            name="stipend"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Stipend</FormLabel>
                <FormControl>
                <Input
                    placeholder="Stipend offered"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Duration */}
        <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                <Input
                    placeholder="Duration of the training"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Apply By */}
        <FormField
            control={form.control}
            name="applyBy"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Apply By</FormLabel>
                <FormControl>
                <Input
                    type="date"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Anonymity */}
        <FormField
            control={form.control}
            name="anonymity"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium">
                    Post Anonymously
                    <div className="text-[12px] font-normal opacity-70">
                    Hide your details while posting training
                    </div>
                </FormLabel>
                </div>
                <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
            </FormItem>
            )}
        />

        <Button type="submit" className="w-full">
            Post Training
        </Button>
        </form>
    </Form>
    </div>

    )
}

export default CreateTrainingForm
