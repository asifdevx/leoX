interface HeaderLists {
  name: string,
  link?: string,
  islink: boolean, 
}

export const HeaderLists:HeaderLists[] = [
  {
    name: "Home",
    link: "/",
    islink: true,
  },
  {
    name: "profile",
    link: "/profile",
    islink: true,
  },
 
  {
    name: "createNft",
    link: "/createNft",
    islink: true,
  },
  {
    name: "<ConnectBtn/>",
    islink: false,
  },
];
