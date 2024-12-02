import Footer from "@/components/footer/Footer";

const Layout = (props: any) => {
  return (
    <div className="w-full min-h-screen bg-white text-black">

      <div className=" bg-[rgba(59,139,246,0.2)]">{props.children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
