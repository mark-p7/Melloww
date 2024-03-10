"use client";
import Navbar from "@/app/ui/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Page() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const [userDetails, setUserDetails] = useState(undefined) as any;
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (user) {
            axios.post("http://localhost:8080/user", {
                identifier: user.email
            }).then(res => {
                setUserName(res.data.username);
                setUserDetails(res.data);
            });
        }
    }, [user]);

    const updateName = () => {
        axios.post("http://localhost:8080/user/updateName", {
            identifier: user?.email,
            username: userName
        }).then(res => {
            setUserDetails(res.data);
        });
    }

    return (
        <>
            <Navbar />
            {userDetails && <>
                <div className="h-[calc(100% - 80px)] w-full py-6 space-y-6 mt-48">
                    <div className="container space-y-4 px-4">
                        <div className="flex items-center justify-center">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold">{userDetails?.username || "Anon"}</h1>
                                <div className="flex items-center space-x-2 text-sm">
                                    <div className="font-semibold">Posts</div>
                                    <div className="font-semibold">{userDetails?.journalIds?.length || 0}</div>
                                    <div className="font-semibold">Comments</div>
                                    <div className="font-semibold">{userDetails?.commentIds?.length || 0}</div>
                                    <div className="font-semibold">Likes</div>
                                    <div className="font-semibold">{userDetails?.likedJournals?.length || 0}</div>
                                </div>
                                <div>
                                    <Sheet>
                                        <SheetTrigger>
                                            <Button className="mt-5 mb-40 mx-2" variant={"outline"}>Edit Name</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Edit profile</SheetTitle>
                                                <SheetDescription>
                                                    Make changes to your profile here. Click save when you're done.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input id="name" value={userName} className="col-span-3" onChange={(e) => { setUserName(e.target.value) }} />
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <Button type="submit" onClick={() => { updateName() }}>Save changes</Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>

                                    </Sheet>
                                    <Button className="mt-5 mb-40 mx-2" onClick={() => router.push("/api/auth/logout")}>Logout</Button>
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
            </>}
        </>
    );
}
