//Modified and completed
import Link from "next/link";
import React from "react";

import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon, Home, Newspaper, ScrollText, UserRoundPlus, UserRoundSearchIcon, Users } from "lucide-react";
import { auth } from "@/utils/firebase";

import { SheetClose } from "./ui/sheet";
import { resetUser, selectUser, UserType } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";



const Sidebar = () => {
    const { theme, setTheme } = useTheme();

    const dispatch = useDispatch();
    const router = useRouter();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const user = useSelector(selectUser);

  const renderLinkOrDisabled = (
    href: string,
    label: string,
    icon: JSX.Element,
    userType: UserType
  ) => {
    return user.userType !== UserType.Guest ? (
      <Link href={href}>
        <SheetClose className="flex gap-2">
          {icon}
          <p>{label}</p>
        </SheetClose>
      </Link>
    ) : (
      <span onClick={handleGuestClick} className="flex gap-2 cursor-pointer">
        {icon}
        <p>{label}</p>
      </span>
    );
  };
  
  const handleGuestClick = () => {
    toast({
      title: "Login to Access",
      description: "You need to login to use the feature",
    });
  };

  const handleSignOut = () => {
    auth.signOut();
    dispatch(resetUser());
    router.push("/");
  };

  return (
    <div className="font-dmsans space-y-4 py-4 flex flex-col h-full  text-black dark:text-white">
      
      <div className="pl-3 py-3 flex-1">
        <Link href="/" className="flex items-center pl-2 mb-14">
          <div className=" relative ">
            <h2 className=" text-xl font-extrabold">Internhub</h2>
          </div>
        </Link>

        <div className="pl-5">
          <ul className="flex flex-col ">
            <li className="cursor-pointer hover:text-gray-600 hover:font-bold">
              {renderLinkOrDisabled('/', 'Home', <Home />, user.userType)}
            </li>
            
            <li className="cursor-pointer mt-9 hover:text-gray-600 hover:font-bold">
              {renderLinkOrDisabled('/Internships', 'Internships', <BriefcaseIcon />, user.userType)}
            </li>

            <li className="cursor-pointer mt-9 hover:text-gray-600 hover:font-bold">
              {renderLinkOrDisabled('/Mentors', 'Mentors', <UserRoundSearchIcon />, user.userType)}
            </li>
            
            <li className="cursor-pointer mt-9 hover:text-gray-600 hover:font-bold">
              {renderLinkOrDisabled('/Adaptation', 'Adaptation', <Users />, user.userType)}
            </li>
            
            <li className="cursor-pointer mt-9 hover:text-gray-600 hover:font-bold">
              {renderLinkOrDisabled('/forums', 'Forums', <ScrollText />, user.userType)}
            </li>
            <li>
              <div className="flex gap-1 items-center mt-[1.8rem]">
                <Switch id="airplane-mode" onCheckedChange={toggleTheme} checked={theme==='dark'}/>
                <Label htmlFor="airplane-mode">Dark Mode</Label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className=" w-full bottom-4 flex items-center justify-center mt-10 right-4">
        <button className=" text-red-500 rounded-3xl w-[80%] " onClick={handleSignOut}>Log out</button>
      </div>
    </div>
  );
};

export default Sidebar;