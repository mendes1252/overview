"""
WhatsApp Legend Generator — Afiliado Amazon & Shopee
Gera legendas persuasivas para grupos de WhatsApp usando Claude Haiku 4.5.
"""

import json
import os
import re
import urllib.parse
from datetime import datetime
from pathlib import Path

import anthropic
import streamlit as st

# ─── Constantes ───────────────────────────────────────────────────────────────

HISTORY_FILE = Path("data/history.json")

MODELS = {
    "Claude Haiku 4.5 ⚡ (Rápido e Econômico)": "claude-haiku-4-5",
    "Claude Haiku 3.5": "claude-haiku-3-5-20241022",
}

# System prompt otimizado para copywriting brasileiro no WhatsApp
SYSTEM_PROMPT = """Você é o MELHOR copywriter brasileiro especializado em vendas pelo WhatsApp e marketing de afiliados Amazon e Shopee. Com 10+ anos de experiência e mais de R$ 2 milhões em vendas geradas para afiliados.

🎯 SEU ESTILO DE ESCRITA:
• Tom conversacional e natural — como um amigo entusiasmado indicando algo incrível
• Emojis ESTRATÉGICOS que amplificam a mensagem (seja cirúrgico, não exagere)
• URGÊNCIA real e crível: "Promoção relâmpago", "Estoque limitado", "Só hoje"
• PREÇO em destaque — use maiúsculas, emojis de dinheiro, contraste visual
• BENEFÍCIOS concretos e emocionais, nunca especificações técnicas frias
• PROVA SOCIAL leve e natural: "Mais de 5.000 avaliações 5 estrelas", "Best-seller"
• CTA (chamada para ação) FORTE, direta e impossível de ignorar
• Link SEMPRE ao final, em linha própria, nunca encurtado

✅ ESTRUTURA CAMPEÃ (máx. 6 linhas por legenda):
1. 🪝 GANCHO — 1 linha que para o scroll e prende atenção
2. 💡 PROBLEMA/DESEJO que o produto resolve (1 linha empática)
3. ✨ BENEFÍCIOS principais com emojis estratégicos (1-2 linhas)
4. 💰 PREÇO em destaque + desconto impactante (1 linha)
5. ⏰ URGÊNCIA ou escassez genuína (1 linha)
6. 🔗 CTA forte + link completo (1-2 linhas)

📋 FORMATO DE SAÍDA OBRIGATÓRIO — use exatamente:

[LEGENDA 1 - Direta]
<texto completo aqui>

[LEGENDA 2 - Emocional]
<texto completo aqui>

[LEGENDA 3 - Lista de Benefícios]
<texto completo aqui>

[LEGENDA 4 - Pergunta Envolvente]
<texto completo aqui>

[LEGENDA 5 - Urgência Máxima]
<texto completo aqui>

📌 REGRAS INVIOLÁVEIS:
• Máximo 6 linhas por legenda (7 se precisar do link)
• Link COMPLETO e EXATO no final de cada legenda — nunca altere
• Português brasileiro natural, persuasivo e correto
• NUNCA mencione "afiliado", "comissão" ou "parceria"
• Foco total no VALOR para o comprador
• Cada legenda com personalidade própria e totalmente diferente"""

PLATFORM_COLORS = {
    "Amazon": ("#FF9900", "#000"),
    "Shopee": ("#EE4D2D", "#fff"),
    "Desconhecida": ("#666", "#fff"),
}
PLATFORM_ICONS = {"Amazon": "📦", "Shopee": "🛍️", "Desconhecida": "🔗"}
STYLE_ICONS = {
    "direta": "🎯",
    "emocional": "💙",
    "lista": "📋",
    "pergunta": "❓",
    "urgência": "⚡",
    "urgencia": "⚡",
}


# ─── Helpers de dados ─────────────────────────────────────────────────────────


def detect_platform(link: str) -> str:
    lower = link.lower()
    if "amazon" in lower or "amzn" in lower or "/a.co/" in lower:
        return "Amazon"
    if "shopee" in lower:
        return "Shopee"
    return "Desconhecida"


def load_history() -> list:
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []


def save_to_history(entry: dict) -> None:
    history = load_history()
    history.insert(0, entry)
    HISTORY_FILE.write_text(
        json.dumps(history[:200], ensure_ascii=False, indent=2), encoding="utf-8"
    )


