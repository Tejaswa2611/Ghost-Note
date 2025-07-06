'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search, MessageCircle, MessagesSquare } from 'lucide-react'

const NotFound = () => {
    const { data: session } = useSession()
    const [isClient, setIsClient] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsClient(true)
        setIsLoaded(true)
    }, [])

    // Determine the home URL based on authentication status
    const homeUrl = session ? '/dashboard' : '/'
    const homeText = session ? 'Back to Dashboard' : 'Back to Home'

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>

                {/* Floating particles */}
                {isClient && [...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"
                        style={{
                            left: `${(i * 7 + 13) % 100}%`,
                            top: `${(i * 11 + 17) % 100}%`,
                            animationDelay: `${(i * 0.3) % 5}s`,
                            animationDuration: `${3 + (i % 4)}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <Card className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500 shadow-2xl">
                    <CardContent className="p-12">
                        {/* Animated Ghost Logo */}
                        <div className={`flex justify-center mb-8 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center animate-bounce shadow-2xl">
                                    <MessagesSquare className="h-12 w-12 text-white" />
                                </div>
                                <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-20 animate-pulse"></div>
                            </div>
                        </div>

                        {/* 404 Number */}
                        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">
                                404
                            </h1>
                        </div>

                        {/* Error Message */}
                        <div className={`mb-8 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Oops! Page Not Found
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                The page you&apos;re looking for seems to have vanished into thin air, just like a ghost!
                                It might have been moved, deleted, or you entered the wrong URL.
                            </p>
                        </div>



                        {/* Action Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <Link href={homeUrl}>
                                <Button className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                                    <span className="relative z-10 flex items-center justify-center">
                                        <Home className="h-5 w-5 mr-2" />
                                        {homeText}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </Button>
                            </Link>

                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="px-8 py-3 border-2 border-purple-400/50 rounded-xl font-semibold text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300 hover:scale-105 bg-transparent"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Go Back
                            </Button>
                        </div>

                        {/* Fun Quote */}
                        <div className={`mt-12 transform transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="border-t border-slate-600/50 pt-8">
                                <p className="text-gray-500 italic">
                                    &quot;Not all who wander are lost, but this page definitely is!&quot;
                                    <span className="text-purple-400 ml-2">- GhostNote Team</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default NotFound
