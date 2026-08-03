'use client';

import { useRef } from 'react';
import { ImageOff, Upload } from 'lucide-react';
import { Button } from './Button';
import { useUploadFile } from '@/lib/api/hooks/useUploads';

export function FileUpload({
  label,
  value,
  onUploaded,
}: {
  label?: string;
  value?: string | null;
  onUploaded: (url: string) => void;
}) {
  const upload = useUploadFile();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      {label && <p className="mb-1.5 block text-sm font-medium text-charcoal">{label}</p>}
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              upload.mutate(file, { onSuccess: (data) => onUploaded(data.url) });
              e.target.value = '';
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {value ? 'Change image' : 'Upload image'}
          </Button>
          {upload.isError && <p className="mt-1 text-xs text-red-600">{upload.error.message}</p>}
        </div>
      </div>
    </div>
  );
}
