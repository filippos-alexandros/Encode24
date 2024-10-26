'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import type { Address, ContractFunctionParameters } from 'viem';
import {
  BASE_SEPOLIA_CHAIN_ID,
  mintABI,
  mintContractAddress,
} from '../constants';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'


export default function TransactionWrapper({ address }: { address: Address }) {
  const navigate = useNavigate();
  let eventArgs; 

  const contracts = [
    {
      address: "0x163953ffA8A7E1f60326035bA5a4837D240150C9",
      abi: mintABI,
      functionName: 'deployWillContract',
      args: [],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);

    // Get the existing transactionHashes array from localStorage, or initialize an empty array
    const currentHashes = localStorage.getItem('transactionHashes');
    let transactionHashes: string[] = currentHashes ? JSON.parse(currentHashes) : [];
    // Type assertion to ensure response has the expected structure
    let transactionHash = response.transactionReceipts[0]?.transactionHash as string; 
    // Add the new transaction hash to the array
    transactionHashes.push(transactionHash);
    // Store the updated array back in localStorage
    localStorage.setItem('transactionHashes', JSON.stringify(transactionHashes));
    console.log(localStorage.getItem('transactionHashes'));

    function getLatestTransactionHash() {
      const currentHashes = localStorage.getItem('transactionHashes');
  
      if (currentHashes) {
        const transactionHashes = JSON.parse(currentHashes) as string[];
        return transactionHashes[transactionHashes.length - 1]; 
      } else {
        return ; ''// Or an appropriate default value if no hashes are found
      }
    }

    function getTransactionReceipt(
      ethersProvider: ethers.providers.Provider,
      transactionHash: string,
      callback: (receipt: ethers.providers.TransactionReceipt | null) => void
    ) {
      ethersProvider
        .getTransactionReceipt(transactionHash)
        .then((receipt) => {
          console.log('-----')
          console.log('-----')
          console.log(receipt)
          console.log('-----')
          console.log('-----')
          callback(receipt);
        })
        .catch((error) => {
          console.error("Error getting transaction receipt:", error);
          callback(null); // Or handle the error in a way that makes sense for your application
        });
    }

    const ethersProvider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org'); 

    if (transactionHash) {
      getTransactionReceipt(ethersProvider, transactionHash, (receipt) => {
        if (receipt) {
          // Use the transaction receipt here
          console.log("Transaction receipt:", receipt);
        } else {
          // Handle the case where the receipt was not found or there was an error
          console.error("Transaction receipt not found.");
        }
      });
    }





    navigate('/add-smart-contract'); 


  };

  return (
    <div className="flex w-[450px]">
      <Transaction
        contracts={contracts}
        className="w-[450px]"
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}

