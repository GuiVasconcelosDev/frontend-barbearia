import { apiClient } from './api'
import type { Agendamento, CreateAgendamentoPayload, BarbeiroDuracao } from '@types/index'

export const agendamentosService = {
  getByBarbearia(barbeariaId: number): Promise<Agendamento[]> {
    return apiClient.get(`/api/agendamentos/barbearia/${barbeariaId}`)
  },

  create(payload: CreateAgendamentoPayload): Promise<Agendamento> {
    return apiClient.post('/api/agendamentos', payload)
  },

  concluir(id: number): Promise<void> {
    return apiClient.post(`/api/agendamentos/${id}/concluir`)
  },

  marcarFalta(id: number): Promise<void> {
    return apiClient.post(`/api/agendamentos/${id}/faltou`)
  },

  configurarTempo(payload: {
    barbeiro: { id: number }
    servico: { id: number }
    duracaoMinutos: number
  }): Promise<BarbeiroDuracao> {
    return apiClient.post('/api/barbeiro-servicos', payload)
  },
}
