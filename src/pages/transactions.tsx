import Layout from '@/components/Layout';
import { TransactionList } from '@/components/TransactionList';
import React, { useEffect, useState } from 'react';
import { useChainStore } from '@/store/chainStore';
import { Transaction } from '@/constants/transactions';


type TabType = 'mined' | 'pending';


export default function TokensPage() {

  const [currentTxn, setCurrentTxn] = useState<Transaction | null>(null);

  const { chainId } = useChainStore();


  useEffect(() => {
    if (currentTxn) {
      setCurrentTxn(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <Layout>
      <div className="w-xl flex flex-col mx-auto gap-6">
        {!currentTxn && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-xl flex flex-col mx-auto border border-gray p-8 rounded-2xl text-black bg-white items-center justify-center gap-4">
              <h1 className="text-base mb-4">Transactions</h1>

              <TransactionList
                onSelect={(txn) => setCurrentTxn(txn)}
              />
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
