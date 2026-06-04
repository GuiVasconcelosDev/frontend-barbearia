import { motion } from 'framer-motion'
import { Scissors } from 'lucide-react'
import { cn } from '@utils/cn'
import type { Servico } from '@types/index'

interface ServiceSelectorProps {
  servicos: Servico[]
  selectedId?: number
  onChange: (id: number) => void
}

export function ServiceSelector({
  servicos,
  selectedId,
  onChange,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-dark-900 dark:text-dark-50">
        1. Escolha o Serviço:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {servicos.map((servico) => (
          <motion.button
            key={servico.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(servico.id)}
            className={cn(
              'card-interactive p-4 text-center transition-all',
              selectedId === servico.id
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950'
                : ''
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scissors className="w-5 h-5" />
              <span className="font-semibold">{servico.nome}</span>
            </div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              R$ {servico.preco.toFixed(2)}
            </p>
            <p className="text-xs text-dark-500 mt-1">
              {servico.duracaoMinutos} min
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
