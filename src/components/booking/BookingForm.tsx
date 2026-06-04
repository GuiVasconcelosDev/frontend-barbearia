import { motion } from 'framer-motion'
import { useState } from 'react'
import { Phone, Mail, Calendar } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody, CardHeader } from '@components/shared/Card'
import { ServiceSelector } from './ServiceSelector'
import { BarberSelector } from './BarberSelector'
import { toast } from 'sonner'
import { agendamentosService } from '@services/agendamentos'
import type { Servico, Barbeiro, Barbearia } from '@types/index'

interface BookingFormProps {
  barbearia: Barbearia
  servicos: Servico[]
  barbeiros: Barbeiro[]
  onSuccess?: () => void
}

export function BookingForm({
  barbearia,
  servicos,
  barbeiros,
  onSuccess,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servicoId: '',
    barbeiroId: '',
    dataHora: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const servicoSelecionado = servicos.find(
        (s) => s.id === parseInt(formData.servicoId)
      )

      await agendamentosService.create({
        barbearia: { id: barbearia.id },
        barbeiro: { id: parseInt(formData.barbeiroId) },
        servico: { id: parseInt(formData.servicoId) },
        cliente: { nome: formData.nome, telefone: formData.telefone },
        dataHoraInicio: formData.dataHora,
      })

      toast.success('✅ Horário Reservado com sucesso!')
      toast.message(
        `Chave Pix para pagamento antecipado: ${barbearia.chavePix}`
      )

      setFormData({
        nome: '',
        telefone: '',
        servicoId: '',
        barbeiroId: '',
        dataHora: '',
      })
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao agendar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Agende seu Horário</h2>
          <p className="text-dark-600 dark:text-dark-400 text-sm mt-1">
            Escolha o serviço, profissional e data desejada
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Input
                label="Seu Nome"
                icon={<Mail className="w-5 h-5" />}
                placeholder="João Silva"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
              <Input
                label="Seu WhatsApp"
                icon={<Phone className="w-5 h-5" />}
                placeholder="(11) 99999-9999"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ServiceSelector
                servicos={servicos}
                selectedId={parseInt(formData.servicoId) || undefined}
                onChange={(id) => handleChange('servicoId', id)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <BarberSelector
                barbeiros={barbeiros}
                selectedId={parseInt(formData.barbeiroId) || undefined}
                onChange={(id) => handleChange('barbeiroId', id)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Input
                label="3. Escolha a Data e Hora:"
                icon={<Calendar className="w-5 h-5" />}
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => handleChange('dataHora', e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full py-3 text-lg"
              >
                Confirmar Agendamento
              </Button>
            </motion.div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  )
}
