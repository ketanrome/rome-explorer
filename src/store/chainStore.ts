import { create } from "zustand";
import { L2_CHAINS } from "@/constants/chains";
import { Config } from "wagmi";
import { createWagmiConfig } from "@/providers/WagmiConfig";
//import { clearRainbowKitCache } from "@/utils/wallet";

interface ChainState {
  selectedChainId: string;
  setSelectedChainId: (chainId: string) => void;

  chainId: string;
  setChain: (chainId: string) => void;
  resetChain: () => void;

  // Chain synchronization state
  isChainReady: boolean;
  setChainReady: (ready: boolean) => void;
  isSwitchingChain: boolean;
  setIsSwitchingChain: (switching: boolean) => void;

  wagmiConfig: Config;
  setWagmiConfig: (wagmiConfig: Config) => void;
}

export const useChainStore = create<ChainState>((set) => ({
  selectedChainId: L2_CHAINS[0].chainId,
  chainId: L2_CHAINS[0].chainId,

  setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
  setChain: (chainId) => {
    set({ chainId });
    // Clear cache when changing chains
  //  clearRainbowKitCache();
  },
  resetChain: () => {
    set({
      chainId: L2_CHAINS[0].chainId,
    });
    // Clear cache when resetting chain
   // clearRainbowKitCache();
  },

  // Chain synchronization state
  isChainReady: true, // Initially ready
  setChainReady: (ready) => set({ isChainReady: ready }),
  isSwitchingChain: false,
  setIsSwitchingChain: (switching) => set({ isSwitchingChain: switching }),

  wagmiConfig: createWagmiConfig(L2_CHAINS[0].chainId),
  setWagmiConfig: (wagmiConfig) => set({ wagmiConfig }),
}));
