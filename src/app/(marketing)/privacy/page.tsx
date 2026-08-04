const SECTIONS = [
  {
    title: '1. What this covers',
    body: [
      `This policy explains what BoaFie collects, why, and what you can do about it. It applies to
      everyone who uses the BoaFie platform — clients posting jobs, artisans and freelancers offering
      work, and visitors browsing before signing up.`,
    ],
  },
  {
    title: '2. What we collect',
    body: [
      `Account basics: your name, email, phone number, and password (stored as a salted hash, never
      in plain text).`,
      `Verification data: to earn the verified badge, artisans and freelancers submit a government ID
      (front/back), a selfie for liveness matching, a GPS location, and — where relevant — a trade
      certificate. This is the most sensitive data we hold, and it's used only to verify identity and
      trade credentials, and to review disputed cases. It is never sold or used for advertising.`,
      `Job and contract data: job posts, proposals, messages between clients and workers, milestone
      submissions, and reviews.`,
      `Payment data: escrow transactions, wallet balances, and commission records. BoaFie itself does
      not store full card or mobile-money credentials — those are handled by the payment processor at
      checkout.`,
      `Usage data: device/browser type and basic activity logs (e.g. last active time), used for
      security and abuse prevention.`,
    ],
  },
  {
    title: '3. Why we collect it',
    body: [
      `To operate the marketplace: matching jobs to workers, holding funds in escrow until a milestone
      is approved, and paying out commissions correctly.`,
      `To verify identity and reduce fraud — this is the core trust mechanism the platform is built
      around, not an optional extra.`,
      `To keep the platform safe: detecting scam patterns in job posts, investigating disputes, and
      enforcing account suspensions or bans when necessary.`,
      `To communicate with you about your account, active contracts, and platform updates.`,
    ],
  },
  {
    title: '4. Who we share it with',
    body: [
      `We don't sell personal data. Limited data is shared only where the platform requires it:
      payment processors (to move money for escrow and withdrawals), and — if you're involved in a
      dispute — with our admin team for review.`,
      `We may disclose information if required by law, or to protect the safety of users or the
      platform.`,
    ],
  },
  {
    title: '5. How long we keep it',
    body: [
      `Account and contract data is kept for as long as your account is active, plus a limited period
      afterward for legal, tax, and dispute-resolution purposes.`,
      `Verification documents (ID, selfie) are retained only as long as needed to maintain your
      verified status, or as required by applicable recordkeeping law.`,
    ],
  },
  {
    title: '6. Your rights',
    body: [
      `You can review and update most of your profile information directly from your account
      settings.`,
      `You can delete your account at any time from Settings. This anonymizes your profile (name,
      email, phone, avatar, bio) and disables login immediately. We keep the underlying transaction
      and contract records that other users legitimately rely on (for example, a completed contract
      or an escrow history) — those aren't personal profile data. Deletion is blocked while you have a
      contract in progress, so a counterparty relying on that work or payment isn't left stranded.`,
      `You can ask us questions about your data, or request a copy of it, by contacting us (see
      below).`,
    ],
  },
  {
    title: '7. Security',
    body: [
      `Passwords are hashed, sessions use short-lived access tokens with rotating refresh tokens, and
      access to verification documents and admin actions is logged and restricted to authorized staff.
      No system is perfectly secure, and we continue to invest in this as the platform grows.`,
    ],
  },
  {
    title: '8. Changes to this policy',
    body: [
      `If this policy changes materially, we'll update the effective date below and, where the change
      is significant, notify users directly.`,
    ],
  },
  {
    title: '9. Contact',
    body: [
      `Questions about this policy or your data can be sent to info.boafietechltd@gmail.com.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <h1 className="font-head text-3xl font-bold text-charcoal">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Effective August 1, 2026.</p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-head text-lg font-semibold text-charcoal">{section.title}</h2>
            <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-charcoal">
              {section.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
