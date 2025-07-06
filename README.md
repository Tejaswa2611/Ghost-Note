# 👻 GhostNote - Anonymous Messaging Platform

A modern, secure anonymous messaging platform built with Next.js 14, featuring AI-powered message suggestions, real-time stats, and beautiful glassmorphism UI design.

![GhostNote Banner](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

## 🚀 Project Overview

GhostNote is a full-stack anonymous messaging platform that allows users to send and receive anonymous messages safely and securely. The platform features modern UI/UX design, AI-powered message suggestions, email verification, and real-time statistics.

### 🎯 Key Features

- **🔐 Secure Authentication**: NextAuth.js integration with email verification
- **📧 Email Verification**: Robust email system with Nodemailer and Gmail SMTP
- **🤖 AI-Powered Suggestions**: OpenAI GPT integration for intelligent message suggestions
- **📊 Real-Time Statistics**: Dynamic user and message stats from database
- **🎨 Modern UI/UX**: Glassmorphism design with smooth animations and gradients
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🛡️ Input Validation**: Comprehensive form validation with Zod schemas
- **⚡ Performance Optimized**: Server-side rendering and API route optimization

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling with validation
- **Framer Motion** - Smooth animations

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **NextAuth.js** - Authentication and session management
- **Nodemailer** - Email sending functionality
- **bcryptjs** - Password hashing and security

### AI & APIs
- **OpenAI GPT-3.5** - AI-powered message suggestions
- **Custom API Endpoints** - RESTful API design

### Development Tools
- **ESLint** - Code linting and quality
- **Git** - Version control with proper .gitignore setup

## 🎨 Design Highlights

- **Glassmorphism UI**: Modern glass-like components with backdrop blur
- **Dark Theme**: Professional dark color scheme with purple/blue accents
- **Responsive Layout**: Seamless experience across all devices
- **Loading States**: Smooth skeleton loaders and animated states
- **Error Handling**: User-friendly error messages and fallbacks

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Gmail account (for email functionality)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ghost-note.git
cd ghost-note
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
# Database
MONGODB_URI="your-mongodb-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"
EMAIL_FROM="your-gmail@gmail.com"
EMAIL_FROM_NAME="GhostNote"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Features Showcase

### 🏠 Landing Page
- Hero section with animated background
- Real-time user and message statistics
- Call-to-action buttons for sign-up and sign-in
- Feature highlights with modern cards

### 🔐 Authentication System
- **Sign Up**: Username validation, password requirements, email verification
- **Sign In**: Secure login with session management
- **Email Verification**: OTP-based verification with resend functionality

### 📧 Anonymous Messaging
- **Send Messages**: Clean interface for composing anonymous messages
- **AI Suggestions**: GPT-powered message suggestions with categories
- **Message Categories**: General, Creative, Motivational, Friendly, Deep
- **Real-time Validation**: Character limits and input validation

### 📊 User Dashboard
- **Message Management**: View received messages
- **Privacy Controls**: Toggle message acceptance
- **Profile Settings**: Manage account preferences

## 🤖 AI Integration Details

The platform integrates OpenAI's GPT-3.5-turbo model to provide intelligent message suggestions:

- **Category-based Prompts**: Different AI prompts for various message types
- **Fallback System**: Graceful degradation when AI is unavailable
- **Error Handling**: Robust error management with user-friendly messages
- **Performance**: Optimized API calls with proper rate limiting

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Email Verification**: OTP-based account verification
- **Session Management**: Secure session handling with NextAuth.js
- **Input Validation**: Comprehensive validation with Zod schemas
- **Environment Security**: Proper .gitignore configuration for sensitive data

## 📈 Performance Optimizations

- **Server-Side Rendering**: Optimized page loading
- **API Route Optimization**: Efficient database queries
- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **Caching**: Strategic caching for improved response times

## 🚀 Deployment

The application is designed for easy deployment on platforms like:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS**
- **Digital Ocean**

## 🧪 Testing & Quality Assurance

- Comprehensive error handling throughout the application
- Form validation and user input sanitization
- Email delivery testing with fallback mechanisms
- Cross-browser compatibility testing
- Mobile responsiveness verification

## 🤝 Contributing

This project demonstrates modern full-stack development practices and is open for contributions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is created for portfolio demonstration purposes.

## 📞 Contact

**Developer**: [Your Name]
- LinkedIn: [Your LinkedIn Profile]
- Email: [Your Email]
- Portfolio: [Your Portfolio Website]

---

*This project showcases modern web development skills including React/Next.js, TypeScript, database integration, AI APIs, email systems, and responsive design. Built with attention to security, performance, and user experience.*
