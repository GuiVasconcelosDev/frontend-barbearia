import { motion } from 'framer-motion'
import { useState } from 'react'
import { Store, Phone, Mail, Lock, MapPin, Zap } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody } from '@components/shared/Card'
import { toast } from 'sonner'
import { authService } from '@services/auth'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    chavePix: '',
    endereco: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (nome: string): string => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '-')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slug = generateSlug(formData.nome)
      await authService.signup({
        ...formData,
        slug,
      })
      toast.success('✅ Conta criada com sucesso! Faça login para acessar o painel.')
      onSwitchToLogin()
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        senha: '',
        chavePix: '',
        endereco: '',
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta')
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
        <CardBody className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Criar Conta de Barbearia</h2>
            <p className="text-dark-600 dark:text-dark-400">
              Comece a gerenciar sua barbearia hoje
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome da Barbearia"
              icon={<Store className="w-5 h-5" />}
              placeholder="Barbearia do João"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />

            <Input
              label="Telefone"
              icon={<Phone className="w-5 h-5" />}
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              required
            />

            <Input
              label="E-mail"
              icon={<Mail className="w-5 h-5" />}
              placeholder="seu@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <Input
              label="Senha"
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
              type="password"
              value={formData.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              required
            />

            <Input
              label="Chave Pix"
              icon={<Zap className="w-5 h-5" />}
              placeholder="CPF, email ou telefone"
              value={formData.chavePix}
              onChange={(e) => handleChange('chavePix', e.target.value)}
              required
            />

            <Input
              label="Endereço"
              icon={<MapPin className="w-5 h-5" />}
              placeholder="Rua, número, bairro, cidade"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Criar Conta
            </Button>
          </form>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onSwitchToLogin}
            className="w-full btn btn-secondary"
          >
            Já Tenho Conta
          </motion.button>
        </CardBody>
      </Card>
    </motion.div>
  )
}
