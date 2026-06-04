import { motion } from 'framer-motion'
import { Calendar, Phone, Scissors, AlertCircle } from 'lucide-react'
import { Button } from '@components/shared/Button'
import { Card, CardBody, CardHeader } from '@components/shared/Card'
import { formatDateTime } from '@utils/dateFormat'
import type { Agendamento } from '@types/index'

interface ScheduleListProps {
  agendamentos: Agendamento[]
  onConcluir?: (id: number) => void
  onMarcarFalta?: (id: number) => void
  isLoading?: boolean
}

export function ScheduleList({
  agendamentos,
  onConcluir,
  onMarcarFalta,
  isLoading = false,
}: ScheduleListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </CardBody>
      </Card>
    )
  }

  if (agendamentos.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-dark-300 dark:text-dark-600 mb-3" />
          <p className="text-dark-600 dark:text-dark-400">
            Nenhum agendamento pendente
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {agendamentos.map((ag, index) => (
        <motion.div
          key={ag.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
        >
          <Card className="card-interactive">
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{ag.cliente.nome}</h3>
                    <span className="badge badge-primary">
                      {ag.servico.nome}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Phone className="w-4 h-4" />
                      {ag.cliente.telefone}
                    </div>
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Scissors className="w-4 h-4" />
                      {ag.barbeiro.nome}
                    </div>
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400 col-span-2">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(ag.dataHoraInicio)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {onMarcarFalta && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onMarcarFalta(ag.id)}
                    >
                      ❌ Faltou
                    </Button>
                  )}
                  {onConcluir && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onConcluir(ag.id)}
                    >
                      ✅ Concluir
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
