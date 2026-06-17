import type { Prisma } from "@prisma/client";

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: { include: { service: true } };
    payments: true;
    createdBy: { select: { name: true } };
  };
}>;

export type CustomerWithOrders = Prisma.CustomerGetPayload<{
  include: { orders: { include: { items: true } } };
}>;

export type KanbanOrder = {
  id: string;
  orderNumber: number;
  customer: { id: string; name: string; type: string };
  total: number;
  paymentStatus: string;
  productionStatus: string;
  estimatedDelivery?: string | null;
  itemSummary: string;
  notes?: string | null;
  createdAt: string;
};
