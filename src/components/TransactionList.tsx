import React, { useCallback, useEffect, useState } from 'react';
import { Transaction } from '@/constants/transactions';
import { Tabs } from '@/components/Tabs';
import { useMinedTransactions } from '@/components/Transactions';
import { useChainStore } from "@/store/chainStore";



const BOX_H = 400;

type TransactionType = 'mined' | 'pending'

interface TransactionHook {
  numTransactions: number | null;
  loadedTransactions: Transaction[];
  loadNextTransactions: () => Promise<void>;
  getDisplayTransactions?: (searchQuery: string) => Transaction[];
  fetchTransactionfromAPI: () => Promise<Transaction[]>;

}

interface TransactionTypeConfig {
  label: string;
  useHook: () => TransactionHook;
  emptyStateMessage: string;
}


const TRANSACTION_TYPE_CONFIGS: Record<TransactionType, TransactionTypeConfig> = {
  mined: {
    label: 'Mined',
    useHook: useMinedTransactions,
    emptyStateMessage: 'No transactions available for the selected chain',
  },
  pending: {
    label: 'Pending',
    useHook: useMinedTransactions,// Placeholder hook
    emptyStateMessage: 'No pending transactions available',
  }

};

interface TransactionListProps {
  onSelect: (transaction: Transaction) => void;
  onTabChange?: (transactionType: TransactionType) => void;
  showNativeTab?: boolean; // New prop to control Native tab visibility
}

// Internal component that gets remounted when activeTab changes
function TransactionListContent({
  activeTab,
  onSelect,
  searchQuery,
}: {
  activeTab: TransactionType;
  onSelect: (transaction: Transaction) => void;
  searchQuery: string;
}) {
  const [atBottom, setAtBottom] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const activeConfig = TRANSACTION_TYPE_CONFIGS[activeTab];
  const { chainId } = useChainStore();

  const {
    numTransactions,
    loadedTransactions,
    loadNextTransactions,
    getDisplayTransactions,
    fetchTransactionfromAPI,

  } = activeConfig.useHook();

  const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);
  function fetchData() {
    if (fetchTransactionfromAPI) {
      fetchTransactionfromAPI().then((txs) => {
        console.log('Fetched transactions from API (raw):', txs);
        // Try to map each transaction to expected shape
        const mappedTxs = Array.isArray(txs)
          ? txs.map((tx: any) => {
            const t = tx.Transaction ?? tx;
            return {
              hash: t.hash ?? t.txHash ?? t.id ?? '',
              nonce: t.nonce ?? '',
              blockNumber: t.blockNumber ?? t.block_num ?? '',
              from: t.from ?? t.sender ?? '',
              to: t.to ?? t.recipient ?? '',
              value: t.value ?? t.amount ?? '',
              gas: t.gas ?? '',
              input: t.input ?? '',
              // Add more mappings as needed for Transaction type
            };
          })
          : [];
        setApiTransactions(mappedTxs);
      });
    }
  }


  // Call backend search when searchQuery changes
  useEffect(() => {

    fetchData();
  }, [chainId]);

  useEffect(() => {
    console.log('apiTransactions:', apiTransactions);
    if (apiTransactions.length > 0) {
      console.log('First transaction:', apiTransactions[0]);
      console.log('Transaction keys:', Object.keys(apiTransactions[0]));
    }
  }, [apiTransactions]);

  const handleScroll = useCallback(
    (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = el;

      // Load new transactions when user scrolled 80% of the list
      // This is more natural behavior for web applications
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const shouldLoadMore = scrollPercentage >= 0.8;

      // Set state only if it changed
      if (shouldLoadMore && !atBottom) {
        setAtBottom(true);
      } else if (!shouldLoadMore && atBottom) {
        setAtBottom(false);
      }
    },
    [atBottom]
  );

  const setBoxRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        node.addEventListener('scroll', handleScroll, { passive: true });
      }
    },
    [handleScroll]
  );



  // Show empty state only if both loadedTransactions and apiTransactions are empty
  if (loadedTransactions.length === 0 && apiTransactions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {activeConfig.emptyStateMessage}
      </div>
    );
  }



  return (
    <div ref={setBoxRef} className="max-h-[60vh] overflow-y-auto">
      <table className="w-full text-sm border rounded-lg shadow bg-white">
        <thead>
          <tr>
            <th className="p-2 border sticky top-0 bg-gray-100">Hash</th>
            <th className="p-2 border sticky top-0 bg-gray-100">Nonce</th>
            <th className="p-2 border sticky top-0 bg-gray-100">Block Number</th>
            <th className="p-2 border sticky top-0 bg-gray-100">From</th>
            <th className="p-2 border sticky top-0 bg-gray-100">To</th>
            <th className="p-2 border sticky top-0 bg-gray-100">Value</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {apiTransactions.length === 0 ? null : apiTransactions.map((tx) => (
            <tr key={tx.hash} className="border-b hover:bg-gray-50 cursor-pointer">
              <td className="p-2 border">{tx.hash ?? ''}</td>
              <td className="p-2 border">{tx.nonce ?? ''}</td>
              <td className="p-2 border">{tx.blockNumber ?? ''}</td>
              <td className="p-2 border">{tx.from ?? ''}</td>
              <td className="p-2 border">{tx.to ?? ''}</td>
              <td className="p-2 border">{tx.value ?? ''}</td>
              {/* Add more cells for other fields */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* ...existing indicators... */}
    </div>
  );
}

export function TransactionList({
  onSelect,
  onTabChange,
  showNativeTab = false, // Default to false for backward compatibility
}: TransactionListProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>('mined');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tab options based on showNativeTab prop
  const tabOptions: { label: string; value: TransactionType }[] = Object.entries(
    TRANSACTION_TYPE_CONFIGS
  )
    .filter(([key]) => showNativeTab || key !== 'native') // Only include native if showNativeTab is true
    .map(([key, config]) => ({ label: config.label, value: key as TransactionType }));

  useEffect(() => {
    onTabChange?.(activeTab);
  }, [activeTab, onTabChange]);

  // Reset activeTab if showNativeTab changes and current tab is no longer available
  useEffect(() => {
    if (!showNativeTab && activeTab === 'mined') {
      setActiveTab('mined');
    } else if (
      showNativeTab &&
      !tabOptions.find((tab) => tab.value === activeTab)
    ) {
      setActiveTab('mined');
    }
  }, [showNativeTab, activeTab, tabOptions]);

  const handleTabChange = (newTab: TransactionType) => {
    setActiveTab(newTab);
    // Reset search and scroll state when switching tabs
    //setSearchQuery('');
    onTabChange?.(newTab);
  };

  return (
    <div className="w-full flex flex-col gap-2" style={{ height: BOX_H + 50 }}>
      <Tabs
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-4"
      />

      <TransactionListContent
        key={activeTab}
        activeTab={activeTab}
        onSelect={onSelect}
        searchQuery={searchQuery}
      />
    </div>
  );
}