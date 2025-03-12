import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function AnnounceMent() {
  const [nfts, setNFTs] = useState<string[]>([]); // Array to hold NFT image URLs

  const tempImages: string[] = [
    "nft_1.png",
    "nft_2.png",
    "nft_3.png",
    "nft_4.png",
    "nft_2.png",
    "nft_3.png",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
  };

  useEffect(() => {

      setNFTs(tempImages);
  
  }, []);

  return (
    <div className="bg-black py-12 flex md:flex-row flex-col w-full h-auto items-center justify-between gap-16 px-14">
      {/* Text Section */}
      <h1 className="text-4xl font-bold text-white">
        Build your awesome NFT <span className="text-[#2b2ba1]">HERE</span>
      </h1>

      {/* NFT Slider */}
      <div className="w-full  md:w-1/2 lg:w-[40%] xl:w-1/4 max-xl:mx-auto max-xl:text-center ">
        {nfts.length > 0 ? (
          <Slider {...settings}>
            {nfts.map((nft, index) => (
              <div key={index} className="px-0 "> 
                <LazyLoadImage
                  src={nft}
                  alt={`NFT ${index}`}
                  className="w-72 h-80 object-cover rounded-lg shadow-lg max-xl:mx-auto"
                  effect="blur" // Adds blur effect on lazy load
                  delayTime={300} // Optional: Adds delay for smoother appearance
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p>Loading NFTs...</p>
        )}
      </div>
    </div>
  );
}

export default AnnounceMent;
