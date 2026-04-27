import os
import pandas as pd
import requests
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task
from crewai.tools import tool
from langchain_openai import ChatOpenAI

load_dotenv()

# ---------------------------------------------------------------------------
# LLM
# ---------------------------------------------------------------------------
_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
_base_url = os.getenv("OPENAI_BASE_URL")  # set to xAI endpoint for Grok

llm_kwargs = dict(model=_model, temperature=0.2)
if _base_url:
    llm_kwargs["base_url"] = _base_url
    llm_kwargs["api_key"] = os.getenv("GROK_API_KEY") or os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(**llm_kwargs)

# ---------------------------------------------------------------------------
# FIIs monitorados (expanda conforme necessário)
# ---------------------------------------------------------------------------
TICKERS = (
    "KNRI11,HGLG11,MXRF11,KNCR11,VISC11,CPTS11,XPLG11,ALZR11,"
    "TRBL11,RECR11,IRDM11,BCFF11,BTLG11,JSRE11,RBRR11,HSML11"
)

# ---------------------------------------------------------------------------
# Tool: busca dados reais via brapi.dev REST API
# ---------------------------------------------------------------------------
@tool("Buscar dados de FIIs")
def fetch_fiis_data() -> str:
    """Busca cotações e indicadores fundamentalistas dos principais FIIs via brapi.dev."""
    token = os.getenv("BRAPI_API_KEY", "")
    url = f"https://brapi.dev/api/quote/{TICKERS}"
    params = {"token": token, "fundamental": "true", "dividends": "true"}

    try:
        resp = requests.get(url, params=params, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as exc:
        return f"Erro ao acessar brapi.dev: {exc}"

    results = resp.json().get("results", [])
    if not results:
        return "Nenhum dado retornado pela API."

    rows = []
    for r in results:
        rows.append({
            "ticker":    r.get("symbol", ""),
            "preco":     r.get("regularMarketPrice"),
            "dy_12m":    r.get("dividendYield"),
            "pvp":       r.get("priceToBook"),
            "volume":    r.get("regularMarketVolume"),
            "setor":     r.get("sector") or r.get("industry") or "N/D",
            "nome":      r.get("shortName", ""),
        })

    df = pd.DataFrame(rows)
    df["dy_12m"] = pd.to_numeric(df["dy_12m"], errors="coerce")
    df["pvp"] = pd.to_numeric(df["pvp"], errors="coerce")
    df = df.sort_values("dy_12m", ascending=False)
    return df.to_string(index=False)


# ---------------------------------------------------------------------------
# Agentes
# ---------------------------------------------------------------------------
data_agent = Agent(
    role="Analista Quantitativo de FIIs",
    goal=(
        "Buscar e estruturar os dados mais recentes de FIIs brasileiros, "
        "destacando yield, P/VP, segmento e liquidez."
    ),
    backstory=(
        "Especialista em análise quantitativa de fundos imobiliários com 10 anos de mercado. "
        "Retorna sempre dados limpos, ordenados e prontos para análise."
    ),
    tools=[fetch_fiis_data],
    llm=llm,
    verbose=True,
)

analysis_agent = Agent(
    role="Gestor de Carteira e Risco",
    goal=(
        "Analisar a carteira atual do investidor, identificar gaps de diversificação "
        "por segmento (tijolo, papel, híbrido, logística, shoppings) e nível de risco."
    ),
    backstory=(
        "Gestor conservador e certificado com foco em renda mensal sustentável via FIIs. "
        "Evita concentração acima de 20% em um único ativo ou segmento."
    ),
    llm=llm,
    verbose=True,
)

recommender_agent = Agent(
    role="Consultor de Investimentos em FIIs",
    goal=(
        "Recomendar de 3 a 6 FIIs com justificativa clara, percentual sugerido na carteira, "
        "DY esperado, risco e segmento. Apresentar alocação total sugerida por segmento."
    ),
    backstory=(
        "Consultor financeiro com histórico de recomendações assertivas. "
        "Sempre transparente, usa dados reais e considera o perfil do investidor."
    ),
    llm=llm,
    verbose=True,
)

# ---------------------------------------------------------------------------
# Tasks
# ---------------------------------------------------------------------------
task_data = Task(
    description=(
        "Use a ferramenta 'Buscar dados de FIIs' para obter os dados mais recentes. "
        "Retorne uma tabela resumida com os 15 melhores em dividend yield."
    ),
    expected_output=(
        "Tabela com colunas: ticker, preco, dy_12m, pvp, volume, setor, nome. "
        "Ordenada por dy_12m decrescente."
    ),
    agent=data_agent,
)

task_analysis = Task(
    description=(
        "Analise a carteira atual: {carteira_atual}\n"
        "Perfil do investidor: {perfil}\n"
        "Objetivo: {objetivo}\n\n"
        "Identifique: concentração por ativo, diversificação por segmento, "
        "yield médio ponderado atual e principais riscos."
    ),
    expected_output=(
        "Relatório de análise com: yield médio atual, segmentos presentes, "
        "gaps identificados, nível de risco e recomendações de ajuste."
    ),
    agent=analysis_agent,
)

task_recommendation = Task(
    description=(
        "Com base na análise da carteira e nos dados de FIIs disponíveis, "
        "recomende de 3 a 6 FIIs. Para cada um informe:\n"
        "- Ticker e nome\n"
        "- % sugerida na carteira\n"
        "- Justificativa (máx. 2 linhas)\n"
        "- DY esperado e P/VP\n"
        "- Segmento e nível de risco (Baixo/Médio/Alto)\n\n"
        "Ao final, mostre a alocação total sugerida por segmento."
    ),
    expected_output=(
        "Relatório final formatado em Markdown com tabela de recomendações "
        "e gráfico de alocação por segmento em texto."
    ),
    agent=recommender_agent,
)

# ---------------------------------------------------------------------------
# Crew
# ---------------------------------------------------------------------------
crew = Crew(
    agents=[data_agent, analysis_agent, recommender_agent],
    tasks=[task_data, task_analysis, task_recommendation],
    process=Process.sequential,
    verbose=True,
)


if __name__ == "__main__":
    result = crew.kickoff(inputs={
        "carteira_atual": "KNRI11: 30%, MXRF11: 20%, HGLG11: 50%",
        "perfil": "Moderado",
        "objetivo": "Renda mensal alta",
    })
    print(result)
