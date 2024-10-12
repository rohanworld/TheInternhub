"use client"
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { auth } from "@/utils/firebase";
import { 
    selectUserType, 
    setUser, 
    resetUser, 
    setSearchText, 
    setEventSearchText, 
    categoryE, 
    categoryQ, 
    UserType,
    loadUserFromLocalStorage,
    selectUser
} from "@/store/slice";
import { collection, getDocs } from "firebase/firestore";
import { Bell, PlusCircle, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MobileSidebar from "./MobileSidebar";
import logo from '../public/logo.png';
import { RootState } from "@/store/store";
import { toast } from "./ui/use-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'text-blue-500' : 'text-white';

  // Selectors
  const user = useSelector(selectUser);

  const [hideQueSearch, setHideQueSearch] = useState(false);
  const [navSearchText, setNavSearchText] = useState("");

  useEffect(() => {
    setHideQueSearch(pathname === '/events');
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  }

  const handleSignIn = () => {
    router.push("/auth/signin");
  }

  const handleSignOut = () => {
    auth.signOut();
    dispatch(resetUser());
    router.push("/");
  };


  // State to handle the expansion of the search bar
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Refs for search input and container to manage focus and clicks
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Toggle the search bar expansion and focus input if expanding
  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100); // Delay focus to allow animation
    }
  };

  // Handle blur event to collapse search bar if clicking outside
  const handleSearchBlur = (e: React.FocusEvent) => {
    if (!searchContainerRef.current?.contains(e.relatedTarget as Node)) {
      setIsSearchExpanded(false);
    }
  };

  // Update search text and dispatch actions to update search state
  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavSearchText(e.target.value);
    dispatch(setSearchText(e.target.value));
    dispatch(setEventSearchText(e.target.value));
  };


  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  const renderButton = () => (
    // <Button variant="outline" className="rounded-3xl bg-white text-black hover:bg-white hover:text-black transition-colors">
      <Button variant="outline" className="rounded-3xl bg-white text-black hover:bg-gray-200 transition-colors">
      <PlusCircle className="w-4 h-4 mr-2 transition-transform transform hover:scale-110" />

      Ask a question
    </Button>
  );

  const renderNotificationButton = () => (
    <Button variant="ghost" className="p-2" id="notification-bell">
      <Bell className="h-5 w-7 transition-transform transform hover:scale-110" />

    </Button>
  );

  const handleGuestClick = () => {
    toast({
      title: "Login to Access",
      description: "You need to login to use the feature",
    });
  };

  const renderLinkOrText = (href: string, label: string) => {
    return (
      <Link href={href}>{label}</Link>
    )
  };
  

  return (
    <div className="fixed top-0 max-w-full inset-x-0 h-fit bg-[#000000] dark:bg-gray-950 z-[10] py-2">

      {/* Mobile Navbar */}
      <div className="lg:hidden flex justify-between px-2">
        <MobileSidebar />

        {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Link href="/">
              <Image alt="InternHub Logo" src={logo} width={40} height={300} />
            </Link>
          </div>
        </div> */}

        <Link href="/" className="pt-1 text-xl text-white ">InternHub</Link>


        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">

                <div className="relative w-full h-full aspect-square">
                  {user && user.photoURL ? (
                    <Image
                      
                      src={user.photoURL}
                      width={50}
                      height={50}
                      alt="profile picture"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                    
                      src="/authbgnew.jpg"
                      width={50}
                      height={50}
                      alt="default profile picture"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40  lg:w-56">
              {user.name ? (
                <>
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              ):(<></>)}
              <DropdownMenuGroup>
                <Link href={`${user.uid ? "/profilePage" : "/auth/signin"}`}>
                <DropdownMenuItem className="hover:bg-gray-200 transition-colors">Profile</DropdownMenuItem>

                </Link>
                <Link href={`${user.uid ? "/Dashboard" : "/auth/signin"}`}>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
                <Link href={`${user.uid ? "/Applications" : "/auth/signin"}`}>
                  <DropdownMenuItem>{user.userType === UserType.Student ? "Your Applications" : "Applicants"}</DropdownMenuItem>
                </Link>
                {user.userType === "organization" && <Link href="/createOpportunity">
                  <DropdownMenuItem>Post Opportunity</DropdownMenuItem>
                </Link>}
                <Link href={`${user.uid ? "/MentorMatch" : "/auth/signin"}`}>
                  <DropdownMenuItem>Mentor Match</DropdownMenuItem>
                </Link>
                <Link href={`${user.uid ? "/settings" : "/auth/signin"}`}>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <div className="mt-1 ml-2 mb-2">
                  <div className="flex items-center justify-between pr-1 space-x-2">
                    <Label htmlFor="dark-mode" >Dark Mode</Label>
                    <Switch id="dark-mode" onCheckedChange={toggleTheme} checked={theme === 'dark'} style={{
                      backgroundColor: theme === 'dark' ? '#333' : '#ccc', // Darker color for dark mode
                      borderColor: theme === 'dark' ? '#444' : '#bbb', // Darker border color
                    }} />
                  </div>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {user.uid ? (
                <DropdownMenuItem onClick={handleSignOut}>
                  Log Out
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleSignIn}>
                    Log In
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden container max-w-full h-[3rem] mx-auto lg:flex items-start justify-between text-white navbar flex-wrap">

        <div className="flex h-full items-center space-x-4">
          {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Link href="/">
                <Image alt="InternHub Logo" src={logo} width={40} height={300} />
              </Link>
            </div>
          </div> */}
          {/* <Link href="/" className="btn btn-ghost text-xl hover:bg-transparent">InternHub</Link> */}
          <Link href="/" className="pl-5 text-xl hover:text-white">InternHub</Link>

          {user.userType !== UserType.Guest && (
              <Link href="/createQue">
                {renderButton()}
              </Link>
            )
          }
          
          
        </div>

        <div className="flex items-center space-x-4 font-normal">
          <ul className="flex space-x-6 ">
          <li className={`${isActive('/')} hover:text-blue-400`}>
              {renderLinkOrText('/', 'Home')}
            </li>
            <li className={`${isActive('/Internships')} hover:text-blue-400`}>
              {renderLinkOrText('/Internships', 'Internships')}
            </li>
            <li className={`${isActive('/Mentors')} hover:text-blue-400`}>
              {renderLinkOrText('/Mentors', 'Mentors')}
            </li>
            <li className={`${isActive('/Adaptation')} hover:text-blue-400`}>
              {renderLinkOrText('/Adaptation', 'Adaptation')}
            </li>
            
            <li className={`${isActive('/forums')} hover:text-blue-400`}>
              {renderLinkOrText('/forums', 'Forum')}
            </li>
          </ul>
          {/* Notification Removed */}
          {/* {user.userType === UserType.Guest ? (
              <div onClick={handleGuestClick} className="cursor-pointer inline-block relative">
                {renderNotificationButton()}
              </div>
            ) : (
              <Link href="/notifications" className="inline-block relative">
                {renderNotificationButton()}
              </Link>
            )
          } */}
          

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer transition-transform transform hover:scale-110">

                <div className="relative w-full h-full aspect-square">
                  {user && user.photoURL ? (
                    <Image
                      width={50}
                      height={50}
                      src={user.photoURL}
                      alt="profile picture"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      width={50}
                      height={50}
                      src="/anonymous2.png"
                      alt="default profile picture"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40  lg:w-56">
              {user.name ? (
                <>
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={`${user.uid ? "/profilePage" : "/auth/signin"}`}>
                  <DropdownMenuItem className="hover:bg-gray-200 transition-colors">Profile</DropdownMenuItem>

                  </Link>
                </>
              ):(<></>)}
              <DropdownMenuGroup>
                
                <Link href={`${user.uid ? "/Dashboard" : "/auth/signin"}`}>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
                <Link href={`${user.uid ? "/Applications" : "/auth/signin"}`}>
                  <DropdownMenuItem>{user.userType === UserType.Student ? "Your Applications" : "Applicants"}</DropdownMenuItem>
                </Link>
                {user.userType === "organization" && <Link href="/createOpportunity">
                  <DropdownMenuItem>Post Opportunity</DropdownMenuItem>
                </Link>}
                <Link href={`${user.uid ? "/MentorMatch" : "/auth/signin"}`}>
                  <DropdownMenuItem>Mentor Match</DropdownMenuItem>
                </Link>
                <Link href={`${user.uid ? "/settings" : "/auth/signin"}`}>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <div className="mt-1 ml-2 mb-2">
                  <div className="flex items-center justify-between pr-1 space-x-2">
                    <Label htmlFor="dark-mode" >Dark Mode</Label>
                    <Switch id="dark-mode" onCheckedChange={toggleTheme} checked={theme === 'dark'} style={{
                      backgroundColor: theme === 'dark' ? '#333' : '#ccc', // Darker color for dark mode
                      borderColor: theme === 'dark' ? '#444' : '#bbb', // Darker border color
                    }} />
                  </div>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {user.uid ? (
                <DropdownMenuItem onClick={handleSignOut} className="font-semibold">
                  Log Out
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleSignIn} className="font-semibold">
                    Log In
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
