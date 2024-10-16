// import { Metadata } from "next"
// import Image from "next/image"

// import { Separator } from '@/components/ui/separator'
// import { SidebarNav } from "@/app/settings/components/sidebar-nav"

// export const metadata: Metadata = {
//   title: "Forms",
//   description: "Advanced form example using react-hook-form and Zod.",
// }

// const sidebarNavItems = [
//   {
//     title: "Create Question",
//     href: "/createForumPost",
//   },
  
// ]

// interface SettingsLayoutProps {
//   children: React.ReactNode
// }

// export default function SettingsLayout({ children }: SettingsLayoutProps) {
//   return (
//     <>
//     <div className="md:container md:max-w-7xl md:mx-auto mt-3">
      
//       <div className=" space-y-6 p-10 pb-16  bg-white dark:bg-[#262626] rounded-md font-dmsans">
//         <div className="space-y-0.5">
//           <h2 className="text-2xl font-bold tracking-tight">Post your Forum post here</h2>
//           <p className="text-muted-foreground">
//             Fill the form to post your thoughts.
//           </p>
//         </div>
//         <Separator className="my-6" />
//         <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
//           <aside className="-mx-4 lg:w-1/5 overflow-auto">
//             <SidebarNav items={sidebarNavItems} />
//           </aside>
//           <div className="flex-1 lg:max-w-2xl">{children}</div>
//         </div>
//       </div>
//       </div>
//     </>
//   )
// }

















// Dark Mode
import { Metadata } from "next";
import Image from "next/image";
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from "@/app/settings/components/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Create Question",
    href: "/createForumPost",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:container md:max-w-7xl md:mx-auto mt-3">
        <div className="space-y-6 p-10 pb-16 bg-white dark:bg-[#262626] rounded-md font-dmsans text-gray-900 dark:text-gray-100">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Post your Forum post here</h2>
            <p className="text-muted-foreground dark:text-gray-400">
              Fill the form to post your thoughts.
            </p>
          </div>
          <Separator className="my-6 border-gray-200 dark:border-gray-700" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 overflow-auto">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