def parse_legends(text: str) -> list[dict]:
    pattern = r"\[LEGENDA\s+\d+\s*[-–]\s*([^\]]+)\]"
    parts = re.split(pattern, text)
    legends: list[dict] = []

    if len(parts) > 1:
        for i in range(1, len(parts) - 1, 2):
            style = parts[i].strip()
            content = parts[i + 1].strip() if i + 1 < len(parts) else ""
            if content:
                legends.append({"style": style, "content": content})
    else:
        # fallback: split by double newline
        blocks = [b.strip() for b in text.split("\n\n") if b.strip()]
        for j, block in enumerate(blocks[:6]):
            legends.append({"style": f"Variação {j + 1}", "content": block})

    return legends


def make_wa_link(text: str) -> str:
    return "https://wa.me/?text=" + urllib.parse.quote(text)


# ─── Chamada à API ────────────────────────────────────────────────────────────


def generate_legends(
    *,
    client: anthropic.Anthropic,
    product_name: str,
    product_link: str,
    price: str,
    discount: str,
    features: str,
    platform: str,
    num_legends: int,
    temperature: float,
    extra_instructions: str,
    model: str,
) -> str:
    user_msg = (
        f"Crie {num_legends} legendas para WhatsApp para este produto afiliado:\n\n"
        f"NOME DO PRODUTO: {product_name}\n"
        f"PLATAFORMA: {platform}\n"
        f"PREÇO ATUAL: {price}\n"
        + (f"DESCONTO: {discount}\n" if discount else "")
        + f"LINK COMPLETO (use este exato em todas as legendas): {product_link}\n\n"
        "CARACTERÍSTICAS E BENEFÍCIOS:\n"
        + (features.strip() if features.strip() else "Não especificado — use benefícios genéricos relevantes")
        + "\n\n"
        + (f"INSTRUÇÕES ADICIONAIS: {extra_instructions}\n\n" if extra_instructions else "")
        + "LEMBRETE: Máximo 6 linhas, link completo no final de cada legenda, emojis estratégicos, CTA forte!"
    )

    response = client.messages.create(
        model=model,
        max_tokens=2048,
        temperature=temperature,
        # System prompt com cache ativado (prompt caching para economia de tokens)
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": user_msg}],
    )
    return response.content[0].text


# ─── Componentes de UI ────────────────────────────────────────────────────────


def render_legend_card(legend: dict, idx: int, platform: str) -> None:
    style = legend.get("style", f"Legenda {idx + 1}")
    style_lower = style.lower()
    icon = next((v for k, v in STYLE_ICONS.items() if k in style_lower), "✨")
    plat_icon = PLATFORM_ICONS.get(platform, "🔗")

    st.markdown(f"#### {icon} {plat_icon} Legenda {idx + 1} — *{style}*")

    # st.code exibe um bloco com botão de cópia nativo no Streamlit
    st.code(legend["content"], language=None)

    col_wa, col_tip = st.columns([1, 2])
    with col_wa:
        wa_url = make_wa_link(legend["content"])
        st.markdown(
            f'<a href="{wa_url}" target="_blank" style="text-decoration:none;">'
            '<button style="background:#25D366;color:white;border:none;padding:10px 20px;'
            'border-radius:8px;cursor:pointer;font-size:0.9rem;font-weight:600;width:100%;'
            'margin-top:4px;">'
            "📤 Abrir no WhatsApp</button></a>",
            unsafe_allow_html=True,
        )
    with col_tip:
        st.caption("💡 Use o ícone 📋 no canto superior direito do bloco para copiar a legenda.")

    st.markdown("---")


