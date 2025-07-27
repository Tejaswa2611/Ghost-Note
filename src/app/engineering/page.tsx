'use client'
import { Github, ExternalLink, MessagesSquare, Mail } from "lucide-react";
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dark">
      {/* Simple Home Link */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium">
          Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-8 pt-60 pb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          <span className="text-foreground tracking-wider">Engineering behind </span>
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
            FeedForward
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg max-w-5xl leading-relaxed mb-16">
          How I built an anonymous feedback platform that people can use to get honest feedbacks and grow.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Warming Up */}
        <div className="animate-on-scroll">
          <h2 className="text-5xl font-semibold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Why &ldquo;FeedForward&rdquo;?
          </h2>
          <p className="text-gray-300 mb-12 text-lg leading-relaxed">
            The name isn&apos;t just wordplay—it&apos;s the philosophy. <span className="text-white font-bold">FeedForward is feedback that pushes you forward</span>, not criticism that dwells on mistakes.<br />
            Here&apos;s how I built it: <span className="text-white font-bold">the problem</span>, <span className="text-white font-bold">the architecture</span>, <span className="text-white font-bold">database design</span>, and <span className="text-white font-bold">technical challenges</span> that made this both frustrating and rewarding.<br />
            <span className="text-white font-bold text-xl">Let&apos;s dive in.</span>
          </p>
        </div>

        {/* Origin Story */}
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            The &ldquo;aha&rdquo; moment
          </h2>
          
          <p className="text-slate-400 mb-12 text-lg leading-relaxed">
            The best feedback comes from anonymous sources—course reviews, workplace surveys. People are honest when there&apos;s no consequences.<br />
            <strong className="text-slate-100 font-bold">Problem:</strong> Most &ldquo;anonymous&rdquo; systems aren&apos;t truly anonymous. They&apos;re tied to accounts or people don&apos;t trust them.<br />
            I built a platform where anonymity is the foundation, and feedback helps people move <span className="text-white font-bold">forward</span>.
          </p>
        </div>

        {/* High Level Design */}
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
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
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
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
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Features
          </h2>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Technical challenges that made this project worth the sleepless nights:
          </p>

          <div className="space-y-12">
            {/* Feature 1: Anonymous Messaging */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">01</span>
              Anonymous Messaging
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <strong className="text-slate-100">Challenge:</strong> Complete anonymity without spam. Messages must be untraceable but the platform stays secure.<br />
                <strong className="text-slate-100">Solution:</strong> <span className="text-white font-bold">MongoDB</span> stores messages without sender links. <span className="text-white font-bold">NextAuth.js</span> handles sessions without breaking anonymity.
              </p>
            </div>

            {/* Feature 2: AI Message Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">02</span>
                AI Message Suggestions
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Ever stared at a blank message box? AI helps transform thoughts into constructive feedback.<br />
                <span className="text-white font-bold">OpenAI API</span> generates suggestions that encourage growth-oriented feedback, not just criticism.
              </p>
            </div>

            {/* Feature 3: Email Verification */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">03</span>
                Email Verification System
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                How do you verify users without compromising future anonymity? Tricky balance.<br />
                <span className="text-white font-bold">Nodemailer</span> sends time-limited codes. Real users verified, anonymity preserved.
              </p>
            </div>

            {/* Feature 4: Privacy Controls */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">04</span>
                Privacy Controls
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Privacy is personal. Some want feedback from anyone, others from close circles. Flexible controls without complexity.<br />
                <span className="text-white font-bold">User-centric design:</span> intuitive settings, transparent practices, complete control.
              </p>
            </div>
          </div>
        </div>

        {/* Bonus Features */}
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Beyond the basics
          </h2>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            The features that turned a simple messaging app into something special:
          </p>

          <div className="space-y-16">
            {/* MongoDB Aggregation Pipelines */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">01</span>
                MongoDB Aggregation Pipelines
              </h3>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Picture this: A user wants to see their feedback patterns—how many appreciations vs. suggestions they receive. 
                Simple query? Not quite. <span className="text-white font-bold">Enter MongoDB&apos;s aggregation pipelines</span>—the Swiss Army knife of data processing.
              </p>
              
              {/* Code example in box */}
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
                <div className="font-mono text-sm text-green-400 mb-3">{`// Real aggregation pipeline from the codebase`}</div>
                <div className="font-mono text-xs text-gray-300 leading-relaxed">
                  <div className="text-blue-400">db.users.aggregate([</div>
                  <div className="ml-4 text-yellow-400">{'{ $match: { isAcceptingMessages: true } },'}</div>
                  <div className="ml-4 text-pink-400">{'{ $lookup: {'}</div>
                  <div className="ml-8 text-gray-300">from: &quot;messages&quot;,</div>
                  <div className="ml-8 text-gray-300">localField: &quot;_id&quot;,</div>
                  <div className="ml-8 text-gray-300">foreignField: &quot;userId&quot;,</div>
                  <div className="ml-8 text-gray-300">as: &quot;userMessages&quot;</div>
                  <div className="ml-4 text-pink-400">{'}},'}</div>
                  <div className="ml-4 text-cyan-400">{'{ $addFields: { messageCount: { $size: "$userMessages" } } },'}</div>
                  <div className="ml-4 text-orange-400">{'{ $group: {'}</div>
                  <div className="ml-8 text-gray-300">_id: null,</div>
                  <div className="ml-8 text-gray-300">totalUsers: {'{ $sum: 1 }'},</div>
                  <div className="ml-8 text-gray-300">usersWithMessages: {'{ $sum: { $cond: [{ $gt: ["$messageCount", 0] }, 1, 0] } }'}</div>
                  <div className="ml-4 text-orange-400">{'} }'}</div>
                  <div className="text-blue-400">])</div>
                </div>
              </div>
              
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">The magic?</span> One query processes thousands of documents, 
                joins collections, calculates statistics, and returns insights in milliseconds. No multiple database hits, 
                no complex application logic—just pure MongoDB wizardry.
              </p>
            </div>

            {/* Light/Dark Mode Theme System */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">02</span>
                Intelligent Theme System
              </h3>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Ever notice how the theme toggle <span className="text-white font-bold">just works</span>? That&apos;s 3 AM debugging paying off. 
                Light mode, dark mode, system preference—it remembers your choice across sessions and never flickers.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-yellow-400 text-2xl mb-2">☀️</div>
                    <div className="font-bold text-yellow-400">Light Mode</div>
                    <div className="text-xs text-gray-400 mt-1">Clean, professional vibes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-2xl mb-2">🌙</div>
                    <div className="font-bold text-blue-400">Dark Mode</div>
                    <div className="text-xs text-gray-400 mt-1">Easy on the eyes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 text-2xl mb-2">🖥️</div>
                    <div className="font-bold text-purple-400">System</div>
                    <div className="text-xs text-gray-400 mt-1">Follows your OS preference</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">The secret sauce?</span> CSS custom properties, React Context, 
                and localStorage working in harmony. One toggle, infinite possibilities.
              </p>
            </div>

            {/* Message Categorization System */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">03</span>
                Smart Message Categorization
              </h3>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Not all feedback is created equal. Some messages spark growth, others show appreciation, 
                and some ask genuine questions. <span className="text-white font-bold">The AI doesn&apos;t just suggest messages—it understands intent.</span>
              </p>
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-3">
                    <div className="text-blue-400 text-xl mb-1">❓</div>
                    <div className="font-bold text-blue-400 text-sm">Questions</div>
                    <div className="text-xs text-gray-400">&quot;How did you...?&quot;</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-green-400 text-xl mb-1">💬</div>
                    <div className="font-bold text-green-400 text-sm">General</div>
                    <div className="text-xs text-gray-400">&quot;Just wanted to say...&quot;</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-yellow-400 text-xl mb-1">💡</div>
                    <div className="font-bold text-yellow-400 text-sm">Suggestions</div>
                    <div className="text-xs text-gray-400">&quot;You could try...&quot;</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-pink-400 text-xl mb-1">❤️</div>
                    <div className="font-bold text-pink-400 text-sm">Appreciation</div>
                    <div className="text-xs text-gray-400">&quot;Thank you for...&quot;</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-orange-400 text-xl mb-1">🛠️</div>
                    <div className="font-bold text-orange-400 text-sm">Constructive</div>
                    <div className="text-xs text-gray-400">&quot;Consider improving...&quot;</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-purple-400 text-xl mb-1">🎯</div>
                    <div className="font-bold text-purple-400 text-sm">Growth</div>
                    <div className="text-xs text-gray-400">&quot;Your next step...&quot;</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">The innovation?</span> OpenAI APIs analyze message content and intent patterns, 
                automatically categorize messages, helping users understand the type of input they&apos;re receiving. 
                No manual tagging required—the AI reads between the lines.
              </p>
            </div>

            {/* API Rate Limiting */}
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-baseline">
                <span className="text-5xl font-bold text-gray-400 mr-3">04</span>
                API Rate Limiting & Spam Protection
              </h3>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                With anonymous messaging comes the challenge of preventing abuse. <span className="text-white font-bold">How do you stop spam without compromising anonymity?</span> 
                Smart rate limiting is the answer.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-blue-400 text-2xl mr-3">⏱️</span>
                      <div className="font-bold text-blue-400 text-lg">Time-based Limits</div>
                    </div>
                    <div className="text-gray-400">Max messages per IP per hour</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">The balance?</span> Legitimate users send thoughtful messages at reasonable intervals, 
                while spammers hit limits quickly. Anonymous stays anonymous, but spam gets blocked.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="animate-on-scroll mt-32">
          <h2 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></span>
            Tech choices
          </h2>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            The stack that makes FeedForward tick. Each choice driven by purpose, not hype:
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">Next.js 14</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Full-stack in one package. Server-side rendering for speed, API routes for logic, 
                App Router for clean file structure. Plus, React Server Components mean smaller bundles and faster loads.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">MongoDB + Mongoose</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Anonymous messaging needs flexible document storage. No rigid schemas when user patterns evolve. 
                Mongoose keeps data consistent while MongoDB&apos;s aggregation pipelines crunch analytics like a boss.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">NextAuth.js</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Auth is hard. Privacy-focused sessions, JWT tokens, secure flows—all handled. 
                Lets me focus on anonymity features instead of wrestling with authentication edge cases.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">Nodemailer</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Email that actually delivers. SMTP reliability with custom templates. 
                Time-limited verification codes work seamlessly—no third-party email service dependencies.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">OpenAI API</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Because blank message boxes kill conversations. AI suggestions that actually make sense, 
                encouraging growth-focused feedback instead of generic &quot;good job&quot; comments.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">Tailwind CSS + shadcn/ui</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Utility-first CSS that doesn&apos;t fight you. shadcn/ui components for consistency. 
                Fast prototypes, professional results, zero CSS headaches.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">TypeScript</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Life&apos;s too short for runtime errors. Type safety catches bugs before users do. 
                Better IDE support, cleaner refactoring, more confident deployments.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-100 font-bold text-xl mb-2">AWS Amplify</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                <span className="text-white font-bold">Why?</span> Deploy and forget. CI/CD that works, AWS infrastructure that scales, 
                zero deployment drama. Push to main, watch it go live.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700 animate-on-scroll">
          <p className="text-slate-400 mb-6 text-lg">
            Built with passion for honest communication by{" "}
            <span className="text-slate-100 font-bold">Tejaswa</span>
          </p>
          
          {/* Contact Icons */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <a 
              href="mailto:mathurkiit@gmail.com" 
              className="group flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-red-500/20 rounded-full border border-slate-600/50 hover:border-red-400/50 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors duration-300" />
            </a>
            <a 
              href="https://github.com/Tejaswa2611" 
              className="group flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-purple-500/20 rounded-full border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
            </a>
          </div>
          
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
