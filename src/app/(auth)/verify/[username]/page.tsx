'use client'

import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { APIResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { MessagesSquare, Mail, Shield, Loader2 } from 'lucide-react'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [isClient, setIsClient] = useState(false)

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            if (!params || !params.username) {
                toast({
                    title: "Error",
                    description: "Username is missing."
                });
                setIsSubmitting(false)
                return;
            }
            
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Verification Failed",
                description: axiosError.response?.data.message ?? 'Error Verifying Account'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendCode = async () => {
        if (!params?.username) {
            toast({
                title: "Error",
                description: "Username is missing."
            });
            return;
        }

        setIsResending(true)
        try {
            const response = await axios.post('/api/resend-code', {
                username: params.username
            })

            toast({
                title: "Success",
                description: response.data.message || "A new verification code has been sent to your email."
            })
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Error resending verification code'
            })
        } finally {
            setIsResending(false)
        }
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
                            left: `${(i * 9 + 15) % 100}%`,
                            top: `${(i * 13 + 20) % 100}%`,
                            animationDelay: `${(i * 0.4) % 6}s`,
                            animationDuration: `${4 + (i % 3)}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex justify-center items-center min-h-screen px-6 py-12">
                <div className="w-full max-w-lg">
                    {/* Main Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                                    <Shield className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                                Verify Your Account
                            </h1>
                            <p className="text-gray-400 text-base mb-2">
                                We&apos;ve sent a verification code to your email
                            </p>
                            {params?.username && (
                                <p className="text-purple-400 font-medium">
                                    @{params.username}
                                </p>
                            )}
                        </div>

                        {/* Verification Info */}
                        <div className="bg-slate-700/30 rounded-2xl p-6 mb-8 border border-slate-600/30">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail className="h-5 w-5 text-purple-400" />
                                <span className="text-white font-medium">Check Your Email</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Enter the 6-digit verification code sent to your email address to complete your account setup.
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white font-medium">Verification Code</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter 6-digit code"
                                                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 text-center text-2xl font-mono tracking-widest"
                                                    maxLength={6}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="mr-2 h-5 w-5" />
                                            Verify Account
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Additional Info */}
                        <div className="mt-8 space-y-4">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">
                                    Didn&apos;t receive the code?{' '}
                                    <button 
                                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                    >
                                        {isResending ? 'Resending...' : 'Resend'}
                                    </button>
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">
                                    Wrong email?{' '}
                                    <Link 
                                        href="/sign-up" 
                                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                                    >
                                        Sign up again
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="text-center mt-6">
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

export default VerifyAccount
