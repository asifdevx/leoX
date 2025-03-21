import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import abi from "@/components/ABI/abi.json";
import { NFT, NFTState } from "@/types";

dotenv.config();
const CONTRACT_ADDRESS = "0x8Ef4476E5Ed07dFC9eCA640106F00841F89F5e97";

const createEthContract = async () => {
  console.log("Contract Address:", CONTRACT_ADDRESS);
  if (!window.ethereum) {
    console.error("MetaMask not detected.");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
  console.log(await contract?.getListPrice());
  console.log(await contract?.getCurrentToken());

  return contract;
};

export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async (
    { tokenURI, price }: { tokenURI: string; price: number },
    { getState }
  ) => {
    try {
      const contract = await createEthContract();
      const listPrice = await contract?.getListPrice();
      const tx = await contract?.createToken(
        tokenURI,
        ethers.parseEther(price.toString()),
        {
          value: listPrice,
          gasLimit: 3000000,
        }
      );

      if (!tx) {
        throw new Error("Transaction failed to initialize.");
      }
      const receipt = await tx.wait();

      console.log("Transaction Receipt:", receipt);
      console.log("List Price:", ethers.formatEther(listPrice));
      console.log("Token URI:", tokenURI);
      console.log("Price:", ethers.parseEther(price.toString()));

      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  }
);

export const fetchNFTs = createAsyncThunk<NFT[]>("nft/fetchNFTs", async () => {
  const contract = await createEthContract();
  const nftsRaw = await contract?.getAllNfts();
  console.log("Raw NFTs Data:", nftsRaw);

  if (!nftsRaw) return [];

  const nftsArray = Array.from(nftsRaw);
  console.log("nftsArray Data:", nftsArray);

  const tokens = await Promise.all(
    nftsArray.map(async (nft: any) => {
      const tokenId = nft[0].toString();
      console.log("tokenId", tokenId);

      let metadata = { name: "", description: "", image: "" };

      try {
        const tokenURI = await contract?.tokenURI(tokenId);
        const metaRes = await axios.get(
          `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`
        );
        metadata = metaRes.data;
      } catch (error) {
        const tokenURI = await contract?.tokenURI(tokenId);
        console.log("tokenURI", tokenURI);

        console.error("Error fetching metadata for token", tokenId, error);
      }
      return {
        tokenId,
        name: metadata.name || `Token #${tokenId}`,
        description: metadata.description || "No description available",
        image:
          `https://gateway.pinata.cloud/ipfs/${metadata.image.replace(
            "ipfs://",
            ""
          )}` || "/placeholder.png",
        price: ethers.formatEther(nft[3]),
        owner: nft[1],
        seller: nft[2],
        isSold: nft[4],
      };
    })
  );

  console.log("Formatted NFTs:", tokens);
  return tokens;
});

const initialState: NFTState = {
  nfts: [],
  loading: false,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createNFT.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNFT.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.nfts = action.payload;
      });
  },
});

export default nftSlice.reducer;
