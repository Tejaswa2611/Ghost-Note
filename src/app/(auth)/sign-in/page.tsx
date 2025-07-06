'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { set } from "mongoose"
import axios, { AxiosError } from "axios"
import { APIResponse } from "@/types/apiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MessagesSquare } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Ensure we're on the client side before rendering random elements
  useEffect(() => {
    setIsClient(true)
  }, [])

  // zod impleqmentation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      console.log("here i am beep beep");
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard'
      })
      console.log("result is ", result)
      
      // If we reach here and there's no error, the redirect should have happened
      if (result?.error) {
        toast({
          title: 'Sign In Failed',
          description: result.error
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Sign In Failed',
        description: 'An unexpected error occurred.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles - only render on client to avoid hydration mismatch */}
        {isClient && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${(i * 7 + 13) % 100}%`,
              top: `${(i * 11 + 17) % 100}%`,
              animationDelay: `${(i * 0.3) % 5}s`,
              animationDuration: `${3 + (i % 4)}s`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md relative">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <MessagesSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-lg">Sign in to continue your anonymous journey</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email field */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium">Email/Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
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
                    <FormLabel className="text-gray-300 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
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
                className="w-full group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 h-12"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Button>
            </form>
          </Form>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <a href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                Sign up here
              </a>
            </p>
            <p className="text-gray-500 text-sm">
              Forgot your password?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                Reset it
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page