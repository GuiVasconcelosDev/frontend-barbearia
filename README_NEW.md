# 🎭 Barbearia SaaS - Frontend Moderno

Uma aplicação SaaS moderna e dinâmica para gerenciar barbearias com design atrativo, animações suaves e experiência de usuário excepcional.

## ✨ Features

- ✂️ **Gerenciamento Completo** - Serviços, profissionais e agendamentos
- 🎨 **Design Moderno** - Tailwind CSS com gradientes e efeitos
- 💫 **Animações Suaves** - Framer Motion em toda a aplicação
- 🌙 **Dark Mode** - Suporte completo a tema escuro
- 📱 **Responsivo** - Mobile-first design
- 🔐 **Autenticação** - Login e registro seguro com JWT
- 🔔 **Notificações** - Toast elegantes com Sonner
- ⚡ **Performance** - React Query para cache automático
- 🎯 **TypeScript** - Type safety completo

## 🚀 Stack Tecnológico

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animações declarativas
- **React Query** - Data fetching e cache
- **Zustand** - State management
- **Vite** - Build tool rápido
- **Lucide Icons** - Ícones modernos
- **Sonner** - Toast notifications

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🏗️ Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Formulários de autenticação
│   ├── booking/        # Componentes de agendamento
│   ├── dashboard/      # Componentes do painel
│   ├── layouts/        # Layouts principais
│   └── shared/         # Componentes compartilhados
├── pages/              # Páginas/rotas principais
├── hooks/              # Custom hooks
├── services/           # Integração com API
├── store/              # Zustand store (autenticação)
├── types/              # Tipos TypeScript
├── utils/              # Funções utilitárias
└── styles/             # CSS global com Tailwind
```

## 🎨 Paleta de Cores

- **Primary**: Roxo/Púrpura (#a855f7)
- **Success**: Verde (#10b981)
- **Warning**: Âmbar
- **Danger**: Vermelho (#ef4444)
- **Dark**: Tons de cinza/preto

## 🔧 Configuração

### Variáveis de Ambiente

```env
# .env.local
VITE_API_URL=http://localhost:3000
```

### Componentes Principais

#### Autenticação
- `LoginForm` - Formulário de login
- `SignupForm` - Registro de barbearia
- `AuthLayout` - Layout com background animado

#### Dashboard
- `StatsCard` - Cards de estatísticas
- `ServiceForm` - Adicionar serviços
- `BarberForm` - Adicionar barbeiros
- `QuickFitForm` - Encaixe rápido
- `ScheduleList` - Lista de agendamentos

#### Agendamento
- `BookingForm` - Formulário de agendamento
- `ServiceSelector` - Seleção de serviço
- `BarberSelector` - Seleção de barbeiro

## 🎯 Guia de Uso

### Para Barbearia (Admin)

1. **Criar Conta**
   - Preencha formulário de cadastro
   - Informe nome, telefone, email e dados bancários

2. **Gerenciar Serviços**
   - Adicione serviços com preço e duração
   - Configure tempos específicos por profissional

3. **Gerenciar Profissionais**
   - Adicione barbeiros/profissionais
   - Configure suas disponibilidades

4. **Agendar Clientes**
   - Use "Encaixe Rápido" para clientes presentes
   - Visualize agenda em tempo real

### Para Cliente

1. **Acessar Site**
   - Compartilhe link: `seu-dominio.com/nome-da-barbearia`

2. **Agendar Horário**
   - Escolha serviço
   - Escolha profissional
   - Selecione data/hora
   - Confirme agendamento

## 🔐 Autenticação

- Baseada em JWT (JSON Web Token)
- Token armazenado no localStorage
- Rotas privadas protegidas
- Auto-logout em sessão expirada

## 📊 Estado da Aplicação

### Zustand Store (authStore.ts)
```typescript
- barbearia: dados da barbearia logada
- token: JWT token
- isAuthenticated: status de autenticação
- setBarbearia(): armazenar dados
- setToken(): armazenar token
- logout(): limpar autenticação
```

## 🎬 Animações

- **Entrada**: Fade + Scale
- **Hover**: Elevação + Glow
- **Loading**: Spinner giratório
- **Modal**: Backdrop blur + Scale
- **Cards**: Hover lift + Border glow

## 🌙 Dark Mode

Automaticamente detecta preferência do sistema. Alternância manual via localStorage.

```typescript
// Forçar dark mode
document.documentElement.classList.add('dark')

// Remover dark mode
document.documentElement.classList.remove('dark')
```

## 🐛 Tratamento de Erros

Todos os erros são capturados e mostrados como notificações toast:

```typescript
try {
  // Operação
} catch (error) {
  toast.error(error instanceof Error ? error.message : 'Erro genérico')
}
```

## ⚙️ Configurações de Build

### Vite Aliases
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- E mais...

### TypeScript
- Modo strict ativado
- Resolução de tipos automática
- Path mapping configurado

## 🚢 Deploy

### Vercel
```bash
npm run build
# Fazer deploy da pasta 'dist'
```

### Outras Plataformas
```bash
npm run build
# Servir a pasta 'dist' como estática
```

## 📝 Notas Importantes

1. **API URL**: Configurar via `.env.local`
2. **CORS**: Backend deve permitir requisições do frontend
3. **Token**: Sempre incluído nos headers de autenticação
4. **Cache**: React Query gerencia automaticamente
5. **Responsividade**: Testar em múltiplos dispositivos

## 🤝 Contribuindo

1. Criar branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m 'feat: descrição'`
3. Push: `git push origin feature/sua-feature`
4. Pull Request

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**
