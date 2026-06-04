import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  gradient?: 'primary' | 'success' | 'blue'
  trend?: number
}

const gradients = {
  primary: 'bg-gradient-primary',
  success: 'bg-gradient-success',
  blue: 'bg-gradient-blue',
}

export function StatsCard({
  title,
  value,
  icon,
  gradient = 'primary',
  trend,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card overflow-hidden group"
    >
      <div className="relative p-6">
        <div className={cn('absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity', gradients[gradient])} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-dark-600 dark:text-dark-400">{title}</p>
              <h3 className="text-3xl font-bold mt-1">{value}</h3>
              {trend !== undefined && (
                <p className="text-xs mt-2 text-emerald-600 dark:text-emerald-400">
                  ↑ {trend}% vs mês anterior
                </p>
              )}
            </div>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={cn('p-3 rounded-lg text-white', gradients[gradient])}
            >
              {icon}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
      </div>
    </motion.div>
  )
}
