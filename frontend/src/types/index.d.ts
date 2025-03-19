import { ReactNode } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}


declare type customBtnProps = {
  title: string;
  othercss: string;
  handleclick?: () => void;
  isLink?: boolean;
  linkUrl: string;
  icon?: string;
};
interface InputProps  {
  placeholder: string;
  name?: string;
  type: string;
  inputClass?:string,
  iconClass?:string,
  value?: number,
  position?:"left" | "right",
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
};

interface NFT {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  seller:string;
  isSold:boolean
}

interface NFTState {
  nfts: NFT[];
  loading: boolean;
}

declare type MobileSideBar={
  open:boolean,
  setOpen:Dispatch<SetStateAction<boolean>>
}
declare type SearchBarProps={
  search:boolean,
  setSearchBar:Dispatch<SetStateAction<boolean>>
}
