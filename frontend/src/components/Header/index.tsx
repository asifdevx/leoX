import { HeaderLists } from "@/config/HeaderLists";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConnectBtn from "../HelperCom/ConnectBtn";

const index = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScroll, setScroll] = useState(false);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 px-5 xl:px-0 ${
        !isScroll && "bg-white"
      }`}
    >
      <div
        className={`${
          isScroll && "backdrop-blur-2xl bg-white/30 shadow-header"
        } rounded-3xl xl:max-w-7xl  2xl:max-w-[1450px] mx-auto flex items-center justify-between space-x-7 mt-2 py-2 px-7 transition-all duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div>
          <Image src="fm.svg" alt="logo" width={70} height={50} />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center md:gap-8 lg:gap-16">
          {HeaderLists.map((items, idx) => (
            <div key={idx}>
              {items.islink ? (
                <Link
                  href={items.link || ""}
                  className={`relative transition-transform ${
                    pathname === items.link
                      ? "text-blue scale-110 after:absolute after:content-[''] after:w-full after:h-[2px] after:bg-blue after:bottom-[-5px] after:left-0 after:animate-widthIncrease"
                      : "hover:text-blue-500 hover:scale-105"
                  }`}
                >
                  {items.name}
                </Link>
              ) : (
                items.name === "<ConnectBtn/>" && <ConnectBtn />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default index;
