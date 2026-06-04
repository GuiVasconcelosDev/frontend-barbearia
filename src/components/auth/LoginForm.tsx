import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { Input } from '@components/shared/Input'
import { Button } from '@components/shared/Button'
import { Card, CardBody } from '@components/shared/Card'
import { toast } from 'sonner'
import { authService } from '@services/auth'
import { useAuthStore } from '@store/authStore'

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setBarbearia = useAuthStore((state) => state.setBarbearia)
  const setToken = useAuthStore((state) => state.setToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login({ email, senha: password })
      setToken(response.token)
      setBarbearia(response.barbearia)
      toast.success('Bem-vindo ao painel!')
      window.location.href = '/painel'
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
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
            <h2 className="text-2xl font-bold mb-2">Entrar no Painel</h2>
            <p className="text-dark-600 dark:text-dark-400">
              Acesse sua barbearia e gerenie agendamentos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="E-mail"
              icon={<Mail className="w-5 h-5" />}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Senha"
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200 dark:border-dark-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400">
                Não tem conta?
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onSwitchToSignup}
            className="w-full btn btn-secondary"
          >
            Criar Conta de Barbearia
          </motion.button>
        </CardBody>
      </Card>
    </motion.div>
  )
}
