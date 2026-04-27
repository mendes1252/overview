"""
Otimização de portfólio de FIIs usando programação linear (PuLP).

Objetivo: maximizar o dividend yield esperado sujeito a restrições de
diversificação (máximo por ativo e por segmento) e liquidez mínima.
"""

from pulp import (
    LpProblem,
    LpVariable,
    LpMaximize,
    lpSum,
    value,
    PULP_CBC_CMD,
    LpStatus,
)


def optimize_portfolio(
    fiis: list[dict],
    max_per_fii: float = 0.20,
    max_per_segment: float = 0.40,
    min_yield: float = 0.0,
) -> dict:
    """
    Retorna alocação ótima em % para cada FII.

    Args:
        fiis: lista de dicts com chaves 'ticker', 'dy' (%), 'setor', 'volume'
        max_per_fii: limite máximo por ativo (ex: 0.20 = 20%)
        max_per_segment: limite máximo por segmento (ex: 0.40 = 40%)
        min_yield: yield mínimo para o ativo entrar na otimização

    Returns:
        dict {ticker: percentual_alocado} apenas para alocações > 1%
    """
    # Filtra ativos com DY mínimo e volume positivo
    eligible = [
        f for f in fiis
        if float(f.get("dy") or 0) >= min_yield
        and float(f.get("volume") or 0) > 0
    ]

    if not eligible:
        return {}

    tickers = [f["ticker"] for f in eligible]
    dy = {f["ticker"]: float(f.get("dy") or 0) for f in eligible}
    segment = {f["ticker"]: str(f.get("setor") or "outros").lower() for f in eligible}
    segments = list(set(segment.values()))

    prob = LpProblem("FII_Portfolio_Optimization", LpMaximize)

    # Variáveis: fração alocada em cada FII [0, max_per_fii]
    x = {t: LpVariable(f"x_{t}", lowBound=0, upBound=max_per_fii) for t in tickers}

    # Objetivo: maximizar yield ponderado
    prob += lpSum(dy[t] * x[t] for t in tickers)

    # Restrição: soma total = 100%
    prob += lpSum(x[t] for t in tickers) == 1.0

    # Restrição: máximo por segmento
    for seg in segments:
        tickers_in_seg = [t for t in tickers if segment[t] == seg]
        if tickers_in_seg:
            prob += lpSum(x[t] for t in tickers_in_seg) <= max_per_segment

    # Resolve silenciosamente
    prob.solve(PULP_CBC_CMD(msg=0))

    if LpStatus[prob.status] != "Optimal":
        return {}

    return {
        t: round(value(x[t]) * 100, 1)
        for t in tickers
        if value(x[t]) is not None and value(x[t]) > 0.01
    }


def format_optimization_report(allocation: dict) -> str:
    if not allocation:
        return "Não foi possível calcular uma alocação ótima com os dados disponíveis."

    lines = ["**Alocação Ótima Calculada (PuLP)**", ""]
    lines.append(f"{'Ticker':<10} {'Alocação %':>12}")
    lines.append("-" * 24)
    for ticker, pct in sorted(allocation.items(), key=lambda x: -x[1]):
        lines.append(f"{ticker:<10} {pct:>11.1f}%")
    lines.append("-" * 24)
    lines.append(f"{'Total':<10} {sum(allocation.values()):>11.1f}%")
    return "\n".join(lines)


if __name__ == "__main__":
    sample = [
        {"ticker": "KNRI11", "dy": 8.5, "setor": "Logística", "volume": 5_000_000},
        {"ticker": "MXRF11", "dy": 10.2, "setor": "Papel",    "volume": 8_000_000},
        {"ticker": "HGLG11", "dy": 7.8, "setor": "Logística", "volume": 3_000_000},
        {"ticker": "KNCR11", "dy": 9.0, "setor": "Papel",    "volume": 4_000_000},
        {"ticker": "VISC11", "dy": 7.2, "setor": "Shopping",  "volume": 2_000_000},
    ]
    result = optimize_portfolio(sample)
    print(format_optimization_report(result))
