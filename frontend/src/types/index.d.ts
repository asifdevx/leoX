interface Window{
  ethereum?:any
}

declare type customBtnProps = {
  title: string;
  othercss: string;
  handleclick?: () => void;
  isLink?: boolean;
  linkUrl: string;
  icon?: string;
};
declare type InputProps = {
  placeholder: string;
  name: string;
  type: string;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

interface NFT {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
}

interface NFTState {
  nfts: NFT[];
  loading: boolean;
}