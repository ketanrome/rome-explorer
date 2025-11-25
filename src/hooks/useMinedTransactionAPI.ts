import { useCallback, useRef } from 'react';
import { L2_CHAINS } from '@/constants/chains';
import { useChainStore } from '@/store/chainStore';
import { Transaction } from '@/constants/transactions';
import { INDEXER_FULL_URL } from '@/constants';

const PAGE_SIZE = 1000;
// Define a type for the transaction cache
type TransactionCache = {
  total: number;
  transactions: Transaction[];
};

export const useMinedTransactionAPI = () => {
  const { chainId } = useChainStore();
  // Cache transactions for the current chainId
  const transactionCache = useRef<{ [chainId: string]: TransactionCache }>({});

  // Fetch and cache transactions for the current chainId
  const fetchAndCacheTransactions = useCallback(async () => {
    if (!chainId) return { total: 0, transactions: [] };
    if (transactionCache.current[chainId]) {
      return transactionCache.current[chainId];
    }

    //const url = `${INDEXER_FULL_URL}/transactions?latest=true&&chain_id=${chainId}&all=true&Limit=50`;
    const url = `${INDEXER_FULL_URL}transactions?latest=true&&chain_id=121214&all=true&Limit=50`;
    
    console.log('Fetching transactions from txn API:', url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      console.log('Fetched transactions data from API:', data);

      const cache: TransactionCache = {
        total: Array.isArray(data) ? data.length : 0,
        transactions: Array.isArray(data) ? data : [],
      };
      
      transactionCache.current[chainId] = cache;
      return cache;
    } catch (error) {
      console.error('API fetch error:', error);
      return { total: 0, transactions: [] };
    }
  }, [chainId]);



async function fetchTransactionfromAPI(): Promise<Transaction[]> {
  try {
    const url = `${INDEXER_FULL_URL}transactions?chain_id=121214&all=true&limit=25&latest=true`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

 
 

  // Mimic the contract's totalTransactions() method
  const totalTransactions = useCallback(async () => {
    const { total } = await fetchAndCacheTransactions();
    console.log('Total transactions from API:', total);
    return total;
  }, [fetchAndCacheTransactions]);

 
  const getTransaction = useCallback(
    async (idx: number) => {
      const { transactions } = await fetchAndCacheTransactions();
      //  console.log('Fetching token symbol for index:', idx);
      return transactions[idx] ?? null;
    },
    [fetchAndCacheTransactions]
  );

  // Mimic the contract's getTransaction(symbol) method
  const getTransactionByHash = useCallback(
    async (hashcode: string) => {
      const { transactions } = await fetchAndCacheTransactions();
      const transaction = transactions.find((t) => t.hash === hashcode);
      return transaction;
    },
    [fetchAndCacheTransactions]
  );

 

  return {
    
    totalTransactions,
    getTransactionByHash,
    getTransaction,
    fetchTransactionfromAPI,
  };
};
