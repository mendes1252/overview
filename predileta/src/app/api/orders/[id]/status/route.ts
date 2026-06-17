import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcProductionStatus } from "@/lib/utils";
import { sendWhatsAppMessage, WHATSAPP_TEMPLATES } from "@/lib/whatsapp";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["received", "washing", "drying", "ironing", "ready", "delivered", "cancelled"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = statusSchema.parse(body);

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { customer: { select: { name: true, phone: true } } },
    });
    if (!existing) return NextResponse.json({ error: "OS não encontrada" }, { status: 404 });

    const productionStatus = calcProductionStatus(existing.estimatedDelivery, status);
    const actualDelivery = status === "delivered" ? new Date() : existing.actualDelivery;

    const updated = await prisma.order.update({
      where: { id },
      data: { status, productionStatus, actualDelivery },
    });

    // WhatsApp notifications for key statuses
    if (existing.customer.phone) {
      if (status === "ready") {
        await sendWhatsAppMessage(
          existing.customer.phone,
          WHATSAPP_TEMPLATES.orderReady(existing.orderNumber, existing.customer.name)
        );
      } else if (status === "delivered") {
        await sendWhatsAppMessage(
          existing.customer.phone,
          WHATSAPP_TEMPLATES.orderDelivered(existing.orderNumber, existing.customer.name)
        );
      }
    }

    return NextResponse.json({
      ...updated,
      subtotal: Number(updated.subtotal),
      discount: Number(updated.discount),
      total: Number(updated.total),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[orders/status/PATCH]", err);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}
