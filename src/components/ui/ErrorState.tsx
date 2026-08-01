import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 h-7 w-7 text-red-500" />
      <p className="text-sm text-red-700">{message || "Couldn't load this — check the API is running."}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
