import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { bscTestnet,sepolia } from "wagmi/chains";

const metadata = {
  name: "wagmi",
  description: "Binance Smart Chain Testnet Example",
  url: "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const projectId = process.env.NEXT_PUBLIC_KEY || "";
const chains = [bscTestnet,sepolia] as const;

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeMode: "dark", // Can be "light" or "dark"
});




export function Web3Provider(props: any) {
  const [queryClient] = useState(() => new QueryClient());


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
