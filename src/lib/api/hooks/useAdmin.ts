'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { User, Verification, Job } from '../types';

export interface AdminStats {
  total_users: number;
  total_artisans: number;
  total_freelancers: number;
  open_jobs: number;
  active_contracts: number;
  open_disputes: number;
  total_commission_earned_ghs: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats'),
  });
}

export function useAdminUsers(params: { page?: number; role?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.role) qs.set('role', params.role);
  if (params.status) qs.set('status', params.status);
  const s = qs.toString();
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => api.getPaginated<User[]>(`/admin/users${s ? `?${s}` : ''}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.patch(`/admin/users/${id}/suspend`, { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.patch(`/admin/users/${id}/ban`, { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminReinstateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/reinstate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminPromoteToAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/promote`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export interface AdminVerification extends Verification {
  users: Pick<User, 'id' | 'full_name' | 'email' | 'role'>;
  id_type?: string | null;
  id_number?: string | null;
  id_front_url?: string | null;
  id_back_url?: string | null;
  selfie_url?: string | null;
  trade_cert_url?: string | null;
}

export function useAdminPendingVerifications(page = 1) {
  return useQuery({
    queryKey: ['admin', 'verifications', page],
    queryFn: () => api.getPaginated<AdminVerification[]>(`/admin/verifications?page=${page}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/verifications/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] }),
  });
}

export function useAdminRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.patch(`/admin/verifications/${id}/reject`, { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] }),
  });
}

export function useAdminJobs(params: { page?: number; status?: string; flagged?: boolean } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.status) qs.set('status', params.status);
  if (params.flagged !== undefined) qs.set('flagged', String(params.flagged));
  const s = qs.toString();
  return useQuery({
    queryKey: ['admin', 'jobs', params],
    queryFn: () => api.getPaginated<Job[]>(`/admin/jobs${s ? `?${s}` : ''}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminRemoveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/jobs/${id}/remove`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] }),
  });
}

interface AdminTransaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  commission_amount?: number | null;
  created_at: string;
  user?: Pick<User, 'id' | 'full_name' | 'email'>;
}

export function useAdminTransactions(page = 1) {
  return useQuery({
    queryKey: ['admin', 'transactions', page],
    queryFn: () => api.getPaginated<AdminTransaction[]>(`/admin/transactions?page=${page}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminCommissions() {
  return useQuery({
    queryKey: ['admin', 'commissions'],
    queryFn: () => api.get<{ total_commission_ghs: number; sample_size: number }>('/admin/commissions'),
  });
}

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, unknown>;
  created_at: string;
  admin?: Pick<User, 'id' | 'full_name'>;
}

export function useAdminAuditLog(page = 1) {
  return useQuery({
    queryKey: ['admin', 'audit-log', page],
    queryFn: () => api.getPaginated<AuditLogEntry[]>(`/admin/audit-log?page=${page}`),
    placeholderData: (prev) => prev,
  });
}

export interface AdminDispute {
  id: string;
  contract_id: string;
  raised_by: string;
  against_user: string;
  reason: string;
  description: string;
  status: string;
  resolution_note?: string | null;
  created_at: string;
  contract?: { id: string; title: string };
  raised_by_user?: { id: string; full_name: string };
  against_user_user?: { id: string; full_name: string };
}

export function useAdminDisputes(page = 1) {
  return useQuery({
    queryKey: ['admin', 'disputes', page],
    queryFn: () => api.getPaginated<AdminDispute[]>(`/admin/disputes?page=${page}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, outcome, resolution_note }: { id: string; outcome: string; resolution_note: string }) =>
      api.patch(`/admin/disputes/${id}/resolve`, { outcome, resolution_note }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] }),
  });
}
