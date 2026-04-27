"""
Envio de relatórios via Telegram Bot.

Configure TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID no .env.
Crie seu bot em: https://t.me/BotFather
Obtenha seu chat_id: https://t.me/userinfobot
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
_BASE_URL = f"https://api.telegram.org/bot{_TOKEN}"


def _is_configured() -> bool:
    return bool(_TOKEN and _CHAT_ID)


def send_message(text: str, parse_mode: str = "Markdown") -> bool:
    """Envia texto para o chat configurado. Retorna True se bem-sucedido."""
    if not _is_configured():
        print("[Telegram] Bot não configurado. Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID no .env")
        return False

    # Telegram limita mensagens a 4096 caracteres
    chunks = [text[i:i+4096] for i in range(0, len(text), 4096)]
    ok = True
    for chunk in chunks:
        try:
            resp = requests.post(
                f"{_BASE_URL}/sendMessage",
                json={"chat_id": _CHAT_ID, "text": chunk, "parse_mode": parse_mode},
                timeout=15,
            )
            resp.raise_for_status()
        except requests.RequestException as exc:
            print(f"[Telegram] Erro ao enviar mensagem: {exc}")
            ok = False
    return ok


def send_daily_report(report_text: str):
    header = "🤖 *Relatório Diário de FIIs*\n" + "─" * 30 + "\n"
    send_message(header + report_text)


def send_error_alert(error_msg: str):
    send_message(f"⚠️ *Erro no Agente de FIIs*\n\n`{error_msg}`")


if __name__ == "__main__":
    send_daily_report("Teste de notificação — sistema funcionando! ✅")
