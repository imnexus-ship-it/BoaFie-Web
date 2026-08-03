'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useCreateArtisanProfile } from '@/lib/api/hooks/useArtisans';
import { useCreateFreelancerProfile } from '@/lib/api/hooks/useFreelancers';

export function ProfessionalInfoStep({
  role,
  onDone,
}: {
  role: 'artisan' | 'freelancer';
  onDone: () => void;
}) {
  const { data: categories } = useCategories();
  const createArtisan = useCreateArtisanProfile();
  const createFreelancer = useCreateFreelancerProfile();
  const mutation = role === 'artisan' ? createArtisan : createFreelancer;

  const [category, setCategory] = useState('');
  const [years, setYears] = useState('');
  const [skills, setSkills] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mb-1 font-head text-lg font-semibold text-charcoal">Tell us about your work</h2>
        <p className="text-sm text-muted">
          You can add pricing, portfolio, and verification documents right after this — no rush.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
          if (role === 'artisan') {
            createArtisan.mutate(
              { trade_category: category, trade_subcategories: skillsList, years_experience: years ? Number(years) : undefined },
              { onSuccess: onDone },
            );
          } else {
            createFreelancer.mutate(
              { title: category, skills: skillsList },
              { onSuccess: onDone },
            );
          }
        }}
        className="flex flex-col gap-4"
      >
        {role === 'artisan' ? (
          <Select label="Primary trade category" required value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category…</option>
            {(categories || [])
              .filter((c) => c.type === 'artisan' || c.type === 'both')
              .map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </Select>
        ) : (
          <Input
            label="Professional title"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Web Developer, Graphic Designer"
          />
        )}

        {role === 'artisan' && (
          <Input label="Years of experience" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        )}

        <Input
          label={role === 'artisan' ? 'Specific skills (comma-separated)' : 'Skills (comma-separated)'}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder={role === 'artisan' ? 'Tiling, roofing, welding' : 'React, Node.js, UI design'}
        />

        {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}
        <Button type="submit" loading={mutation.isPending} className="w-full">
          Finish sign up
        </Button>
      </form>
    </div>
  );
}
