import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function VerificationStatusBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge variant="green">
      <ShieldCheck className="h-3 w-3" /> Verified
    </Badge>
  ) : (
    <Badge variant="muted">
      <ShieldAlert className="h-3 w-3" /> Unverified
    </Badge>
  );
}
