/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  const admin = await prisma.admin.findUnique({
    where: { email: "admin@telekvis.com" },
  });
  if (!admin) {
    console.log("Seeding admin...");
    await prisma.admin.create({
      data: {
        name: "Admin",
        email: "admin@telekvis.com",
        password: await bcrypt.hash("12345678", 10),
      },
    });
  } else {
    console.log("Admin already exists");
  }
};

const seedUser = async () => {
  const user = await prisma.user.findUnique({
    where: { email: "user@telekvis.com" },
  });
  if (!user) {
    console.log("Seeding user...");
    const create = await prisma.user.create({
      data: {
        name: "User",
        email: "user@telekvis.com",
        phone: "081234567890",
        password: await bcrypt.hash("12345678", 10),
      },
    });
    return create.id;
  } else {
    console.log("User already exists");
    return user.id;
  }
};

const seedEngineer = async () => {
  const engineer = await prisma.engineer.findFirst({
    where: { name: "Engineer" },
  });
  if (!engineer) {
    console.log("Seeding engineer...");
    const create = await prisma.engineer.create({
      data: {
        name: "Engineer",        
        field: "Sample Field",
      },
    });
    return create.id;
  } else {
    console.log("Engineer already exists");
    return engineer.id;
  }
};

const seedTransaction = async (userId, engineerId) => {
  await prisma.order.create({
    data: {
      userId: userId,
      engineerId: engineerId,
      location: "Sample Location",
      latitude: 0.0,
      longitude: 0.0,
      brand: "Sample Brand",
      desc: "Sample Description",
      picture:
        "https://res.cloudinary.com/telekvis/image/upload/v1694094036/telekvis/1.jpg",
      status: "Dipesan",
    },
  });
};

const main = async () => {
  await seedAdmin();
  const userId = await seedUser();
  const engineerId = await seedEngineer();
  await seedTransaction(userId, engineerId);
  process.exit(0);
};

main();

