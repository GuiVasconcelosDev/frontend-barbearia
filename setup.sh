#!/bin/bash

# SETUP RÁPIDO - Barbearia SaaS Frontend

echo "🚀 Iniciando setup do Barbearia SaaS Frontend..."
echo ""

# 1. Criar .env.local
if [ ! -f .env.local ]; then
  echo "📝 Criando arquivo .env.local..."
  cp .env.example .env.local
  echo "✅ .env.local criado"
  echo "   ⚠️  Lembre-se de configurar VITE_API_URL com sua API"
  echo ""
else
  echo "✅ .env.local já existe"
  echo ""
fi

# 2. Instalar dependências
if [ ! -d node_modules ]; then
  echo "📦 Instalando dependências..."
  npm install
  echo "✅ Dependências instaladas"
  echo ""
else
  echo "✅ Dependências já instaladas"
  echo ""
fi

# 3. Mostrar próximos passos
echo "🎉 Setup completo!"
echo ""
echo "Próximos passos:"
echo "1. Configure VITE_API_URL em .env.local"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:5173"
echo ""
echo "Dicas:"
echo "- Use 'npm run build' para produção"
echo "- Use 'npm run lint' para verificar código"
echo "- Consulte README_NEW.md para mais informações"
echo ""
