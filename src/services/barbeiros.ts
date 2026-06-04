import { apiClient } from './api'
import type { Barbeiro, CreateBarbeiroPayload } from '@types/index'

export const barbeirosService = {
  getByBarbearia(barbeariaId: number): Promise<Barbeiro[]> {
    return apiClient.get(`/api/barbeiros/barbearia/${barbeariaId}`)
  },

  create(payload: CreateBarbeiroPayload): Promise<Barbeiro> {
    return apiClient.post('/api/barbeiros', payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/api/barbeiros/${id}`)
  },
}
