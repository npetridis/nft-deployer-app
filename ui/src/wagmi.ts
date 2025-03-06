// import { http, createConfig } from "wagmi";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  sepolia,
  base,
} from "wagmi/chains";

// export const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// });

export const config = getDefaultConfig({
  appName: "My Web3 auth App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, sepolia, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
