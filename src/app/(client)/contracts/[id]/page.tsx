'use client';

import { ContractDetail } from '@/components/contracts/ContractDetail';

export default function ClientContractDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ContractDetail contractId={id} />;
}
