import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Scissors, LogOut, Globe } from 'lucide-react'
import { Button } from './Button'

interface HeaderProps {
  barbeariaName?: string
  barbeariaSlug?: string
  onLogout?: () => void
  isDashboard?: boolean
}

export function Header({
  barbeariaName,
  barbeariaSlug,
  onLogout,
  isDashboard = false,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-dark-200 dark:border-dark-700 bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Barbearia</h1>
              {barbeariaName && (
                <p className="text-xs text-dark-600 dark:text-dark-400">{barbeariaName}</p>
              )}
            </div>
          </motion.div>

          {isDashboard && (
            <div className="flex items-center gap-3">
              {barbeariaSlug && (
                <Link
                  to={`/${barbeariaSlug}`}
                  target="_blank"
                  className="btn btn-secondary text-sm gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Ver Site
                </Link>
              )}
              {onLogout && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
