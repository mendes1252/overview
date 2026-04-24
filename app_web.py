import streamlit as st
from groq import Groq
import json
import os
import datetime
import urllib.parse
import requests
from bs4 import BeautifulSoup

# --- CONFIGURAÇÃO ---
st.set_page_config(
    page_title="Gerador de Mensagens WhatsApp - Afiliado",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #FF9900;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #888;
        text-align: center;
        margin-bottom: 2rem;
    }
    .stButton>button {
        width: 100%;
        border-radius: 8px;
        font-weight: bold;
    }
    .highlight-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 12px;
        color: white;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# --- MODELOS GROQ DISPONÍVEIS ---
GROQ_MODELS = {
    "LLaMA 3.3 70B (Melhor qualidade)": "llama-3.3-70b-versatile",
    "LLaMA 3.1 8B (Mais rápido)": "llama-3.1-8b-instant",
    "LLaMA 3 70B": "llama3-70b-8192",
    "Mixtral 8x7B": "mixtral-8x7b-32768",
}

# --- FUNÇÕES AUXILIARES ---

def get_groq_client(api_key):
    return Groq(api_key=api_key)


def detect_platform(link):
    link_lower = link.lower()
    if "amazon" in link_lower or "amzn" in link_lower:
        return "Amazon"
    elif "shopee" in link_lower or "shope.ee" in link_lower:
        return "Shopee"
    return "Outros"


def generate_whatsapp_link(text):
    return f"https://wa.me/?text={urllib.parse.quote(text)}"


