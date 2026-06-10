import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-bg-secondary border rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}
