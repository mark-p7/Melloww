"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
	const { user, error, isLoading } = useUser();
	const router = useRouter();

	// If the user is not logged in, redirect to the login page
	if (!user && !isLoading) {
		// console.log(user);
		router.push("/login");
	}

	return (
		<main className="min-h-screen p-24">
			{user && <>
				{user.name} is logged in
			</>}
			<br />
			<Link href="/api/auth/logout">Logout</Link>
		</main>
	);
}