def render_sidebar() -> dict:
    with st.sidebar:
        st.markdown("## ⚙️ Configurações")
        st.divider()

        api_key = st.text_input(
            "🔑 Anthropic API Key",
            type="password",
            value=os.environ.get("ANTHROPIC_API_KEY", ""),
            help="Obtenha sua chave em console.anthropic.com",
            placeholder="sk-ant-...",
        )

        model_label = st.selectbox("🤖 Modelo de IA", list(MODELS.keys()))
        model = MODELS[model_label]

        temperature = st.slider(
            "🌡️ Criatividade (Temperatura)",
            min_value=0.7,
            max_value=1.0,
            value=0.85,
            step=0.05,
            help="Valores mais altos = legendas mais criativas e variadas",
        )

        num_legends = st.slider(
            "📝 Número de Legendas",
            min_value=3,
            max_value=6,
            value=5,
        )

        extra = st.text_area(
            "💡 Instruções Extras para o Copywriter",
            placeholder=(
                "Ex: Use tom mais formal.\n"
                "Mencione frete grátis.\n"
                "Foque no público feminino..."
            ),
            height=100,
        )

        st.divider()

        if st.button("🔌 Testar Conexão com API", use_container_width=True):
            if not api_key:
                st.error("❌ Insira sua API Key primeiro!")
            else:
                with st.spinner("Testando conexão..."):
                    try:
                        c = anthropic.Anthropic(api_key=api_key)
                        c.messages.create(
                            model=model,
                            max_tokens=5,
                            messages=[{"role": "user", "content": "Olá"}],
                        )
                        st.success("✅ Conexão estabelecida com sucesso!")
                    except anthropic.AuthenticationError:
                        st.error("❌ API Key inválida! Verifique em console.anthropic.com")
                    except anthropic.APIConnectionError:
                        st.error("🌐 Sem conexão com a internet.")
                    except Exception as exc:
                        st.error(f"❌ Erro: {exc}")

        st.divider()
        st.markdown("**📖 Início rápido:**")
        st.markdown(
            "1. Insira sua **API Key** acima\n"
            "2. Preencha os **dados do produto**\n"
            "3. Clique em **🚀 Gerar Legendas**\n"
            "4. **Copie** ou envie direto pelo **WhatsApp**!"
        )
        st.divider()
        st.caption(
            "💡 *Dica: defina `ANTHROPIC_API_KEY` como variável de ambiente "
            "para não precisar inserir toda vez.*"
        )

    return {
        "api_key": api_key,
        "model": model,
        "temperature": temperature,
        "num_legends": num_legends,
        "extra": extra,
    }


