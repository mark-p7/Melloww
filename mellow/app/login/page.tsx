"use client";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    // If the user is logged in, redirect to the home page
    if (user && !isLoading) {
        router.push("/");
    }

    return (
        <main className="min-h-screen p-24">
            <Link href="/api/auth/login">Login</Link>
        </main>
    );
}
