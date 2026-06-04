import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody, CardHeader } from '@components/shared/Card'
import { toast } from 'sonner'
import { barbeirosService } from '@services/barbeiros'
import type { CreateBarbeiroPayload } from '@types/index'

interface BarberFormProps {
  barbeariaId: number
  onSuccess?: () => void
}

export function BarberForm({ barbeariaId, onSuccess }: BarberFormProps) {
  const [nome, setNome] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload: CreateBarbeiroPayload = {
        nome,
        ativo: true,
        barbearia: { id: barbeariaId },
      }
      await barbeirosService.create(payload)
      toast.success('💈 Barbeiro adicionado com sucesso!')
      setNome('')
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar barbeiro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold">Adicionar Profissional</h3>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome do Barbeiro"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="success"
              isLoading={isLoading}
              className="w-full"
            >
              Adicionar Profissional
            </Button>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  )
}
