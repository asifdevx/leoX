import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNFT } from "@/reducer/nftSlice"; // Import Redux action
import axios from "axios";
import { AppDispatch } from "@/components/store/store";

const index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload Image to IPFS
  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET,
          },
        }
      );
      console.log("url1", `ipfs://${response.data.IpfsHash}`);

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error uploading image to IPFS.");
      return null;
    }
  };

  // Upload Metadata to IPFS
  const uploadMetadataToIPFS = async (imageCID: string) => {
    const metadata = {
      name,
      description,
      image: imageCID,
    };

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET,
          },
        }
      );
      console.log("url2", `ipfs://${response.data.IpfsHash}`);

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      setError("Error uploading metadata to IPFS.");
      return null;
    }
  };

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

    const tokenURI = await uploadMetadataToIPFS(imageCID);
    if (!tokenURI) {
      setLoading(false);
      console.log("Failed to get tokenURI");

      return;
    }

    // Dispatch the Redux action to create the NFT

    dispatch(createNFT({ tokenURI, price: parseFloat(price) }));
    console.log("data",tokenURI, parseFloat(price),price );
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#5b64b6] via-[#7052a7] to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Create Your NFT
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-6">
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your NFT's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a description for your NFT"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="price"
            >
              Price (ETH)
            </label>
            <input
              id="price"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Set the price in ETH"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image"
            >
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </form>
      </div>
    </div>
  );
};

export default index;
