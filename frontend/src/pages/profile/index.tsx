import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFTs } from "@/reducer/nftSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { nfts, loading } = useSelector(
    (state: RootState) => state.nft as NFTState
  );

  useEffect(() => {
    dispatch(fetchNFTs());
  }, [dispatch]);
  
  console.log("NFTs in Redux:", nfts)

  return (
    <div className=" mx-auto px-4 py-8 bg-black">
      {loading ? (
        <div className="text-center text-xl font-semibold text-gray">Loading NFTs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <div key={index} className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold text-[#505f60]">{nft.name}</h2>
                <p className="text-[#afbec3] mt-2">{nft.description}</p>
                <p className="mt-4 text-xl font-semibold text-indigo-600">Price: {nft.price} ETH</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
