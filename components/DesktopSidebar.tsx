import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setCategoryQ, categoryQ } from "@/store/slice";
import { auth, storage } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import CategoryIcon from "../public/menu.png"
import forumIcon from "../public/communication.png"
import forumIcon2 from "../public/chat.png"
import Image from "next/image";

// import { Playlist } from "../data/playlists"

type Playlist = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
  "Logic Discography",
  "Bedtime Beats",
  "Feeling Happy",
  "I miss Y2K Pop",
  "Runtober",
  "Mellow Days",
  "Eminem Essentials"
];

import { current } from "@reduxjs/toolkit";
import { use, useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import Loader from "@/components/ui/Loader";
import { setCategoryE, categoryE, change, setChange } from "@/store/slice";
import { useSelector, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { PlusCircleIcon } from "lucide-react";
import { Separator } from "./ui/separator";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Avatar } from "./ui/avatar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export function Sidebar({ className, playlists }: SidebarProps) {
  const sidebarCategory = [
    "Health",
    "Finance",
    "Marketing",
    "Technology",
    "Education",
    "Engineering",
    "Sales",
    "Human Resources",
    "Customer Service",
    "Legal",
    "Operations",
    "Product Management",
    "Consulting",
    "Arts & Design",
    "Data & Analytics",
    "Supply Chain",
    "Hospitality",
    "Construction",
    "Retail",
    "Real Estate",
  ];
  const categoryPosts = useSelector(categoryQ);
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const selectChange = (category: any) => {
    dispatch(setCategoryQ(category));
  };

  const [forums, setForums] = useState<any>([]);

  //fetching forums
  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(db, "forums");
        const forumsSnapshot = await getDocs(forumsCollection);

        const forumsData: any = [];
        forumsSnapshot.forEach((doc) => {
          // Assuming each forum document has fields like title, description, etc.
          const forumDetails = {
            uniqueForumName: doc.data().uniqueForumName,
            title: doc.data().name,
            description: doc.data().description,
            imageURL: doc.data().imageURL,
            // Add other fields as needed
          };
          forumsData.push(forumDetails);
        });

        setForums(forumsData);
        //console.log("Ls: ",forumsData)
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, []);

  return (
    <div>
      <div
        className={cn(
          "pb-1 rounded-lg max-h-[39rem] dark:bg-gray-800 bg-white shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]",
          className
        )}
      >
        <div className="space-y-4 py-2 mt-2">
          <div className="">
            <h2 className="px-3 tracking-tight">
              Categories
            </h2>
            <Command className="dark:bg-gray-800">
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  <Button
                    onClick={() => {
                      selectChange("all");
                    }}
                    variant={`${
                      categoryPosts == "all" ? "secondary" : "ghost"
                    }`}
                    className="w-full px-7 justify-start"
                  >
                    <CommandItem className="font-[15px] font-style-list">All</CommandItem>
                  </Button>
                </CommandGroup>
                <ScrollArea className="h-[200px]">
                <div>
                  {sidebarCategory ? (
                    sidebarCategory.map((categoryD: any, index: any) => (
                      <CommandGroup key={index}>
                        <div
                          onClick={() => {
                            selectChange(categoryD);
                          }}
                          // variant={`${
                          //   categoryPosts == categoryD ? "secondary" : "ghost"
                          // }`}
                          className="w-full px-3 py-[1px] justify-start font-style-list  cursor-pointer"
                        >
                          <CommandItem >
                          <div className="flex gap-3">
                          <div>
                          <div className="h-[18px] w-[18px]">
                      <div className=" relative w-full h-full aspect-square">
                        <Image
                          fill
                          src={
                          CategoryIcon
                          }
                          alt="profile picture"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* <AvatarFallback>SP</AvatarFallback> */}
                    </div>
                          </div>
                          <div className="text-black dark:text-white font-style-list  text-[15px]">{categoryD}</div>
                          </div>
                          </CommandItem>
                          {
                          index!=sidebarCategory.length-1&&<Separator />
                          }
                        </div>
                        
                      </CommandGroup>
                    ))
                  ) : (
                    <div>
                      <Loader />
                    </div>
                  )}
                </div>
                </ScrollArea>
              </CommandList>
            </Command>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "py-[14px] bt-1 border-black rounded-lg bg-[#ffffff] dark:bg-gray-800 mt-[20px] shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]",
          className
        )}
      >
        <div className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-transparent bg-clip-text relative px-3 font-bold tracking-tight flex items-center justify-between">
          <h2 className=" ">Forums</h2>
          {
          user?.isAnonymous==true?
          <div onClick={()=>{
            toast({
              title: "Login to Create Forum",
              description: "You need to login to create forum",
            });
          }}>
            <span>
              <PlusCircleIcon />
            </span>
          </div>:
          <Link href="/createForum">
            <span>
              <PlusCircleIcon />
            </span>
          </Link>
          }
        </div>
        <ScrollArea className="h-[140px] px-1">
          <div className="space-y-1 p-2">
            {forums ? (
              forums.map((forum: any, index: any) => (
                <div key={index}>
                  <div className="w-full py-2 text-base flex gap-3">
                  <div className="h-[20px] w-[20px]">
                      <div className=" relative w-full h-full flex items-center justify-center aspect-square">
                        <Image
                          fill
                          className="rounded-full"
                          src={forum.imageURL ? forum.imageURL : forumIcon2}
                          alt="profile picture"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* <AvatarFallback>SP</AvatarFallback> */}
                    </div>
                    <Link href={`/forums/${forum.uniqueForumName}`} className="font-style-list  dark:text-white ">
                      {forum.title}
                    </Link>
                  </div>
                  {index!=forums.length-1&&<Separator />}
                </div>
              ))
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
 