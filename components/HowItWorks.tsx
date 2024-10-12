import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import { FaLaptop, FaChalkboardTeacher, FaRegHandshake, FaUserGraduate, FaTools } from "react-icons/fa";
import { FaUserCheck, FaClipboardList, FaLightbulb } from "react-icons/fa"; 

import Link from "next/link";

interface ContentItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    step: number;
}

const HowItWorks: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"students" | "business">("students");

    const content = {
        business: [
            {
                title: "Post a Project",
                description: "Create internship opportunities and define specific tasks.",
                icon: <FaTools size={40} />,
                step: 1,
            },
            {
                title: "Select Interns",
                description: "Choose from a pool of trained, highly motivated students.",
                icon: <FaUserGraduate size={40} />,
                step: 2,
            },
            {
                title: "Mentor & Track Progress",
                description: "Guide interns through real-world projects while monitoring their growth.",
                icon: <FaChalkboardTeacher size={40} />,
                step: 3,
            },
            {
                title: "Hire",
                description: "Upon successful completion, businesses can hire interns as full-time employees.",
                icon: <FaRegHandshake size={40} />,
                step: 4,
            },
        ],
        students: [
            {
                title: "Sign Up",
                description: "Create a profile, upload your resume, and showcase your skills.",
                // icon: <FaUserGraduate size={40} />,
                icon: <FaClipboardList size={40} />,
                step: 1,
            },
            {
                title: "Training Modules",
                description: "Complete industry-specific training courses tailored to your career aspirations.",
                icon: <FaLaptop size={40} />,
                step: 2,
            },
            {
                title: "Internship Placement",
                description: "Get matched with companies that align with your skillset and career goals.",
                // icon: <FaChalkboardTeacher size={40} />,
                icon: <FaUserCheck size={40} />, // Changed icon
                step: 3,
            },
            {
                title: "Mentorship",
                description: "Receive ongoing guidance and support from industry professionals.",
                // icon: <FaRegHandshake size={40} />,
                icon: <FaChalkboardTeacher  size={40} />, // Changed icon
                step: 4,
            },
        ],
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] bg-clip-text text-transparent text-5xl font-bold text-center mb-8">How Internhub Works?</h1>

            <div className="flex justify-center mb-6 space-x-1">
                <button
                    className={`${activeTab === "students"
                        ? "bg-[#3B82F6] text-white flex items-center"
                        : "bg-gray-100 text-gray-600 flex items-center"
                        } px-4 py-2 rounded-md text-sm md:text-base`}
                    onClick={() => setActiveTab("students")}
                >
                    <FaBriefcase className="mr-2" size={20} /> For students
                </button>
                <button
                    className={`${activeTab === "business"
                        ? "bg-[#3B82F6] text-white flex items-center"
                        : "bg-gray-100 text-gray-600 flex items-center"
                        } px-4 py-2 rounded-md text-sm md:text-base`}
                    onClick={() => setActiveTab("business")}
                >
                    <MdOutlineSell className="mr-2" size={20} /> For business
                </button>
            </div>

            <div className="flex flex-col space-y-6">
                {content[activeTab].map((item: ContentItem, index: number) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-2/3 h-auto mx-auto dark:bg-[#1F2937]"

                    >
                        {/* Icon on the top for mobile, left for desktop */}
                        <div className="flex items-center justify-center w-full md:w-1/4 h-24 border border-black dark:border-white rounded-full dark:border-gray-300 p-2">
                            {item.icon}
                        </div>


                        {/* Number, Title, and Description on the right */}
                        <div className="flex flex-col">
                            <div className="text-black font-bold text-2xl mb-2 dark:text-white">{item.step}</div>
                            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                            <p className="text-gray-600 dark:text-white">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add this section at the end of the content mapping */}
            <div className="flex justify-center mt-6">
            {activeTab === "students" ? (
                <Link href="/auth/signin">
                <button className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-white px-10 py-4 rounded-md text-lg font-semibold w-full md:w-auto">
                    Sign up today to jumpstart your career
                </button>
                </Link>
            ) : (
                <Link href="/auth/signin">
                <button className="bg-gradient-to-b from-[#7F5BC4] to-[#60A3E6] text-white px-10 py-4 rounded-md text-lg font-semibold w-full md:w-auto">
                    Find the right talent for your next project
                </button>
                </Link>
            )}
            </div>


        </div>
    );
};

export default HowItWorks;
