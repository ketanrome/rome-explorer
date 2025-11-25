import type { FC } from "react";
import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useChainStore } from "@/store/chainStore";

// Use require instead of import since order matters
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { wagmiConfig } = useChainStore();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ToastContainer />
        <Component {...pageProps} />
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;
