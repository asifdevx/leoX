import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import abi from "@/components/ABI/abi.json";
import { NFT, NFTState } from "@/types";

dotenv.config();
const CONTRACT_ADDRESS = "0x8Ef4476E5Ed07dFC9eCA640106F00841F89F5e97";

const createEthContract = async ()=> {
  if (!window.ethereum) {
    console.error("MetaMask not detected.");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);

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
      await tx.wait();

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
      let metadata = { name: "", description: "", image: "" };
      
      try {
        const tokenURI = await contract?.tokenURI(tokenId);
        const metaRes = await axios.get(
          `https://ipfs.io/ipfs/${tokenURI.replace("ipfs://", "")}`
        );
        metadata = metaRes.data;
      } catch (error) {
        console.log(error);
      }
      return {
        tokenId,
        name: metadata.name || `Token #${tokenId}`,
        description: metadata.description || "No description available",
        image:
          `https://ipfs.io/ipfs/${metadata.image.replace(
            "ipfs://",
            ""
          )}` || "https://ipfs.io/ipfs/QmV3TTBR8ZGSxWx4c9wTCybozP5nknpk3m3jDkPzcnhXhZ",
        price: ethers.formatEther(nft[3]),
        owner: nft[1],
        seller: nft[2],
        isSold: nft[4],
      };
    })
  );

  console.log("Formatted NFTs in fathchNft", tokens);
  
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
      .addCase(fetchNFTs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.nfts = action.payload;
        state.loading = false;
      })
      .addCase(fetchNFTs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default nftSlice.reducer;
