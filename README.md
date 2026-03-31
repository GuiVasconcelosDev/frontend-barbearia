✂️ Barbearia SaaS - Frontend (React)
Interface de utilizador (Single Page Application) desenvolvida em React 19 e Vite para o sistema de gestão e agendamento de barbearias (SaaS). O frontend consome a API RESTful desenvolvida em Spring Boot, oferecendo tanto um painel administrativo para os donos das barbearias, quanto uma interface pública de agendamento para os clientes.

🚀 Tecnologias Utilizadas
Framework/Biblioteca: React 19

Bundler: Vite (Rápido desenvolvimento e build otimizado)

Roteamento: React Router DOM (v7)

Estilização: Inline Styles & CSS puro (App.css)

Gestão de Estado: React Hooks (useState, useEffect)

Comunicação de Rede: Fetch API nativa do navegador

✨ Principais Funcionalidades
1. Autenticação e Onboarding (/)
Sistema de Login/Registo integrado: O dono da barbearia pode criar a sua conta fornecendo os dados do negócio.

Geração Automática de Slug: Ao criar a conta, o sistema converte o nome da barbearia num link amigável (ex: "Barbearia do João" vira barbearia-do-joao).

Gestão de Sessão: O Token JWT (Crachá de acesso) recebido da API é armazenado de forma segura no localStorage e anexado automaticamente aos cabeçalhos (Headers) das requisições subsequentes.

2. Painel Administrativo (/painel)
Dashboard exclusivo e protegido (requer token JWT) com métricas e gestão do salão:

Indicadores em Tempo Real: Cálculo de Faturamento Total e número de cortes concluídos com base na agenda.

Gestão de Catálogo e Equipa: Adição de novos serviços (com preço e duração) e registo de profissionais.

Configuração Dinâmica de Tempo: Tela inovadora para definir durações de serviço específicas por barbeiro (ex: o Barbeiro A demora 30 min, o Barbeiro B demora 45 min).

Gestão da Agenda (Ações Rápidas): Listagem dos agendamentos do dia com botões para "Concluir" (soma no caixa) ou marcar "Faltou" (não soma no caixa).

Encaixe Manual: Permite que o rececionista adicione um cliente que chegou presencialmente diretamente à agenda.

3. Tela de Agendamento do Cliente (/:slug)
Página pública e dinâmica gerada para cada barbearia registada:

Identidade Visual: Carrega automaticamente o nome, endereço e telefone da barbearia dona do link.

Fluxo de Agendamento Intuitivo: O cliente preenche o seu nome, WhatsApp, seleciona o serviço, o profissional e a data/hora num formulário amigável.

Notificação de Pagamento: Ao concluir, o cliente é alertado com a Chave Pix da barbearia para pagamento antecipado.

⚙️ Arquitetura e Destaques Técnicos
Componentização via Funções: O código centraliza rotas lógicas de grande porte, demonstrando fluência no ciclo de vida do React (useEffect para chamadas de rede no carregamento das telas).

Validação de Rotas (Protected Routes): O /painel faz um bypass e redireciona automaticamente utilizadores não logados de volta para a tela de login.
