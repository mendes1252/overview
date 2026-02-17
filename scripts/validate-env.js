#!/usr/bin/env node

/**
 * pulse - Environment Configuration Validator
 * Run with: npm run validate
 *
 * Checks all required and optional environment variables,
 * validates their format, and provides actionable guidance
 * for common configuration issues (especially Resend email).
 */

const fs = require("fs");
const path = require("path");

// --- ANSI Colors ---
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const NC = "\x1b[0m";

// --- Load .env.local ---
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    const envFallback = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envFallback)) {
      parseEnvFile(envFallback);
      return;
    }
    return;
  }
  parseEnvFile(envPath);
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

// --- Env Var Definitions ---
const ENV_VARS = [
  {
    name: "DATABASE_URL",
    required: true,
    description: "PostgreSQL connection string",
    validate: (v) => v.startsWith("postgresql://") || v.startsWith("postgres://") ? null : "Must start with postgresql:// or postgres://",
    hint: "Format: postgresql://user:password@host:5432/dbname",
  },
  {
    name: "AUTH_SECRET",
    required: true,
    description: "NextAuth secret key",
    validate: (v) => v.length >= 20 ? null : "Too short. Generate with: openssl rand -base64 32",
    hint: "Generate with: openssl rand -base64 32",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    required: true,
    description: "Public application URL",
    validate: (v) => v.startsWith("http") ? null : "Must start with http:// or https://",
    hint: "Example: https://pulseprodutividade.com.br",
  },
  {
    name: "RESEND_API_KEY",
    required: false,
    description: "Resend API key for emails",
    validate: (v) => v.startsWith("re_") ? null : "Resend API keys start with 're_'",
    hint: "Get yours at https://resend.com/api-keys",
  },
  {
    name: "EMAIL_FROM",
    required: false,
    description: "Email sender address",
    validate: (v) => {
      if (v.includes("onboarding@resend.dev")) {
        return "SANDBOX: Can only send to your Resend account email. Verify domain for production.";
      }
      return null;
    },
    hint: 'Production: "pulse <noreply@yourdomain.com>"',
  },
  {
    name: "GOOGLE_CLIENT_ID",
    required: false,
    description: "Google OAuth client ID",
    hint: "Get from Google Cloud Console",
  },
  {
    name: "GOOGLE_CLIENT_SECRET",
    required: false,
    description: "Google OAuth client secret",
    hint: "Get from Google Cloud Console",
  },
  {
    name: "OPENAI_API_KEY",
    required: false,
    description: "OpenAI API key for AI coach",
    validate: (v) => v.startsWith("sk-") ? null : "OpenAI keys typically start with 'sk-'",
    hint: "Get from https://platform.openai.com/api-keys",
  },
  {
    name: "ASAAS_API_KEY",
    required: false,
    description: "Asaas payment gateway key",
    hint: "Get from Asaas dashboard",
  },
  {
    name: "ASAAS_WEBHOOK_TOKEN",
    required: false,
    description: "Asaas webhook verification token",
    hint: "Set in Asaas webhook configuration",
  },
];

// --- Validation ---
let errors = 0;
let warnings = 0;
let passed = 0;

console.log("");
console.log(`${BOLD}============================================================${NC}`);
console.log(`${BOLD}  pulse - Validacao de Ambiente${NC}`);
console.log(`${BOLD}============================================================${NC}`);
console.log("");

