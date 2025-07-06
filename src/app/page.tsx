'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Link as LinkIcon, Share2, MessageCircle, Shield, Lock, MessagesSquare } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMessages: number;
  usersWithMessages: number;
  acceptingUsers: number;
  averageMessagesPerUser: number;
}

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

const TypewriterText = ({ text, delay = 0, speed = 100, className = "" }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isStarted]);

  return (
    <span className={className}>
      {displayedText}
      {isStarted && currentIndex <= text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  );
};

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  delay?: number;
}

const AnimatedCounter = ({ target, duration = 2000, delay = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | undefined;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return <span>{count}</span>;
};

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 350, // Fallback values
    totalMessages: 750,
    usersWithMessages: 50,
    acceptingUsers: 100,
    averageMessagesPerUser: 2.1
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    setIsClient(true);
    
    // Fetch real statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep fallback values
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-primary-glow/15 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-primary/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary-glow/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        
        {/* Floating particles - only render on client to avoid hydration mismatch */}
        {isClient && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${(i * 7 + 13) % 100}%`,
              top: `${(i * 11 + 17) % 100}%`,
              animationDelay: `${(i * 0.3) % 5}s`,
              animationDuration: `${3 + (i % 4)}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Logo and Brand Animation */}
          <div className={`flex items-center justify-center mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative mr-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center animate-glow shadow-2xl">
                <MessagesSquare className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur opacity-20 animate-pulse"></div>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-6xl md:text-8xl font-heading font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                <TypewriterText text="GhostNote" delay={500} speed={150} />
              </h1>
            </div>
          </div>
          
          {/* Subtitle Animation */}
          <div className="mb-12 overflow-hidden">
            <p className="text-xl md:text-3xl text-muted-foreground font-light leading-relaxed">
              <TypewriterText 
                text="Create unique links to receive anonymous messages with complete privacy" 
                delay={2000} 
                speed={50}
                className="inline"
              />
            </p>
          </div>
          
          {/* Stats Animation */}
          <div className={`flex justify-center gap-8 mb-12 transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-8 w-16 rounded"></div>
                ) : (
                  <>
                    <AnimatedCounter target={stats.totalUsers} delay={3000} />+
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-8 w-16 rounded"></div>
                ) : (
                  <>
                    <AnimatedCounter target={stats.totalMessages} delay={3500} />+
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Anonymous</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center transform transition-all duration-1000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link href="/sign-up">
              <button className="group relative px-8 py-4 bg-gradient-primary rounded-2xl font-heading font-semibold text-primary-foreground shadow-glow hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Create Your Link
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </Link>
            <button 
              onClick={scrollToHowItWorks}
              className="group px-8 py-4 border-2 border-primary/50 rounded-2xl font-heading font-semibold text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-center mb-20 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: LinkIcon, title: "Create Your Link", description: "Generate a unique, anonymous link in seconds. No registration required, just click and go.", delay: 0 },
              { icon: Share2, title: "Share It", description: "Share your link anywhere - social media, messaging apps, or embed it on your website.", delay: 200 },
              { icon: MessageCircle, title: "Receive Messages", description: "Get anonymous messages directly. Simple, private, and completely secure.", delay: 400 }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-card/50 backdrop-blur-xl rounded-3xl p-10 shadow-medium hover:shadow-glow transition-all duration-500 group-hover:scale-105 border border-border/30 hover:border-primary/30 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                     style={{ transitionDelay: `${2000 + item.delay}ms` }}>
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-6 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Features Section */}
      <section className="py-24 px-6 bg-gradient-secondary/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-16 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Your Privacy Matters
          </h2>
          
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {[
              { icon: Shield, title: "No Tracking", description: "We don't track your activity or store personal information. Your privacy is guaranteed.", delay: 0 },
              { icon: Lock, title: "Secure Messages", description: "Messages are Encrypted and no one can know who sent the message", delay: 200 }
            ].map((item, index) => (
              <div key={index} className={`bg-card/50 backdrop-blur-xl rounded-2xl p-10 shadow-medium hover:shadow-glow transition-all duration-500 border border-border/30 hover:border-primary/30 group transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                   style={{ transitionDelay: `${3000 + item.delay}ms` }}>
                <item.icon className="h-16 w-16 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          <Link href="/sign-up">
            <button className="group relative px-8 py-4 bg-gradient-primary rounded-2xl font-heading font-semibold text-primary-foreground shadow-glow hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center justify-center">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center mr-3">
              <MessagesSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-semibold text-muted-foreground">GhostNote</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 GhostNote. Designed for privacy, built for honesty.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;