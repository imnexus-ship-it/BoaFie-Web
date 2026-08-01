'use client';

import { useState } from 'react';
import { Image as ImageIcon, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  useCreatePortfolioItem,
  useDeletePortfolioItem,
  useMyPortfolio,
  useToggleFeaturedPortfolioItem,
} from '@/lib/api/hooks/usePortfolio';

export default function PortfolioPage() {
  const { data, isLoading, isError, error, refetch } = useMyPortfolio();
  const create = useCreatePortfolioItem();
  const remove = useDeletePortfolioItem();
  const toggleFeatured = useToggleFeaturedPortfolioItem();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-charcoal">Portfolio</h1>
          <p className="text-sm text-muted">Show clients your best work — before/after photos help most.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add item</Button>
      </div>

      {(data || []).length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No portfolio items yet"
          description="Add photos of past jobs to build trust with clients."
          action={<Button onClick={() => setOpen(true)}>Add your first item</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((item) => (
            <Card key={item.id}>
              {item.media_urls?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.media_urls[0]} alt={item.title} className="h-40 w-full rounded-t-lg object-cover" />
              )}
              <CardBody>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-head text-sm font-semibold text-charcoal">{item.title}</p>
                  <button
                    onClick={() => toggleFeatured.mutate(item.id)}
                    title={item.is_featured ? 'Unfeature' : 'Feature'}
                  >
                    <Star className={item.is_featured ? 'h-4 w-4 fill-gold-2 text-gold-2' : 'h-4 w-4 text-muted'} />
                  </button>
                </div>
                {item.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{item.description}</p>}
                <button
                  onClick={() => remove.mutate(item.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add portfolio item">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate(
              { title, description, media_urls: mediaUrl ? [mediaUrl] : [] },
              {
                onSuccess: () => {
                  setOpen(false);
                  setTitle('');
                  setDescription('');
                  setMediaUrl('');
                },
              },
            );
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input
            label="Photo URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://…"
          />
          <p className="text-xs text-muted">
            Paste an image URL for now — direct upload wires up once /uploads/image is connected client-side.
          </p>
          {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
          <Button type="submit" loading={create.isPending}>
            Add item
          </Button>
        </form>
      </Modal>
    </div>
  );
}
