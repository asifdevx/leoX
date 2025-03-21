import { HeaderLists } from "@/config/HeaderLists";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConnectBtn from "../HelperCom/ConnectBtn";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Input from "../ui/Input";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import MobileSideBar from "../HelperCom/MobileSideBar";
import SearchBar from "../ui/SearchBar";

const index = () => {
  const pathname = usePathname();
  const [isScroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOPen] = useState(false);
  function toggleBtn() {
    setOpen(!open);
  }

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 bg-white w-screen text-black z-40`}>
        <div className="w-full flex lg:grid  grid-cols-8 justify-between px-2 md:px-7 mx-auto">
          {/* Logo section  */}
          <div className="h-full flex items-center md:gap-10 gap-3 ">
            <div className=" flex gap-1 items-center ">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={70}
                priority
                className={"object-fill"}
              />
              <h3 className="text-2xl text-[#474343] font-ponomar">
                Leo<span>x</span>
              </h3>
            </div>
            <div className="lg:hidden items-center mt-1">
              <HiOutlineMagnifyingGlass size={24} className="text-[#292b2b]" onClick={()=>setSearchOPen(true)} />
            </div>
          </div>

          {/* Input section  */}
          <div className="flex items-center lg:col-start-2 gap-5">
            <div className=" max-lg:hidden">
              <Input
                placeholder={"searce your nfts"}
                type={"text"}
                position={"right"}
                icon={
                  <HiOutlineMagnifyingGlass
                    size={24}
                    className="text-[#7a5454]"
                  />
                }
                inputClass={"bg-[#e8eeee] rounded-lg w-[400px]"}
              />
            </div>
            <div className="flex items-center gap-5 max-md:hidden">
              {HeaderLists.map((items, idx) => (
                <div key={idx}>
                  <Link
                    href={items.link || ""}
                    className={`text-lg font-ponomar text-[#313434]`}
                  >
                    {items.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* connect btn section  */}
          <div className="flex gap-2 lg:col-start-8 items-center justify-center">
            <ConnectBtn />
            <div onClick={toggleBtn} className="md:hidden">
              {open ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
            </div>
          </div>
        </div>
        {open && <MobileSideBar open={open} setOpen={setOpen} />}
      </div>
      {searchOpen && (
        <SearchBar search={searchOpen} setSearchBar={setSearchOPen} />
      )}
    </>
  );
};

export default index;
