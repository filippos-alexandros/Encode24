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

interface TransactionWrapperProps {
  address: Address;
  will: any;
}


export default function TransactionWrapper2({ address, will }: TransactionWrapperProps ) {

    const currentTransactionReceipts = localStorage.getItem('transactionReceipts');



    const contracts = [
        {
          address: "0x7e7f390f90b17e76f38debd111cf7518077c0394",
          abi: willABI,
          functionName: 'checkDeath',
          args: []
          // args: ["0x8354641235243183df6d1fa8d15b46fc1e996eb7", 1, 0, 0, 0, "0x22c0DB4CC9B339E34956A5699E5E95dC0E00c800", 0, 0, "0xAfb89a09D82FBDE58f18Ac6437B3fC81724e4dF6", "none"],
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
