import sqlite3
import pandas as pd
from datetime import datetime

DB_PATH = "fiis.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS carteira (
            ticker      TEXT PRIMARY KEY,
            percent     REAL NOT NULL,
            last_update TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            date           TEXT NOT NULL,
            recommendation TEXT NOT NULL,
            performance    TEXT DEFAULT ''
        )
    """)
    conn.commit()
    conn.close()


def save_portfolio(portfolio_dict: dict):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM carteira")
    now = datetime.now().isoformat()
    for ticker, percent in portfolio_dict.items():
        conn.execute(
            "INSERT INTO carteira (ticker, percent, last_update) VALUES (?, ?, ?)",
            (ticker.upper(), float(percent), now),
        )
    conn.commit()
    conn.close()


def load_portfolio() -> dict:
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql("SELECT ticker, percent FROM carteira", conn)
    conn.close()
    if df.empty:
        return {}
    return dict(zip(df["ticker"], df["percent"]))


def save_recommendation(text: str):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO recommendations (date, recommendation) VALUES (?, ?)",
        (datetime.now().isoformat(), text),
    )
    conn.commit()
    conn.close()


def load_recommendations(limit: int = 30) -> pd.DataFrame:
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql(
        f"SELECT date, recommendation FROM recommendations ORDER BY id DESC LIMIT {limit}",
        conn,
    )
    conn.close()
    return df


if __name__ == "__main__":
    init_db()
    save_portfolio({"KNRI11": 30.0, "MXRF11": 20.0, "HGLG11": 50.0})
    print("Carteira salva:", load_portfolio())
