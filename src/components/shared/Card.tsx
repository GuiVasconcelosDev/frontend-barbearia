import React from 'react'
import { cn } from '@utils/cn'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>
}

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-dark-200 dark:border-dark-700', className)}>
      {children}
    </div>
  )
}

interface CardBodyProps {
  className?: string
  children: React.ReactNode
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800/50', className)}>
      {children}
    </div>
  )
}
