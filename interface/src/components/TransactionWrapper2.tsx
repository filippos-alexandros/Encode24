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
  willABI,
} from '../constants';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'


export default function TransactionWrapper2({ address }: { address: Address }) {

    const currentTransactionReceipts = localStorage.getItem('transactionReceipts');

    const contracts = [
        {
          address: "0x163953ffA8A7E1f60326035bA5a4837D240150C9",
          abi: willABI,
          functionName: 'deployWillContract',
          args: [],
        },
      ] as unknown as ContractFunctionParameters[];
    
      const handleError = (err: TransactionError) => {
        console.error('Transaction error:', err);
      };
    
      const handleSuccess = (response: TransactionResponse) => {}

  

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
