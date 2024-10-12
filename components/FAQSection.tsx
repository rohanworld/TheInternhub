import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What is InternHub?",
      answer: "InternHub is a platform designed to connect students with internship opportunities and empower them to kickstart their careers through personalized job matches, training, and mentorship."
    },
    {
      question: "How can I find the right internship?",
      answer: "You can search for internships directly on our platform or receive personalized recommendations based on your skills and preferences. Our matching system helps connect you with jobs that align with your career goals."
    },
    {
      question: "What resources does InternHub offer to boost my career?",
      answer: "InternHub provides various resources, including a profile creation tool to enhance your visibility, access to career guidance through our 'Career Centre,' and industry-specific training modules to develop your skills."
    },
    {
      question: "What are the steps to get started with InternHub?",
      answer: "To get started, simply sign up by creating a profile, uploading your resume, and showcasing your skills. Then, complete any relevant training modules to enhance your profile before getting matched with internship opportunities."
    },
    {
      question: "How does the mentorship program work?",
      answer: "Our mentorship program connects you with industry professionals who provide ongoing guidance and support throughout your internship journey, helping you navigate your career path effectively."
    },
    {
      question: "What makes InternHub a reliable platform for employers?",
      answer: "InternHub boasts a high recruitment success rate, with access to over 600,000 quality candidates in Ghana. Our platform allows employers to easily filter and manage applicants, ensuring they find the right fit for their job vacancies."
    }
  ];

  const toggleAccordion = (index:any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden dark:bg-[#111827]">
            <button
              className="w-full flex justify-between items-center p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              {activeIndex === index ? (
                <FiChevronUp className="text-blue-500" />
              ) : (
                <FiChevronDown className="text-gray-400" />
              )}
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                activeIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <p className="p-4 bg-white dark:bg-gray-900">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
