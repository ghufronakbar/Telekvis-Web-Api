import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Teknisi", href: "/engineer" },
  { name: "Customer", href: "/customer" },
  { name: "Pesanan", href: "/order" },
  { name: "Logout", href: "/logout" },
];

interface Props {
  children?: React.ReactNode;
  title?: string;
}

const Navigation = ({ children, title }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex flex-col w-64 bg-primary text-white p-4 space-y-6 fixed h-full top-0 left-0">
        <div className="text-2xl font-semibold">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={400}
            height={400}
            className="w-40 h-auto object-cover"
          />
        </div>
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-secondary hover:bg-secondary hover:text-primary px-4 py-2 rounded-md font-semibold ease-in-out duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        <div className="md:hidden fixed top-0 left-0 w-full bg-primary p-4 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-white text-xl font-semibold">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={400}
                height={400}
                className="w-40 h-auto object-cover"
              />
            </div>

            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 w-full bg-primary p-4 z-20 shadow-md">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-secondary hover:bg-secondary hover:text-primary px-4 py-2 rounded-md font-semibold ease-in-out duration-300 mx-2 my-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <main className="p-6 bg-gray-100 mt-16 md:mt-0 flex flex-col min-h-screen">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 mt-8">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navigation;