def render_generate_tab(cfg: dict) -> None:
    # Botão de exemplo com 1 clique
    if st.button("⚡ Carregar Exemplo (Fone JBL Bluetooth)", key="load_example"):
        st.session_state.update(
            {
                "_ex_name": "Fone Bluetooth JBL Tune 520BT - Sem Fio",
                "_ex_link": "https://amzn.to/exemplo-jbl-tune520bt",
                "_ex_price": "R$ 249,90",
                "_ex_discount": "30%",
                "_ex_features": (
                    "Som puro e de qualidade superior\n"
                    "Bateria de até 57 horas de uso\n"
                    "Bluetooth 5.3 com conexão rápida\n"
                    "Dobrável e leve (220g) — cabe na bolsa\n"
                    "Compatível com Siri e Google Assistant\n"
                    "Certificado de resistência a respingos"
                ),
                "_ex_platform": "Amazon",
            }
        )
        st.rerun()

    with st.form("product_form", clear_on_submit=False):
        col_left, col_right = st.columns([3, 2])

        with col_left:
            product_link = st.text_input(
                "🔗 Link do Produto (com tag de afiliado) *",
                value=st.session_state.get("_ex_link", ""),
                placeholder="https://amzn.to/SEU-LINK-AFILIADO ou https://s.shopee.com.br/...",
            )
            product_name = st.text_input(
                "📦 Nome do Produto *",
                value=st.session_state.get("_ex_name", ""),
                placeholder="Ex: Fone Bluetooth JBL Tune 520BT",
            )
            cp, cd = st.columns(2)
            price = cp.text_input(
                "💰 Preço Atual *",
                value=st.session_state.get("_ex_price", ""),
                placeholder="R$ 249,90",
            )
            discount = cd.text_input(
                "🏷️ Desconto (opcional)",
                value=st.session_state.get("_ex_discount", ""),
                placeholder="30%",
            )

        with col_right:
            features = st.text_area(
                "✨ Características / Benefícios",
                value=st.session_state.get("_ex_features", ""),
                placeholder=(
                    "Uma por linha:\n"
                    "Bateria de 57h\n"
                    "Bluetooth 5.3\n"
                    "Resistente à água\n"
                    "Entrega rápida Prime\n..."
                ),
                height=170,
            )
            platform_opts = ["Auto-detectar", "Amazon", "Shopee"]
            default_plat = st.session_state.get("_ex_platform", "Auto-detectar")
            platform_sel = st.selectbox(
                "🏪 Plataforma",
                platform_opts,
                index=platform_opts.index(default_plat) if default_plat in platform_opts else 0,
            )

        submitted = st.form_submit_button(
            "🚀 Gerar Legendas",
            use_container_width=True,
            type="primary",
        )

    # Badge de plataforma detectada
    if product_link:
        detected = detect_platform(product_link)
        platform = platform_sel if platform_sel != "Auto-detectar" else detected
        bg, fg = PLATFORM_COLORS.get(platform, ("#666", "#fff"))
        icon = PLATFORM_ICONS.get(platform, "🔗")
        st.markdown(
            f'<span style="background:{bg};color:{fg};padding:4px 14px;'
            f'border-radius:20px;font-size:0.82rem;font-weight:700;">'
            f"{icon} Detectado: {platform}</span>",
            unsafe_allow_html=True,
        )
        st.markdown("")
    else:
        platform = platform_sel if platform_sel != "Auto-detectar" else "Desconhecida"

    # Lógica de geração
    if submitted:
        errors = []
        if not cfg["api_key"]:
            errors.append("**🔑 API Key ausente** — insira na barra lateral à esquerda.")
        if not product_name.strip():
            errors.append("**📦 Nome do produto** é obrigatório.")
        if not product_link.strip():
            errors.append("**🔗 Link do produto** é obrigatório.")
        if not price.strip():
            errors.append("**💰 Preço** é obrigatório.")

        for err in errors:
            st.error(err)

        if not errors:
            plat = platform_sel if platform_sel != "Auto-detectar" else detect_platform(product_link)

            with st.spinner(
                "✨ Criando legendas persuasivas... isso pode levar alguns segundos!"
            ):
                try:
                    client = anthropic.Anthropic(api_key=cfg["api_key"])
                    raw_text = generate_legends(
                        client=client,
                        product_name=product_name.strip(),
                        product_link=product_link.strip(),
                        price=price.strip(),
                        discount=discount.strip(),
                        features=features.strip(),
                        platform=plat,
                        num_legends=cfg["num_legends"],
                        temperature=cfg["temperature"],
                        extra_instructions=cfg["extra"],
                        model=cfg["model"],
                    )
                    legends = parse_legends(raw_text)

                    # Salvar no histórico
                    entry = {
                        "id": datetime.now().strftime("%Y%m%d_%H%M%S"),
                        "date": datetime.now().strftime("%d/%m/%Y %H:%M"),
                        "product_name": product_name.strip(),
                        "product_link": product_link.strip(),
                        "price": price.strip(),
                        "discount": discount.strip(),
                        "features": features.strip(),
                        "platform": plat,
                        "legends": legends,
                    }
                    save_to_history(entry)

                    st.session_state["current_legends"] = legends
                    st.session_state["current_platform"] = plat
                    st.success(f"✅ {len(legends)} legendas geradas com sucesso!")

                except anthropic.AuthenticationError:
                    st.error(
                        "❌ **API Key inválida!** Verifique sua chave em console.anthropic.com"
                    )
                except anthropic.RateLimitError:
                    st.warning(
                        "⚠️ **Limite de requisições atingido.** "
                        "Aguarde alguns instantes e tente novamente."
                    )
                except anthropic.APIConnectionError:
                    st.error(
                        "🌐 **Sem conexão com a API Anthropic.** "
                        "Verifique sua conexão com a internet."
                    )
                except anthropic.BadRequestError as exc:
                    st.error(f"❌ **Requisição inválida:** {exc}")
                except Exception as exc:
                    st.error(f"❌ **Erro inesperado:** {exc}")

    # Exibir legendas geradas
    if st.session_state.get("current_legends"):
        st.markdown("---")
        st.markdown("## 🎯 Suas Legendas Prontas para Enviar")
        st.info(
            "💡 **Como copiar:** clique no ícone 📋 no canto superior direito de cada bloco "
            "para copiar o texto completo da legenda."
        )
        current_plat = st.session_state.get("current_platform", "Desconhecida")
        for i, lg in enumerate(st.session_state["current_legends"]):
            render_legend_card(lg, i, current_plat)