def scrape_product_info(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    try:
        resp = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        platform = detect_platform(resp.url)

        result = {"name": "", "price": "", "discount": "", "features": [], "platform": platform}

        if platform == "Amazon":
            title_elem = soup.find("span", {"id": "productTitle"})
            if title_elem:
                result["name"] = title_elem.get_text().strip()

            price_whole = soup.find("span", {"class": "a-price-whole"})
            if price_whole:
                price_frac = soup.find("span", {"class": "a-price-fraction"})
                frac = price_frac.get_text().strip() if price_frac else "00"
                result["price"] = f"R$ {price_whole.get_text().strip().rstrip(',')},{frac}"

            discount_elem = soup.find("span", {"class": "savingsPercentage"})
            if discount_elem:
                result["discount"] = discount_elem.get_text().strip().replace("-", "") + " OFF"

            bullets = soup.find("div", {"id": "feature-bullets"})
            if bullets:
                items = bullets.find_all("span", {"class": "a-list-item"})
                result["features"] = [i.get_text().strip() for i in items if i.get_text().strip()][:5]

        elif platform == "Shopee":
            og_title = soup.find("meta", property="og:title")
            if og_title:
                result["name"] = og_title.get("content", "").strip()
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                desc = og_desc.get("content", "").strip()
                if desc:
                    result["features"] = [desc]
        else:
            og_title = soup.find("meta", property="og:title")
            if og_title:
                result["name"] = og_title.get("content", "").strip()
            if not result["name"]:
                tag_title = soup.find("title")
                if tag_title:
                    result["name"] = tag_title.get_text().strip()
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                desc = og_desc.get("content", "").strip()
                if desc:
                    result["features"] = [desc]

        return result, None

    except requests.exceptions.Timeout:
        return None, "Timeout — a página demorou muito para responder."
    except requests.exceptions.RequestException as e:
        return None, f"Erro de conexão: {e}"
    except Exception as e:
        return None, f"Erro: {e}"


# --- PROMPTS ---

PROMPT_COMPLETO = """
Você é um Copywriter Brasileiro especialista em vendas diretas no WhatsApp para afiliados.
Crie {num_copies} legendas de alta conversão para WhatsApp.

REGRAS:
1. Use emojis estratégicos (🔥, 🚨, 💰, ✅, 🛒) com moderação
2. Tom urgente, entusiasta e confiável
3. Destaque PREÇO e DESCONTO de forma visual
4. Gatilhos mentais: Escassez, Urgência, Prova Social
5. Máximo 8 linhas por legenda
6. SEMPRE termine com o link de afiliado
7. Texto puro, sem markdown (sem **, sem *)

Produto: {product_name}
Preço: {price}
Desconto: {discount}
Benefícios: {features}
Plataforma: {platform}
Link: {link}

Retorne APENAS um JSON válido (sem mais nada):
[
  {{"style": "Urgência", "text": "..."}},
  {{"style": "Benefícios", "text": "..."}},
  {{"style": "Promoção", "text": "..."}}
]
"""

PROMPT_APENAS_LINK = """
Você é um Copywriter Brasileiro especialista em vendas diretas no WhatsApp para afiliados.

Com base APENAS no link de afiliado fornecido, crie {num_copies} legendas persuasivas para WhatsApp.

Instruções:
- Se o link for da Amazon (amzn.to, amazon.com.br): mencione Amazon e use tom premium
- Se for da Shopee (shope.ee, shopee.com.br): mencione Shopee e reforce frete grátis/cashback
- Use gatilhos de urgência, escassez e oferta imperdível
- Inclua emojis estratégicos
- Termine SEMPRE com o link fornecido
- Máximo 8 linhas por legenda
- Texto puro, sem markdown

Link: {link}

Retorne APENAS um JSON válido (sem mais nada):
[
  {{"style": "Urgência", "text": "..."}},
  {{"style": "Oferta Relâmpago", "text": "..."}},
  {{"style": "Prova Social", "text": "..."}}
]
"""


# --- GERAÇÃO ---

def _parse_response(content):
    content = content.strip()
    if "```" in content:
        parts = content.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                content = part[4:].strip()
                break
            elif part.startswith("["):
                content = part
                break
    start = content.find("[")
    end = content.rfind("]") + 1
    if start != -1 and end > start:
        content = content[start:end]
    return json.loads(content)


def gerar_copies(client, model_id, temperature, prompt_text):
    response = client.chat.completions.create(
        model=model_id,
        messages=[
            {
                "role": "system",
                "content": "You are a JSON generator. Output ONLY a valid JSON array. No markdown, no explanation.",
            },
            {"role": "user", "content": prompt_text},
        ],
        temperature=temperature,
    )
    return _parse_response(response.choices[0].message.content)


def exibir_resultados(results):
    st.subheader("✨ Mensagens Prontas para WhatsApp")
    for i, item in enumerate(results):
        c1, c2 = st.columns([4, 1])
        with c1:
            st.markdown(f"**#{i + 1} — {item.get('style', 'Geral')}**")
            st.code(item.get("text", ""), language=None)
        with c2:
            st.write("")
            wa_link = generate_whatsapp_link(item.get("text", ""))
            st.link_button("📤 Enviar no WhatsApp", wa_link, use_container_width=True)
        st.markdown("---")


def save_session_history(data):
    if "history" not in st.session_state:
        st.session_state["history"] = []
    data["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    st.session_state["history"].insert(0, data)
    if len(st.session_state["history"]) > 30:
        st.session_state["history"] = st.session_state["history"][:30]


# --- MAIN ---

def main():
    st.markdown(
        '<h1 class="main-header">🛒 Gerador de Mensagens WhatsApp — Afiliado</h1>',
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="sub-header">Cole o link → a IA escreve a mensagem. Grátis, rápido, sem instalação.</p>',
        unsafe_allow_html=True,
    )

    # --- SIDEBAR ---
    with st.sidebar:
        st.header("⚙️ Configurações")

        # API Key — tenta secrets do Streamlit Cloud primeiro, senão pede no sidebar
        api_key = st.secrets.get("GROQ_API_KEY", "") if hasattr(st, "secrets") else ""
        if not api_key:
            api_key = st.text_input(
                "🔑 Groq API Key",
                type="password",
                placeholder="gsk_...",
                help="Chave gratuita em console.groq.com",
            )

        if not api_key:
            st.warning("Insira sua API Key do Groq para continuar.")
            st.markdown(
                "**Como obter gratuitamente:**\n"
                "1. Acesse [console.groq.com](https://console.groq.com)\n"
                "2. Crie uma conta (gratuita)\n"
                "3. Vá em **API Keys → Create API Key**\n"
                "4. Cole a chave aqui"
            )
            st.stop()

        client = get_groq_client(api_key)

        model_label = st.selectbox("Modelo de IA", list(GROQ_MODELS.keys()), index=0)
        model_id = GROQ_MODELS[model_label]

        temperature = st.slider("Criatividade", 0.5, 1.2, 0.8, 0.1)
        num_copies = st.selectbox("Variações de Mensagem", [3, 5, 7], index=1)

        st.divider()
        st.subheader("📜 Histórico da Sessão")
        history_data = st.session_state.get("history", [])
        if history_data:
            for item in history_data[:5]:
                label = item.get("product_name", item.get("link", "Item"))
                short = (label[:26] + "...") if len(label) > 26 else label
                if st.button(f"🔄 {short}", key=f"hist_{item['timestamp']}"):
                    st.session_state["carregado"] = item
                    st.rerun()
        else:
            st.info("Nenhuma geração ainda.")

    # --- TABS ---
    tab_rapido, tab_manual, tab_historico = st.tabs(
        ["⚡ Modo Rápido (só o link!)", "📝 Modo Manual", "📜 Histórico"]
    )

    # =========================================================
    # TAB 1 — MODO RÁPIDO
    # =========================================================
    with tab_rapido:
        st.markdown(
            """
            <div class="highlight-box">
            <strong>⚡ Modo Rápido</strong><br>
            Cole qualquer link de afiliado abaixo. A IA analisa e gera as mensagens completas — sem preencher nada.
            </div>
            """,
            unsafe_allow_html=True,
        )

        url_rapido = st.text_input(
            "🔗 Link de Afiliado",
            placeholder="https://amzn.to/... ou https://shope.ee/...",
            key="url_rapido",
        )

        col_a, col_b = st.columns(2)
        with col_a:
            btn_analisar = st.button(
                "🔍 Analisar Página e Extrair Dados",
                use_container_width=True,
                disabled=not url_rapido,
                help="Acessa a página e extrai nome, preço e benefícios automaticamente.",
            )
        with col_b:
            btn_direto = st.button(
                "⚡ Gerar Direto (só pela URL)",
                use_container_width=True,
                disabled=not url_rapido,
                help="A IA gera copy analisando apenas a URL, sem acessar a página.",
            )

        # SCRAPING
        if btn_analisar and url_rapido:
            with st.spinner("🔍 Acessando a página e extraindo informações..."):
                data, error = scrape_product_info(url_rapido)
            if error:
                st.warning(f"⚠️ Não foi possível extrair dados: {error}")
                st.info("Use **Gerar Direto** ou preencha manualmente na aba **Modo Manual**.")
            else:
                st.session_state["scraped"] = data
                st.session_state["scraped_link"] = url_rapido
                if data.get("name"):
                    st.success(f"✅ Produto identificado: **{data['name'][:70]}**")
                else:
                    st.info("Dados parcialmente extraídos. Revise e complete abaixo.")

        # GERAR DIRETO
        if btn_direto and url_rapido:
            with st.spinner("⚡ IA gerando mensagens a partir do link..."):
                try:
                    prompt = PROMPT_APENAS_LINK.format(num_copies=num_copies, link=url_rapido)
                    copies = gerar_copies(client, model_id, temperature, prompt)
                    st.session_state["resultados_rapido"] = copies
                    save_session_history({"product_name": url_rapido, "link": url_rapido, "copies": copies})
                except json.JSONDecodeError:
                    st.error("Erro ao interpretar JSON. Tente diminuir a criatividade ou outro modelo.")
                except Exception as e:
                    st.error(f"Erro: {e}")

        # FORMULÁRIO COM DADOS EXTRAÍDOS
        if "scraped" in st.session_state and "scraped_link" in st.session_state:
            data = st.session_state["scraped"]
            st.divider()
            st.markdown("#### 📋 Dados Extraídos — Revise e Confirme")

            with st.form("form_rapido"):
                c1, c2 = st.columns(2)
                with c1:
                    nome_r = st.text_input("Produto", value=data.get("name", ""))
                    preco_r = st.text_input("Preço", value=data.get("price", ""))
                with c2:
                    desconto_r = st.text_input("Desconto", value=data.get("discount", ""))
                    plataforma_r = st.text_input("Plataforma", value=data.get("platform", ""))

                features_r = st.text_area(
                    "Benefícios (um por linha)",
                    value="\n".join(data.get("features", [])),
                    height=120,
                )
                custom_r = st.text_area(
                    "Instruções extras (opcional)",
                    placeholder="Ex: foco em público jovem, mais emojis de fogo...",
                    height=80,
                )
                btn_gerar_r = st.form_submit_button("🚀 Gerar Mensagens", use_container_width=True)

            if btn_gerar_r:
                link_usar = st.session_state["scraped_link"]
                with st.spinner("🤖 Gerando mensagens..."):
                    try:
                        features_list = [f.strip() for f in features_r.split("\n") if f.strip()]
                        prompt = PROMPT_COMPLETO.format(
                            num_copies=num_copies,
                            product_name=nome_r or "(produto não identificado)",
                            price=preco_r or "não informado",
                            discount=desconto_r or "não informado",
                            features=", ".join(features_list) or "não informados",
                            platform=plataforma_r or "não identificada",
                            link=link_usar,
                        )
                        if custom_r:
                            prompt += f"\nInstrução extra: {custom_r}"
                        copies = gerar_copies(client, model_id, temperature, prompt)
                        st.session_state["resultados_rapido"] = copies
                        save_session_history({"product_name": nome_r, "link": link_usar, "price": preco_r, "copies": copies})
                    except json.JSONDecodeError:
                        st.error("Erro de JSON. Diminua a criatividade ou troque o modelo.")
                    except Exception as e:
                        st.error(f"Erro: {e}")

        if "resultados_rapido" in st.session_state:
            st.divider()
            exibir_resultados(st.session_state["resultados_rapido"])

    # =========================================================
    # TAB 2 — MODO MANUAL
    # =========================================================
    with tab_manual:
        initial_data = st.session_state.get("carregado", {})

        col1, col2 = st.columns([2, 1])

        with col1:
            with st.form("form_manual"):
                st.subheader("📝 Detalhes do Produto")
                c1, c2 = st.columns(2)
                with c1:
                    product_name = st.text_input("Nome do Produto", value=initial_data.get("product_name", ""))
                    price = st.text_input("Preço (ex: R$ 99,90)", value=initial_data.get("price", ""))
                with c2:
                    affiliate_link = st.text_input("Link de Afiliado", value=initial_data.get("link", ""))
                    discount = st.text_input("Desconto (ex: 40% OFF)", value=initial_data.get("discount", ""))

                features = st.text_area(
                    "Benefícios (um por linha)",
                    value="\n".join(initial_data.get("features", [])),
                    height=150,
                    placeholder="- Entrega rápida\n- Garantia de 1 ano\n- Melhor preço",
                )

                platform_detect = detect_platform(affiliate_link)
                opts = ["Auto-detectar", "Amazon", "Shopee", "Genérico"]
                platform_select = st.selectbox(
                    "Plataforma",
                    opts,
                    index=opts.index(platform_detect) if platform_detect in opts else 0,
                )

                custom_instructions = st.text_area(
                    "Instruções Extras (Opcional)",
                    placeholder="Ex: Use mais emojis de fogo, foque em público jovem...",
                    height=80,
                )

                submitted = st.form_submit_button("🚀 Gerar Mensagens", use_container_width=True)

        with col2:
            st.info("💡 **Dica Pro:**\nSeja específico. Em vez de 'bom', diga 'bateria dura 24h'. Isso melhora muito a copy gerada!")
            if st.button("🎲 Exemplo: Fone Bluetooth", use_container_width=True):
                st.session_state["carregado"] = {
                    "product_name": "Fone Bluetooth TWS Pro",
                    "price": "R$ 89,90",
                    "discount": "50% OFF",
                    "link": "https://amzn.to/exemplo",
                    "features": ["Cancelamento de ruído ativo", "Bateria 24h", "Resistente à água IPX5"],
                }
                st.rerun()

        if submitted:
            if not product_name or not affiliate_link:
                st.error("Preencha o Nome do Produto e o Link de Afiliado.")
            else:
                with st.spinner("🤖 Gerando mensagens..."):
                    try:
                        features_list = [f.strip() for f in features.split("\n") if f.strip()]
                        final_platform = platform_select if platform_select != "Auto-detectar" else platform_detect
                        prompt = PROMPT_COMPLETO.format(
                            num_copies=num_copies,
                            product_name=product_name,
                            price=price or "não informado",
                            discount=discount or "não informado",
                            features=", ".join(features_list) or "não informados",
                            platform=final_platform,
                            link=affiliate_link,
                        )
                        if custom_instructions:
                            prompt += f"\nInstrução extra: {custom_instructions}"
                        copies = gerar_copies(client, model_id, temperature, prompt)
                        save_session_history({"product_name": product_name, "price": price, "link": affiliate_link, "features": features_list, "copies": copies})
                        if "carregado" in st.session_state:
                            del st.session_state["carregado"]
                        st.session_state["resultados_manual"] = copies
                        st.rerun()
                    except json.JSONDecodeError:
                        st.error("Erro de JSON. Diminua a criatividade ou troque o modelo.")
                    except Exception as e:
                        st.error(f"Erro: {e}")

        if "resultados_manual" in st.session_state:
            st.divider()
            exibir_resultados(st.session_state["resultados_manual"])

    # =========================================================
    # TAB 3 — HISTÓRICO
    # =========================================================
    with tab_historico:
        history_data = st.session_state.get("history", [])

        if not history_data:
            st.info("Nenhuma geração no histórico desta sessão.")
        else:
            st.markdown(f"**{len(history_data)} geração(ões) nesta sessão**")
            st.divider()
            for item in history_data:
                label = item.get("product_name", item.get("link", "Sem nome"))
                ts = item.get("timestamp", "")
                with st.expander(f"📦 {label[:55]} — {ts}"):
                    if item.get("link"):
                        st.markdown(f"**Link:** `{item['link']}`")
                    if item.get("price"):
                        st.markdown(f"**Preço:** {item['price']}")
                    for copy in item.get("copies", []):
                        st.markdown(f"*{copy.get('style', 'Geral')}*")
                        st.code(copy.get("text", ""), language=None)
                    if st.button("♻️ Reutilizar no Modo Manual", key=f"reuse_{ts}"):
                        st.session_state["carregado"] = item
                        st.rerun()


if __name__ == "__main__":
    main()
