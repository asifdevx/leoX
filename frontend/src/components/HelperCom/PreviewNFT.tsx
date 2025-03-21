import { PreviewNFTProps } from "@/types";
import React from "react";

const PreviewNFT = ({ preview,name,price }:PreviewNFTProps) => {
  return (
    <div className="max-md:hidden">
      {preview ? (
        <div className="border rounded-lg p-4 bg-grayborder w-64 shadow-lg">
          <img src={preview} alt="NFT Preview" className="w-full  rounded-lg" />
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Ethereum ERC-721</p>
            <h3 className="font-bold">{name}</h3>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <p>Price : {price} ETH</p>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <p className="text-gray">Not for sale</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <p>preview</p>
            <div className="border rounded-lg p-4 bg-white w-64 h-72 shadow-lg">
              upload file and choose collection to preview your brand new NFT
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewNFT;
