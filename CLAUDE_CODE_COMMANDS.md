# PULSO - Comandos Manuais de Configuração

Execute os comandos abaixo em sequência para configurar o projeto.

---

## 1. Instalar Dependências

```bash
npm install
```

## 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Gerar chave secreta para NextAuth
openssl rand -base64 32
# Cole o resultado no campo AUTH_SECRET do .env.local
```

Edite `.env.local` e configure pelo menos:
- `DATABASE_URL` - URL do PostgreSQL
- `AUTH_SECRET` - Chave gerada acima
- `NEXTAUTH_URL` - `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` - `http://localhost:3000`

## 3. Configurar Prisma e Banco de Dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Sincronizar schema com o banco de dados
npx prisma db push
```

## 4. Verificar Configuração

```bash
# Executar lint
npm run lint

# Executar build
npm run build
```

## 5. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Comandos Úteis

```bash
# Interface visual do banco de dados
npx prisma studio

# Regenerar Prisma Client após alterações no schema
npx prisma generate

# Criar migration versionada
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```
