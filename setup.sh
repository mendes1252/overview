#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# PULSO - Script de Configuração Automatizada
# ============================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
  echo -e "\n${GREEN}[STEP]${NC} $1"
}

print_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

echo "============================================================"
echo "  PULSO - Configuração do Ambiente de Desenvolvimento"
echo "============================================================"

# -----------------------------------------------------------
# 1. Verificar pré-requisitos
# -----------------------------------------------------------
print_step "Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
  print_error "Node.js não encontrado. Instale o Node.js >= 20.x"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  print_error "Node.js >= 20.x é necessário. Versão atual: $(node -v)"
  exit 1
fi
print_success "Node.js $(node -v) encontrado"

if ! command -v npm &> /dev/null; then
  print_error "npm não encontrado."
  exit 1
fi
print_success "npm $(npm -v) encontrado"

# -----------------------------------------------------------
# 2. Instalar dependências
# -----------------------------------------------------------
print_step "Instalando dependências..."

npm install
print_success "Dependências instaladas com sucesso"

# -----------------------------------------------------------
# 3. Configurar variáveis de ambiente
# -----------------------------------------------------------
print_step "Configurando variáveis de ambiente..."

if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local

    # Gerar AUTH_SECRET automaticamente
    if command -v openssl &> /dev/null; then
      AUTH_SECRET=$(openssl rand -base64 32)
      if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|your-secret-key-here-generate-with-openssl-rand-base64-32|${AUTH_SECRET}|" .env.local
      else
        sed -i "s|your-secret-key-here-generate-with-openssl-rand-base64-32|${AUTH_SECRET}|" .env.local
      fi
      print_success "AUTH_SECRET gerado automaticamente"
    else
      print_warn "openssl não encontrado. Edite AUTH_SECRET manualmente em .env.local"
    fi

    print_success "Arquivo .env.local criado a partir de .env.example"
    print_warn "Edite .env.local com suas credenciais (DATABASE_URL, API keys, etc.)"
  else
    print_error "Arquivo .env.example não encontrado"
    exit 1
  fi
else
  print_warn "Arquivo .env.local já existe. Pulando configuração."
fi

# -----------------------------------------------------------
# 4. Configurar Prisma
# -----------------------------------------------------------
print_step "Gerando Prisma Client..."

npx prisma generate
print_success "Prisma Client gerado com sucesso"

# -----------------------------------------------------------
# 5. Verificar banco de dados (opcional)
# -----------------------------------------------------------
print_step "Verificando conexão com banco de dados..."

if npx prisma db push --accept-data-loss 2>/dev/null; then
  print_success "Schema sincronizado com o banco de dados"
else
  print_warn "Não foi possível conectar ao banco de dados."
  print_warn "Verifique a DATABASE_URL no .env.local e tente novamente com:"
  print_warn "  npx prisma db push"
fi

# -----------------------------------------------------------
# 6. Verificar lint
# -----------------------------------------------------------
print_step "Executando verificação de lint..."

if npm run lint 2>/dev/null; then
  print_success "Lint passou sem erros"
else
  print_warn "Lint reportou problemas. Execute 'npm run lint' para detalhes."
fi

# -----------------------------------------------------------
# 7. Build de verificação
# -----------------------------------------------------------
print_step "Executando build de verificação..."

if npm run build 2>/dev/null; then
  print_success "Build completado com sucesso"
else
  print_warn "Build falhou. Execute 'npm run build' para ver erros detalhados."
fi

# -----------------------------------------------------------
# Concluído
# -----------------------------------------------------------
echo ""
echo "============================================================"
echo -e "  ${GREEN}Configuração concluída!${NC}"
echo "============================================================"
echo ""
echo "Próximos passos:"
echo "  1. Edite .env.local com suas credenciais"
echo "  2. Configure o PostgreSQL e atualize DATABASE_URL"
echo "  3. Execute: npx prisma db push"
echo "  4. Execute: npm run dev"
echo "  5. Acesse: http://localhost:3000"
echo ""
