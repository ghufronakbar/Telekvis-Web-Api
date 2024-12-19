import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";
import { $Enums } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const id = req.decoded?.id;
      const orders = await GET(id);
      return res
        .status(200)
        .json({ success: true, message: "Success", data: orders });
    } else if (req.method === "POST") {
      const { location, latitude, longitude, brand, desc } = req.body;
      const userId = req.decoded?.id;
      console.log({ location, latitude, longitude, brand, desc });
      if (!location || !latitude || !longitude || !brand || !desc) {
        return res
          .status(200)
          .json({ success: false, message: "Harap isi semua field" });
      }
      if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return res
          .status(200)
          .json({
            success: false,
            message: "Harap isi latitude dan longitude dengan angka",
          });
      }
      const data: CheckoutDTO = {
        userId,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        brand,
        desc,
        status: "Dipesan",
      };
      const order = await POST(data);
      return res
        .status(200)
        .json({ success: true, message: "Success", data: order });
    } else {
      return res
        .status(405)
        .json({ status: 405, message: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}

async function GET(userId: string) {
  return await prisma.order.findMany({
    include: {
      engineer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
    },
  });
}

interface CheckoutDTO {
  userId: string;
  location: string;
  latitude: number;
  longitude: number;
  brand: string;
  desc: string;
  status: $Enums.OrderStatus;
}

async function POST(data: CheckoutDTO) {
  return await prisma.order.create({ data });
}

export default userAuth(handler);
