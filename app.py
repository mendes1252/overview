import streamlit as st
import ollama
import json
import os
import datetime
import urllib.parse
import time

# --- CONFIGURAÇÃO DA PÁGINA ---
st.set_page_config(
    page_title="Gerador de Legendas WhatsApp - Afiliado",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- CSS PERSONALIZADO ---
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #FF9900; /* Amazon Orange-ish */
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #888;
        text-align: center;
        margin-bottom: 2rem;
    }
    .card-container {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #ddd;
        margin-bottom: 1rem;
    }
    .stButton>button {
        width: 100%;
        border-radius: 8px;
        font-weight: bold;
    }
    /* Dark mode adjustments handled automatically by Streamlit, but we can tweak specific elements */
    [data-theme="dark"] .card-container {
        background-color: #262730;
        border-color: #444;
    }
</style>
""", unsafe_allow_html=True)

# --- FUNÇÕES AUXILIARES ---

def get_ollama_models():
    """Retorna lista de modelos disponíveis no Ollama local."""
    try:
        models = ollama.list()
        # Ollama library returns a ModelsResponse object, need to extract names
        return [m.model for m in models.models]
    except Exception as e:
        return []

def check_ollama_connection():
    """Verifica se o Ollama está rodando."""
    try:
        ollama.chat(model='llama3', messages=[{'role': 'user', 'content': 'ping'}])
        return True
    except:
        return False

def save_to_history(data):
    """Salva a geração no arquivo JSON local."""
    history_file = "history.json"
    history = []
    if os.path.exists(history_file):
        try:
            with open(history_file, "r", encoding="utf-8") as f:
                history = json.load(f)
        except:
            history = []
    
    # Adiciona timestamp e salva no início da lista
    data['timestamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    history.insert(0, data)
    
    # Mantém apenas os últimos 50 registros para não pesar
    if len(history) > 50:
        history = history[:50]
        
    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_history():
    """Carrega o histórico."""
    history_file = "history.json"
    if os.path.exists(history_file):
        try:
            with open(history_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return []
    return []

def generate_whatsapp_link(text):
    """Gera link wa.me com texto codificado."""
    encoded_text = urllib.parse.quote(text)
    return f"https://wa.me/?text={encoded_text}"

def detect_platform(link):
    """Detecta se é Amazon ou Shopee baseado na URL."""
    link_lower = link.lower()
    if "amazon" in link_lower:
        return "Amazon"
    elif "shopee" in link_lower:
        return "Shopee"
    else:
        return "Outros"

# --- SYSTEM PROMPT OTIMIZADO ---
SYSTEM_PROMPT = """
Você é um Copywriter Brasileiro especialista em vendas diretas no WhatsApp para afiliados (Amazon e Shopee).
Sua tarefa é criar legendas de alta conversão.

REGRAS DE OURO:
1. Use emojis estratégicos (🔥, 🚨, 💰, ✅, 🛒) mas sem exagero.
2. O tom deve ser urgente, entusiasta e confiável.
3. Destaque o PREÇO e o DESCONTO de forma visual.
4. Use gatilhos mentais: Escassez ("Poucas unidades"), Urgência ("Só hoje"), Prova Social ("Todo mundo quer").
5. A legenda deve ter no máximo 6 linhas (quebras de linha).
6. SEMPRE termine com o Link de Afiliado fornecido.
7. Não use markdown (negrito/itálico) no output JSON, use apenas texto puro.

FORMATO DE SAÍDA OBRIGATÓRIO:
Você deve retornar APENAS um JSON válido contendo uma lista de 5 objetos. Cada objeto representa uma variação de legenda.
Estrutura do JSON:
[
  {
    "style": "Urgência",
    "text": "Texto da legenda aqui..."
  },
  ...
]

