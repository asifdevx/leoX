import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const ConnectBtn = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (connector: any) => {
    setIsLoading(true);
    setIsModalOpen(true); // Open modal when connecting
    try {
      await connectAsync({ connector });
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected as: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button
          onClick={() => metaMaskConnector && handleConnect(metaMaskConnector)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue text-black rounded"
        >
          {isLoading ? "Connecting..." : "Connect with MetaMask"}
        </button>
      )}

      {/* Modal Implementation */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-[#31ecf9] p-6">
            <div className="flex flex-col items-center">
              <img
                src="/fm.svg" // Replace with a MetaMask logo URL or import
                alt="MetaMask Logo"
                className="w-16 h-16 mb-4"
              />
              <Dialog.Title className="text-lg font-medium text-gray">
                Continue in MetaMask
              </Dialog.Title>
              <p className="text-gray text-center mt-2">
                Accept connection request in the wallet
              </p>
              <button
                onClick={() => {
                  setIsModalOpen(false); // Allow user to close modal
                }}
                className="mt-4 px-4 py-2 bg-blue text-black rounded"
              >
                Try Again
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ConnectBtn;
