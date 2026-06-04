import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { BookingForm } from '@components/booking/BookingForm'
import { LoadingSpinner } from '@components/shared/LoadingSpinner'
import { barbeariaService } from '@services/barbearia'
import { servicosService } from '@services/servicos'
import { barbeirosService } from '@services/barbeiros'
import type { Barbearia, Servico, Barbeiro } from '@types/index'

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const [barbearia, setBarbearia] = useState<Barbearia | null>(null)
  const [servicos, setServicos] = useState<Servico[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!slug) throw new Error('Slug inválido')

        const barbeariaData = await barbeariaService.getBySlug(slug)
        setBarbearia(barbeariaData)

        const [servicosData, barbeirosData] = await Promise.all([
          servicosService.getByBarbearia(barbeariaData.id),
          barbeirosService.getByBarbearia(barbeariaData.id),
        ])

        setServicos(servicosData)
        setBarbeiros(barbeirosData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Barbearia não encontrada'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [slug])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-2">😢 Oops!</h1>
          <p className="text-dark-600 dark:text-dark-400">{error}</p>
        </motion.div>
      </div>
    )
  }

  if (isLoading || !barbearia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando barbearia..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-950 dark:to-dark-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">✂️ {barbearia.nome}</h1>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-center gap-2 text-dark-600 dark:text-dark-400">
              <MapPin className="w-5 h-5" />
              <span>{barbearia.endereco || 'Endereço não informado'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-dark-600 dark:text-dark-400">
              <Phone className="w-5 h-5" />
              <span>{barbearia.telefone}</span>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        {servicos.length > 0 && barbeiros.length > 0 ? (
          <BookingForm
            barbearia={barbearia}
            servicos={servicos}
            barbeiros={barbeiros}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-dark-600 dark:text-dark-400">
              Barbearia não possui serviços ou profissionais cadastrados
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-dark-500 mt-8"
        >
          © 2024 Barbearia SaaS - Todos os direitos reservados
        </motion.p>
      </div>
    </div>
  )
}
