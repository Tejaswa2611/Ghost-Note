'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Copy, Link2, MessageCircle, Eye, Settings, Trash2, RefreshCw, Search, X, Loader2 } from 'lucide-react'
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
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isCopying, setIsCopying] = useState(false)
    const [deletingMessageIds, setDeletingMessageIds] = useState<Set<string>>(new Set())
    const [acceptMessages, setAcceptMessages] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Message categories
    const messageCategories = [
        { value: 'all', label: '📋 All Messages', count: messages.length },
        { value: 'constructive', label: '🔧 Constructive', count: messages.filter(m => m.category === 'constructive').length },
        { value: 'appreciation', label: '👏 Appreciation', count: messages.filter(m => m.category === 'appreciation').length },
        { value: 'suggestion', label: '💡 Suggestion', count: messages.filter(m => m.category === 'suggestion').length },
        { value: 'question', label: '❓ Question', count: messages.filter(m => m.category === 'question').length },
        { value: 'general', label: '💬 General', count: messages.filter(m => m.category === 'general' || !m.category).length }
    ]

    // Filter messages based on selected category and search query
    const filteredMessages = messages.filter(message => {
        // Category filter
        const matchesCategory = categoryFilter === 'all' || 
            (categoryFilter === 'general' 
                ? (message.category === 'general' || !message.category)
                : message.category === categoryFilter);
        
        // Search filter
        const matchesSearch = searchQuery === '' || 
            message.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
    })

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Keyboard shortcut for search (Ctrl/Cmd + K)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
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
            const response = await axios.get('/api/get-messages')
            setMessages(response.data.data?.messages || [])
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

    // Refresh messages with loading state
    const refreshMessages = async () => {
        if (isRefreshing) return // Prevent multiple refresh attempts
        
        setIsRefreshing(true)
        try {
            await fetchMessages(true) // Show toast for manual refresh
        } finally {
            setIsRefreshing(false)
        }
    }

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
    const copyToClipboard = async () => {
        if (isCopying) return // Prevent multiple clicks
        
        setIsCopying(true)
        try {
            await navigator.clipboard.writeText(profileUrl)
            toast({
                title: 'Copied!',
                description: 'Profile URL copied to clipboard'
            })
        } catch (error) {
            toast({
                title: 'Failed to copy',
                description: 'Could not copy to clipboard. Please try again.'
            })
        } finally {
            setTimeout(() => setIsCopying(false), 1000) // Keep loading state for a moment for better UX
        }
    }

    // Delete message
    const deleteMessage = async (messageId: string) => {
        if (deletingMessageIds.has(messageId)) return // Prevent multiple delete attempts
        
        setDeletingMessageIds(prev => new Set([...Array.from(prev), messageId]))
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
        } finally {
            setDeletingMessageIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(messageId)
                return newSet
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
        <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-primary/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Floating particles */}
                {isClient && [...Array(window.innerWidth < 768 ? 6 : 10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
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
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Profile & Settings */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        {/* Your Unique Link Card */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border hover:border-primary/30 transition-all duration-300">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-card-foreground text-lg sm:text-xl">
                                    <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Your Unique Link
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                    Share this link to receive anonymous messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                    <p className="text-xs sm:text-sm text-muted-foreground break-all font-mono">
                                        {profileUrl || 'Loading...'}
                                    </p>
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    disabled={isCopying}
                                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50"
                                >
                                    {isCopying ? (
                                        <>
                                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                            Copying...
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            Copy Link
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Message Settings Card */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border hover:border-primary/30 transition-all duration-300">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-card-foreground text-lg sm:text-xl">
                                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Message Settings
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                    Control who can send you messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-card-foreground">Accept Messages</p>
                                        <p className="text-xs text-muted-foreground">
                                            {acceptMessages ? 'Currently accepting messages' : 'Not accepting messages'}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={acceptMessages}
                                        onCheckedChange={handleSwitchChange}
                                        disabled={isSwitchLoading}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-card-foreground text-lg sm:text-xl">
                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Total Messages</span>
                                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                                            {messages.length}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Status</span>
                                        <Badge
                                            variant="secondary"
                                            className={acceptMessages ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}
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
                        <Card className="bg-card/80 backdrop-blur-xl border-border h-fit">
                            <CardHeader className="pb-3 sm:pb-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-card-foreground text-lg sm:text-xl">
                                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            Your Messages
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                            Anonymous messages from your audience
                                            {(searchQuery || categoryFilter !== 'all') && (
                                                <span className="ml-2 text-primary">
                                                    ({filteredMessages.length} of {messages.length} shown)
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={refreshMessages}
                                            disabled={isRefreshing || isLoading}
                                            className="border-border text-muted-foreground hover:bg-accent text-xs sm:text-sm disabled:opacity-50"
                                        >
                                            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
                                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                        </Button>

                                    </div>
                                </div>
                                
                                {/* Search Input */}
                                <div className="border-t border-border pt-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            ref={searchInputRef}
                                            placeholder="Search messages... (Ctrl+K)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Category Filter */}
                                <div className="border-t border-border pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {messageCategories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() => setCategoryFilter(category.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                                    categoryFilter === category.value
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-accent'
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
                                        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2">
                                            {searchQuery ? 'No messages found' : 'No messages in this category'}
                                        </h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            {searchQuery 
                                                ? `No messages match "${searchQuery}". Try a different search term.`
                                                : 'Try selecting a different category filter'
                                            }
                                        </p>
                                        {searchQuery && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSearchQuery('')}
                                                className="mt-4 border-border text-muted-foreground hover:bg-accent"
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2">No messages yet</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">Share your link to start receiving anonymous messages!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {filteredMessages.map((message) => (
                                            <div
                                                key={message._id}
                                                className="bg-card/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border hover:border-primary/30 transition-all duration-300 group"
                                            >
                                                <div className="flex justify-between items-start gap-3 sm:gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <p className="text-card-foreground leading-relaxed text-sm sm:text-base break-words flex-1">{message.content}</p>
                                                            {message.category && (
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    className="text-xs bg-primary/20 text-primary border-primary/30 shrink-0"
                                                                >
                                                                    {messageCategories.find(cat => cat.value === message.category)?.label.split(' ')[0] || '💬'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
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
                                                        disabled={deletingMessageIds.has(message._id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 hover:bg-destructive/10 flex-shrink-0 p-1 sm:p-2 disabled:opacity-50"
                                                    >
                                                        {deletingMessageIds.has(message._id) ? (
                                                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        )}
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