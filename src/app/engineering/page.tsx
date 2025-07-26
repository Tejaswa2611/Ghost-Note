'use client'
import { Github, ExternalLink, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Engineering() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => {
      section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Simple Home Link */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
          Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-8 pt-60 pb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          <span className="text-white tracking-wider">Engineering behind </span>
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
            FeedForward
          </span>
        </h1>
        
        <p className="text-gray-300 text-lg max-w-4xl leading-relaxed mb-16">
          How I built an anonymous feedback platform that people can use to get honest feedbacks and grow.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Warming Up */}
        <div className="animate-on-scroll">
          <h2 className="text-4xl font-semibold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Why "FeedForward"?
          </h2>
          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            The name isn't just wordplay—it's the philosophy. <span className="text-white font-bold">FeedForward is feedback that pushes you forward</span>, not criticism that dwells on mistakes.
          </p>
          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            Here's how I built it: <span className="text-white font-bold">the problem</span>, <span className="text-white font-bold">the architecture</span>, 
            <span className="text-white font-bold">database design</span>, and <span className="text-white font-bold">technical challenges</span> that made this both frustrating and rewarding.
          </p>
          <p className="text-gray-300 mb-12 text-lg">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold text-xl">Let's dive in.</span>
          </p>
        </div>

        {/* Origin Story */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            The "aha" moment
          </h2>
          <div className="bg-slate-800/50 border border-purple-400/20 rounded-lg p-8 mb-8">
            <p className="text-gray-300 mb-4">
              The best feedback comes from anonymous sources—course reviews, workplace surveys. People are honest when there's no consequences.
            </p>
            <p className="text-gray-300 mb-4">
              Problem: <strong className="text-white font-bold">Most "anonymous" systems aren't truly anonymous</strong>. They're tied to accounts or people don't trust them.
            </p>
            <p className="text-gray-300">
              I built a platform where anonymity is the foundation, and feedback helps people move <span className="text-white font-bold">forward</span>.
            </p>
          </div>
        </div>

        {/* High Level Design */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            System architecture
          </h2>
          
          {/* High-Level Architecture Diagram */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
            <div className="font-mono text-xs leading-relaxed">
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-white mb-2">FeedForward System Architecture</div>
                <div className="text-gray-300">Next.js • MongoDB • Anonymous Messaging</div>
              </div>
              
              {/* Client Layer */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="text-sm font-bold text-blue-400 mb-2">CLIENT LAYER</div>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">Next.js 14</div>
                      <div className="text-xs text-gray-400">App Router + TypeScript</div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">UI Components</div>
                      <div className="text-xs text-gray-400">shadcn/ui + Tailwind</div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">Authentication</div>
                      <div className="text-xs text-gray-400">NextAuth.js + JWT</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold">⬇ HTTPS/API Routes ⬇</div>
              </div>

              {/* API Layer */}
              <div className="mb-6">
                <div className="text-center">
                  <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
                    <div className="font-bold text-green-400">Next.js API Routes</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Server-side Logic • Rate Limiting • Validation • Email Services
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* Service Layer */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-cyan-400">SERVICE LAYER</div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Auth Service</div>
                    <div className="text-xs text-gray-400">User Management</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Message Service</div>
                    <div className="text-xs text-gray-400">Anonymous Messaging</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Email Service</div>
                    <div className="text-xs text-gray-400">Verification & Notifications</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">AI Service</div>
                    <div className="text-xs text-gray-400">Message Suggestions</div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* External Integrations */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-red-400">EXTERNAL INTEGRATIONS</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Email Services */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">Email Services</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">Nodemailer</div>
                      <div className="text-xs text-gray-400">Email Delivery</div>
                    </div>
                  </div>
                  
                  {/* AI Services */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">AI Services</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">OpenAI API</div>
                      <div className="text-xs text-gray-400">Message Suggestions</div>
                    </div>
                  </div>
                  
                  {/* Infrastructure */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">Infrastructure</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">AWS Amplify</div>
                      <div className="text-xs text-gray-400">Deployment & Hosting</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* Data Layer */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-yellow-400">DATA LAYER</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Primary Database */}
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-center">
                    <div className="font-bold text-yellow-400">MongoDB</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Primary Database<br/>
                      Document Storage<br/>
                      Mongoose ODM
                    </div>
                  </div>
                  
                  {/* File Storage */}
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-center">
                    <div className="font-bold text-yellow-400">File System</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Static Assets<br/>
                      User Uploads<br/>
                      Temporary Storage
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="text-xs font-bold text-green-400">Response Time</div>
                  <div className="text-xs text-gray-400">&lt; 100ms average</div>
                </div>
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="text-xs font-bold text-blue-400">Security</div>
                  <div className="text-xs text-gray-400">End-to-end encrypted</div>
                </div>
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="text-xs font-bold text-purple-400">Architecture</div>
                  <div className="text-xs text-gray-400">Server-side rendering</div>
                </div>
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="text-xs font-bold text-orange-400">Uptime</div>
                  <div className="text-xs text-gray-400">99.9% availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Design */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Database design
          </h2>
          
          {/* Database Schema */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
            <div className="font-mono text-sm leading-relaxed">
              <div className="text-center mb-8">
                <div className="text-lg font-semibold text-white mb-2">FeedForward Database Schema</div>
                <div className="text-gray-300">MongoDB Collections • User-Centric Design</div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column - User Management */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 mb-2">
                      <div className="font-bold text-blue-400">users</div>
                      <div className="text-xs text-gray-400 mt-1">
                        _id, username, email<br/>
                        password (hashed)<br/>
                        isVerified, verifyCode<br/>
                        isAcceptingMessages
                      </div>
                    </div>
                    <div className="text-yellow-400">↓ 1:M</div>
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3 mt-2">
                      <div className="font-bold text-green-400">messages</div>
                      <div className="text-xs text-gray-400 mt-1">
                        _id, content<br/>
                        createdAt<br/>
                        userId (reference)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Collections */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-purple-500/20 border border-purple-500/50 rounded p-3 mb-2">
                      <div className="font-bold text-purple-400">sessions</div>
                      <div className="text-xs text-gray-400 mt-1">
                        _id, userId<br/>
                        sessionToken<br/>
                        expires
                      </div>
                    </div>
                    <div className="text-yellow-400">↓</div>
                    <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3 mt-2">
                      <div className="font-bold text-orange-400">verification_codes</div>
                      <div className="text-xs text-gray-400 mt-1">
                        userId, code<br/>
                        expiresAt<br/>
                        attempts
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Legend */}
              <div className="mt-8 pt-4 border-t border-slate-700">
                <div className="text-center text-xs text-gray-400">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><span className="text-blue-400">■</span> User Management</div>
                    <div><span className="text-green-400">■</span> Message System</div>
                    <div><span className="text-purple-400">■</span> Authentication</div>
                    <div><span className="text-orange-400">■</span> Verification</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-yellow-400">→</span> Document References • 
                    <span className="text-gray-400"> Anonymous message handling with user privacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Technical challenges that kept me up at night
          </h2>
          <p className="text-gray-300 mb-8">
            Five technical challenges that made this project worth the sleepless nights:
          </p>

          {/* Feature 1: Anonymous Messaging */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">01</span>
              <h3 className="text-xl font-semibold text-white font-bold">Anonymous Messaging</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Challenge: Complete anonymity without spam. Messages must be untraceable but the platform stays secure.
            </p>
            <p className="text-gray-300">
              Solution: <span className="text-white font-bold">MongoDB</span> stores messages without sender links. <span className="text-white font-bold">NextAuth.js</span> handles sessions without breaking anonymity.
            </p>
          </div>

          {/* Feature 2: AI Message Suggestions */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">02</span>
              <h3 className="text-xl font-semibold text-white font-bold">AI Message Suggestions</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Ever stared at a blank message box? AI helps transform thoughts into constructive feedback.
            </p>
            <p className="text-gray-300">
              <span className="text-white font-bold">OpenAI API</span> generates suggestions that encourage growth-oriented feedback, not just criticism.
            </p>
          </div>

          {/* Feature 3: Email Verification */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">03</span>
              <h3 className="text-xl font-semibold text-white font-bold">Email Verification System</h3>
            </div>
            <p className="text-gray-300 mb-4">
              How do you verify users without compromising future anonymity? Tricky balance.
            </p>
            <p className="text-gray-300">
              <span className="text-white font-bold">Nodemailer</span> sends time-limited codes. Real users verified, anonymity preserved.
            </p>
          </div>

          {/* Feature 4: Dashboard Analytics */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">04</span>
              <h3 className="text-xl font-semibold text-white font-bold">Dashboard Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Show feedback impact without breaking anonymity. Like solving a puzzle.
            </p>
            <p className="text-gray-300">
              <span className="text-white font-bold">React dashboards</span> aggregate data to show patterns without exposing message sources.
            </p>
          </div>

          {/* Feature 5: Privacy Controls */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8 hover:transform hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">05</span>
              <h3 className="text-xl font-semibold text-white font-bold">Privacy Controls</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Privacy is personal. Some want feedback from anyone, others from close circles. Flexible controls without complexity.
            </p>
            <p className="text-gray-300">
              <span className="text-white font-bold">User-centric design</span>: intuitive settings, transparent practices, complete control.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Tech choices
          </h2>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
            <p className="text-white mb-6">Built in <span className="text-white font-bold">TypeScript</span>. Life's too short for runtime errors.</p>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">Next.js 14 + TypeScript</div>
                <div className="text-gray-300 text-sm mt-1">App Router with SSR, server components, and static generation for performance and SEO.</div>
              </div>
              
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">MongoDB + Mongoose</div>
                <div className="text-gray-300 text-sm mt-1">Flexible document storage for user content and anonymous messaging.</div>
              </div>
              
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">NextAuth.js</div>
                <div className="text-gray-300 text-sm mt-1">Secure authentication with JWT tokens and privacy-focused sessions.</div>
              </div>
              
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">Nodemailer</div>
                <div className="text-gray-300 text-sm mt-1">Reliable email delivery for verification codes with SMTP.</div>
              </div>
              
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">OpenAI API</div>
                <div className="text-gray-300 text-sm mt-1">AI-powered suggestions for meaningful, constructive feedback.</div>
              </div>
              
              <div className="pb-4 border-b border-slate-700">
                <div className="text-white font-bold text-lg">Tailwind CSS + shadcn/ui</div>
                <div className="text-gray-300 text-sm mt-1">Utility-first CSS with shadcn/ui components for fast, consistent development.</div>
              </div>
              
              <div>
                <div className="text-white font-bold text-lg">AWS Amplify</div>
                <div className="text-gray-300 text-sm mt-1">Seamless deployment with CI/CD and AWS infrastructure.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700 animate-on-scroll">
          <p className="text-gray-300 mb-6">
            Built with passion for honest communication by{" "}
            <span className="text-white font-bold">Tejaswa</span>
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-semibold">
              <Link href="/dashboard">
                <MessagesSquare className="h-4 w-4 mr-2" />
                Try FeedForward
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-fade-in-up {
            animation: fadeInUp 0.7s ease-out forwards;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(2rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
}
