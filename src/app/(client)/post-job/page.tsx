import { JobPostForm } from '@/components/jobs/JobPostForm';

export default function PostJobPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-head text-2xl font-bold text-charcoal">Post a job</h1>
      <p className="mb-6 text-sm text-muted">The more detail you give, the better your proposals will be.</p>
      <JobPostForm />
    </div>
  );
}
