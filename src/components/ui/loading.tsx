import React from 'react'
import Image from 'next/image'
import loadingSpinner from '@/assets/animations/loading-spinner-transparent.gif'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <Image
        src={loadingSpinner}
        alt="Loading..."
        width={dimensions[size]}
        height={dimensions[size]}
        className={sizes[size]}
        unoptimized
      />
    </div>
  )
}

export function LoadingContainer({ 
  children, 
  className 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-white ${className || ''}`}>
      {children || <Loading size="lg" />}
    </div>
  )
}
