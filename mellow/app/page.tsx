"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

export default function Home() {
	const { user, error, isLoading } = useUser();
	const router = useRouter();
	
	// If the user is not logged in, redirect to the login page
	if (!user && !isLoading) {
		router.push("/login");
	}

	if(user){
		axios.post("http://localhost:8080/user", {
			identifier: user.email
		}).then(res => {
			console.log(user.email);
			console.log(res);
		});
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
