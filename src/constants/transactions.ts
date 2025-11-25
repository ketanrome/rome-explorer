
export interface Transaction {
  hash: `0x${string}`;
  nonce: string; // hex string
  blockHash?: `0x${string}` | null;
  blockNumber?: string | null; // hex string
  transactionIndex?: string | null; // hex string
  from: `0x${string}`;
  to?: `0x${string}` | null;
  value: string; // hex string
  gasPrice?: string; // hex string
  gas: string; // hex string
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  maxFeePerBlobGas?: string;
  input: string; // hex string
  signature?: {
    v: string;
    r: string;
    s: string;
    yParity?: string;
  };
  chainId?: string;
  blobVersionedHashes?: string[];
  transactionType?: number;
}

