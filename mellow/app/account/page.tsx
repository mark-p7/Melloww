"use client";
import Navbar from "@/app/ui/Navbar";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Page() {
    let posts = 4;
    let comments = 0;
    let likes = 2;

    const router = useRouter();

    return (
        <>
            <Navbar />
            <div className="h-[calc(100% - 80px)] w-full py-6 space-y-6 mt-48">
                <div className="container space-y-4 px-4">
                    <div className="flex items-center justify-center">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">John Liddell</h1>
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="font-semibold">Posts</div>
                                <div className="font-semibold">{posts}</div>
                                <div className="font-semibold">Comments</div>
                                <div className="font-semibold">{comments}</div>
                                <div className="font-semibold">Likes</div>
                                <div className="font-semibold">{likes}</div>
                            </div>
                            <div>
                                <Button className="mt-5 mb-40" onClick={() => router.push("/api/auth/logout")}>Logout</Button>
                            </div>
                        </div>
                    </div>
                    <Alert className="mt-20 w-1/2 mx-auto">
                        <Sun className="h-4 w-4" />
                        <AlertTitle>Tip of the day!</AlertTitle>
                        <AlertDescription>
                            Smile! It's a new day and you're doing great!
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </>
    );
}
