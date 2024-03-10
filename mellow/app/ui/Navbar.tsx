"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const pathname = usePathname();
	const router = useRouter();
	
	// If the user is not logged in, redirect to the login page
	// if (!user && !isLoading) {
	// 	router.push("/login");
	// }

  return (
    <nav
      className="flex h-20 w-full items-center px-10"
    >
      <div className="flex items-center justify-between flex-1">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">MELLOW</h1>
        <div className="flex">
        <Link className={`inline-flex h-13 items-center justify-center rounded-md mx-3 text-lg font-bold cursor-pointer relative before:absolute ${pathname == "/feed" ? "before:bg-amber-200" : "before:bg-sky-200"} before:bottom-0 before:right-0 before:h-full before:w-4/5 before:origin-bottom before:scale-y-[0.35] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500`} href="/feed">
            <span className="relative">Home</span>
          </Link>
          <Link className={`inline-flex h-13 items-center justify-center rounded-md mx-3 text-lg font-bold cursor-pointer relative before:absolute ${pathname == "/create" ? "before:bg-amber-200" : "before:bg-sky-200"} before:bottom-0 before:right-0 before:h-full before:w-4/5 before:origin-bottom before:scale-y-[0.35] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500`} href="/create">
            <span className="relative">Create</span>
          </Link>
          <Link className={`inline-flex h-13 items-center justify-center rounded-md mx-3 text-lg font-bold cursor-pointer relative before:absolute ${pathname == "/private" ? "before:bg-amber-200" : "before:bg-sky-200"} before:bottom-0 before:right-0 before:h-full before:w-4/5 before:origin-bottom before:scale-y-[0.35] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500`} href="#">
            <span className="relative">Private</span>
          </Link>
          <Link className={`inline-flex h-13 items-center justify-center rounded-md mx-3 text-lg font-bold cursor-pointer relative before:absolute ${pathname == "/account" ? "before:bg-amber-200" : "before:bg-sky-200"} before:bottom-0 before:right-0 before:h-full before:w-4/5 before:origin-bottom before:scale-y-[0.35] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500`} href="/account">
            <span className="relative">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

