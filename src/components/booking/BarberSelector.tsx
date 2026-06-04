import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { cn } from '@utils/cn'
import type { Barbeiro } from '@types/index'

interface BarberSelectorProps {
  barbeiros: Barbeiro[]
  selectedId?: number
  onChange: (id: number) => void
}

export function BarberSelector({
  barbeiros,
  selectedId,
  onChange,
}: BarberSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-dark-900 dark:text-dark-50">
        2. Escolha o Profissional:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {barbeiros.map((barbeiro) => (
          <motion.button
            key={barbeiro.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(barbeiro.id)}
            className={cn(
              'card-interactive p-4 text-center transition-all',
              selectedId === barbeiro.id
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950'
                : ''
            )}
          >
            <div className="flex items-center justify-center gap-1 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="font-semibold text-sm line-clamp-2">
              {barbeiro.nome}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              ✓ Disponível
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
