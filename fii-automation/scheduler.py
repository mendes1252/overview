"""
Agendador diário do agente de FIIs.

Executa todo dia às 8h: busca dados → analisa → envia relatório no Telegram.
Rode em segundo plano: python scheduler.py
No Linux você pode usar systemd ou screen/tmux para mantê-lo ativo.
"""

import logging
import time

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from agents import crew
from database import init_db, load_portfolio, save_recommendation
from telegram_bot import send_daily_report, send_error_alert

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


def daily_job():
    log.info("Iniciando job diário de FIIs...")
    try:
        portfolio = load_portfolio()
        if not portfolio:
            portfolio_str = "Nenhuma (carteira vazia — use o dashboard para cadastrar)"
            perfil = "Moderado"
            objetivo = "Renda mensal alta"
        else:
            portfolio_str = ", ".join(f"{t}: {p}%" for t, p in portfolio.items())
            perfil = "Moderado"
            objetivo = "Renda mensal alta"

        result = crew.kickoff(inputs={
            "carteira_atual": portfolio_str,
            "perfil": perfil,
            "objetivo": objetivo,
        })

        report_text = str(result)
        save_recommendation(report_text)
        send_daily_report(report_text)
        log.info("Job concluído com sucesso.")
    except Exception as exc:
        log.exception("Erro no job diário.")
        send_error_alert(str(exc))


if __name__ == "__main__":
    init_db()
    scheduler = BlockingScheduler(timezone="America/Sao_Paulo")
    scheduler.add_job(
        daily_job,
        trigger=CronTrigger(hour=8, minute=0),
        id="fii_daily",
        name="Relatório Diário de FIIs",
        replace_existing=True,
    )
    log.info("Scheduler iniciado — próxima execução todo dia às 08:00 (Brasília).")
    log.info("Pressione Ctrl+C para encerrar.")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        log.info("Scheduler encerrado.")
