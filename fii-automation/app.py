"""
Dashboard Streamlit — Agente de FIIs
Execute: streamlit run app.py
"""

import os
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import requests
import streamlit as st
from dotenv import load_dotenv

from agents import crew
from database import (
    init_db,
    load_portfolio,
    load_recommendations,
    save_portfolio,
    save_recommendation,
)
from optimizer import format_optimization_report, optimize_portfolio

load_dotenv()
init_db()

# ---------------------------------------------------------------------------
# Configuração da página
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="Agente de FIIs",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------------------------
# Sidebar — carteira e perfil
# ---------------------------------------------------------------------------
st.sidebar.title("🏢 Agente de FIIs")
st.sidebar.markdown("---")

st.sidebar.subheader("Sua Carteira")
carteira_raw = st.sidebar.text_area(
    "Formato: TICKER:%, um por linha",
    value="\n".join(f"{k}:{v}" for k, v in load_portfolio().items()) or "KNRI11:30\nMXRF11:20\nHGLG11:50",
    height=150,
)

if st.sidebar.button("💾 Salvar Carteira"):
    portfolio = {}
    for line in carteira_raw.strip().splitlines():
        line = line.strip()
        if ":" in line:
            parts = line.split(":", 1)
            ticker = parts[0].strip().upper()
            try:
                pct = float(parts[1].strip())
                portfolio[ticker] = pct
            except ValueError:
                st.sidebar.warning(f"Linha inválida: {line}")
    if portfolio:
        save_portfolio(portfolio)
        st.sidebar.success("Carteira salva!")

st.sidebar.markdown("---")
st.sidebar.subheader("Perfil do Investidor")
perfil = st.sidebar.selectbox(
    "Perfil",
    ["Conservador", "Moderado", "Arrojado"],
    index=1,
)
objetivo = st.sidebar.selectbox(
    "Objetivo",
    ["Renda mensal alta", "Crescimento do patrimônio", "Equilíbrio risco/retorno"],
    index=0,
)

# ---------------------------------------------------------------------------
# Tabs principais
# ---------------------------------------------------------------------------
tab_dashboard, tab_agent, tab_optimizer, tab_history, tab_config = st.tabs([
    "📊 Dashboard",
    "🤖 Agente IA",
    "⚙️ Otimizador",
    "📋 Histórico",
    "🔧 Configuração",
])

# ---------------------------------------------------------------------------
# Tab: Dashboard
# ---------------------------------------------------------------------------
with tab_dashboard:
    st.header("Visão Geral da Carteira")

    portfolio = load_portfolio()
    if not portfolio:
        st.info("Nenhuma carteira cadastrada. Use a barra lateral para adicionar seus FIIs.")
    else:
        col1, col2, col3 = st.columns(3)
        total_pct = sum(portfolio.values())
        col1.metric("Total de FIIs", len(portfolio))
        col2.metric("Alocação Total", f"{total_pct:.1f}%")
        col3.metric("Concentração Máxima", f"{max(portfolio.values()):.1f}%")

        df_portfolio = pd.DataFrame(
            list(portfolio.items()), columns=["Ticker", "Alocação (%)"]
        ).sort_values("Alocação (%)", ascending=False)

        col_chart, col_table = st.columns([3, 2])
        with col_chart:
            fig = px.pie(
                df_portfolio,
                names="Ticker",
                values="Alocação (%)",
                title="Composição da Carteira",
                hole=0.4,
            )
            fig.update_traces(textposition="inside", textinfo="percent+label")
            st.plotly_chart(fig, use_container_width=True)

        with col_table:
            st.subheader("Tabela de Alocação")
            st.dataframe(df_portfolio, hide_index=True, use_container_width=True)

    # Cotações em tempo real (se BRAPI_API_KEY configurada)
    st.markdown("---")
    st.subheader("Cotações em Tempo Real")
    brapi_key = os.getenv("BRAPI_API_KEY", "")

    if portfolio and brapi_key:
        tickers_str = ",".join(portfolio.keys())
        try:
            resp = requests.get(
                f"https://brapi.dev/api/quote/{tickers_str}",
                params={"token": brapi_key},
                timeout=15,
            )
            resp.raise_for_status()
            results = resp.json().get("results", [])
            if results:
                df_quotes = pd.DataFrame([{
                    "Ticker":  r.get("symbol"),
                    "Preço":   r.get("regularMarketPrice"),
                    "Var. %":  r.get("regularMarketChangePercent"),
                    "Volume":  r.get("regularMarketVolume"),
                    "DY 12m":  r.get("dividendYield"),
                    "P/VP":    r.get("priceToBook"),
                } for r in results])

                def color_var(val):
                    if val is None:
                        return ""
                    color = "green" if val >= 0 else "red"
                    return f"color: {color}"

                st.dataframe(
                    df_quotes.style.applymap(color_var, subset=["Var. %"]),
                    hide_index=True,
                    use_container_width=True,
                )
        except Exception as exc:
            st.warning(f"Não foi possível carregar cotações: {exc}")
    elif portfolio and not brapi_key:
        st.info("Configure BRAPI_API_KEY no .env para ver cotações em tempo real.")

