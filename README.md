# Predileta Lavanderia - Sistema de Gestão

Sistema de gestão para lavanderia com foco em PDV, automação de notificações e relatórios básicos.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Email:** Resend
- **State:** React Query
- **Forms:** React Hook Form + Zod

## Features

- **F1:** Autenticação simples com senha fixa
- **F2:** CRUD completo de clientes com busca e paginação
- **F3:** Sistema de pedidos (PDV) com wizard de 3 etapas e geração de protocolo
- **F4:** Notificações automáticas por email (recebimento, pronto, lembrete)
- **F5:** Relatórios com exportação para Excel
- **F6:** Dashboard com resumo do dia

## Setup

1. Clone o repositório
2. Instale dependências: `npm install`
3. Copie `.env.example` para `.env.local` e configure as variáveis
4. Execute o schema SQL no Supabase
5. Gere o client Prisma: `npx prisma generate`
6. Inicie o servidor: `npm run dev`

## Variáveis de Ambiente

Veja `.env.example` para a lista completa. As principais são:

- `DATABASE_URL` - Connection string do Supabase
- `RESEND_API_KEY` - Chave API do Resend para emails
- `APP_PASSWORD` - Senha de acesso ao sistema
- `CRON_SECRET` - Secret para proteger cron jobs

## Deploy na Vercel

1. Conecte o repositório GitHub na Vercel
2. Configure todas as variáveis de ambiente
3. Deploy automático em cada push
4. O `vercel.json` configura o cron job de lembretes (diário às 9h)
