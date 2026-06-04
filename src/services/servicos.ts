import { apiClient } from './api'
import type { Servico, CreateServicePayload } from '@types/index'

export const servicosService = {
  getByBarbearia(barbeariaId: number): Promise<Servico[]> {
    return apiClient.get(`/api/servicos/barbearia/${barbeariaId}`)
  },

  create(payload: CreateServicePayload): Promise<Servico> {
    return apiClient.post('/api/servicos', payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/api/servicos/${id}`)
  },
}
