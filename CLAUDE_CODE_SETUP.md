# PULSO - Guia de Configuração com Claude Code

## Visão Geral

O **PULSO** é uma plataforma SaaS de produtividade pessoal com IA, construída com Next.js 16, Prisma, PostgreSQL, e integração com OpenAI, Stripe e Resend.

Este guia descreve os passos para configurar o ambiente de desenvolvimento.

---

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 15.x (rodando localmente ou via Docker)
- Contas de serviço (opcionais para desenvolvimento):
  - Google Cloud Console (OAuth)
  - OpenAI API
  - Stripe
  - Resend

---

## Configuração Rápida

### Opção 1: Script Automatizado

```bash
# 1. Dar permissão de execução
chmod +x setup.sh

# 2. Executar
./setup.sh
```

### Opção 2: Comandos Manuais

Abra o arquivo **CLAUDE_CODE_COMMANDS.md** e execute os comandos em sequência.

---

## Passos Detalhados

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

**Variáveis obrigatórias para desenvolvimento:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:password@localhost:5432/pulso?schema=public` |
| `AUTH_SECRET` | Chave secreta do NextAuth | Gerar com `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL da aplicação | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação | `http://localhost:3000` |

**Variáveis opcionais (funcionalidades extras):**

| Variável | Descrição |
|----------|-----------|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Login via Google OAuth |
| `OPENAI_API_KEY` | Coach IA e relatórios semanais |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRO_PRICE_ID` | Pagamentos e assinaturas |
| `RESEND_API_KEY` | Envio de emails transacionais |

### 3. Configurar Banco de Dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco de dados
npx prisma db push
```

> **Nota:** Use `npx prisma migrate dev` se preferir utilizar migrations versionadas.

### 4. Verificar a Configuração

```bash
# Verificar lint
npm run lint

# Build de produção (verificação completa)
npm run build
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Projeto

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Páginas de autenticação (login, cadastro)
│   ├── (dashboard)/      # Páginas do painel (dashboard, tarefas, hábitos, metas)
│   ├── api/              # Rotas da API REST
│   └── onboarding/       # Wizard de configuração inicial
├── components/
│   ├── ui/               # Componentes Radix UI reutilizáveis
│   ├── layout/           # Header, Sidebar
│   ├── dashboard/        # Cards do painel
│   ├── tasks/            # Gerenciamento de tarefas
│   ├── habits/           # Rastreamento de hábitos
│   └── goals/            # Definição de metas
├── lib/                  # Utilitários e integrações
├── hooks/                # React hooks customizados
└── types/                # Definições de tipos TypeScript
prisma/
└── schema.prisma         # Schema do banco de dados (11 modelos)
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Verificação de lint (ESLint) |
| `npx prisma studio` | Interface visual do banco de dados |
| `npx prisma generate` | Regenerar Prisma Client |
| `npx prisma db push` | Sincronizar schema com o banco |

---

## Solução de Problemas

### Erro de conexão com PostgreSQL
Verifique se o PostgreSQL está rodando e se a `DATABASE_URL` no `.env.local` está correta.

### Erro no Prisma Client
Execute `npx prisma generate` para regenerar o client.

### Erro de build com tipos TypeScript
Execute `npm run build` para ver os erros detalhados e corrija os tipos indicados.
