import { useCallback, useEffect, useRef, useState } from "react";
import { useMinedTransactionAPI } from "@/hooks/useMinedTransactionAPI";
import { Transaction } from "@/constants/transactions";
import { useChainStore } from "@/store/chainStore";

const BATCH_SIZE = 10;

export const useMinedTransactions = () => {
    const { chainId } = useChainStore();
    const nextIndexToLoad = useRef<number>(0);
    const [loadedTransactions, setLoadedTransactions] = useState<Transaction[]>([]);
    const { totalTransactions, getTransactionByHash, getTransaction, fetchTransactionfromAPI } = useMinedTransactionAPI();
    //const { getTransactionInfo } = useRomeERC20();
    const [numTransactions, setNumTransactions] = useState<number | null>(null);
    const loading = useRef<boolean>(false);
    const [searchResults, setSearchResults] = useState<Transaction[]>([]);


    const fetchOne = useCallback(
        async (index: number): Promise<Transaction | null> => {
            const transaction = await getTransaction(index);
            console.log('Fetching  transaction :', transaction);
            return transaction;
        },
        [totalTransactions, getTransactionByHash, getTransaction],
    );

    const loadNextTransactions = useCallback(async () => {
        if (loading.current) return;
        loading.current = true;

        const total = await totalTransactions();
        if (!total) {
            loading.current = false;
            return;
        }
        setNumTransactions(total);

        const from = nextIndexToLoad.current;
        const to = Math.min(from + BATCH_SIZE, Number(total));

        const promises: Promise<Transaction | null>[] = [];
        for (let i = from; i < to; i++) promises.push(fetchOne(i));

        const results = (await Promise.all(promises)).filter(
            (x): x is Transaction => x !== null,
        );

        nextIndexToLoad.current = to;
        setLoadedTransactions((prev) => [...prev, ...results]);
        loading.current = false;
    }, [fetchOne, totalTransactions]);


    // Function to get tokens for display
    const getDisplayTransactions = useCallback(
        (searchQuery: string) => {
            if (searchQuery && searchQuery.trim().length >= 2) {
                console.log(
                    `📋 SHOWING BACKEND SEARCH RESULTS: ${searchResults.length} transactions`
                );
                return searchResults;
            } else {
                console.log(
                    `📋 SHOWING ALL LOADED TRANSACTIONS: ${loadedTransactions.length} transactions`
                );
                return loadedTransactions;
            }
        },
        [searchResults, loadedTransactions]
    );



    useEffect(() => {
        if (nextIndexToLoad.current === 0) loadNextTransactions().then();
    }, [loadNextTransactions]);

    useEffect(() => {
        setNumTransactions(0);
        setLoadedTransactions([]);
        nextIndexToLoad.current = 0;
        loadNextTransactions().then();
    }, [chainId, loadNextTransactions]);

    return {
        numTransactions,
        loadedTransactions,
        loadNextTransactions,
        getDisplayTransactions,
        fetchTransactionfromAPI,
    };
};