import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import abi from "@/components/ABI/abi.json";
dotenv.config();
const CONTRACT_ADDRESS = "0xf944a6Bc9e9A09781583ece2B3E114af86D427Ae";

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
  async ({ tokenURI, price }: { tokenURI: string; price: number }) => {
    const contract = await createEthContract();
    const listprice = await contract?.getListPrice();
    const tx = await contract?.createToken(
      tokenURI,
      ethers.parseEther(price.toString()),
      {
        value: listprice,
        gasLimit: 3000000,
      }
    );
    await tx.wait();
    console.log("List Price:", ethers.formatEther(listprice));
    console.log("Token URI:", tokenURI);
    console.log("Price:", ethers.parseEther(price.toString()));

    console.log("step 1");

    return { success: true };
  }
);

export const fetchNFTs = createAsyncThunk<NFT[]>("nft/fetchNFTs", async () => {
  const contract = await createEthContract();
  const nftsRaw = await contract?.getAllNfts();
  console.log("Raw NFTs Data:", nftsRaw);

  if (!nftsRaw) return [];

  // Convert proxy object to a plain array
  const nftsArray = Array.from(nftsRaw);

  // For each NFT, fetch the tokenURI metadata and return the formatted NFT data.
  const tokens = await Promise.all(
    nftsArray.map(async (nft: any) => {
      // The raw NFT is returned as a tuple:
      // [ tokenID, owner, seller, price, isSold ]
      const tokenId = nft[0].toString();
      let metadata = { name: "", description: "", image: "" };
      try {
        // Call tokenURI to get the metadata URI then fetch it
        const tokenURI = await contract?.tokenURI(tokenId);
        const metaRes = await axios.get(tokenURI);
        metadata = metaRes.data;
      } catch (error) {
        console.error("Error fetching metadata for token", tokenId, error);
      }
      return {
        tokenId,
        name: metadata.name || `Token #${tokenId}`,
        description: metadata.description || "No description available",
        image: metadata.image || "/placeholder.png",
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
