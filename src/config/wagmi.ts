import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [
    mainnet,
    arbitrum,
  ],

  connectors: [
    injected(),
  ],

  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
})
