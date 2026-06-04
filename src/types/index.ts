export interface Usuario {
  id: number
  email: string
  nome: string
  telefone: string
}

export interface Barbearia {
  id: number
  nome: string
  slug: string
  email: string
  telefone: string
  endereco: string
  chavePix: string
  criado_em: string
}

export interface Servico {
  id: number
  nome: string
  preco: number
  duracaoMinutos: number
  barbearia: { id: number }
}

export interface Barbeiro {
  id: number
  nome: string
  ativo: boolean
  barbearia: { id: number }
}

export interface Cliente {
  nome: string
  telefone: string
}

export interface Agendamento {
  id: number
  cliente: Cliente
  servico: Servico
  barbeiro: Barbeiro
  barbearia: { id: number }
  dataHoraInicio: string
  concluido: boolean
  faltou: boolean
}

export interface BarbeiroDuracao {
  id: number
  barbeiro: Barbeiro
  servico: Servico
  duracaoMinutos: number
}

export interface AuthResponse {
  token: string
  barbearia: Barbearia
}

export interface SignupPayload {
  nome: string
  slug: string
  telefone: string
  email: string
  senha: string
  chavePix: string
  endereco: string
}

export interface LoginPayload {
  email: string
  senha: string
}

export interface CreateServicePayload {
  nome: string
  preco: number
  duracaoMinutos: number
  barbearia: { id: number }
}

export interface CreateBarbeiroPayload {
  nome: string
  ativo: boolean
  barbearia: { id: number }
}

export interface CreateAgendamentoPayload {
  barbearia: { id: number }
  barbeiro: { id: number }
  servico: { id: number }
  cliente: Cliente
  dataHoraInicio: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
}
