'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Wallet } from '../types';

export type WithdrawMethod = 'mtn_momo' | 'telecel_cash' | 'airteltigo' | 'bank_transfer';

export interface WithdrawInput {
  amount_ghs: number;
  method: WithdrawMethod;
  account_number: string;
  account_name: string;
}

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

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: WithdrawInput) => api.post<Transaction>('/wallet/withdraw', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}
