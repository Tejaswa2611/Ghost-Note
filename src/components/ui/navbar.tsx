"use client"
import React from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./button"
import { MessagesSquare } from "lucide-react"

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            <MessagesSquare className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            GhostNote
                        </span>
                    </Link>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                {/* User Welcome */}
                                <div className="hidden md:flex items-center space-x-3 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700/50">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-white">
                                            {(user?.username || user?.email)?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <Link href="/dashboard" className="text-gray-300 font-medium hover:underline focus:outline-none">
                                        Welcome, {user?.username || user?.email}
                                    </Link>
                                </div>
                                
                                {/* Mobile User Indicator */}
                                <div className="md:hidden w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">
                                        {(user?.username || user?.email)?.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {/* Sign Out Button */}
                                <Button 
                                    className="group relative px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                                    onClick={() => signOut()}
                                >
                                    <span className="relative z-10">Sign Out</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href='/sign-in'>
                                    <Button className="group relative px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                                        <span className="relative z-10">Sign In</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    </Button>
                                </Link>
                                <Link href='/sign-up'>
                                    <Button className="px-6 py-2 border-2 border-purple-400/50 rounded-xl font-semibold text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300 hover:scale-105 bg-transparent">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;
