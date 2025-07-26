'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MessagesSquare } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Ensure we're on the client side before rendering random elements
  useEffect(() => {
    setIsClient(true)
  }, [])

  // zod implementation - memoized for performance
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: useMemo(() => ({
      email: '',
      password: '',
    }), [])
  })

  // Optimized submit handler with useCallback
  const onSubmit = useCallback(async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      console.log("🔐 Attempting sign in...");
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Important: prevent automatic redirect
      })
      
      console.log("🔍 Sign in result:", result)
      
      if (result?.error) {
        // Handle different types of errors
        let errorMessage = 'Sign in failed. Please try again.';
        
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email/username or password. Please check your credentials.';
        } else if (result.error.includes('User not verified')) {
          errorMessage = 'Please verify your account before signing in. Check your email for verification code.';
        } else if (result.error.includes('No User found')) {
          errorMessage = 'No account found with this email/username. Please sign up first.';
        } else if (result.error.includes('Incorrect Password')) {
          errorMessage = 'Incorrect password. Please try again.';
        }
        
        toast({
          title: 'Sign In Failed',
          description: errorMessage,
        })
      } else if (result?.ok) {
        // Sign in successful
        console.log("✅ Sign in successful, redirecting...");
        toast({
          title: 'Welcome back!',
          description: 'Sign in successful. Redirecting to dashboard...',
        })
        
        // Wait a moment for the toast, then redirect
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      console.error("❌ Unexpected error during sign in:", error)
      toast({
        title: 'Sign In Failed',
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [toast, router])

  // Memoized floating particles for better performance
  const floatingParticles = useMemo(() => {
    if (!isClient) return null
    // Reduce particles on mobile for better performance
    const particleCount = window.innerWidth < 768 ? 8 : 15
    return [...Array(particleCount)].map((_, i) => (
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
    ))
  }, [isClient])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-purple-500/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles - memoized for performance */}
        {floatingParticles}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm sm:max-w-md relative mt-12 sm:mt-16">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
          {/* Logo Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <MessagesSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">Sign in to access your feedback management dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-400 rounded-xl h-10 sm:h-12 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
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
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-400 rounded-xl h-10 sm:h-12 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
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
                className="w-full group relative px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 h-10 sm:h-12"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
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
          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
            <p className="text-gray-400 text-sm sm:text-base">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                Sign up here
              </Link>
            </p>
            
            {/* Engineering Link */}
            <div className="flex justify-center">
              <Link href="/engineering" className="text-gray-400 hover:text-white font-extrabold tracking-wider underline underline-offset-4 decoration-2 transition-colors duration-200 text-lg sm:text-xl">
                Engineering Portal
              </Link>
            </div>
            
            <p className="text-gray-500 text-xs sm:text-sm">
              Forgot your password?{' '}
              <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                Reset it
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage