import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@predileta.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@predileta.com",
      passwordHash: hash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "operador@predileta.com" },
    update: {},
    create: {
      name: "Operador",
      email: "operador@predileta.com",
      passwordHash: await bcrypt.hash("op123456", 12),
      role: "operator",
    },
  });

  const services = [
    { name: "Camisa social", category: "Roupas", priceB2c: 12.00, priceB2bDefault: 9.00, unit: "piece" as const, estimatedHours: 24 },
    { name: "Calça jeans", category: "Roupas", priceB2c: 18.00, priceB2bDefault: 14.00, unit: "piece" as const, estimatedHours: 24 },
    { name: "Terno (paletó + calça)", category: "Roupas", priceB2c: 55.00, priceB2bDefault: 42.00, unit: "piece" as const, estimatedHours: 48 },
    { name: "Vestido", category: "Roupas", priceB2c: 32.00, priceB2bDefault: 25.00, unit: "piece" as const, estimatedHours: 24 },
    { name: "Blazer", category: "Roupas", priceB2c: 28.00, priceB2bDefault: 22.00, unit: "piece" as const, estimatedHours: 24 },
    { name: "Edredom solteiro", category: "Cama/Mesa/Banho", priceB2c: 45.00, priceB2bDefault: 35.00, unit: "piece" as const, estimatedHours: 48 },
    { name: "Edredom casal", category: "Cama/Mesa/Banho", priceB2c: 65.00, priceB2bDefault: 50.00, unit: "piece" as const, estimatedHours: 48 },
    { name: "Toalha de banho", category: "Cama/Mesa/Banho", priceB2c: 12.00, priceB2bDefault: 9.00, unit: "piece" as const, estimatedHours: 24 },
    { name: "Travesseiro", category: "Cama/Mesa/Banho", priceB2c: 22.00, priceB2bDefault: 17.00, unit: "piece" as const, estimatedHours: 48 },
    { name: "Lavagem a peso", category: "Lavagem", priceB2c: 8.00, priceB2bDefault: 6.50, unit: "kg" as const, estimatedHours: 24 },
    { name: "Passadoria", category: "Passadoria", priceB2c: 7.00, priceB2bDefault: 5.50, unit: "piece" as const, estimatedHours: 12 },
    { name: "Higienização de sofá (por lugar)", category: "Estofados", priceB2c: 85.00, priceB2bDefault: 65.00, unit: "piece" as const, estimatedHours: 72 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-${s.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: { priceB2c: s.priceB2c, priceB2bDefault: s.priceB2bDefault },
      create: {
        id: `seed-${s.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: s.name,
        category: s.category,
        priceB2c: s.priceB2c,
        priceB2bDefault: s.priceB2bDefault,
        unit: s.unit,
        estimatedHours: s.estimatedHours,
      },
    });
  }

  console.log("✓ Seed completed!");
  console.log("  → admin@predileta.com / admin123");
  console.log("  → operador@predileta.com / op123456");
  console.log(`  → ${services.length} serviços criados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
