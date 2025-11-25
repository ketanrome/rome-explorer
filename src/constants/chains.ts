import { Chain } from '@rainbow-me/rainbowkit';
import chainsData from '../../chains.yaml';

export type RomeChain = {
  name: string;
  chainId: string;
  rpcUrl: string;
  explorerUrl?: string;
  contracts: {
    uniswapV2Factory: string;
    uniswapV2Router: string;
    weth: string;
    multicall: string;
    erc20Factory: string;
    erc20SplFactory: string;
  };
};

export const L2_CHAINS: RomeChain[] = chainsData as RomeChain[];

export const createCustomChain = (
  chainId: string,
  rpcUrl: string,
  name?: string,
  explorerUrl?: string
): Chain => {
  const chainName = name || `Rome L2_${chainId}`;

  return {
    id: Number(chainId),
    name: chainName,
    nativeCurrency: {
      decimals: 18,
      name: 'Rome',
      symbol: 'rSOL',
    },
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
    blockExplorers: {
      default: { name: `${chainName} Explorer`, url: explorerUrl || '' },
    },
  } as const;
};
