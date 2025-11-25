import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { L2_CHAINS } from "@/constants/chains";
import { useChainStore } from "@/store/chainStore";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
//mport { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { toast } from "react-toastify";
//import { createWagmiConfig } from "@/providers/WagmiConfig";
//import { clearRainbowKitCache } from "@/utils/wallet";

interface ChainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChainModal = ({ isOpen, onClose }: ChainModalProps) => {
  const { selectedChainId, setSelectedChainId, setChain, setWagmiConfig } =
    useChainStore();
  // const { isConnected } = useAccount();
  //const { disconnect } = useDisconnect();
  // const { switchChain } = useSwitchChain();

  const handleChainSelect = async (chainId: string) => {
    const chain = L2_CHAINS.find((chain) => chain.chainId === chainId);
    if (chain) {
      try {
        // Update chain selection
        setSelectedChainId(chainId);
        setChain(chain.chainId);

        // Update wagmi config with new chain
        // setWagmiConfig(createWagmiConfig(chain.chainId));

        // If wallet is connected, try to switch 

        // if (isConnected) {
        //   try {
        //     await switchChain({ chainId: Number(chain.chainId) });
        //   } catch (error) {
        //     console.error("Failed to switch chain:", error);
        //     // If chain switch fails, disconnect to force reconnection
        //     disconnect();
        //   }
        // }


        // Clear RainbowKit cache
        // clearRainbowKitCache();
      } catch (error) {
        console.error("Failed to update chain:", error);
        toast.error("Failed to switch chain. Please try again.");
      }
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Select Chain
                </Dialog.Title>
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                    {L2_CHAINS.map((chain) => (
                      <button
                        key={chain.chainId}
                        type="button"
                        className={clsx(
                          "flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium",
                          selectedChainId === chain.chainId
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => handleChainSelect(chain.chainId)}
                      >
                        <div className="flex flex-col items-start">
                          <span>{chain.name}</span>
                          <span className="text-xs text-gray-500">Chain ID: {chain.chainId}</span>
                        </div>
                        {selectedChainId === chain.chainId && (
                          <CheckIcon className="h-5 w-5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
