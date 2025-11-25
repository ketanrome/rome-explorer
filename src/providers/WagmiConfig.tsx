import { createCustomChain, L2_CHAINS } from "@/constants/chains";
import { injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";

export const createWagmiConfig = (chainId?: string) => {
  const selectedChain =
    L2_CHAINS.find((chain) => chain.chainId === chainId) || L2_CHAINS[0];
  
  const allChains = L2_CHAINS.map(chain => 
    createCustomChain(
      chain.chainId.toString(),
      chain.rpcUrl,
      chain.name,
      chain.explorerUrl
    )
  );

  const primaryChain = allChains.find(chain => 
    chain.id === Number(selectedChain.chainId)
  ) || allChains[0];

  const orderedChains = [
    primaryChain,
    ...allChains.filter(chain => chain.id !== primaryChain.id)
  ];

  const transports = Object.fromEntries(
    orderedChains.map(chain => [chain.id, http(chain.rpcUrls.default.http[0])])
  );

  const connectors = [
    injected({
      target: 'metaMask',
    }),
  ];

  const config = createConfig({
    chains: orderedChains as [typeof primaryChain, ...typeof allChains],
    connectors,
    transports,
    ssr: true,
    multiInjectedProviderDiscovery: false,
  });

  return config;
};
