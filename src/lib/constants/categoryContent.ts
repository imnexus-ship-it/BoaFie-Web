/**
 * Per-category "common services" copy for the category detail pages.
 * Hand-curated, not database-driven — same reasoning as countries.ts:
 * a small maintained list beats building a CMS for content that changes
 * rarely. Keyed by the category slug seeded in 0008_seed_categories.sql.
 */
export const CATEGORY_COMMON_SERVICES: Record<string, string[]> = {
  carpentry: ['Custom furniture', 'Door and window framing', 'Roofing carpentry', 'Cabinet installation', 'Wood repairs'],
  electrical: ['Wiring and rewiring', 'Fault-finding and repairs', 'Socket and switch installation', 'Lighting installation', 'Meter and distribution board work'],
  plumbing: ['Leak repair', 'Pipe installation', 'Drain unclogging', 'Tap and fitting installation', 'Toilet and sink installation'],
  masonry: ['Block laying', 'Foundation work', 'Concrete work', 'Brickwork', 'Boundary walls'],
  welding: ['Metal gates and doors', 'Window burglar-proofing', 'Structural steelwork', 'Fabrication and repairs', 'Handrails and staircases'],
  painting: ['Interior painting', 'Exterior painting', 'Wall preparation and priming', 'Decorative finishes', 'Waterproofing'],
  'pop-plastering': ['Ceiling POP design', 'Wall plastering', 'Cornices and moldings', 'Smooth-finish rendering', 'Crack repair'],
  tiling: ['Floor tiling', 'Wall tiling', 'Bathroom and kitchen tiling', 'Outdoor paving', 'Tile repair and regrouting'],
  mechanics: ['Vehicle diagnostics', 'Engine repair', 'Brake and suspension work', 'Routine servicing', 'Electrical fault repair'],
  'interior-decoration': ['Space planning', 'Furniture sourcing', 'Curtains and soft furnishings', 'Lighting design', 'Full room makeovers'],
  'fashion-tailoring': ['Custom clothing', 'Alterations and repairs', 'Made-to-measure suits and dresses', 'School and work uniforms', 'Traditional wear'],
  'furniture-making': ['Custom furniture builds', 'Kitchen cabinetry', 'Wardrobes and storage', 'Office furniture', 'Furniture restoration'],
  'web-development': ['Business websites', 'E-commerce stores', 'Web applications', 'Website maintenance', 'Landing pages'],
  'graphic-design': ['Logo design', 'Brand identity', 'Print design (flyers, posters)', 'Social media graphics', 'Packaging design'],
  'digital-marketing': ['Social media management', 'Paid ad campaigns', 'SEO', 'Content strategy', 'Email marketing'],
  'writing-editing': ['Copywriting', 'Blog and article writing', 'Editing and proofreading', 'Resume and CV writing', 'Ghostwriting'],
  'video-animation': ['Video editing', 'Motion graphics', '2D/3D animation', 'Event videography', 'Ad and promo videos'],
  'virtual-assistant': ['Admin support', 'Calendar and email management', 'Data entry', 'Customer support', 'Research tasks'],
  'ai-automation': ['Workflow automation', 'Chatbot setup', 'AI tool integration', 'Custom scripts and tooling', 'Data pipeline setup'],
};

export const CATEGORY_SAFETY_TIPS = [
  'Only communicate and pay through BoaFie — never share phone numbers or move the conversation to WhatsApp or another app.',
  'Funds you pay are held in escrow and only released to the professional once you approve the completed work.',
  'Check a professional\'s verification badge, rating, and reviews before hiring.',
  'If something goes wrong, you can raise a dispute directly from the contract — BoaFie reviews it before any money moves.',
];
