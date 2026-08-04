import Link from 'next/link';
import {
  AlertTriangle,
  BadgeCheck,
  Database,
  Flag,
  Gavel,
  Lock,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface Section {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'identity-verification',
    icon: BadgeCheck,
    title: 'Identity verification',
    body: [
      `Before a professional can be hired, we ask for a government ID, a selfie that's matched
      against it, and their location. Artisans in licensed trades can also add a trade certificate.
      Each of these is reviewed by our team, not just auto-approved.`,
      `A "Verified" badge only appears once a professional has cleared enough of these checks to pass
      our trust threshold. If you don't see the badge, treat that as useful information — it means
      part of their verification is still incomplete.`,
    ],
  },
  {
    id: 'payment-protection',
    icon: ShieldCheck,
    title: 'Payment protection',
    body: [
      `You never pay a professional directly. When you accept a proposal, the agreed amount moves into
      BoaFie's escrow — it's set aside, but it isn't handed to the professional yet.`,
      `A small commission is deducted only when money is actually released, and the rate is always
      shown to you beforehand. There are no surprise deductions after the fact.`,
    ],
  },
  {
    id: 'escrow',
    icon: Lock,
    title: 'How escrow works',
    body: [
      `Larger jobs can be broken into milestones. Each milestone holds its own slice of the funds —
      the professional only gets paid for a milestone once you've reviewed the work and approved it.
      If it's not right yet, you can request changes instead of paying.`,
      `For simpler jobs with no milestones, marking the contract complete releases the full amount.
      Either way, the money sits in escrow — untouched — until you say the work is done.`,
    ],
  },
  {
    id: 'review-moderation',
    icon: Star,
    title: 'Review moderation',
    body: [
      `Only a client who actually paid for and completed a contract can leave a review for that job —
      one review per contract. There's no way to buy, fake, or mass-post reviews, because a review has
      to be tied to real, finished, paid-for work.`,
    ],
  },
  {
    id: 'dispute-resolution',
    icon: Gavel,
    title: 'Dispute resolution',
    body: [
      `If something goes wrong — the work doesn't match what was agreed, or communication breaks down
      — either the client or the professional can raise a dispute directly on the contract.`,
      `The moment a dispute is open, that contract is frozen: no milestone can be approved and no funds
      can move until our team reviews it. We look at both sides and either release the escrowed funds
      to the professional or refund them to the client — every decision is logged.`,
    ],
  },
  {
    id: 'fraud-reporting',
    icon: Flag,
    title: 'Fraud reporting',
    body: [
      `Job posts are automatically screened for common scam patterns — like being asked to pay a
      "registration fee" before work starts — and flagged listings go to our team for review.`,
      `Messages are also checked: we block attempts to share phone numbers, emails, or move a
      conversation to WhatsApp or another app, because escrow and dispute protection only cover
      activity that happens on BoaFie. If you spot something that looks like a scam, raise a dispute
      on the relevant contract or email info.boafietechltd@gmail.com and we'll investigate.`,
    ],
  },
  {
    id: 'data-protection',
    icon: Database,
    title: 'Data protection',
    body: [
      `We collect what we need to run the marketplace safely — your profile details, verification
      documents, and transaction history — and nothing is sold to advertisers.`,
      `You can delete your account at any time from Settings (once any in-progress contract is
      resolved). Deleting your account removes your name, contact details, and bio; it keeps
      transaction records the other party in a contract may still rely on, the same way a receipt
      survives after you close a bank account. Full details are in our `,
      `Privacy Policy.`,
    ],
  },
  {
    id: 'community-standards',
    icon: Users,
    title: 'Community standards',
    body: [
      `Represent yourself honestly, communicate respectfully, and do the work you agreed to. Don't
      submit fake verification documents, manipulate reviews, or try to take a job off-platform to
      avoid escrow and fees.`,
      `Accounts that break these standards can be suspended or banned — every enforcement action is
      recorded, and if you think one was made in error you can always reach out.`,
    ],
  },
];

export default function TrustSafetyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <div className="flex items-center gap-2 text-green">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-wide">Trust & Safety</span>
      </div>
      <h1 className="mt-2 font-head text-3xl font-bold text-charcoal">How BoaFie keeps you safe</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        No legal jargon — just a plain explanation of the protections built into every job on BoaFie, from
        verifying who you're hiring to making sure money only moves when work is actually done.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-pill border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal hover:border-green hover:text-green"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 rounded-lg border border-border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-3">
                <section.icon className="h-5 w-5 text-green" />
              </div>
              <h2 className="font-head text-lg font-semibold text-charcoal">{section.title}</h2>
            </div>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-charcoal">
              {section.id === 'data-protection' ? (
                <>
                  <p>{section.body[0]}</p>
                  <p>
                    {section.body[1]}
                    <Link href="/privacy" className="font-medium text-green hover:underline">
                      {section.body[2]}
                    </Link>
                  </p>
                </>
              ) : (
                section.body.map((p, i) => <p key={i}>{p}</p>)
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-lg bg-gradient-to-br from-navy to-green p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-gold-2" />
          <div>
            <p className="font-head text-sm font-semibold">Spotted something suspicious?</p>
            <p className="text-sm text-white/70">Raise a dispute on the contract, or contact us directly.</p>
          </div>
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-gold-2"
        >
          Contact support
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted">
        This page is a plain-language guide, not a legal document. See our{' '}
        <Link href="/terms" className="text-green hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-green hover:underline">
          Privacy Policy
        </Link>{' '}
        for the full legal terms.
      </p>
    </div>
  );
}
