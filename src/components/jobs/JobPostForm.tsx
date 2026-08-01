'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useCreateJob } from '@/lib/api/hooks/useJobs';

export function JobPostForm() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createJob = useCreateJob();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location_text: '',
    budget_min_ghs: '',
    budget_max_ghs: '',
    budget_type: 'fixed' as 'fixed' | 'hourly' | 'daily',
    urgency: 'normal' as 'emergency' | 'urgent' | 'normal',
    is_diaspora_job: false,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createJob.mutate(
          {
            title: form.title,
            description: form.description,
            category: form.category,
            location_text: form.location_text || undefined,
            budget_min_ghs: form.budget_min_ghs ? Number(form.budget_min_ghs) : undefined,
            budget_max_ghs: form.budget_max_ghs ? Number(form.budget_max_ghs) : undefined,
            budget_type: form.budget_type,
            urgency: form.urgency,
            is_diaspora_job: form.is_diaspora_job,
          },
          { onSuccess: (job) => router.push(`/jobs/${job.id}`) },
        );
      }}
      className="flex flex-col gap-5"
    >
      <Input
        label="Job title"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="e.g. Kitchen cabinet installation"
      />
      <Textarea
        label="Description"
        required
        rows={5}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Describe the work, scope, and what a great applicant looks like."
      />
      <Select
        label="Category"
        required
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select a category</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input
        label="Location"
        value={form.location_text}
        onChange={(e) => setForm({ ...form, location_text: e.target.value })}
        placeholder="e.g. East Legon, Accra"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Budget min (GHS)"
          type="number"
          value={form.budget_min_ghs}
          onChange={(e) => setForm({ ...form, budget_min_ghs: e.target.value })}
        />
        <Input
          label="Budget max (GHS)"
          type="number"
          value={form.budget_max_ghs}
          onChange={(e) => setForm({ ...form, budget_max_ghs: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Budget type"
          value={form.budget_type}
          onChange={(e) => setForm({ ...form, budget_type: e.target.value as typeof form.budget_type })}
        >
          <option value="fixed">Fixed price</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily rate</option>
        </Select>
        <Select
          label="Urgency"
          value={form.urgency}
          onChange={(e) => setForm({ ...form, urgency: e.target.value as typeof form.urgency })}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={form.is_diaspora_job}
          onChange={(e) => setForm({ ...form, is_diaspora_job: e.target.checked })}
          className="h-4 w-4 rounded border-border text-green focus:ring-green"
        />
        I'm hiring remotely from abroad (diaspora job)
      </label>

      {createJob.isError && <p className="text-sm text-red-600">{createJob.error.message}</p>}
      <Button type="submit" loading={createJob.isPending} className="w-full">
        Post job
      </Button>
    </form>
  );
}
