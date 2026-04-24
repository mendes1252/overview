# 🛒 WhatsApp Legend Generator — Afiliado Amazon & Shopee

Gere legendas persuasivas para WhatsApp em segundos usando IA. Ideal para afiliados Amazon e Shopee que precisam de textos de venda prontos, com emojis estratégicos, destaque de preço, urgência e link de afiliado.

---

## ✨ Funcionalidades

- 🚀 **Gera 3–6 legendas diferentes** com variações de estilo (direta, emocional, lista, pergunta, urgência)
- 📦 **Detecta plataforma automaticamente** pelo link (Amazon ou Shopee)
- 📋 **Cópia com 1 clique** — botão nativo em cada legenda
- 📤 **Botão "Abrir no WhatsApp"** com a legenda já preenchida
- 📚 **Histórico local** de todos os produtos gerados (busca por nome)
- ♻️ **Reutilizar produto** do histórico com 1 clique
- ⚡ **Exemplo pronto** para testar em 1 clique
- 🔌 **Teste de conexão** com a API integrado

---

## 📋 Pré-requisitos

- Python **3.10 ou superior**
- Conta na [Anthropic](https://console.anthropic.com) com uma **API Key**
- Conexão com a internet

---

## 🚀 Instalação e Execução

### Passo 1 — Clone ou baixe o projeto

```bash
git clone <url-do-repo>
cd whatsapp-legend-generator
```

### Passo 2 — Crie um ambiente virtual (recomendado)

```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

### Passo 3 — Instale as dependências

```bash
pip install -r requirements.txt
```

### Passo 4 — Configure sua API Key

**Opção A — Variável de ambiente (recomendada):**

```bash
# macOS / Linux
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."
```

**Opção B — Inserir diretamente no app:**  
Você pode digitar sua API Key no campo da barra lateral ao abrir o app.

### Passo 5 — Execute o app

```bash
streamlit run app.py
```

O app abrirá automaticamente em seu navegador em `http://localhost:8501`.

---

## 🎯 Como Usar

1. **Insira sua API Key** na barra lateral (ou defina como variável de ambiente)
2. **Cole o link** do produto com sua tag de afiliado
3. **Preencha o nome, preço e características** do produto
4. Clique em **🚀 Gerar Legendas**
5. **Copie** a legenda desejada (ícone 📋) ou clique em **📤 Abrir no WhatsApp**

---

## 📁 Estrutura do Projeto

```
whatsapp-legend-generator/
├── app.py              # Aplicação principal Streamlit
├── requirements.txt    # Dependências Python
├── README.md           # Este arquivo
└── data/
    └── history.json    # Histórico local (criado automaticamente)
```

---

## 💰 Custo

Este app usa o modelo **Claude Haiku 4.5** da Anthropic, que é extremamente econômico:

- **~$1,00 por 1 milhão de tokens de entrada**
- **~$5,00 por 1 milhão de tokens de saída**
- Cada geração de 5 legendas custa aproximadamente **$0,001** (menos de 1 centavo)
- O **prompt caching** está ativado, reduzindo custos em ~90% no system prompt

---

## 🔧 Configurações Avançadas

Na barra lateral você pode ajustar:

| Configuração | Descrição |
|---|---|
| 🤖 Modelo | Claude Haiku 4.5 (recomendado) ou Haiku 3.5 |
| 🌡️ Criatividade | 0.7 (mais consistente) a 1.0 (mais variado) |
| 📝 Nº de Legendas | 3 a 6 legendas por geração |
| 💡 Instruções Extras | Personalização adicional para o copywriter |

---

## ❓ Perguntas Frequentes

**O app funciona sem internet?**  
Não. O app precisa de conexão para chamar a API da Anthropic.

**Minha API Key fica segura?**  
Sim. A chave é usada apenas localmente para autenticar com a API Anthropic e nunca é transmitida para terceiros.

**Como obter uma API Key?**  
Acesse [console.anthropic.com](https://console.anthropic.com), crie uma conta e gere uma chave em "API Keys".

**O histórico fica onde?**  
Em `data/history.json` na pasta do projeto. Apenas no seu computador.

---

## 📝 Licença

MIT — use, modifique e distribua livremente.
