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
