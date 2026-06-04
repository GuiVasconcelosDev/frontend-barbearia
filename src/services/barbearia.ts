import { apiClient } from './api'
import type { Barbearia } from '@types/index'

export const barbeariaService = {
  getBySlug(slug: string): Promise<Barbearia> {
    return apiClient.get(`/api/barbearias/slug/${slug}`)
  },

  getById(id: number): Promise<Barbearia> {
    return apiClient.get(`/api/barbearias/${id}`)
  },
}
