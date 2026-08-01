'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { Wallet } from '../types';

export interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  description?: string | null;
  created_at: string;
  commission_rate?: number | null;
  commission_amount?: number | null;
  net_amount?: number | null;
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get<Wallet>('/wallet'),
    retry: false,
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => api.getPaginated<Transaction[]>('/wallet/transactions'),
    retry: false,
  });
}
