import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider, http } from 'wagmi'
import { baseSepolia, mainnet } from 'wagmi/chains'

import { ALCHEMY_RPC_URL_ENS, WALLETCONNECT_PROJECT_ID } from '../config/appConfig'
import { ALCHEMY_RPC_URL } from '../config/appConfig'

export const chain = baseSepolia
export const ensChain = mainnet

const projectId = WALLETCONNECT_PROJECT_ID

const metadata = {
  name: 'Micro-Democracies',
  description: 'Connect to Microdemocracies',
  url: 'http://localhost:3000/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const config = defaultWagmiConfig({
  chains: [chain, ensChain],
  projectId,
  metadata,
  transports: {
    [chain.id]: http(ALCHEMY_RPC_URL),
    [ensChain.id]: http(ALCHEMY_RPC_URL_ENS),
  },
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  allowUnsupportedChain: true,
})

const queryClient = new QueryClient()

export const ConnectedWallet = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
