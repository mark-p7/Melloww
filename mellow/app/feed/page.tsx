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
import axios from "axios";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Journal {
  _id: string;
  EntryID: string; // Change this based on your actual data structure
  Emoji: string;
  Title: string;
  Color: string;
  // Add other properties as needed
}

export default function Feed() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [userDetails, setUserDetails] = useState({} as any);
  const enteriesPerPage = 8;
  const lastPage =
    Math.ceil(journals.length / enteriesPerPage) * enteriesPerPage;
  console.log(lastPage);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(enteriesPerPage);

  useEffect(() => {
    if (user) {
      axios.post("http://localhost:8080/user", {
        identifier: user.email
      }).then(res => {
        setUserDetails(res.data);
      });
    }
  }, [user]);

  const refreshUserDetails = () => {
    if (user) {
      axios.post("http://localhost:8080/user", {
        identifier: user.email
      }).then(res => {
        setUserDetails(res.data);
      });
    }
  }
  // Example journals data - replace this with actual data fetching logic
  // const [journals, setJournals] = useState([
  //   { id: 1, emoji: '😊', title: 'Fun day at work' },
  //   { id: 2, emoji: '🚀', title: 'Started a new project' },
  //   { id: 3, emoji: '🌟', title: 'Met with an old friend' },

  // ]);

  const [selectedFilter, setSelectedFilter] = useState("");

  const fetchRandomJournals = async () => {
    try {
      const response = await axios.get("http://localhost:8080/journals/random");
      // Assuming the API returns an array with a single random journal
      setJournals(response.data);
    } catch (error) {
      console.error("Error fetching random journal:", error);
    }
  };

  const fetchDateJournals = async () => {
    try {
      const response = await axios.get("http://localhost:8080/journals/date");
      // Assuming the API returns an array with a single random journal
      setJournals(response.data);
    } catch (error) {
      console.error("Error fetching random journal:", error);
    }
  };

  const fetchUserJournals = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/journals/user`, { userId: userDetails?._id || "" });
      // Assuming the API returns an array with a single random journal
      setJournals(response.data);
    } catch (error) {
      console.error("Error fetching random journal:", error);
    }
  };

  const handleFilterChange = (newValue: string) => {
    setSelectedFilter(newValue);
    if (newValue === "random") {
      fetchRandomJournals();
    } else if (newValue === "date") {
      fetchDateJournals();
    } else if (newValue === "user") {
      fetchUserJournals();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/journals");
        setJournals(response.data);
        console.log("Got journals");
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated Journals:", journals);
  }, [journals]);

  return (
    <>
      <Navbar />
      {journals?.length > 0 &&
        <div className="w-full h-[calc(100% - 80px)] flex flex-col items-center py-8 px-4 lg:px-32">
          <div className="w-full max-w-screen-xl">
            <Select onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="user">My Journals</SelectItem>
              </SelectContent>
            </Select>

            {/* Adjust max width as needed */}
            <h1 className="text-left font-bold tracking-tighter text-5xl mb-5"></h1>
            {/* ... other content */}
            {/* Cards container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8">
              {journals.slice(startIndex, endIndex).map((journal) => (
                <div
                  key={journal.EntryID}
                  className="flex flex-col items-center justify-center p-10 rounded-lg shadow-lg cursor-pointer"
                  style={{ width: "250px", backgroundColor: `${journal.Color}` }}
                  onClick={() => {
                    router.push(`/feed/${journal?._id}`);
                  }}
                >
                  {/* Emoji container */}
                  <div className="w-20 h-20 flex items-center justify-center rounded mb-4">
                    <span className="text-5xl">{journal.Emoji}</span>
                  </div>
                  {/* Title */}
                  <span className="text-md font-bold text-gray-700">
                    {journal.Title}
                  </span>
                </div>
              ))}
            </div>
            <Pagination className="absolute inset-x-0 bottom-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      startIndex === 0
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={() => {
                      setStartIndex(startIndex - enteriesPerPage);
                      setEndIndex(endIndex - enteriesPerPage);
                    }}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    className={
                      endIndex === lastPage
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={() => {
                      setStartIndex(startIndex + enteriesPerPage);
                      setEndIndex(endIndex + enteriesPerPage);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      }
    </>
  );
}
