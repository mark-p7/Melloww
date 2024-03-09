// Navbar.js

"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YHT8dsuR0YB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function Navbar() {
  return (
    <nav
      className="grid h-20 w-full items-center px-10 shrink-0 md:px-30 border-gray-500 border-b"
    >
      <div className="flex items-center justify-between flex-1">
        <h1 className="text-7xl font-bold">MELLOW</h1>
        <div className="grid grid-cols-6 gap-4">
          <Link className="inline-flex h-13 items-center justify-center rounded-md px-6 text-lg font-bold" href="#">
            Create
          </Link>
          <Link className="inline-flex h-13 items-center justify-center rounded-md px-6 text-lg font-bold" href="#">
            Feed
          </Link>
          <Link className="inline-flex h-13 items-center justify-center rounded-md px-6 text-lg font-bold" href="#">
            Private
          </Link>
          <Link className="inline-flex h-13 items-center justify-center rounded-md px-6 text-lg font-bold" href="#">
            Account
          </Link>
        </div>
      </div>
    </nav>
  )
}

