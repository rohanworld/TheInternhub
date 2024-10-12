"use client";
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUser, UserType } from '@/store/slice';
import { toast } from "./ui/use-toast";
import { useState } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function Footer() {

    const [email, setEmail] = useState('');
    const user = useSelector(selectUser);

    const handleGuestClick = () => {
        toast({
            title: "Login to Access",
            description: "You need to login to use the feature",
        });
    };

    const renderLinkOrRedirect = (href: string, label: string) => {
        return user.userType !== UserType.Guest ? (
            <Link href={href} className="hover:underline">
                {label}
            </Link>
        ) : (
            <span onClick={handleGuestClick} className="cursor-pointer text-gray-500 hover:underline">
                {label}
            </span>
        );
    };

    const handleEmailSubmit = async () => {
        if (!email) {
            toast({
                title: "Error ❌",
                description: "Email cannot be empty",
            });
            return;
        }

        if (!validateEmail(email)) {
            toast({
                title: "Error ❌",
                description: "Please enter a Valid email address",
            });
            return;
        }

        try {
            const docRef = doc(db, 'newsletter-subs', email);
            const docSnap = await getDoc(docRef);

            // If the email already exists in the collection, show a message
            if (docSnap.exists()) {
                toast({
                    title: "You're already subscribed!",
                    description: "You have already joined our newsletter.",
                });
            } else {
                // Otherwise, add the email as a new document
                await setDoc(docRef, {
                    email,
                    subscribedAt: new Date(),
                });

                //   await sendWelcomeEmail(email);

                toast({
                    title: "Thank You for Subscribing!",
                    description: "You have successfully joined our newsletter. Stay tuned for updates!",
                });
            }
        } catch (error) {
            console.error("Error subscribing to newsletter: ", error);
            toast({
                title: "Error ❌",
                description: "An error occurred while subscribing. Please try again later.",
            });
        }
    };


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <footer className="bg-black text-white mt-10 py-8 px-4 md:px-8 dark:bg-gray-800 border-t border-white border-opacity-25">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-xl font-bold">Internhub</div>

                <div className="mt-4 md:mt-0 flex items-center mr-16">
                    <span className="mr-2 pr-6 text-lg">Ready to get started?</span>
                    <Link href="/auth/signin">
                        <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>

            {/* Horizontal Line */}
            <hr className="border-gray-700 my-6" />

            {/* Middle Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Newsletter Signup */}
                <div>
                    <div className="font-semibold mb-2">Join our newsletter</div>
                    <p className="mb-4">Get the latest job listings</p>
                    <div className="flex space-x-2 items-center">
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="px-4 py-2 bg-gray-900 text-white outline-none rounded-md focus:ring-2 focus:ring-gray-700 dark:border-white border"
                        />

                        <button onClick={handleEmailSubmit} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                            ➔
                        </button>
                    </div>
                </div>

                {/* Services Links */}
                <div>
                    <div className="font-semibold mb-2">Services</div>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/Internships" className="hover:underline">
                                Find a Job
                            </Link>
                        </li>
                        <li>
                            <Link href="/Adaptation" className="hover:underline">
                                Discover Companies
                            </Link>
                        </li>
                        <li>
                            <Link href="/Mentors" className="hover:underline">
                                Recruiter
                            </Link>
                        </li>
                    </ul>

                </div>

                {/* About Links */}
                <div>
                    <div className="font-semibold mb-2">About</div>
                    <ul className="space-y-2">
                    <li><Link href="/AboutUs" className="hover:underline">
                                Our Story
                            </Link></li>
                        <li>{renderLinkOrRedirect('/benefits', 'Benefits')}</li>
                            <li><Link href="/Team" className="hover:underline">
                                Team
                            </Link></li>
                            <li><Link href="/Careers" className="hover:underline">
                                Careers
                            </Link></li> 
                    </ul>
                </div>

                {/* Help Links */}
                <div>
                    <div className="font-semibold mb-2">Help</div>
                    <ul className="space-y-2">
                        <li><Link href="/FAQs" className="hover:underline">
                                FAQ
                            </Link></li>
                            <li><Link href="/ContactUs" className="hover:underline">
                                Contact Us
                            </Link></li> 
                        
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center pt-4">
                <div className="flex space-x-4">
                    <Link href="/terms" className="hover:underline">
                        Terms & Conditions
                    </Link>
                    <Link href="/privacy" className="hover:underline">
                        Privacy Policy
                    </Link>
                </div>

                <div className="mt-4 md:mt-0 flex space-x-4">
                    <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
                        <FaFacebook size={24} />
                    </Link>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
                        <FaTwitter size={24} />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
                        <FaInstagram size={24} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
