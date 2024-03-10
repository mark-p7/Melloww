"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Home() {
	const { user, error, isLoading } = useUser();
	const router = useRouter();
	
	// If the user is not logged in, redirect to the login page
	if (!user && !isLoading) {
		router.push("/login");
	}

	if (user && !isLoading) {
		router.push("/feed");
	}
	
	return (
		<main className="min-h-screen p-24">
		</main>
	);
}