# ---------------------------------------------------------------------------
# Tab: Agente IA
# ---------------------------------------------------------------------------
with tab_agent:
    st.header("🤖 Recomendação por Agente de IA")
    st.markdown(
        "O agente usa **CrewAI** com 3 sub-agentes especializados: "
        "busca de dados (brapi.dev), análise de carteira e geração de recomendações."
    )

    carteira_para_agente = load_portfolio()
    if carteira_para_agente:
        carteira_str = ", ".join(f"{t}: {p}%" for t, p in carteira_para_agente.items())
    else:
        carteira_str = "Nenhuma"

    col_info1, col_info2, col_info3 = st.columns(3)
    col_info1.info(f"**Carteira:** {carteira_str}")
    col_info2.info(f"**Perfil:** {perfil}")
    col_info3.info(f"**Objetivo:** {objetivo}")

    if st.button("🚀 Gerar Recomendação", type="primary"):
        with st.spinner("Agentes trabalhando... isso pode levar 1-2 minutos."):
            try:
                result = crew.kickoff(inputs={
                    "carteira_atual": carteira_str,
                    "perfil": perfil,
                    "objetivo": objetivo,
                })
                report = str(result)
                save_recommendation(report)
                st.success("Recomendação gerada!")
                st.markdown("---")
                st.markdown(report)
            except Exception as exc:
                st.error(f"Erro ao executar o agente: {exc}")

# ---------------------------------------------------------------------------
# Tab: Otimizador
# ---------------------------------------------------------------------------
with tab_optimizer:
    st.header("⚙️ Otimizador de Portfólio (PuLP)")
    st.markdown(
        "Usa **programação linear** para encontrar a alocação que maximiza o "
        "dividend yield total, respeitando limites por ativo e por segmento."
    )

    col_opt1, col_opt2 = st.columns(2)
    max_fii = col_opt1.slider("Máximo por FII (%)", 5, 40, 20) / 100
    max_seg = col_opt2.slider("Máximo por Segmento (%)", 20, 80, 40) / 100

    st.markdown("**Insira os FIIs com DY e Segmento:**")
    fiis_input = st.text_area(
        "Formato: TICKER,DY%,Segmento — um por linha",
        value="KNRI11,8.5,Logística\nMXRF11,10.2,Papel\nHGLG11,7.8,Logística\nKNCR11,9.0,Papel\nVISC11,7.2,Shopping",
        height=150,
    )

    if st.button("Otimizar Carteira"):
        fiis_list = []
        for line in fiis_input.strip().splitlines():
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 2:
                fiis_list.append({
                    "ticker": parts[0].upper(),
                    "dy": float(parts[1]) if len(parts) > 1 else 0,
                    "setor": parts[2] if len(parts) > 2 else "outros",
                    "volume": 1_000_000,
                })

        if fiis_list:
            allocation = optimize_portfolio(fiis_list, max_per_fii=max_fii, max_per_segment=max_seg)
            if allocation:
                st.success("Otimização concluída!")
                st.code(format_optimization_report(allocation))

                df_opt = pd.DataFrame(
                    list(allocation.items()), columns=["Ticker", "Alocação (%)"]
                ).sort_values("Alocação (%)", ascending=False)
                fig_opt = px.bar(
                    df_opt,
                    x="Ticker",
                    y="Alocação (%)",
                    title="Alocação Ótima",
                    color="Alocação (%)",
                    color_continuous_scale="Teal",
                )
                st.plotly_chart(fig_opt, use_container_width=True)
            else:
                st.warning("Não foi possível encontrar uma solução ótima. Revise os parâmetros.")
        else:
            st.warning("Adicione ao menos um FII no campo acima.")

# ---------------------------------------------------------------------------
# Tab: Histórico
# ---------------------------------------------------------------------------
with tab_history:
    st.header("📋 Histórico de Recomendações")

    df_hist = load_recommendations(limit=20)
    if df_hist.empty:
        st.info("Nenhuma recomendação registrada ainda. Execute o agente na aba 'Agente IA'.")
    else:
        for _, row in df_hist.iterrows():
            with st.expander(f"📄 {row['date'][:19].replace('T', ' ')}"):
                st.markdown(row["recommendation"])

# ---------------------------------------------------------------------------
# Tab: Configuração
# ---------------------------------------------------------------------------
with tab_config:
    st.header("🔧 Configuração do Sistema")

    st.subheader("Variáveis de Ambiente")
    st.markdown(
        "Crie um arquivo `.env` na pasta `fii-automation/` com as variáveis abaixo. "
        "Use `.env.example` como base."
    )

    config_status = {
        "BRAPI_API_KEY": bool(os.getenv("BRAPI_API_KEY")),
        "OPENAI_API_KEY": bool(os.getenv("OPENAI_API_KEY")),
        "TELEGRAM_BOT_TOKEN": bool(os.getenv("TELEGRAM_BOT_TOKEN")),
        "TELEGRAM_CHAT_ID": bool(os.getenv("TELEGRAM_CHAT_ID")),
    }

    for var, ok in config_status.items():
        icon = "✅" if ok else "❌"
        st.markdown(f"{icon} `{var}`")

    st.markdown("---")
    st.subheader("Como Rodar em Produção")
    st.code(
        """# 1. Instale as dependências
pip install -r requirements.txt

# 2. Configure o .env (copie o .env.example e preencha)
cp .env.example .env

# 3. Dashboard (acesso local em http://localhost:8501)
streamlit run app.py

# 4. Agendador diário (rode em segundo plano)
python scheduler.py

# No Linux com systemd ou screen:
# screen -S fii-scheduler
# python scheduler.py
""",
        language="bash",
    )
