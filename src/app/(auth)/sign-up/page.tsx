'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { APIResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MessagesSquare, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const { toast } = useToast()
    const router = useRouter()

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    // zod implementation - memoized for performance
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: useMemo(() => ({
            username: '',
            email: '',
            password: '',
        }), [])
    })

    // Optimized username check with useCallback
    const checkUsernameUnique = useCallback(async (usernameToCheck: string) => {
        if (usernameToCheck) {
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
                const response = await axios.get(`/api/check-username-unique?username=${usernameToCheck}`)
                console.log("response from check username unique->", response);
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<APIResponse>
                setUsernameMessage(axiosError.response?.data.message ?? 'Error Checking Username')
            } finally {
                setIsCheckingUsername(false)
            }
        }
    }, [])

    useEffect(() => {
        checkUsernameUnique(username)
    }, [username, checkUsernameUnique])

    // Optimized submit handler with useCallback
    const onSubmit = useCallback(async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            console.log("data->", data);
            const response = await axios.post<APIResponse>('/api/sign-up', data)
            toast({
                title: "Success",
                description: response.data.message,
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error signing up->", error);
            const axiosError = error as AxiosError<APIResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'Error signing up'
            toast({
                title: "SignUp failed",
                description: errorMessage
            })
        } finally {
            setIsSubmitting(false)
        }
    }, [toast, router, username])
    // Optimized password toggle with useCallback
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    // Memoized floating particles for better performance
    const floatingParticles = useMemo(() => {
        if (!isClient) return null
        // Reduce particles on mobile for better performance
        const particleCount = window.innerWidth < 768 ? 6 : 12
        return [...Array(particleCount)].map((_, i) => (
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
        ))
    }, [isClient])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Floating particles - memoized for performance */}
                {floatingParticles}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex justify-center items-center min-h-screen px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-sm sm:max-w-md mt-12 sm:mt-16">
                    {/* Main Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
                        {/* Logo Section */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="flex items-center justify-center mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                                    <MessagesSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                                Join GhostNote
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Sign up to start your anonymous adventure
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                {/* Username Field */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white font-medium">Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        placeholder="Enter your username"
                                                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 pr-10"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            debounced(e.target.value)
                                                        }}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        {isCheckingUsername && (
                                                            <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                                                        )}
                                                        {!isCheckingUsername && usernameMessage === 'Username available' && (
                                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                                        )}
                                                        {!isCheckingUsername && usernameMessage && usernameMessage !== 'Username available' && (
                                                            <XCircle className="h-4 w-4 text-red-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            {/* Show username availability message only if there's no form validation error */}
                                            {usernameMessage && !form.formState.errors.username && (
                                                <p className={`text-sm flex items-center gap-2 ${usernameMessage === 'Username available' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {usernameMessage === 'Username available' ? (
                                                        <CheckCircle className="h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3" />
                                                    )}
                                                    {usernameMessage}
                                                </p>
                                            )}
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white font-medium">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter your email"
                                                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white font-medium">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Sign In Link */}
                        <div className="mt-6 sm:mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link 
                                    href="/sign-in" 
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="text-center mt-4 sm:mt-6">
                        <Link 
                            href="/" 
                            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage