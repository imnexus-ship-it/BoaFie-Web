const SECTIONS = [
  {
    title: '1. What BoaFie is',
    body: [
      `BoaFie is a marketplace that connects clients with verified artisans and freelancers in Ghana
      and its diaspora. We provide the platform, identity verification, escrow, and dispute handling —
      we are not a party to the work agreement itself, and we don't employ the workers on the
      platform.`,
    ],
  },
  {
    title: '2. Accounts',
    body: [
      `You must provide accurate information when registering and keep your login credentials
      confidential. You're responsible for activity that happens under your account.`,
      `Artisans and freelancers must complete identity verification (ID, selfie, location, and where
      applicable a trade certificate) before they can be hired. Submitting false identity or
      credential information is grounds for immediate suspension.`,
    ],
  },
  {
    title: '3. Jobs, proposals, and contracts',
    body: [
      `Clients post jobs; workers submit proposals. Accepting a proposal creates a contract between
      the client and worker, with the agreed amount held in escrow by BoaFie.`,
      `Work is tracked in milestones. Funds for a milestone are only released to the worker once the
      client approves it. If a milestone is disputed, either party can raise it for admin review before
      funds move.`,
    ],
  },
  {
    title: '4. Fees',
    body: [
      `BoaFie deducts a commission from the escrowed amount when a milestone is released, calculated
      from your plan tier. The exact rate is shown before you accept a proposal or release a payment —
      there are no hidden fees added afterward.`,
    ],
  },
  {
    title: '5. Prohibited conduct',
    body: [
      `You may not: circumvent escrow by arranging payment outside the platform for work initiated on
      it, submit fraudulent verification documents, post scam or advance-fee job listings, manipulate
      reviews, or harass other users. Job posts are automatically screened for common scam patterns,
      and flagged listings are reviewed by our admin team.`,
    ],
  },
  {
    title: '6. Suspension, bans, and deletion',
    body: [
      `We may suspend or ban an account that violates these terms, with the reason recorded in an
      internal audit log. If you believe an enforcement action was made in error, contact us — every
      account action is logged and reviewable.`,
      `You can delete your own account at any time from Settings, unless you currently have a contract
      in progress (complete or resolve it first, so the other party isn't left without recourse).
      Deleting your account anonymizes your profile and disables login; it does not erase contract or
      transaction history that a counterparty is relying on.`,
    ],
  },
  {
    title: '7. Disputes',
    body: [
      `If a client and worker disagree about a milestone, either party can escalate it to BoaFie for
      review before escrowed funds are released or refunded. We aim to resolve disputes based on the
      evidence submitted by both sides.`,
    ],
  },
  {
    title: '8. Liability',
    body: [
      `BoaFie provides the platform "as is." We vet identity and hold funds in escrow to reduce risk,
      but we don't guarantee the quality of work performed or the conduct of any user, and we aren't
      liable for losses arising from a contract between a client and a worker beyond the funds we
      actually hold in escrow for that contract.`,
    ],
  },
  {
    title: '9. Governing law',
    body: [`These terms are governed by the laws of Ghana.`],
  },
  {
    title: '10. Changes to these terms',
    body: [
      `We may update these terms as the platform evolves. Material changes will be communicated to
      users, and continued use of BoaFie after a change takes effect means you accept the updated
      terms.`,
    ],
  },
  {
    title: '11. Contact',
    body: [`Questions about these terms can be sent to support@boafie.app.`],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <h1 className="font-head text-3xl font-bold text-charcoal">Terms of Service</h1>
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
