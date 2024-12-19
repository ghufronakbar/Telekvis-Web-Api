import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import { ResErr, ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import { $Enums, Engineer, Order, User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

interface ResOrder extends Order {
  user: User;
  engineer: Engineer | null;
}

const OrderPage = () => {
  const [data, setData] = useState<ResOrder[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.engineer?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResOrder[]>>("/orders");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEngineer = async () => {
    try {
      const res = await axiosInstance.get<ResOk<Engineer[]>>("/engineers");
      setEngineers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEngineer();
  }, []);

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

  const linkLocation = (item: ResOrder) =>
    `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;

  const handleSetStatus = async (item: ResOrder, isConfirm?: boolean) => {
    try {
      let status: $Enums.OrderStatus | null = null;
      switch (item.status) {
        case "Dipesan":
          status = isConfirm ? "Diterima" : "Ditolak";
          break;
        case "Diterima":
          status = "Proses";
          break;
        case "Proses":
          status = "Selesai";
          break;
        case "Selesai":
          status = null;
          break;
      }
      toast.loading();
      await axiosInstance.patch(`/orders/${item.id}`, {
        status,
        engineerId: item.engineerId,
      });
      toast.success("Berhasil mengubah status pesanan");
      fetchData();
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err.response?.data.message);
    }
  };

  return (
    <Navigation title="Pesanan">
      <div className="w-full flex flex-col gap-2">
        <input
          type="text"
          placeholder="Cari pesanan..."
          className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredData.map((item) => (
          <div
            className="w-full bg-white rounded-lg p-4 shadow-lg"
            key={item.id}
          >
            <table className="min-w-full table-auto">
              <thead className="text-white">
                <tr className="rounded-lg bg-primary">
                  <th className="px-4 py-2 text-left">#{item.id}</th>
                  <th className="px-4 py-2 text-left">
                    <div className="flex self-end items-end justify-end">
                      <Link href={`/order/${item.id}`}>
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
                        colorStatus(item.status)
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Nama</td>
                  <td className="px-4 py-2">{item.user.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">No Hp</td>
                  <td className="px-4 py-2">{item.user.phone}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Alamat</td>
                  <td className="px-4 py-2 flex items-center gap-1">
                    <span>{item.location}</span>
                    <Link href={linkLocation(item)} target="_blank">
                      <FiExternalLink className="text-primary" />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Teknisi</td>
                  <td className="px-4 py-2">
                    {item.engineer?.name ||
                      (item.status === "Dipesan" ? "Belum dipilih" : "-")}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Tanggal</td>
                  <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                </tr>
              </tbody>
            </table>

            <div className="px-4 flex flex-col gap-2 mt-4">
              {item.status === "Dipesan" && (
                <div className="flex flex-col w-fit mb-2">
                  <div className="text-lg font-semibold text-secondary flex flex-row items-center gap-2">
                    Pilih Teknisi
                  </div>
                  <select
                    className="font-normal text-base bg-white border border-secondary rounded-md px-2 py-1"
                    value={item?.engineerId || ""}
                    onChange={(e) => {
                      const updatedData = data.map((order) =>
                        order.id === item.id
                          ? { ...order, engineerId: e.target.value }
                          : order
                      );
                      setData(updatedData);
                    }}
                  >
                    <option value="">Belum dipilih</option>
                    {engineers.map((engineer) => (
                      <option key={engineer.id} value={engineer.id}>
                        {engineer.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-row gap-2">
                {item.status === "Dipesan" ? (
                  <>
                    <button
                      className="bg-red-500 text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                      onClick={() => handleSetStatus(item, false)}
                    >
                      Tolak
                    </button>
                    <button
                      className="bg-green-500 text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                      onClick={() => handleSetStatus(item, true)}
                    >
                      Konfirmasi
                    </button>
                  </>
                ) : item.status === "Diterima" ? (
                  <button
                    className="bg-secondary text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                    onClick={() => handleSetStatus(item)}
                  >
                    Tandai Sebagai Diproses
                  </button>
                ) : item.status === "Proses" ? (
                  <button
                    className="bg-primary text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                    onClick={() => handleSetStatus(item)}
                  >
                    Tandai Sebagai Selesai
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toaster />
    </Navigation>
  );
};

export default OrderPage;
