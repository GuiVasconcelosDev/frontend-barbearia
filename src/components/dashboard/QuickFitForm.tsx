import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody, CardHeader } from '@components/shared/Card'
import { toast } from 'sonner'
import { agendamentosService } from '@services/agendamentos'
import type { Servico, Barbeiro } from '@types/index'

interface QuickFitFormProps {
  barbeariaId: number
  servicos: Servico[]
  barbeiros: Barbeiro[]
  onSuccess?: () => void
}

export function QuickFitForm({
  barbeariaId,
  servicos,
  barbeiros,
  onSuccess,
}: QuickFitFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    servicoId: '',
    barbeiroId: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const agora = new Date()
      agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset())
      const dataHoraAtual = agora.toISOString().slice(0, 16)

      await agendamentosService.create({
        barbearia: { id: barbeariaId },
        barbeiro: { id: parseInt(formData.barbeiroId) },
        servico: { id: parseInt(formData.servicoId) },
        cliente: { nome: formData.nome, telefone: 'Encaixe Manual' },
        dataHoraInicio: dataHoraAtual,
      })

      toast.success('✅ Encaixe realizado com sucesso!')
      setFormData({ nome: '', servicoId: '', barbeiroId: '' })
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao realizar encaixe')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-semibold">Encaixe Rápido</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-sm text-dark-600 dark:text-dark-400">
            Adicione clientes que já estão no salão
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome do Cliente"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />

            <select
              value={formData.servicoId}
              onChange={(e) => handleChange('servicoId', e.target.value)}
              className="input"
              required
            >
              <option value="">Selecione o Serviço...</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} - R$ {s.preco}
                </option>
              ))}
            </select>

            <select
              value={formData.barbeiroId}
              onChange={(e) => handleChange('barbeiroId', e.target.value)}
              className="input"
              required
            >
              <option value="">Selecione o Profissional...</option>
              {barbeiros.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Adicionar à Agenda
            </Button>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  )
}
