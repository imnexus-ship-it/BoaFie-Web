'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  useCreateArtisanProfile,
  useMyArtisanProfile,
  useUpdateArtisanProfile,
} from '@/lib/api/hooks/useArtisans';
import {
  useCreateFreelancerProfile,
  useMyFreelancerProfile,
  useUpdateFreelancerProfile,
} from '@/lib/api/hooks/useFreelancers';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useGenerateBio } from '@/lib/api/hooks/useAi';

function ArtisanProfileForm() {
  const { data: profile, isLoading } = useMyArtisanProfile();
  const { data: categories } = useCategories();
  const create = useCreateArtisanProfile();
  const update = useUpdateArtisanProfile();
  const generateBio = useGenerateBio();

  const [category, setCategory] = useState('');
  const [years, setYears] = useState('');
  const [rate, setRate] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setCategory(profile.trade_category || '');
      setYears(profile.years_experience ? String(profile.years_experience) : '');
      setRate(profile.hourly_rate_ghs ? String(profile.hourly_rate_ghs) : '');
      setLocation(profile.location_text || '');
      setBio(profile.ai_bio || '');
    }
  }, [profile]);

  if (isLoading) return <PageSpinner />;

  const mutation = profile ? update : create;
  const saved = mutation.isSuccess;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const body = {
          trade_category: category,
          years_experience: years ? Number(years) : undefined,
          hourly_rate_ghs: rate ? Number(rate) : undefined,
          location_text: location || undefined,
          ai_bio: bio || undefined,
        };
        if (profile) update.mutate(body);
        else create.mutate(body as any);
      }}
      className="flex flex-col gap-4"
    >
      <Select label="Trade category" value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select a category…</option>
        {(categories || [])
          .filter((c) => c.type === 'artisan' || c.type === 'both')
          .map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
      </Select>
      <Input label="Years of experience" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      <Input label="Hourly rate (GHS)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Accra, East Legon" />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="artisan-bio" className="text-sm font-medium text-charcoal">
            Bio
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-green"
            loading={generateBio.isPending}
            disabled={!category}
            onClick={() =>
              generateBio.mutate(
                {
                  role: 'artisan',
                  headline: category,
                  years_experience: years ? Number(years) : undefined,
                  location_text: location || undefined,
                },
                { onSuccess: (data) => setBio(data.bio) },
              )
            }
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate with AI
          </Button>
        </div>
        <Textarea
          id="artisan-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="A short introduction clients will see on your profile."
        />
        {generateBio.isError && <p className="mt-1 text-xs text-red-600">{generateBio.error.message}</p>}
      </div>
      {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}
      {saved && <p className="text-sm text-green">Profile saved.</p>}
      <Button type="submit" loading={mutation.isPending}>
        {profile ? 'Save changes' : 'Create profile'}
      </Button>
    </form>
  );
}

function FreelancerProfileForm() {
  const { data: profile, isLoading } = useMyFreelancerProfile();
  const create = useCreateFreelancerProfile();
  const update = useUpdateFreelancerProfile();
  const generateBio = useGenerateBio();

  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [rate, setRate] = useState('');
  const [remote, setRemote] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setTitle(profile.title || '');
      setSkills((profile.skills || []).join(', '));
      setRate(profile.hourly_rate_ghs ? String(profile.hourly_rate_ghs) : '');
      setRemote(!!profile.remote_only);
      setBio(profile.ai_bio || '');
    }
  }, [profile]);

  if (isLoading) return <PageSpinner />;

  const mutation = profile ? update : create;
  const saved = mutation.isSuccess;
  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const body = {
          title,
          skills: skillsList,
          hourly_rate_ghs: rate ? Number(rate) : undefined,
          remote_only: remote,
          ai_bio: bio || undefined,
        };
        if (profile) update.mutate(body);
        else create.mutate(body as any);
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full-stack developer" required />
      <Input label="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, UI design" />
      <Input label="Hourly rate (GHS)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
        Available for remote work only
      </label>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="freelancer-bio" className="text-sm font-medium text-charcoal">
            Bio
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-green"
            loading={generateBio.isPending}
            disabled={!title}
            onClick={() =>
              generateBio.mutate(
                { role: 'freelancer', headline: title, skills: skillsList },
                { onSuccess: (data) => setBio(data.bio) },
              )
            }
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate with AI
          </Button>
        </div>
        <Textarea
          id="freelancer-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="A short introduction clients will see on your profile."
        />
        {generateBio.isError && <p className="mt-1 text-xs text-red-600">{generateBio.error.message}</p>}
      </div>
      {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}
      {saved && <p className="text-sm text-green">Profile saved.</p>}
      <Button type="submit" loading={mutation.isPending}>
        {profile ? 'Save changes' : 'Create profile'}
      </Button>
    </form>
  );
}

export default function WorkerProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 font-head text-2xl font-bold text-charcoal">Your profile</h1>
      <p className="mb-6 text-sm text-muted">
        This is what clients see when they view your public profile.
      </p>
      <Card>
        <CardBody>
          {user?.role === 'artisan' ? <ArtisanProfileForm /> : <FreelancerProfileForm />}
        </CardBody>
      </Card>
    </div>
  );
}
