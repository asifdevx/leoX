import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { createNFT } from "@/reducer/nftSlice"; // Import Redux action
import { AppDispatch } from "@/components/store/store";
import { shortenAddress } from "@/components/ui/ShortenAddress";
import { useAccount } from "wagmi";
import { uploadFile } from "pinata";
import { IoMdClose } from "react-icons/io";
import { uploadMetadataToIPFS, uploadToIPFS } from "@/utils/uploadIpfs";
import PreviewNFT from "@/components/HelperCom/PreviewNFT";
import Input from "@/components/ui/Input";

const index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  // Upload Image to IPFS

  const handleCreateNFT = async () => {
    setLoading(true);
    setError(null); // Reset error message

    if (!file || !name || !description || !price) {
      setError("Please fill all fields and select an image.");
      setLoading(false);
      return;
    }

    try {
      const imageCID = await uploadToIPFS(file);
      if (!imageCID) throw new Error("Failed to get Image CID");

      const tokenURI = await uploadMetadataToIPFS(name, description, imageCID);
      if (!tokenURI) throw new Error("Failed to get tokenURI");

      const response = await dispatch(
        createNFT({ tokenURI, price: parseFloat(price) })
      ).unwrap();
      console.log("NFT Creation Response:", response);

      if (!response || !response.txHash) {
        throw new Error("NFT creation failed: Invalid response");
      }
      setPreview(null);
      setName(" ");
      setDescription(" ");
      setPrice("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
     
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  return (
    <div className="min-h-screen max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl bg-white  mx-auto flex flex-col gap-4">
      <h3>Create your NFT</h3>
      <p>Single edition on Ethereum</p>
      <div className="w-full flex ">
        <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-5 md:col-span-2">
            {/* Show case wallet  */}
            <div className="w-full px-4 py-2 rounded-xl border border-[#d9dddd]  flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/eth.svg" width={50} height={50} alt="eth logo" />
                <div className="text-sm">
                  {address && (
                    <p className="font-bold">{shortenAddress(address)}</p>
                  )}
                  <p className="font-extralight">Ethereum</p>
                </div>
              </div>
              {isConnected && (
                <div className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                  connect
                </div>
              )}
            </div>
            <h5 className="mt-5">Upload file</h5>
            <div
              className={` ${
                preview && "flex justify-between  gap-1 bg-grayborder "
              } border-dashed border-2 p-6  w-full h-72 flex justify-center items-center mt-2 border-[#d9dddd] rounded-2xl relative`}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="NFT Preview"
                    className="w-full h-full rounded-lg"
                  />
                  <IoMdClose
                    size={24}
                    onClick={() => setPreview(null)}
                    className=""
                  />
                </>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-black p-3 bg-gray-light">
                    Upload file
                  </span>
                </label>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="price">Price</label>
              <Input
                placeholder={"Enter price"}
                type={"text"} // Keep type text to allow handling of decimal points
                position={"right"}
                inputClass={"w-full bg-[#e8eeee] rounded-lg"}
                handleChange={(e) => {
                  // Remove any non-numeric characters except for the decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, "");

                  // Ensure only one decimal point is allowed
                  if ((value.match(/\./g) || []).length <= 1) {
                    setPrice(value); // Update the price only if it's a valid number
                  }
                }}
                value={price}
                icon={"ETH"}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="Name">Name</label>
              <Input
                placeholder={`e.g."Redeemable T-Shirt with logo"`}
                type={"text"}
                inputClass={"w-full bg-[#e8eeee] rounded-lg"}
                handleChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="description">description</label>
              <Input
                placeholder={`e.g."After purchasing you"ll be able to get the real T-Shirt"`}
                type={"text"}
                inputClass={"w-full bg-[#e8eeee] rounded-lg"}
                handleChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleCreateNFT}
              disabled={loading}
              className="w-full bg-blue text-black font-semibold py-3 rounded-lg hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue disabled:bg-gray"
            >
              {loading ? "Creating NFT..." : "Create NFT"}
            </button>
          </div>
          {/* preiew compartment for pc version  */}
          <PreviewNFT preview={preview} price={price} name={name} />
        </div>
      </div>
    </div>
  );
};

export default index;