Dados do Produto:
- Nome: {product_name}
- Preço: {price}
- Desconto: {discount}
- Características: {features}
- Link: {link}
- Plataforma: {platform}
"""

# --- INTERFACE PRINCIPAL ---

def main():
    # Header
    st.markdown('<h1 class="main-header">🛒 Gerador de Legendas WhatsApp - Afiliado</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Crie legendas irresistíveis com IA local em segundos. Sem custos, 100% privacidade.</p>', unsafe_allow_html=True)

    # Sidebar
    with st.sidebar:
        st.header("⚙️ Configurações")
        
        # Verificação de Conexão
        is_connected = check_ollama_connection()
        if not is_connected:
            st.error("❌ Ollama não detectado! Certifique-se de que o Ollama está rodando (`ollama serve`).")
            st.stop()
        else:
            st.success("✅ Ollama Conectado")

        # Seleção de Modelo
        available_models = get_ollama_models()
        default_model = "llama3" if "llama3" in available_models else (available_models[0] if available_models else "")
        
        selected_model = st.selectbox(
            "Modelo LLM",
            available_models,
            index=available_models.index(default_model) if default_model in available_models else 0,
            help="Modelos menores (7b/8b) são mais rápidos. Modelos maiores (14b+) são mais criativos."
        )

        temperature = st.slider("Criatividade (Temperatura)", 0.5, 1.2, 0.8, 0.1)
        num_copies = st.selectbox("Quantidade de Opções", [3, 5, 7], index=1)
        
        custom_instructions = st.text_area(
            "Instruções Extras (Opcional)",
            placeholder="Ex: Use mais emojis de fogo, foque em público jovem...",
            height=100
        )

        st.divider()
        
        # Aba de Histórico na Sidebar
        st.subheader("📜 Histórico Recente")
        history_data = load_history()
        
        if history_data:
            for item in history_data[:5]: # Mostra apenas os 5 últimos
                if st.button(f"🔄 {item['product_name'][:20]}...", key=f"hist_{item['timestamp']}"):
                    # Carrega dados no session state para reutilizar
                    st.session_state['loaded_product'] = item
                    st.rerun()
        else:
            st.info("Nenhum histórico salvo.")

    # --- ÁREA PRINCIPAL ---

    # Carregar dados do histórico se clicado
    initial_data = st.session_state.get('loaded_product', {})
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        with st.form("generator_form"):
            st.subheader("📝 Detalhes do Produto")
            
            c1, c2 = st.columns(2)
            with c1:
                product_name = st.text_input("Nome do Produto", value=initial_data.get('product_name', ""))
                price = st.text_input("Preço Atual (ex: R$ 99,90)", value=initial_data.get('price', ""))
            with c2:
                affiliate_link = st.text_input("Link de Afiliado", value=initial_data.get('link', ""))
                discount = st.text_input("Desconto (ex: 40% OFF)", value=initial_data.get('discount', ""))
            
            features = st.text_area(
                "Principais Benefícios (um por linha)", 
                value="\n".join(initial_data.get('features', [])),
                height=150,
                placeholder="- Entrega rápida\n- Garantia de 1 ano\n- Melhor preço do mercado"
            )
            
            platform_detect = detect_platform(affiliate_link)
            platform_select = st.selectbox("Plataforma", ["Auto-detectar", "Amazon", "Shopee", "Genérico"], index=["Auto-detectar", "Amazon", "Shopee", "Genérico"].index(platform_detect) if platform_detect in ["Amazon", "Shopee"] else 0)
            
            submitted = st.form_submit_button("🚀 Gerar Legendas Mágicas", use_container_width=True)

    with col2:
        st.info("💡 **Dica Pro:**\nSeja específico nos benefícios. Em vez de 'bom', diga 'bateria dura 24h'. Isso ajuda a IA a vender melhor!")
        
        # Exemplo Rápido
        if st.button("🎲 Preencher com Exemplo (Fone Bluetooth)", use_container_width=True):
            st.session_state['loaded_product'] = {
                'product_name': 'Fone Bluetooth TWS Pro',
                'price': 'R$ 89,90',
                'discount': '50% OFF',
                'link': 'https://amzn.to/exemplo',
                'features': ['Cancelamento de ruído', 'Bateria 24h', 'Resistente à água']
            }
            st.rerun()

    # --- LÓGICA DE GERAÇÃO ---
    
    if submitted:
        if not product_name or not affiliate_link:
            st.error("Por favor, preencha pelo menos o Nome do Produto e o Link.")
        else:
            with st.spinner("🤖 A IA está escrevendo suas legendas de venda..."):
                try:
                    # Preparar lista de features
                    features_list = [f.strip() for f in features.split('\n') if f.strip()]
                    final_platform = platform_select if platform_select != "Auto-detectar" else platform_detect
                    
                    # Montar Prompt Final
                    full_prompt = SYSTEM_PROMPT.format(
                        product_name=product_name,
                        price=price,
                        discount=discount,
                        features=", ".join(features_list),
                        link=affiliate_link,
                        platform=final_platform
                    )
                    
                    if custom_instructions:
                        full_prompt += f"\nInstrução extra do usuário: {custom_instructions}"

                    # Chamada ao Ollama
                    # Pedimos formato JSON estrito
                    response = ollama.chat(
                        model=selected_model,
                        messages=[
                            {'role': 'system', 'content': "You are a JSON generator. Output ONLY valid JSON array."},
                            {'role': 'user', 'content': full_prompt}
                        ],
                        options={'temperature': temperature}
                    )
                    
                    content = response['message']['content']
                    
                    # Limpeza básica caso o modelo adicione markdown ```json ... ```
                    content = content.replace("```json", "").replace("```", "").strip()
                    
                    generated_copies = json.loads(content)
                    
                    # Salvar no histórico
                    save_data = {
                        'product_name': product_name,
                        'price': price,
                        'link': affiliate_link,
                        'features': features_list,
                        'copies': generated_copies
                    }
                    save_to_history(save_data)
                    
                    # Limpar session state de load
                    if 'loaded_product' in st.session_state:
                        del st.session_state['loaded_product']
                        
                    st.session_state['last_results'] = generated_copies
                    st.rerun()

                except json.JSONDecodeError:
                    st.error("Erro ao interpretar a resposta da IA. Tente diminuir a temperatura ou trocar o modelo.")
                    st.write("Resposta bruta:", content)
                except Exception as e:
                    st.error(f"Erro na conexão com Ollama: {e}")

    # --- EXIBIÇÃO DE RESULTADOS ---
    
    if 'last_results' in st.session_state:
        st.divider()
        st.subheader("✨ Suas Legendas Prontas")
        
        results = st.session_state['last_results']
        
        for i, item in enumerate(results):
            with st.container():
                # Card visual
                c1, c2 = st.columns([4, 1])
                
                with c1:
                    st.markdown(f"**Opção {i+1}: {item.get('style', 'Geral')}**")
                    # Usamos st.code para facilitar a cópia nativa do Streamlit
                    st.code(item['text'], language=None)
                
                with c2:
                    st.markdown("### Ações")
                    # Botão Copiar (Streamlit copy button é nativo no st.code, mas podemos fazer um botão de WhatsApp)
                    wa_link = generate_whatsapp_link(item['text'])
                    st.link_button("📤 Abrir no WhatsApp", wa_link, use_container_width=True)
                    
                    if st.button(f"📋 Copiar Texto #{i+1}", key=f"copy_{i}", use_container_width=True):
                        st.toast(f"Legenda {i+1} copiada! (Use Ctrl+V no WhatsApp)")
                        # Nota: Streamlit não permite copiar para clipboard via JS puro facilmente sem extensions, 
                        # o st.code acima já tem o botão de copiar nativo no canto superior direito.
                
                st.markdown("---")

if __name__ == "__main__":
    main()
