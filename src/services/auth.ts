import { apiClient, setToken, removeToken } from './api'
import type { AuthResponse, LoginPayload, SignupPayload } from '@types/index'

export const authService = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post('/api/barbearias/login', payload)
  },

  signup(payload: SignupPayload): Promise<void> {
    return apiClient.post('/api/barbearias', payload)
  },

  logout(): void {
    removeToken()
    localStorage.removeItem('barbeariaLogada')
  },

  setAuth(token: string): void {
    setToken(token)
  },
}
