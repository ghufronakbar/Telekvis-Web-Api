import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import { OrderStatus } from "@prisma/client";

const VALID_STATUS = [
  OrderStatus.Dipesan,
  OrderStatus.Ditolak,
  OrderStatus.Diterima,
  OrderStatus.Proses,
  OrderStatus.Selesai,
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    if (req.method === "GET") {
      const order = await GET(id);
      if (!order)
        return res
          .status(404)
          .json({ status: 404, message: "Pesanan tidak ditemukan" });
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: order });
    } else if (req.method === "PATCH") {
      const { status, engineerId } = req.body;
      if (!status)
        return res
          .status(400)
          .json({ status: 400, message: "Harap isi semua field" });
      if (!VALID_STATUS.includes(status))
        return res
          .status(400)
          .json({ status: 400, message: "Status tidak valid" });
      const check = await prisma.order.findUnique({ where: { id } });
      if (!check) {
        return res
          .status(400)
          .json({ status: 400, message: "Teknisi tidak ditemukan" });
      }
      if (
        ((check.status === "Dipesan" && !engineerId) ||
          (!engineerId && !check.engineerId)) &&
        status !== "Ditolak"
      ) {
        return res
          .status(400)
          .json({ status: 400, message: "Harap isi semua field" });
      }
      const data = {
        status: status as OrderStatus,
        engineerId: engineerId || check.engineerId,
      };
      const order = await PATCH(id, data);
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengubah status order",
        data: order,
      });
    } else {
      return res
        .status(405)
        .json({ status: 405, message: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

async function GET(id: string) {
  return await prisma.order.findUnique({
    include: {
      engineer: true,
      user: true,
    },
    where: { id },
  });
}

interface OrderDTO {
  status: OrderStatus;
  engineerId?: string;
}

async function PATCH(id: string, data: OrderDTO) {
  return await prisma.order.update({
    where: { id },
    data,
  });
}

export default adminAuth(handler);
