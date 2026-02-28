import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNotificationAndPush } from "@/lib/push";

// POST — send a test push notification
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const result = await createNotificationAndPush(session.user.id, {
      type: "system",
      title: "Pulse — Teste de Notificação",
      body: "As notificações push estão funcionando! Você receberá alertas de tarefas, hábitos e metas.",
      url: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      notification: result.notification,
      push: result.pushResult,
    });
  } catch (error) {
    console.error("Error sending test push:", error);
    return NextResponse.json({ error: "Erro ao enviar notificação de teste" }, { status: 500 });
  }
}
