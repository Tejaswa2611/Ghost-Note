'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Link2, MessageCircle, Eye, Settings, Trash2, RefreshCw } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/loading'
import axios from 'axios'

interface Message {
    _id: string
    content: string
    createdOn: string
    category?: string
}

const Dashboard = () => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [acceptMessages, setAcceptMessages] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Message categories
    const messageCategories = [
        { value: 'all', label: '📋 All Messages', count: messages.length },
        { value: 'constructive', label: '🔧 Constructive', count: messages.filter(m => m.category === 'constructive').length },
        { value: 'appreciation', label: '👏 Appreciation', count: messages.filter(m => m.category === 'appreciation').length },
        { value: 'suggestion', label: '💡 Suggestion', count: messages.filter(m => m.category === 'suggestion').length },
        { value: 'question', label: '❓ Question', count: messages.filter(m => m.category === 'question').length },
        { value: 'general', label: '💬 General', count: messages.filter(m => m.category === 'general' || !m.category).length }
    ]

    // Filter messages based on selected category
    const filteredMessages = categoryFilter === 'all' 
        ? messages 
        : messages.filter(message => 
            categoryFilter === 'general' 
                ? (message.category === 'general' || !message.category)
                : message.category === categoryFilter
          )

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    const username = session?.user?.username
    const [profileUrl, setProfileUrl] = useState<string>('')
    
    // Set profile URL on client side only
    useEffect(() => {
        if (username && typeof window !== 'undefined') {
            setProfileUrl(`${window.location.protocol}//${window.location.host}/u/${username}`)
        }
    }, [username])

    // Fetch user's accept message status
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept-messages')
            setAcceptMessages(response.data.isAcceptingMessages)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch message settings'
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [toast])

    // Fetch messages
    const fetchMessages = useCallback(async (showToast = false) => {
        setIsLoading(true)
        try {
            console.log("📨 Fetching messages...");
            const response = await axios.get('/api/get-messages')
            console.log("✅ Messages response:", response.data);
            setMessages(response.data.messages || [])
            if (showToast) {
                toast({
                    title: 'Refreshed',
                    description: 'Messages refreshed successfully'
                })
            }
        } catch (error: any) {
            console.error("❌ Error fetching messages:", error);
            console.error("Error details:", error.response?.data);
            
            let errorMessage = 'Failed to fetch messages';
            if (error.response?.status === 401) {
                errorMessage = 'Please sign in again to view messages';
            } else if (error.response?.status === 404) {
                errorMessage = 'User not found';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast({
                title: 'Error',
                description: errorMessage
            })
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    // Handle accept messages toggle
    const handleSwitchChange = async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.post('/api/accept-messages', {
                isAcceptingMessages: !acceptMessages
            })
            setAcceptMessages(!acceptMessages)
            toast({
                title: 'Success',
                description: response.data.message
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update message settings'
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }

    // Copy profile URL to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Copied!',
            description: 'Profile URL copied to clipboard'
        })
    }

    // Delete message
    const deleteMessage = async (messageId: string) => {
        try {
            console.log(`🗑️ Attempting to delete message: ${messageId}`)
            const response = await axios.delete(`/api/delete-message/${messageId}`)
            console.log(`✅ Delete response:`, response.data)
            
            setMessages(messages.filter(message => message._id !== messageId))
            toast({
                title: 'Success',
                description: 'Message deleted successfully'
            })
        } catch (error: any) {
            console.error(`❌ Delete error:`, error)
            
            let errorMessage = 'Failed to delete message'
            if (error.response?.status === 401) {
                errorMessage = 'Please sign in again to delete messages'
            } else if (error.response?.status === 404) {
                errorMessage = 'Message not found'
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            }
            
            toast({
                title: 'Error',
                description: errorMessage
            })
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchMessages()
            fetchAcceptMessages()
        }
    }, [session?.user, fetchMessages, fetchAcceptMessages])

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Floating particles */}
                {isClient && [...Array(window.innerWidth < 768 ? 6 : 10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
                        style={{
                            left: `${(i * 9 + 15) % 100}%`,
                            top: `${(i * 13 + 20) % 100}%`,
                            animationDelay: `${(i * 0.4) % 6}s`,
                            animationDuration: `${4 + (i % 3)}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Profile & Settings */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        {/* Your Unique Link Card */}
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                                    <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                                    Your Unique Link
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-sm sm:text-base">
                                    Share this link to receive anonymous messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                    <p className="text-xs sm:text-sm text-gray-300 break-all font-mono">
                                        {profileUrl || 'Loading...'}
                                    </p>
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-sm sm:text-base py-2 sm:py-3"
                                >
                                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    Copy Link
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Message Settings Card */}
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                                    Message Settings
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-sm sm:text-base">
                                    Control who can send you messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-white">Accept Messages</p>
                                        <p className="text-xs text-gray-400">
                                            {acceptMessages ? 'Currently accepting messages' : 'Not accepting messages'}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={acceptMessages}
                                        onCheckedChange={handleSwitchChange}
                                        disabled={isSwitchLoading}
                                        className="data-[state=checked]:bg-purple-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Total Messages</span>
                                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                                            {messages.length}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Status</span>
                                        <Badge
                                            variant="secondary"
                                            className={acceptMessages ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}
                                        >
                                            {acceptMessages ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Messages */}
                    <div className="lg:col-span-2">
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 h-fit">
                            <CardHeader className="pb-3 sm:pb-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                                            Your Messages
                                        </CardTitle>
                                        <CardDescription className="text-gray-400 text-sm sm:text-base">
                                            Anonymous messages from your audience
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchMessages(true)}
                                        disabled={isLoading}
                                        className="border-slate-600 text-gray-300 hover:bg-slate-700/50 text-xs sm:text-sm"
                                    >
                                        <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                </div>
                                
                                {/* Category Filter */}
                                <div className="border-t border-slate-700/50 pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {messageCategories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() => setCategoryFilter(category.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                                    categoryFilter === category.value
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                                                }`}
                                            >
                                                {category.label} ({category.count})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <LoadingSkeleton key={i} variant="message" />
                                        ))}
                                    </div>
                                ) : filteredMessages.length === 0 && messages.length > 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No messages in this category</h3>
                                        <p className="text-sm sm:text-base text-gray-500">Try selecting a different category filter</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No messages yet</h3>
                                        <p className="text-sm sm:text-base text-gray-500">Share your link to start receiving anonymous messages!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {filteredMessages.map((message) => (
                                            <div
                                                key={message._id}
                                                className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-purple-500/30 transition-all duration-300 group"
                                            >
                                                <div className="flex justify-between items-start gap-3 sm:gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <p className="text-gray-200 leading-relaxed text-sm sm:text-base break-words flex-1">{message.content}</p>
                                                            {message.category && (
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 shrink-0"
                                                                >
                                                                    {messageCategories.find(cat => cat.value === message.category)?.label.split(' ')[0] || '💬'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(message.createdOn).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteMessage(message._id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 p-1 sm:p-2"
                                                    >
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard