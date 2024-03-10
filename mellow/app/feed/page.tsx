"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from 'react';
import Navbar from '../ui/Navbar';
import axios from 'axios';
import Records from '@/components/ui/journal';
import Pagination from '@/components/ui/pagination';

interface Journal {
  EntryID: string; // Change this based on your actual data structure
  Emoji: string;
  Title: string;
  // Add other properties as needed
}

export default function Feed() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(1);

  // Example journals data - replace this with actual data fetching logic
  // const [journals, setJournals] = useState([
  //   { id: 1, emoji: '😊', title: 'Fun day at work' },
  //   { id: 2, emoji: '🚀', title: 'Started a new project' },
  //   { id: 3, emoji: '🌟', title: 'Met with an old friend' },

  // ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/journals");
        setJournals(response.data);
        console.log("Got journals");
        console.log(response.data);
        setLoading(false);        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
  }, []); 
  
  useEffect(() => {
    console.log("Updated Journals:", journals);
  }, [journals]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = journals.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(journals.length / recordsPerPage)
  
  return (
    <>
      <Navbar />
      <div className="w-full h-[calc(100% - 80px)] flex flex-col items-center py-8 px-4 lg:px-32">
        <div className="w-full max-w-screen-xl"> {/* Adjust max width as needed */}

          <h1 className="text-left font-bold tracking-tighter text-5xl mb-5">
          </h1>
          {/* ... other content */}

          {/* Cards container */}
          <Records journals={currentRecords}/>
          <div><Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /></div>
        </div>
      </div>
    </>
  );
}
