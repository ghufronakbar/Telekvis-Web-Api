import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import { $Enums, Engineer, Order, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { GrMailOption } from "react-icons/gr";

interface ResOrder extends Order {
  engineer: Engineer | null;
}

interface ResUser extends User {
  orders: ResOrder[];
}

const DetailUserPage = () => {
  const [item, setItem] = useState<ResUser>();
  const router = useRouter();
  const { id } = router.query as { id: string };

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResUser>>(`/users/${id}`);
      setItem(res.data.data);
    } catch (error) {
      router.push("/customer");
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const colorStatus = (status: $Enums.OrderStatus) => {
    switch (status) {
      case "Dipesan":
        return "bg-orange-100 text-orange-600";
      case "Diterima":
        return "bg-blue-100 text-blue-600";
      case "Ditolak":
        return "bg-red-100 text-red-600";
      case "Proses":
        return "bg-yellow-100 text-yellow-600";
      case "Selesai":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const linkLocation = (item: Order) =>
    `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <Navigation title="Detail Customer">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full bg-white rounded-lg p-4 shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="text-white">
              <tr className="rounded-lg bg-primary">
                <th className="px-4 py-2 text-left">#{item.id}</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              <tr>
                <td className="px-4 py-2 font-semibold">Nama</td>
                <td className="px-4 py-2">{item.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">No Hp</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    {item.phone}
                    <Link href={`https://wa.me/${item.phone}`} target="_blank">
                      <BsWhatsapp />
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Email</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    {item.email}
                    <Link href={`mailto:${item.email}`} target="_blank">
                      <GrMailOption />
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-full bg-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Riwayat Pesanan
          </h2>
          {item.orders.map((order) => (
            <table className="min-w-full table-auto" key={order.id}>
              <thead className="text-white">
                <tr className="rounded-lg bg-primary">
                  <th className="px-4 py-2 text-left">#{order.id}</th>
                  <th className="px-4 py-2 text-left">
                    <div className="flex self-end items-end justify-end">
                      <Link href={`/order/${order.id}`}>
                        <button className="bg-white text-primary px-2 rounded-sm self-end">
                          Detail
                        </button>
                      </Link>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                <tr>
                  <td className="px-4 py-2 font-semibold">Status</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        "font-semibold px-2 py-1 rounded-md " +
                        colorStatus(order.status)
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Merk</td>
                  <td className="px-4 py-2">{order.brand}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Alamat</td>
                  <td className="px-4 py-2 flex items-center gap-1">
                    <span>{order.location}</span>
                    <Link href={linkLocation(order)} target="_blank">
                      <FiExternalLink className="text-primary" />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Teknisi</td>
                  <td className="px-4 py-2">{order.engineer?.name || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Tanngal</td>
                  <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
      <Toaster />
    </Navigation>
  );
};

export default DetailUserPage;
