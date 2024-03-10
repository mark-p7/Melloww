"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Login() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    // If the user is logged in, redirect to the home page
    if (user && !isLoading) {
        router.push("/feed");
    }

    return (
        <>
            <div className="w-full h-full flex-col p-32">
                <div className="w-full sm:px-10 lg:px-48">
                    <h1 className="text-left font-bold tracking-tighter text-5xl mb-5">Welcome to <span className="text-amber-400">Mellow</span></h1>
                    <p className="text-left text-lg mb-8">

                        Your personal space to express, reflect, and connect over your daily emotional journey. Our application offers a unique blend of self-expression and community support, designed to promote mental well-being in a positive, user-friendly environment.
                    </p>
                    <div className="flex flex-col gap-2 ">
                        <Link
                            className="inline-flex h-10 items-center justify-center rounded-md bg-amber-400 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                            href="/api/auth/login"
                        >
                            Login
                        </Link>
                    </div>
                </div>
                <div className="w-full mt-20 sm:px-10 lg:px-48">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Express your emotions</AccordionTrigger>
                            <AccordionContent>
                                Easily record your daily thoughts and pair them with an emoji that best captures your mood. Our wide selection ensures that you can accurately express how you're feeling.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Track Your Emotional Journey</AccordionTrigger>
                            <AccordionContent>
                                Our app not only allows you to express your daily emotions but also helps you visualize and track your emotional trends over time, offering valuable insights into your well-being.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Connect and Support:</AccordionTrigger>
                            <AccordionContent>
                                When you decide to go public, other users can engage with your posts through likes, comments, and words of encouragement, fostering a nurturing environment where everyone can feel understood and supported.                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Privacy on your terms</AccordionTrigger>
                            <AccordionContent>
                                We prioritize your privacy. Choose to keep your posts private or share them with our supportive community. Control is always in your hands.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </>
    );
}
