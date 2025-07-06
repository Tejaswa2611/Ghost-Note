import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const LoadingDots = ({ size = 'md', color = 'current', className }: LoadingDotsProps) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3'
  }

  const dotSize = sizeClasses[size]

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      <div 
        className={cn(dotSize, 'rounded-full animate-bounce [animation-delay:-0.3s]')}
        style={{ backgroundColor: color === 'current' ? 'currentColor' : color }}
      />
      <div 
        className={cn(dotSize, 'rounded-full animate-bounce [animation-delay:-0.15s]')}
        style={{ backgroundColor: color === 'current' ? 'currentColor' : color }}
      />
      <div 
        className={cn(dotSize, 'rounded-full animate-bounce')}
        style={{ backgroundColor: color === 'current' ? 'currentColor' : color }}
      />
    </div>
  )
}

interface LoadingSkeletonProps {
  variant?: 'message' | 'suggestion' | 'stats'
  className?: string
}

const LoadingSkeleton = ({ variant = 'message', className }: LoadingSkeletonProps) => {
  if (variant === 'message') {
    return (
      <div className={cn('bg-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30', className)}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 space-y-2">
            <LoadingDots size="sm" color="rgb(107 114 128 / 0.5)" />
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-600/50 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-gray-600/50 rounded-full animate-pulse [animation-delay:0.1s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-600/50 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-600/50 rounded-full animate-pulse [animation-delay:0.3s]"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-red-500/10 rounded-md flex items-center justify-center">
            <div className="w-1 h-1 bg-red-400/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'suggestion') {
    return (
      <div className={cn('p-4 bg-slate-700/40 rounded-xl border border-slate-600/40', className)}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mt-1">
            <div className="w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 space-y-2">
            <LoadingDots size="sm" color="rgb(107 114 128 / 0.5)" />
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-600/50 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-gray-600/50 rounded-full animate-pulse [animation-delay:0.1s]"></div>
              <div className="w-1 h-1 bg-gray-600/50 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // stats variant
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <LoadingDots size="sm" />
    </div>
  )
}

export { LoadingDots, LoadingSkeleton }
