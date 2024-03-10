"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import Navbar from '../../ui/Navbar';
import axios from 'axios';
import { Heart, HeartIcon } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toggle } from "@/components/ui/toggle"

export default function Journal({ params }: { params: { journalEntryId: string } }) {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const [journal, setJournal] = useState({} as any);
    const [comments, setComments] = useState([] as any[]);
    const [userDetails, setUserDetails] = useState({} as any);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (user) {
            axios.post("http://localhost:8080/user", {
                identifier: user.email
            }).then(res => {
                setUserDetails(res.data);
            });
        }
    }, [user]);

    useEffect(() => {
        if (params?.journalEntryId) {
            axios.get(`http://localhost:8080/journals/${params.journalEntryId}`).then(res => {
                if (res?.data?.Public == true) {
                    console.log(res.data)
                    setJournal(res.data);
                }
            });
        }
    }, []);

    const refreshUserDetails = () => {
        if (user) {
            axios.post("http://localhost:8080/user", {
                identifier: user.email
            }).then(res => {
                setUserDetails(res.data);
            });
        }
    }

    const refreshJournal = () => {
        axios.get(`http://localhost:8080/journals/${params.journalEntryId}`).then(res => {
            if (res?.data?.Public == true) {
                setJournal(res.data);
            }
        });
    }

    const refreshComments = () => {
        axios.post(`http://localhost:8080/api/comment/getByDate/${params.journalEntryId}`).then(res => {
            setComments(res.data);
        });
    }

    useEffect(() => {
        if (journal?.CommentID?.length > 0) {
            axios.post(`http://localhost:8080/api/comment/getByDate/${params.journalEntryId}`).then(res => {
                console.log(res.data);
                setComments(res.data);
            });
        }
    }, [journal]);

    const createComment = (text: string) => {
        if (text != undefined && text.length == 0) return;
        axios.post(`http://localhost:8080/api/comment/create`, { userId: userDetails?._id || "", journalId: journal?._id || "", commentText: text }).then(res => {
            setComments([...comments, res.data]);
            setComment("");
        });
    }

    const likeComment = (commentId: string) => {
        axios.post(`http://localhost:8080/api/comment/like`, { userId: userDetails?._id || "", commentId: commentId }).then(res => {
            refreshComments();
        });
    }

    const likeJournal = () => {
        axios.post(`http://localhost:8080/api/journal/like`, { userId: userDetails?._id || "", journalId: journal?._id || "" }).then(res => {
            refreshJournal();
            refreshUserDetails();
        });
    }

    return (
        <>
            <Navbar />
            <div className="w-full h-[calc(100% - 80px)] flex flex-col items-center p-8">
                {
                    journal && <>
                        <div
                            className="flex flex-col items-center justify-center p-10 rounded-lg shadow-lg h-full w-5/6"
                            style={{ backgroundColor: `${journal.Color}` }}
                        >
                            {/* Emoji container */}
                            <div className="w-full h-20 flex items-center justify-center rounded" >
                                <span className="text-5xl">{journal.Emoji}</span>
                                <span className="text-lg font-bold text-gray-800">
                                    {journal.Title}
                                </span>
                            </div>
                            <div className='flex mb-4 font-bold text-gray-800 text-md'>
                                <Heart className={`mx-2 cursor-pointer ${(userDetails && userDetails?.likedJournals?.includes(journal._id)) ? 'text-red-500 scale-110' : 'text-gray-400'} transition-transform duration-150 ease-in-out`}
                                    onClick={() => {
                                        likeJournal();
                                    }}
                                /> {journal.Likes || 0}
                            </div>
                            <div>
                                <p className="text-md font-semibold text-gray-800">
                                    {journal.EntryText}
                                </p>
                            </div>
                            {/* Title */}

                        </div>
                        <div className="w-4/5 mt-10 rounded">
                            <Label htmlFor="picture">Comment</Label>
                            <Input id="Comment" placeholder='Comment...' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                            <div className='w-full flex justify-end'>
                                <Button size={"sm"} onClick={() => { createComment(comment) }} className="mt-4">Comment</Button>
                            </div>
                        </div>
                        <div className="w-4/5 my-8">
                            {comments?.length > 0 && comments.map((comment, index) => (
                                <React.Fragment key={index}>
                                    {comment != null &&
                                        <>
                                            {comment != null &&
                                                <div className="rounded-lg shadow p-4 h-full my-3">
                                                    <div className="flex w-full">
                                                        <div className="w-full">
                                                            <div className="flex justify-between font-semibold w-full">
                                                                <h1>Anon</h1>
                                                                <div className='flex'>
                                                                    <HeartIcon
                                                                        className={`mx-2 cursor-pointer ${(comment.usersWhoLiked.includes(userDetails._id)) ? 'text-red-500 scale-110' : 'text-gray-400'} transition-transform duration-150 ease-in-out`}
                                                                        onClick={() => {
                                                                            likeComment(comment._id);
                                                                        }}
                                                                    />
                                                                    {comment.likes || 0}
                                                                </div>
                                                            </div>
                                                            <div className='w-full'>
                                                                {comment.commentText}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }
                                </React.Fragment>
                            ))}
                        </div>
                    </>
                }

            </div>
        </>
    );
}
