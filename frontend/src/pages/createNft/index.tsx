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

    const imageCID = await uploadToIPFS(file);
    if (!imageCID) {
      setLoading(false);
      console.log("Failed to get Image CID");

      return;
    }

    const tokenURI = await uploadMetadataToIPFS(name,description,imageCID);
    if (!tokenURI) {
      setLoading(false);
      console.log("Failed to get tokenURI");

      return;
    }
    dispatch(createNFT({ tokenURI, price: parseFloat(price) }));
    console.log("data", tokenURI, parseFloat(price), price);

    setLoading(false);
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
            <div className={` ${preview && "flex justify-between items-start gap-1"}  border-dashed border-2 p-6 w-full h-72 flex justify-center items-center mt-2 border-[#d9dddd] rounded-2xl relative`}>
               
              {preview ? (
                <>
                <img
                  src={preview}
                  alt="NFT Preview"
                  className="w-full h-full rounded-lg"
                  />
                <IoMdClose size={24} onClick={()=>setPreview(null)}/>
                  </>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-black p-3 bg-gray-light">Upload file</span>
                </label>
              )}
            </div>
          </div>
          {/* preiew compartment for pc version  */}
          <div className="max-md:hidden">
            {preview ? (
              <div className="border rounded-lg p-4 bg-white w-64 shadow-lg">
                <img
                  src={preview}
                  alt="NFT Preview"
                  className="w-full  rounded-lg"
                />
                <div className="mt-2">
                  <p className="text-gray-500 text-xs">Ethereum ERC-721</p>
                  <h3 className="font-bold">leoX</h3>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <p>Price</p>
                    <p>Highest bid</p>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <p className="text-gray-500">Not for sale</p>
                    <p className="text-gray-500">No bids yet</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <p>preview</p>
                  <div className="border rounded-lg p-4 bg-white w-64 h-72 shadow-lg">
                    upload file and choose collection to preview your brand new
                    NFT
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
