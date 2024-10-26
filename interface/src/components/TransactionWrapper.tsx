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


export default function TransactionWrapper({ address }: { address: Address }) {
  const navigate = useNavigate();

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
    const transactionHash = response.transactionReceipts[0]?.transactionHash as string; 
  
    // Add the new transaction hash to the array
    transactionHashes.push(transactionHash);
  
    // Store the updated array back in localStorage
    localStorage.setItem('transactionHashes', JSON.stringify(transactionHashes));
  
    console.log(localStorage.getItem('transactionHashes'));
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

