import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Order, User } from "@prisma/client";
import { GoListUnordered } from "react-icons/go";
import { FaPerson, FaRegClock } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { BsCalendar2Month } from "react-icons/bs";
import formatDate from "@/utils/format/formatDate";
import Link from "next/link";
import { MdEngineering } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface ResDashboard {
  totalOrders: number;
  pendingOrders: number;
  successOrders: number;
  rejectedOrders: number;
  totalUsers: number;
  totalMonthly: number;
  totalEngineers: number;
  pendingOrdersData: PendingOrdersData[];
  chartData: ResChartData[];
}

interface PendingOrdersData extends Order {
  user: User;
}

interface ResChartData {
  month: string;
  total: number;
}

const DashboardPage = () => {
  const [data, setData] = useState<ResDashboard>();

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResDashboard>>("/dashboard");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cnIcon = "text-primary w-16 h-16";

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary"
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <Navigation title="Dashboard">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GridPendingOrdersData data={data?.pendingOrdersData} />
        <GridItem
          title="Total Pesanan"
          value={data?.totalOrders}
          icon={<GoListUnordered className={cnIcon} />}
        />
        <GridItem
          title="Total Pesanan Menunggu"
          value={data?.pendingOrders}
          icon={<FaRegClock className={cnIcon} />}
        />
        <GridChart chartData={data?.chartData} />
        <GridItem
          title="Total Pesanan Selesai"
          value={data?.successOrders}
          icon={<IoCheckmarkDone className={cnIcon} />}
        />
        <GridItem
          title="Total Pesanan Ditolak"
          value={data?.rejectedOrders}
          icon={<RxCross1 className={cnIcon} />}
        />
        <GridItem
          title="Total Pesanan Bulan Ini"
          value={data?.totalMonthly}
          icon={<BsCalendar2Month className={cnIcon} />}
        />
        <GridItem
          title="Total Teknisi"
          value={data?.totalEngineers}
          icon={<MdEngineering className={cnIcon} />}
        />
        <GridItem
          title="Total Pengguna Aktif"
          value={data?.totalUsers}
          icon={<FaPerson className={cnIcon} />}
        />
      </div>
      <Toaster />
    </Navigation>
  );
};

interface Props {
  title: React.ReactNode;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const GridItem = ({ title, value, icon }: Props) => {
  return (
    <div className="w-full h-60 overflow-hidden rounded-lg shadow-lg relative flex ">
      <div className="w-full h-full px-12 py-2 flex items-center justify-between gap-8 z-10">
        <div className="flex flex-col">
          <h1 className="text-primary text-3xl font-bold">{value}</h1>
          <h1 className="text-secondary text-xl">{title}</h1>
        </div>
        {icon}
      </div>
    </div>
  );
};

const GridChart = ({ chartData }: { chartData: ResChartData[] }) => {
  const labels = chartData.map((item) => item.month);
  const dataValues = chartData.map((item) => item.total);

  const chartConfig: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: "Total Pesanan",
        data: dataValues,
        backgroundColor: "rgba(70, 199, 184, 0.2)",
        borderColor: "#46C7B8",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full h-30rem md:h-[31rem] overflow-hidden rounded-lg shadow-lg relative flex md:col-span-2 lg:col-span-2 row-span-2">
      <div className="w-full h-full px-12 py-6 flex flex-col gap-4 z-10">
        <h1 className="text-primary text-xl font-bold">
          Pesanan Selesai Per Bulan
        </h1>
        <div className="text-black w-full h-full py-8">
          <Line
            data={chartConfig}
            style={{ width: "100%", height: "100%" }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: "#1E2E46" },
                },
                y: {
                  ticks: { color: "#1E2E46" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const GridPendingOrdersData = ({ data }: { data: PendingOrdersData[] }) => {
  return (
    <div className="w-full h-30rem md:h-[31rem] overflow-hidden rounded-lg shadow-lg relative flex md:col-span-2 lg:col-span-2 row-span-2">
      <div className="w-full h-full px-12 py-6 flex flex-col gap-4 z-10">
        <h1 className="text-primary text-xl font-bold">
          Daftar Pesanan Menunggu
        </h1>
        <div className="text-black w-full h-full mt-4 relative overflow-auto hide-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">ID Pesanan</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Tanggal Pesanan</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr className="text-center">
                  <td colSpan={5}>
                    <div className="py-8">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.user.name}</td>
                    <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/order/${item.id}`}>
                        <button className="bg-primary text-white hover:bg-primary hover:text-secondary px-4 py-2 rounded-md font-semibold ease-in-out duration-300">
                          Detail
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
