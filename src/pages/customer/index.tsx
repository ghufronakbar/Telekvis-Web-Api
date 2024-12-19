import Navigation from "@/components/Navigation";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import { User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResUser extends User {
  _count: {
    orders: number;
  };
}

const CustomerPage = () => {
  const [data, setData] = useState<ResUser[]>([]);
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResUser[]>>("/users");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navigation title="Customer">
      <div className="w-full flex flex-col gap-2">
        <input
          type="text"
          placeholder="Cari customer..."
          className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full bg-white rounded-lg p-6 shadow-lg">
          {/* Table for displaying customer data */}
          <table className="min-w-full table-auto">
            <thead className="text-neutral-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm text-neutral-500"></th>
                <th className="px-6 py-3 font-semibold text-sm text-neutral-500">
                  Nama
                </th>
                <th className="px-6 py-3 font-semibold text-sm text-neutral-500">
                  Nomor Hp
                </th>
                <th className="px-6 py-3 font-semibold text-sm text-neutral-500">
                  Pesanan Menunggu
                </th>
                <th className="px-6 py-3 font-semibold text-sm text-neutral-500"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {/* Loop through each customer and create a row */}
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <div className="font-semibold">{item.name}</div>
                      <div>{item.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-center">
                      {item._count.orders}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-row items-center justify-center">
                      <Link href={`/customer/${item.id}`}>
                        <button className="bg-primary text-white w-fit h-fit rounded-md px-2 py-1 font-semibold">
                          Detail
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Navigation>
  );
};

export default CustomerPage;
