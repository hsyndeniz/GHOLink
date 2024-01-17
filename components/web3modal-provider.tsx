import { WagmiConfig, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { mainnet, sepolia, goerli, arbitrum, polygon, polygonMumbai } from 'wagmi/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

const projectId = process.env.NEXT_PUBLIC_WC_ID || 'test-project-id'

const chains = [polygon, polygonMumbai, mainnet, sepolia]

const config = createConfig(
  getDefaultConfig({
    chains,
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: projectId,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

createWeb3Modal({ wagmiConfig: config, projectId, chains })

export function Web3ModalProvider({ children }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}