// Check each variable
for (const envVar of ENV_VARS) {
  const value = process.env[envVar.name];
  const label = `${envVar.name}`;

  if (!value) {
    if (envVar.required) {
      console.log(`  ${RED}✗${NC} ${label} ${DIM}— ${envVar.description}${NC}`);
      console.log(`    ${RED}ERRO: Variavel obrigatoria nao definida${NC}`);
      if (envVar.hint) console.log(`    ${DIM}Dica: ${envVar.hint}${NC}`);
      errors++;
    } else {
      console.log(`  ${YELLOW}○${NC} ${label} ${DIM}— ${envVar.description} (opcional)${NC}`);
      warnings++;
    }
    continue;
  }

  // Has a value — validate it
  const validationError = envVar.validate ? envVar.validate(value) : null;
  if (validationError) {
    const isWarning = validationError.startsWith("SANDBOX:") || validationError.startsWith("WARNING:");
    if (isWarning) {
      console.log(`  ${YELLOW}△${NC} ${label} ${DIM}— ${envVar.description}${NC}`);
      console.log(`    ${YELLOW}${validationError}${NC}`);
      warnings++;
    } else {
      console.log(`  ${RED}✗${NC} ${label} ${DIM}— ${envVar.description}${NC}`);
      console.log(`    ${RED}${validationError}${NC}`);
      errors++;
    }
    if (envVar.hint) console.log(`    ${DIM}Dica: ${envVar.hint}${NC}`);
  } else {
    console.log(`  ${GREEN}✓${NC} ${label} ${DIM}— ${envVar.description}${NC}`);
    passed++;
  }
}

// --- Resend Domain Verification Guide ---
const emailFrom = process.env.EMAIL_FROM || "";
const hasResendKey = !!process.env.RESEND_API_KEY;
const usingSandbox = !emailFrom || emailFrom.includes("onboarding@resend.dev") || emailFrom.includes("resend.dev");

if (hasResendKey && usingSandbox) {
  console.log("");
  console.log(`${BOLD}${CYAN}------------------------------------------------------------${NC}`);
  console.log(`${BOLD}${CYAN}  Resend: Verificacao de Dominio Necessaria${NC}`);
  console.log(`${CYAN}------------------------------------------------------------${NC}`);
  console.log("");
  console.log(`  Voce esta usando o endereco sandbox ${YELLOW}onboarding@resend.dev${NC}`);
  console.log(`  Emails so podem ser enviados para o email da sua conta Resend.`);
  console.log("");
  console.log(`  ${BOLD}Para enviar emails para qualquer usuario:${NC}`);
  console.log("");
  console.log(`  ${CYAN}1.${NC} Acesse ${BOLD}https://resend.com/domains${NC}`);
  console.log(`  ${CYAN}2.${NC} Clique em "Add Domain"`);
  console.log(`  ${CYAN}3.${NC} Insira seu dominio (ex: pulseprodutividade.com.br)`);
  console.log(`  ${CYAN}4.${NC} O Resend mostrara registros DNS (MX, SPF, DKIM)`);
  console.log(`  ${CYAN}5.${NC} Adicione esses registros no seu provedor DNS:`);
  console.log(`     ${DIM}Vercel: Projeto > Settings > Domains > DNS Records${NC}`);
  console.log(`     ${DIM}Cloudflare: DNS > Records > Add Record${NC}`);
  console.log(`  ${CYAN}6.${NC} Volte ao Resend e clique "Verify"`);
  console.log(`  ${CYAN}7.${NC} Atualize EMAIL_FROM no Vercel:`);
  console.log(`     ${GREEN}EMAIL_FROM="pulse <noreply@seudominio.com.br>"${NC}`);
  console.log(`  ${CYAN}8.${NC} Faca redeploy no Vercel`);
  console.log("");
}

// --- Summary ---
console.log("");
console.log(`${BOLD}------------------------------------------------------------${NC}`);
const total = passed + errors + warnings;
console.log(`  ${GREEN}${passed} OK${NC}  ${RED}${errors} erros${NC}  ${YELLOW}${warnings} avisos${NC}  ${DIM}(${total} variaveis verificadas)${NC}`);

if (errors > 0) {
  console.log(`  ${RED}${BOLD}Corrija os erros acima antes de executar a aplicacao.${NC}`);
} else if (warnings > 0) {
  console.log(`  ${YELLOW}Ambiente funcional, mas com servicos opcionais ausentes.${NC}`);
} else {
  console.log(`  ${GREEN}${BOLD}Ambiente completamente configurado!${NC}`);
}
console.log(`${BOLD}------------------------------------------------------------${NC}`);
console.log("");

process.exit(errors > 0 ? 1 : 0);
