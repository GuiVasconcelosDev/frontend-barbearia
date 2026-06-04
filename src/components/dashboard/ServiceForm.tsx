import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody, CardHeader } from '@components/shared/Card'
import { toast } from 'sonner'
import { servicosService } from '@services/servicos'
import type { CreateServicePayload } from '@types/index'

interface ServiceFormProps {
  barbeariaId: number
  onSuccess?: () => void
}

export function ServiceForm({ barbeariaId, onSuccess }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    duracaoMinutos: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload: CreateServicePayload = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        duracaoMinutos: parseInt(formData.duracaoMinutos),
        barbearia: { id: barbeariaId },
      }
      await servicosService.create(payload)
      toast.success('✂️ Serviço adicionado com sucesso!')
      setFormData({ nome: '', preco: '', duracaoMinutos: '' })
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar serviço')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-semibold">Adicionar Serviço</h3>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Ex: Corte Degradê"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Preço (R$)"
                step="0.01"
                value={formData.preco}
                onChange={(e) => handleChange('preco', e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Duração (min)"
                value={formData.duracaoMinutos}
                onChange={(e) => handleChange('duracaoMinutos', e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="success"
              isLoading={isLoading}
              className="w-full"
            >
              Salvar Serviço
            </Button>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  )
}
