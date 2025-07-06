'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, Sparkles, MessagesSquare, ArrowLeft, Heart } from 'lucide-react'
import axios from 'axios'

interface SuggestedMessage {
    id: number
    text: string
}

const UserProfilePage = () => {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userExists, setUserExists] = useState<boolean | null>(null)
    const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean | null>(null)
    const [isClient, setIsClient] = useState(false)
    const [suggestedMessages, setSuggestedMessages] = useState<SuggestedMessage[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('general')

    const username = params.username as string

    // Message categories for different types of suggestions
    const categories = [
        { id: 'general', label: '💬 General', description: 'Friendly conversation starters' },
        { id: 'creative', label: '🎨 Creative', description: 'Artistic and imaginative questions' },
        { id: 'motivational', label: '💪 Motivational', description: 'Inspiring and uplifting messages' },
        { id: 'friendly', label: '😊 Casual', description: 'Fun and lighthearted topics' },
        { id: 'thoughtful', label: '🤔 Deep', description: 'Meaningful and introspective questions' }
    ]

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Fallback suggested messages (used when GPT is not available)
    const fallbackMessages = useMemo(() => [
        { id: 1, text: "What's something that made you smile today?" },
        { id: 2, text: "If you could travel anywhere right now, where would you go?" },
        { id: 3, text: "What's a hobby you've recently started or want to try?" },
        { id: 4, text: "What's the best advice you've ever received?" },
        { id: 5, text: "If you could have dinner with any historical figure, who would it be?" },
        { id: 6, text: "What's a song that always puts you in a good mood?" }
    ], [])

    // Generate GPT suggestions
    const generateSuggestions = useCallback(async (category: string = 'general') => {
        setIsLoadingSuggestions(true)
        try {
            const response = await axios.post('/api/suggest-message', {
                username,
                category
            })

            if (response.data.success && response.data.suggestions) {
                const formattedSuggestions = response.data.suggestions.map((text: string, index: number) => ({
                    id: index + 1,
                    text
                }))
                setSuggestedMessages(formattedSuggestions)

                if (response.data.source === 'openai') {
                    toast({
                        title: 'Fresh suggestions generated! ✨',
                        description: `AI-powered ${category} messages for ${username}`,
                    })
                }
            } else {
                // Use fallback if API fails
                setSuggestedMessages(fallbackMessages)
            }
        } catch (error) {
            console.error('Failed to generate suggestions:', error)
            setSuggestedMessages(fallbackMessages)
            toast({
                title: 'Using preset suggestions',
                description: 'AI suggestions are temporarily unavailable.',
            })
        } finally {
            setIsLoadingSuggestions(false)
        }
    }, [username, toast, fallbackMessages])

    // Load initial suggestions
    useEffect(() => {
        if (username && isClient) {
            generateSuggestions(selectedCategory)
        }
    }, [username, isClient, selectedCategory, generateSuggestions])

    // Check if user exists and is accepting messages
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await axios.get(`/api/check-user-status?username=${username}`)
                setUserExists(true)
                setIsAcceptingMessages(response.data.isAcceptingMessages)
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setUserExists(false)
                } else {
                    setUserExists(true)
                    setIsAcceptingMessages(false)
                }
            }
        }

        if (username) {
            checkUserStatus()
        }
    }, [username])

    const sendMessage = async () => {
        if (!message.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a message before sending.'
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post('/api/send-messaage', {
                username,
                content: message.trim()
            })

            toast({
                title: 'Success!',
                description: 'Your message has been sent anonymously.',
            })
            setMessage('')
        } catch (error: any) {
            let errorMessage = 'Failed to send message. Please try again.'

            if (error.response?.status === 404) {
                errorMessage = 'User not found.'
                setUserExists(false)
            } else if (error.response?.status === 403) {
                errorMessage = 'This user is not accepting messages right now.'
                setIsAcceptingMessages(false)
            }

            toast({
                title: 'Error',
                description: errorMessage
            })
        } finally {
            setIsLoading(false)
        }
    }

    const selectSuggestedMessage = (suggestedText: string) => {
        setMessage(suggestedText)
    }

    // Show loading state while checking user
    if (userExists === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <MessagesSquare className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-bounce" />
                    <p className="text-gray-300">Loading...</p>
                </div>
            </div>
        )
    }

    // Show error if user doesn't exist
    if (userExists === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <MessagesSquare className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
                    <p className="text-gray-400 mb-6">
                        The user &quot;@{username}&quot; doesn&apos;t exist or may have been removed.
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back Home
                    </Button>
                </div>
            </div>
        )
    }

    // Show message if user is not accepting messages
    if (isAcceptingMessages === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-4">Messages Paused</h1>
                    <p className="text-gray-400 mb-6">
                        @{username} is not accepting messages at the moment. Please try again later.
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back Home
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Floating particles */}
                {isClient && [...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
                        style={{
                            left: `${(i * 7 + 10) % 100}%`,
                            top: `${(i * 11 + 15) % 100}%`,
                            animationDelay: `${(i * 0.3) % 6}s`,
                            animationDuration: `${3 + (i % 4)}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <MessagesSquare className="h-10 w-10 text-purple-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Send Anonymous Message
                        </h1>
                    </div>
                    <p className="text-gray-200 text-xl mb-3">
                        Send an anonymous message to <span className="text-purple-400 font-semibold">@{username}</span>
                    </p>
                    <p className="text-gray-400 text-base">
                        Your identity will remain completely anonymous
                    </p>
                </div>

                {/* Message Input Section */}
                <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/60 hover:border-purple-500/40 transition-all duration-300 mb-8">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-white text-xl">
                            <MessageCircle className="h-6 w-6 text-purple-400" />
                            Your Message
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-base">
                            Write your anonymous message below. Be kind and respectful.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Textarea
                            placeholder="Type your anonymous message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-40 bg-slate-700/60 border-slate-600/60 text-white placeholder:text-gray-400 focus:border-purple-500/60 focus:ring-purple-500/20 resize-none text-base leading-relaxed p-4"
                            maxLength={500}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                {message.length}/500 characters
                            </span>
                            <Button
                                onClick={sendMessage}
                                disabled={isLoading || !message.trim()}
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 disabled:opacity-50 px-8 py-3"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Suggested Messages Section */}
                <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/60 mb-8">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-white text-xl">
                                    <Sparkles className="h-6 w-6 text-purple-400" />
                                    AI-Powered Message Ideas
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-base">
                                    Not sure what to say? Get some AI-generated suggestions to inspire you!
                                </CardDescription>
                            </div>
                            <Button
                                onClick={() => generateSuggestions(selectedCategory)}
                                disabled={isLoadingSuggestions}
                                variant="outline"
                                size="sm"
                                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                            >
                                {isLoadingSuggestions ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        Refresh
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Category Selection */}
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id)
                                            generateSuggestions(category.id)
                                        }}
                                        disabled={isLoadingSuggestions}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                                            } disabled:opacity-50`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSuggestions ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="p-4 bg-slate-700/40 rounded-xl border border-slate-600/40">
                                        <div className="animate-pulse">
                                            <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestedMessages.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => selectSuggestedMessage(suggestion.text)}
                                        className="text-left p-4 bg-slate-700/40 hover:bg-slate-700/60 rounded-xl border border-slate-600/40 hover:border-purple-500/40 transition-all duration-300 group"
                                    >
                                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                                            &quot;{suggestion.text}&quot;
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Source indicator */}
                        <div className="mt-4 pt-4 border-t border-slate-600/30">
                            <p className="text-xs text-gray-500 text-center">
                                {suggestedMessages.length > 0 && (
                                    <>
                                        ✨ Suggestions powered by AI • Category: {categories.find(c => c.id === selectedCategory)?.label || 'General'}
                                    </>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card className="bg-slate-800/40 backdrop-blur-xl border-slate-700/40">
                        <CardContent className="pt-6 pb-6">
                            <div className="text-center space-y-3">
                                <Heart className="h-10 w-10 text-purple-400 mx-auto" />
                                <div>
                                    <h3 className="text-white font-semibold mb-2 text-lg">Stay Anonymous</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Your message will be sent completely anonymously. The recipient won&apos;t know who sent it.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/40 backdrop-blur-xl border-slate-700/40">
                        <CardContent className="pt-6 pb-6">
                            <div className="text-center space-y-3">
                                <MessageCircle className="h-10 w-10 text-blue-400 mx-auto" />
                                <div>
                                    <h3 className="text-white font-semibold mb-2 text-lg">Be Respectful</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Please keep your messages positive and respectful. Spread kindness and good vibes.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Back to Home Button */}
                <div className="text-center">
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        size="lg"
                        className="border-slate-600/60 text-gray-300 hover:bg-slate-700/50 hover:border-purple-500/40 px-8 py-3"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
