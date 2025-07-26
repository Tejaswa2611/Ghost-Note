'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Link as LinkIcon, Share2, MessageCircle, Shield, Lock, MessagesSquare, Mail, Github } from 'lucide-react';
import { LoadingDots } from '@/components/ui/loading';

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
        {isClient && [...Array(window.innerWidth < 768 ? 8 : 15)].map((_, i) => (
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
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 text-center overflow-hidden">{/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Logo and Brand Animation */}
          <div className={`flex flex-col sm:flex-row items-center justify-center mb-8 sm:mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center animate-glow shadow-2xl">
                <MessagesSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur opacity-20 animate-pulse"></div>
            </div>
            <div className="overflow-hidden text-center sm:text-left">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                <TypewriterText text="FeedForward" delay={500} speed={150} />
              </h1>
            </div>
          </div>
          
          {/* Subtitle Animation */}
          <div className="mb-8 sm:mb-12 overflow-hidden px-4">
            <p className="text-lg sm:text-xl md:text-3xl text-muted-foreground font-light leading-relaxed text-center">
              <TypewriterText 
                text="Honest feedback, no awkwardness - anonymous insights to push you forward." 
                delay={2000} 
                speed={50}
                className="inline"
              />
            </p>
          </div>
          
          {/* Stats Animation */}
          <div className={`flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {statsLoading ? (
                  <LoadingDots color="hsl(var(--primary))" />
                ) : (
                  <>
                    <AnimatedCounter target={stats.totalUsers} delay={3000} />+
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-glow">
                {statsLoading ? (
                  <LoadingDots color="hsl(var(--primary-glow))" />
                ) : (
                  <>
                    <AnimatedCounter target={stats.totalMessages} delay={3500} />+
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Feedback Collected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Anonymous</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 transform transition-all duration-1000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link href="/sign-up">
              <button className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary rounded-2xl font-heading font-semibold text-primary-foreground shadow-glow hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Start Collecting Feedback
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </Link>
            <button 
              onClick={scrollToHowItWorks}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary/50 rounded-2xl font-heading font-semibold text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-center mb-12 sm:mb-20 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: LinkIcon, title: "Create Feedback Portal", description: "Sign up and create your unique feedback link. Customize your profile and start accepting anonymous feedback in under 2 minutes.", delay: 0 },
              { icon: Share2, title: "Distribute to Team", description: "Copy your personalized link (feedforward.com/u/yourname) and share it via email, Slack, social media, or embed it on your website.", delay: 200 },
              { icon: MessageCircle, title: "Collect Insights", description: "Monitor your dashboard to read incoming feedback. Use AI-powered suggestions to encourage more detailed responses from your audience.", delay: 400 }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-card/50 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-medium hover:shadow-glow transition-all duration-500 group-hover:scale-105 border border-border/30 hover:border-primary/30 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                     style={{ transitionDelay: `${2000 + item.delay}ms` }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-4 sm:mb-6 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-secondary/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-12 sm:mb-16 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Your Privacy Matters
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 mb-12 sm:mb-16">
            {[
              { icon: Shield, title: "No Tracking", description: "We don't track your activity or store personal information. Your privacy is guaranteed.", delay: 0 },
              { icon: Lock, title: "Secure Messages", description: "Messages are Encrypted and no one can know who sent the message", delay: 200 }
            ].map((item, index) => (
              <div key={index} className={`bg-card/50 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-medium hover:shadow-glow transition-all duration-500 border border-border/30 hover:border-primary/30 group transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                   style={{ transitionDelay: `${3000 + item.delay}ms` }}>
                <item.icon className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-3 sm:mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          <Link href="/sign-up">
            <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary rounded-2xl font-heading font-semibold text-primary-foreground shadow-glow hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center justify-center">
                Launch Your Feedback System
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center mr-3">
              <MessagesSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-heading font-semibold text-muted-foreground">FeedForward</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Made with ❤️ by Tejaswa
          </p>
          
          {/* Contact Icons */}
          <div className="flex items-center justify-center space-x-4">
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
        </div>
      </footer>
    </div>
  );
};

export default Index;