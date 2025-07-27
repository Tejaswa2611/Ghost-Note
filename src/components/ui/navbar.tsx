"use client"
import React, { useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./button"
import { MessagesSquare, Loader2 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user;
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut()
        } finally {
            // Reset loading state after a delay (in case signOut doesn't redirect immediately)
            setTimeout(() => setIsSigningOut(false), 2000)
        }
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-lg transition-colors duration-300">
            <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            <MessagesSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            FeedForward
                        </span>
                    </Link>

                    {/* User Section */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Engineering Link - Simple Text */}
                        <Link href="/engineering" className="text-muted-foreground hover:text-foreground font-extrabold tracking-wider underline underline-offset-4 decoration-2 transition-colors duration-200 text-base sm:text-lg">
                            Engineering
                        </Link>
                        
                        {/* Theme Toggle */}
                        <ThemeToggle />
                        
                        {session ? (
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {/* User Welcome */}
                                <div className="hidden md:flex items-center space-x-3 bg-muted/80 rounded-full px-4 py-2 border border-border">
                                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-primary-foreground">
                                            {(user?.username || user?.email)?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <Link href="/dashboard" className="text-foreground font-medium hover:underline focus:outline-none">
                                        Welcome, {user?.username || user?.email}
                                    </Link>
                                </div>
                                
                                {/* Mobile User Indicator */}
                                <Link href="/dashboard" className="md:hidden">
                                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                        <span className="text-sm font-semibold text-primary-foreground">
                                            {(user?.username || user?.email)?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </Link>

                                {/* Sign Out Button */}
                                <Button 
                                    className="group relative px-3 sm:px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 text-sm sm:text-base disabled:opacity-50 disabled:hover:scale-100"
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                >
                                    <span className="relative z-10 flex items-center">
                                        {isSigningOut ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Signing Out...
                                            </>
                                        ) : (
                                            'Sign Out'
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Link href='/sign-in'>
                                    <Button className="group relative px-3 sm:px-6 py-2 bg-gradient-primary hover:opacity-90 rounded-xl font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 text-sm sm:text-base">
                                        <span className="relative z-10">Sign In</span>
                                        <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
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
