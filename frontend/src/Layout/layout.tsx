import Footer from "@/components/footer/Footer";
import Header from "@/components/Header";

const Layout = (props: any) => {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#2581af] text-black">
      <Header />
      <div className="mt-20 ">{props.children}</div>
    </div>
  );
};

export default Layout;
