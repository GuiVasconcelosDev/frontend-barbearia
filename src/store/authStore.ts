import { create } from 'zustand'
import type { Barbearia } from '@types/index'
import { getToken, setToken as setApiToken } from '@services/api'

interface AuthState {
  barbearia: Barbearia | null
  token: string | null
  isAuthenticated: boolean
  setBarbearia: (barbearia: Barbearia) => void
  setToken: (token: string) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  barbearia: null,
  token: null,
  isAuthenticated: false,

  setBarbearia: (barbearia: Barbearia) => {
    set({ barbearia, isAuthenticated: true })
    localStorage.setItem('barbeariaLogada', JSON.stringify(barbearia))
  },

  setToken: (token: string) => {
    set({ token })
    setApiToken(token)
    localStorage.setItem('tokenSaaS', token)
  },

  logout: () => {
    set({ barbearia: null, token: null, isAuthenticated: false })
    localStorage.removeItem('barbeariaLogada')
    localStorage.removeItem('tokenSaaS')
  },

  hydrate: () => {
    const token = getToken()
    const barbeariaLogada = localStorage.getItem('barbeariaLogada')

    if (token && barbeariaLogada) {
      set({
        token,
        barbearia: JSON.parse(barbeariaLogada),
        isAuthenticated: true,
      })
    }
  },
}))

