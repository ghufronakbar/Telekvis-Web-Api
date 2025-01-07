import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import { $Enums } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [
      totalOrders,
      pendingOrders,
      successOrders,
      rejectedOrders,
      totalUsers,
      totalMonthly,
      totalWeekly,
      pendingOrdersData,
      chartData,
    ] = await Promise.all([
      countTotalOrders(),
      countPendingOrders(),
      countSuccessOrders(),
      countRejectedOrders(),
      countTotalUsers(),
      getTotalIncomeMonthly(),
      getTotalSevenDays(),
      getPendingOrders(),
      getChartData(),
    ]);

    const response = {
      totalOrders,
      pendingOrders,
      successOrders,
      rejectedOrders,
      totalUsers,
      totalMonthly,
      totalWeekly,
      pendingOrdersData,
      chartData,
    };

    return res
      .status(200)
      .json({ status: 200, message: "Success", data: response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

const countRejectedOrders = async () => {
  return await prisma.order.count({
    where: {
      status: $Enums.OrderStatus.Ditolak,
    },
  });
};

const countTotalOrders = async () => {
  return await prisma.order.count();
};

const countTotalUsers = async () => {
  return await prisma.user.count();
};

const countPendingOrders = async () => {
  return await prisma.order.count({
    where: {
      status: $Enums.OrderStatus.Dipesan,
    },
  });
};

const countSuccessOrders = async () => {
  return await prisma.order.count({
    where: {
      status: $Enums.OrderStatus.Selesai,
    },
  });
};

const getPendingOrders = async () => {
  return await prisma.order.findMany({
    where: {
      status: $Enums.OrderStatus.Dipesan,
    },
    include: {
      user: true,
    },
  });
};

const getTotalIncomeMonthly = async () => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const orders = await prisma.order.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: lastMonth,
          },
        },
        {
          status: $Enums.OrderStatus.Selesai,
        },
      ],
    },
    select: {
      id: true,
    },
  });
  const total = orders.length;
  return total;
};

const getTotalSevenDays = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        {
          status: $Enums.OrderStatus.Selesai,
        },
      ],
    },
    select: {
      id: true,
    },
  });
  const total = orders.length;
  return total;
};

const getChartData = async () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(
      oneYearAgo.getFullYear(),
      oneYearAgo.getMonth() + i,
      1
    );
    months.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
  }

  // Ambil data dari database
  const orders = await prisma.order.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: oneYearAgo,
          },
        },
        {
          status: $Enums.OrderStatus.Selesai,
        },
      ],
    },
    select: {
      createdAt: true,
    },
  });

  const transactionData = orders.reduce((acc, order) => {
    const month = formatDate(order.createdAt);
    if (!acc[month]) acc[month] = 0;
    acc[month] += 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = months.map((month) => ({
    month,
    total: transactionData[month] || 0,
  }));

  return chartData;
};

const formatDate = (date: Date) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString();
  return `${month} ${year}`;
};

export default adminAuth(handler);
