"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import Navbar from "../ui/Navbar";

export default function Feed() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  // Example journals data - replace this with actual data fetching logic
  const [journals, setJournals] = useState([
    { id: 1, emoji: "😊", title: "Fun day at work" },
    { id: 2, emoji: "🚀", title: "Started a new project" },
    { id: 3, emoji: "🌟", title: "Met with an old friend" },
    { id: 1, emoji: "😊", title: "Fun day at work" },
    { id: 2, emoji: "🚀", title: "Started a new project" },
    { id: 3, emoji: "🌟", title: "Met with an old friend" },
    { id: 1, emoji: "😊", title: "Fun day at work" },
    { id: 2, emoji: "🚀", title: "Started a new project" },
    { id: 3, emoji: "🌟", title: "Met with an old friend" },
    { id: 1, emoji: "😊", title: "Fun day at work" },
    { id: 2, emoji: "🚀", title: "Started a new project" },
    { id: 3, emoji: "🌟", title: "Met with an old friend" },
    { id: 1, emoji: "😊", title: "Fun day at work" },
    { id: 2, emoji: "🚀", title: "Started a new project" },
    { id: 3, emoji: "🌟", title: "Met with an old friend" },
  ]);

  useEffect(() => {
    // Here you would fetch the journals from your API instead of using the static data above
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full h-[calc(100% - 80px)] flex flex-col items-center py-8 px-4 lg:px-32">
        <div className="w-full max-w-screen-xl">
          {" "}
          {/* Adjust max width as needed */}
          <h1 className="text-left font-bold tracking-tighter text-5xl mb-5">


              <select className="text-sm" name="pets" id="pet-select">
                <option value="">Random</option>
                <option value="dog">date</option>
                <option value="cat">author</option>
              </select>

          </h1>
          {/* ... other content */}
          {/* Cards container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="flex flex-col items-center justify-center p-10 rounded-lg shadow-lg"
                style={{
                  width: "250px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {/* Emoji container */}
                <div className="w-20 h-20 flex items-center justify-center rounded mb-4">
                  <span className="text-5xl">{journal.emoji}</span>
                </div>
                {/* Title */}
                <span className="text-md font-bold">{journal.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