def render_history_tab() -> None:
    st.markdown("## 📚 Histórico de Legendas Geradas")

    history = load_history()

    if not history:
        st.info(
            "📭 Nenhuma legenda gerada ainda. "
            "Acesse a aba **✏️ Gerar Legendas** para começar!"
        )
        return

    col_search, col_count = st.columns([3, 1])
    with col_search:
        search = st.text_input(
            "🔍 Buscar por nome do produto",
            placeholder="Digite para filtrar...",
            label_visibility="collapsed",
        )
    with col_count:
        st.markdown(f"**{len(history)} produto(s)**")

    filtered = (
        [h for h in history if search.lower() in h["product_name"].lower()]
        if search
        else history
    )

    if not filtered:
        st.warning(f'Nenhum produto encontrado para "{search}".')
        return

    st.markdown(f"*Mostrando {len(filtered)} resultado(s)*")

    for entry in filtered:
        plat = entry.get("platform", "Desconhecida")
        plat_icon = PLATFORM_ICONS.get(plat, "🔗")
        price_label = entry.get("price", "—")
        date_label = entry.get("date", "—")

        with st.expander(
            f"{plat_icon} **{entry['product_name']}**  —  {price_label}  —  {date_label}"
        ):
            c_info, c_btn = st.columns([3, 1])

            with c_info:
                st.markdown(f"**Plataforma:** {plat}")
                st.markdown(f"**Preço:** {price_label}")
                if entry.get("discount"):
                    st.markdown(f"**Desconto:** {entry['discount']}")
                link = entry.get("product_link", "—")
                st.markdown(f"**Link:** `{link}`")

            with c_btn:
                if st.button("♻️ Reutilizar Produto", key=f"reuse_{entry['id']}"):
                    st.session_state.update(
                        {
                            "_ex_name": entry["product_name"],
                            "_ex_link": entry.get("product_link", ""),
                            "_ex_price": entry.get("price", ""),
                            "_ex_discount": entry.get("discount", ""),
                            "_ex_features": entry.get("features", ""),
                            "_ex_platform": entry.get("platform", "Auto-detectar"),
                        }
                    )
                    st.rerun()

            legends = entry.get("legends", [])
            if legends:
                st.markdown("---")
                st.markdown(f"**{len(legends)} legenda(s) gerada(s):**")
                for j, lg in enumerate(legends):
                    style = lg.get("style", f"Variação {j + 1}")
                    st.markdown(f"**{j + 1}. {style}**")
                    st.code(lg["content"], language=None)
                    wa_url = make_wa_link(lg["content"])
                    st.markdown(
                        f'<a href="{wa_url}" target="_blank" style="text-decoration:none;">'
                        '<button style="background:#25D366;color:white;border:none;'
                        'padding:6px 14px;border-radius:6px;cursor:pointer;font-size:0.85rem;">'
                        "📤 WhatsApp</button></a>",
                        unsafe_allow_html=True,
                    )
                    st.markdown("")


# ─── App Principal ────────────────────────────────────────────────────────────


def main() -> None:
    st.set_page_config(
        page_title="Gerador de Legendas WhatsApp — Afiliado",
        page_icon="🛒",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # CSS global
    st.markdown(
        """
        <style>
        .main-title {
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 0;
        }
        .sub-title {
            font-size: 1rem;
            color: #888;
            margin-top: 0.3rem;
            margin-bottom: 1.6rem;
        }
        /* Aumentar fonte dos blocos de código (legendas) */
        div[data-testid="stCode"] code {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
        }
        /* Arredondar botões */
        .stButton > button {
            border-radius: 10px !important;
            font-weight: 600 !important;
        }
        /* Remover label vazio de text_input oculto */
        div[data-testid="stTextInput"] label[visibility="collapsed"] {
            display: none;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    cfg = render_sidebar()

    st.markdown(
        '<p class="main-title">🛒 Gerador de Legendas WhatsApp</p>',
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="sub-title">'
        "Afiliado Amazon &amp; Shopee — Crie legendas irresistíveis com emojis, "
        "tom de venda e link de afiliado em segundos"
        "</p>",
        unsafe_allow_html=True,
    )

    tab_gen, tab_hist = st.tabs(["✏️ Gerar Legendas", "📚 Histórico"])

    with tab_gen:
        render_generate_tab(cfg)

    with tab_hist:
        render_history_tab()


if __name__ == "__main__":
    main()
