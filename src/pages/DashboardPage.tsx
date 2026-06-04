import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Scissors,
  DollarSign,
  CheckCircle,
} from 'lucide-react'
import { Header } from '@components/shared/Header'
import { StatsCard } from '@components/shared/StatsCard'
import { LoadingSpinner } from '@components/shared/LoadingSpinner'
import { ServiceForm } from '@components/dashboard/ServiceForm'
import { BarberForm } from '@components/dashboard/BarberForm'
import { QuickFitForm } from '@components/dashboard/QuickFitForm'
import { ScheduleList } from '@components/dashboard/ScheduleList'
import { useAuthStore } from '@store/authStore'
import { agendamentosService } from '@services/agendamentos'
import { servicosService } from '@services/servicos'
import { barbeirosService } from '@services/barbeiros'
import { toast } from 'sonner'
import { formatCurrency } from '@utils/dateFormat'
import type { Agendamento, Servico, Barbeiro } from '@types/index'

export function DashboardPage() {
  const navigate = useNavigate()
  const barbearia = useAuthStore((state) => state.barbearia)
  const logout = useAuthStore((state) => state.logout)

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!barbearia) {
      navigate('/')
      return
    }

    loadData()
  }, [barbearia, navigate, refreshKey])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [agendamentosData, servicosData, barbeirosData] = await Promise.all([
        agendamentosService.getByBarbearia(barbearia!.id),
        servicosService.getByBarbearia(barbearia!.id),
        barbeirosService.getByBarbearia(barbearia!.id),
      ])

      setAgendamentos(agendamentosData)
      setServicos(servicosData)
      setBarbeiros(barbeirosData)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const agendamentosPendentes = agendamentos.filter(
    (ag) => !ag.concluido && !ag.faltou
  )
  const agendamentosConcluidos = agendamentos.filter(
    (ag) => ag.concluido && !ag.faltou
  )
  const faturamentoTotal = agendamentosConcluidos.reduce(
    (total, ag) => total + (ag.servico.preco || 0),
    0
  )

  const handleConcluir = async (id: number) => {
    if (
      !window.confirm(
        'Confirmar a conclusão e adicionar o valor ao caixa?'
      )
    ) {
      return
    }

    try {
      await agendamentosService.concluir(id)
      toast.success('✅ Agendamento concluído!')
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error('Erro ao concluir agendamento')
    }
  }

  const handleMarcarFalta = async (id: number) => {
    if (
      !window.confirm(
        'O cliente faltou? A vaga será liberada e não somará no caixa.'
      )
    ) {
      return
    }

    try {
      await agendamentosService.marcarFalta(id)
      toast.success('❌ Falta registrada')
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error('Erro ao marcar falta')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Até logo!')
  }

  if (!barbearia) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <Header
        barbeariaName={barbearia.nome}
        barbeariaSlug={barbearia.slug}
        onLogout={handleLogout}
        isDashboard
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Faturamento Total"
            value={formatCurrency(faturamentoTotal)}
            icon={<DollarSign className="w-6 h-6" />}
            gradient="success"
          />
          <StatsCard
            title="Cortes Concluídos"
            value={agendamentosConcluidos.length}
            icon={<CheckCircle className="w-6 h-6" />}
            gradient="blue"
          />
          <StatsCard
            title="Agendamentos Pendentes"
            value={agendamentosPendentes.length}
            icon={<BarChart3 className="w-6 h-6" />}
            gradient="primary"
          />
          <StatsCard
            title="Serviços Cadastrados"
            value={servicos.length}
            icon={<Scissors className="w-6 h-6" />}
            gradient="primary"
          />
        </motion.div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando dados..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Forms Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ServiceForm
                barbeariaId={barbearia.id}
                onSuccess={() => setRefreshKey((prev) => prev + 1)}
              />
              <BarberForm
                barbeariaId={barbearia.id}
                onSuccess={() => setRefreshKey((prev) => prev + 1)}
              />
              <QuickFitForm
                barbeariaId={barbearia.id}
                servicos={servicos}
                barbeiros={barbeiros}
                onSuccess={() => setRefreshKey((prev) => prev + 1)}
              />
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">📅 Agenda de Hoje</h2>
              <ScheduleList
                agendamentos={agendamentosPendentes}
                onConcluir={handleConcluir}
                onMarcarFalta={handleMarcarFalta}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
