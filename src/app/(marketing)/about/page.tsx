export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <h1 className="font-head text-3xl font-bold text-charcoal">About BoaFie</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-charcoal">
        <p>
          BoaFie exists because hiring skilled help in Ghana too often means rolling the dice — unverified workers,
          no recourse if things go wrong, and no way to know who to trust before money changes hands.
        </p>
        <p>
          We built a marketplace where trust isn't a promise, it's a process: every artisan and freelancer goes
          through identity, selfie, location, and trade-credential verification before they can be hired. Payments
          sit in escrow until milestones are approved. And it works the same whether you're hiring from Accra or
          from London.
        </p>
        <p>
          "Boafie" means "helper" in Twi — it's who we want to be for every client and every worker on the platform.
        </p>
      </div>
    </div>
  );
}
