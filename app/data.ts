export interface ICP {
  id: string;
  name: string;
  role: string;
  companySize: string;
  industry: string;
  ageRange: string;
  painPoints: string[];
  contentPreferences: string[];
}

export interface ToneAttribute {
  positive: string;
  negative: string;
  description: string;
  example: string;
}

export interface Service {
  name: string;
  details: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  website: string;
  status: "Active" | "Onboarding" | "Paused";
  color: string;
  initials: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  pocRole: string;
  renewalDate: string;
  scopeDocumentName: string;
  notes: string;
  icps: ICP[];
  brandPositioning: string;
  toneAttributes: ToneAttribute[];
  onVoiceExamples: string[];
  offVoiceExamples: { text: string; reason: string }[];
  services: Service[];
  differentiators: string[];
  writingRules: string[];
  doNotSay: string[];
  targetKeywords: string[];
  competitorUrls: string[];
  seoNotes: string;
}

export const clients: Client[] = [
  {
    id: "marketwake",
    name: "Marketwake",
    industry: "Digital Marketing Agency",
    website: "https://marketwake.com",
    status: "Active",
    color: "from-blue-500 to-purple-600",
    initials: "MW",
    pocName: "Internal Team",
    pocEmail: "team@marketwake.com",
    pocPhone: "404-555-0100",
    pocRole: "Marketing Director",
    renewalDate: "2026-09-01",
    scopeDocumentName: "Marketwake_2026_Scope.pdf",
    notes: "Internal brand content. Focus on thought leadership and SEO-driven blog content. Q2 priority is launching the AEO playbook series and updating all service pages for AI search optimization.",

    icps: [
      {
        id: "mw-1",
        name: "Business Owner / Founder",
        role: "CEO, Founder, Owner of SMB ($1M-$50M revenue)",
        companySize: "$1M-$50M revenue",
        industry: "B2B services, ecommerce, healthcare, legal, home services, SaaS",
        ageRange: "30-55",
        painPoints: [
          "Wasting budget on agencies that don't deliver measurable results",
          "Don't understand analytics or what metrics actually matter",
          "Need leads and revenue, not impressions and vanity metrics",
          "Burned by previous agency experiences with junior staff",
        ],
        contentPreferences: ["Short blog posts with actionable takeaways", "Email tips and quick wins", "LinkedIn posts with data points", "Case studies showing ROI"],
      },
      {
        id: "mw-2",
        name: "Marketing Director",
        role: "VP/Director of Marketing at mid-market company",
        companySize: "50-500 employees",
        industry: "B2B SaaS, Professional Services",
        ageRange: "30-45",
        painPoints: [
          "Proving ROI to C-suite and justifying marketing spend",
          "Scaling content production without sacrificing quality",
          "Keeping up with algorithm changes and AI search shifts",
          "Managing multiple vendors vs. finding one full-service partner",
        ],
        contentPreferences: ["In-depth guides and benchmark reports", "Case studies with specific metrics", "Webinars and thought leadership", "Industry trend analysis"],
      },
      {
        id: "mw-3",
        name: "CMO / Growth Lead",
        role: "C-suite marketing executive",
        companySize: "100-1,000 employees",
        industry: "Tech, SaaS, Professional Services",
        ageRange: "35-50",
        painPoints: [
          "Aligning marketing strategy with business growth goals",
          "Attribution modeling across complex buyer journeys",
          "Building a scalable marketing engine, not one-off campaigns",
          "Finding an agency partner that thinks strategically, not just executes",
        ],
        contentPreferences: ["Strategic frameworks and playbooks", "Executive summaries and data visualizations", "Podcast appearances and conference content", "Quarterly trend reports"],
      },
    ],

    brandPositioning: "We sit between boutique specialists (great at one thing) and big holding-company agencies (expensive, slow, impersonal). Marketwake offers enterprise-quality strategy with the speed and attention of a focused team.",
    toneAttributes: [
      { positive: "Confident", negative: "arrogant", description: "We know our stuff and prove it with results. Back claims with data, not bravado.", example: "We increased organic traffic 340% in 6 months. Here's exactly how." },
      { positive: "Direct", negative: "blunt", description: "Get to the point without being cold. Respect the reader's time while maintaining warmth.", example: "Most agencies guess. We measure, test, and iterate until the numbers tell the story." },
      { positive: "Smart", negative: "academic", description: "Expertise without jargon overload. Make complex concepts accessible without dumbing them down.", example: "Your website isn't a brochure -- it's your hardest-working salesperson." },
      { positive: "Energetic", negative: "hype-y", description: "Enthusiasm backed by substance. Show genuine excitement about results and possibilities.", example: "We turned a $15K/mo ad budget into $180K in qualified pipeline. That's the kind of math we love." },
      { positive: "Approachable", negative: "casual", description: "Professional but human. Write like a smart colleague, not a textbook or a text message.", example: "Not every business needs paid ads. Here's how to know if you're one of them." },
    ],
    onVoiceExamples: [
      "We increased organic traffic 340% in 6 months. Here's exactly how.",
      "Most agencies guess. We measure, test, and iterate until the numbers tell the story.",
      "Your website isn't a brochure -- it's your hardest-working salesperson.",
      "Not every business needs paid ads -- here's how to know.",
      "We turned a $15K/mo ad budget into $180K in qualified pipeline.",
    ],
    offVoiceExamples: [
      { text: "In today's ever-changing digital landscape...", reason: "Generic filler -- says nothing" },
      { text: "We leverage synergies to optimize your digital footprint", reason: "Jargon soup -- no one talks like this" },
      { text: "HUGE ANNOUNCEMENT!!!!", reason: "Hype without substance" },
      { text: "We're passionate about helping brands succeed", reason: "Empty claim -- show, don't tell" },
      { text: "In the ever-evolving world of digital marketing...", reason: "Filler opening -- lead with insight instead" },
    ],

    services: [
      { name: "SEO & Content Marketing", details: "Technical SEO, content strategy, link building, AEO optimization" },
      { name: "Paid Media (PPC/SEM)", details: "Google Ads, Meta Ads, LinkedIn Ads, programmatic" },
      { name: "Web Design & Development", details: "Custom WordPress, Shopify, performance optimization" },
      { name: "Social Media Marketing", details: "Strategy, content creation, community management" },
      { name: "Email Marketing", details: "Campaign strategy, automation, list management" },
      { name: "Analytics & Reporting", details: "GA4, dashboards, attribution modeling" },
      { name: "Creative Services", details: "Brand identity, graphic design, video production" },
    ],
    differentiators: [
      "Data-driven approach with transparent reporting",
      "Atlanta-based with national client roster",
      "Full-service under one roof (no outsourced piecework)",
      "Senior-level strategists on every account (not junior staff learning on your dime)",
      "Results-focused -- we tie everything back to revenue impact",
    ],

    writingRules: [
      "Lead with insight, not introduction -- skip throat-clearing openers",
      "Every paragraph must earn its place -- no filler",
      "Include data points or specific examples when possible",
      "Use active voice and strong verbs",
      "Write at a 6th-8th grade reading level for accessibility",
      "Use the Oxford comma consistently",
      "No em dashes -- use double hyphens or restructure the sentence",
      "Capitalize only proper nouns and sentence starts in headlines (sentence case)",
    ],
    doNotSay: [
      "In today's digital landscape...",
      "In the ever-evolving world of...",
      "Leverage / synergy / paradigm shift",
      "We're passionate about...",
      "HUGE ANNOUNCEMENT",
      "Cutting-edge / best-in-class / world-class",
      "Holistic approach",
      "One-stop shop",
      "Move the needle",
      "Think outside the box",
    ],

    targetKeywords: ["digital marketing agency atlanta", "SEO services atlanta", "PPC management", "content marketing strategy", "B2B marketing agency", "AEO optimization", "AI search optimization"],
    competitorUrls: ["https://cardinaldigitalmarketing.com", "https://lyfemarketing.com", "https://thrivedigital.com"],
    seoNotes: "Focus on long-tail B2B keywords. Prioritize AEO (Answer Engine Optimization) content for AI search visibility. All blog posts need FAQ schema. Target featured snippets for comparison and how-to queries.",
  },

  {
    id: "peachtree-dental",
    name: "Peachtree Dental",
    industry: "Healthcare / Dental",
    website: "https://peachtreedental.com",
    status: "Active",
    color: "from-teal-400 to-cyan-500",
    initials: "PD",
    pocName: "Dr. Sarah Chen",
    pocEmail: "sarah@peachtreedental.com",
    pocPhone: "404-555-0200",
    pocRole: "Practice Owner",
    renewalDate: "2026-06-15",
    scopeDocumentName: "PeachtreeDental_2026_Scope.pdf",
    notes: "Family dental practice in Buckhead. Primary goal is increasing new patient appointments. Strong local SEO focus. Dr. Chen is very hands-on and reviews all content before publishing. Prefers warm, approachable tone.",

    icps: [
      {
        id: "pd-1",
        name: "Buckhead Parent",
        role: "Parent / Family Decision Maker",
        companySize: "N/A",
        industry: "Residential, Buckhead / Sandy Springs area",
        ageRange: "30-50",
        painPoints: [
          "Finding a dentist the whole family can see",
          "Managing dental anxiety in children",
          "Understanding insurance coverage and out-of-pocket costs",
          "Fitting appointments into a busy family schedule",
        ],
        contentPreferences: ["Social media tips and short videos", "Email appointment reminders", "Blog posts about kids' dental health", "Google Business Profile posts"],
      },
      {
        id: "pd-2",
        name: "Young Professional",
        role: "Career-focused individual, single or couple",
        companySize: "N/A",
        industry: "Tech, finance, consulting in Atlanta",
        ageRange: "25-35",
        painPoints: [
          "Wants a modern, tech-forward dental experience",
          "Interested in cosmetic dentistry (whitening, aligners)",
          "Needs evening or weekend appointment availability",
          "Values online booking and digital communication",
        ],
        contentPreferences: ["Instagram before/after content", "Quick-read blog posts", "Online booking convenience messaging", "Review-driven social proof"],
      },
      {
        id: "pd-3",
        name: "Anxious Patient",
        role: "Adult with dental anxiety or phobia",
        companySize: "N/A",
        industry: "Various",
        ageRange: "25-65",
        painPoints: [
          "Fear of pain or discomfort during procedures",
          "Embarrassment about current dental condition",
          "Previous negative dental experiences",
          "Wants a judgment-free, gentle environment",
        ],
        contentPreferences: ["Reassuring blog content about sedation options", "Patient testimonial videos", "Behind-the-scenes office tour content", "Empathetic email communications"],
      },
      {
        id: "pd-4",
        name: "Senior Patient",
        role: "Retiree or semi-retired individual",
        companySize: "N/A",
        industry: "N/A",
        ageRange: "60+",
        painPoints: [
          "Dental implants and denture options",
          "Medicare/insurance navigation for dental care",
          "Mobility and accessibility concerns",
          "Managing dental health alongside other health conditions",
        ],
        contentPreferences: ["Informational blog posts", "Print-friendly guides", "Phone-based communication", "Community event participation"],
      },
    ],

    brandPositioning: "Buckhead's friendliest family dental practice, combining modern technology with a warm, personal touch. We make every visit comfortable, from your child's first tooth to your best smile yet.",
    toneAttributes: [
      { positive: "Warm", negative: "saccharine", description: "Genuinely caring without being over-the-top sweet. Like a friend who happens to be a great dentist.", example: "Your smile is in good hands. Book your family's checkup today." },
      { positive: "Reassuring", negative: "dismissive", description: "Acknowledge concerns and address them directly. Don't minimize fears.", example: "Nervous about your visit? You're not alone, and we have options to make it comfortable." },
      { positive: "Professional", negative: "clinical", description: "Show expertise without drowning in medical terminology.", example: "Invisalign works by gradually shifting your teeth with clear, custom-fitted aligners." },
    ],
    onVoiceExamples: [
      "Your smile is our passion. Book your family's checkup today and see why Buckhead families trust us.",
      "Nervous about the dentist? We get it. Ask about our comfort options.",
      "Dr. Chen and the team are here to make every visit easy -- for the whole family.",
    ],
    offVoiceExamples: [
      { text: "Utilize our state-of-the-art periodontal intervention methodologies", reason: "Way too clinical -- patients don't talk like this" },
      { text: "FLASH SALE: 50% OFF WHITENING!!!", reason: "Feels spammy, not consistent with a trusted healthcare provider" },
      { text: "We're the best dentist in Atlanta", reason: "Unsubstantiated superlative -- show, don't tell" },
    ],

    services: [
      { name: "General Dentistry", details: "Cleanings, exams, fillings, crowns" },
      { name: "Cosmetic Dentistry", details: "Whitening, veneers, Invisalign" },
      { name: "Pediatric Dentistry", details: "Kids' exams, sealants, fluoride treatments" },
      { name: "Restorative Dentistry", details: "Implants, bridges, dentures" },
      { name: "Emergency Dental Care", details: "Same-day emergency appointments" },
    ],
    differentiators: [
      "Family-friendly practice -- all ages welcome under one roof",
      "Modern technology (digital X-rays, intraoral cameras)",
      "Sedation options for anxious patients",
      "Evening and Saturday appointments available",
      "Buckhead location with easy parking",
    ],

    writingRules: [
      "Use patient-first language (the patient, not the case)",
      "Explain procedures in plain English, not medical jargon",
      "Always include a call to action for booking",
      "Use 'we' and 'our team' to feel personal",
      "Keep blog posts under 800 words",
      "Include location keywords naturally (Buckhead, Atlanta, Sandy Springs)",
    ],
    doNotSay: [
      "Cheap / discount / bargain",
      "Pain / painful / it won't hurt",
      "Drill (say 'procedure' or 'treatment')",
      "State-of-the-art (overused)",
      "Best dentist in Atlanta (unverifiable claim)",
      "You need to... (prescriptive -- use 'we recommend')",
    ],

    targetKeywords: ["dentist buckhead", "family dentist atlanta", "teeth whitening atlanta", "pediatric dentist buckhead", "invisalign atlanta", "emergency dentist buckhead"],
    competitorUrls: ["https://buckheaddentalpartners.com", "https://atlantadentalgroup.com"],
    seoNotes: "Strong local SEO focus. Google Business Profile optimization is critical. Need consistent NAP across all directories. Target 'near me' search variations. All service pages need LocalBusiness schema.",
  },

  {
    id: "cutting-edge-firewood",
    name: "Cutting Edge Firewood",
    industry: "Premium Home Goods / Firewood",
    website: "https://cuttingedgefirewood.com",
    status: "Active",
    color: "from-orange-500 to-red-500",
    initials: "CE",
    pocName: "Michael Harris",
    pocEmail: "michael@cuttingedgefirewood.com",
    pocPhone: "404-555-0300",
    pocRole: "Founder & CEO",
    renewalDate: "2026-11-01",
    scopeDocumentName: "CuttingEdgeFirewood_2026_Scope.pdf",
    notes: "Premium kiln-dried firewood and cooking wood delivery. Luxury positioning. Strong email marketing program. Seasonal demand spikes in fall/winter. E-commerce focus with subscription model. Michael is very involved in content direction.",

    icps: [
      {
        id: "ce-1",
        name: "Luxury Homeowner",
        role: "Homeowner with outdoor living spaces",
        companySize: "Household income $200K+",
        industry: "Residential, upscale neighborhoods",
        ageRange: "35-65",
        painPoints: [
          "Wants a premium fire experience, not gas-station firewood",
          "Hosting guests and wants impressive outdoor ambiance",
          "Tired of smoky, hard-to-light fires",
          "Values convenience -- delivery and stacking service",
        ],
        contentPreferences: ["Beautiful lifestyle photography", "Email offers and seasonal campaigns", "Instagram content", "Blog posts about entertaining"],
      },
      {
        id: "ce-2",
        name: "Restaurant / Hotel Buyer",
        role: "Chef, F&B Director, or Operations Manager",
        companySize: "Single or multi-location hospitality",
        industry: "Restaurants, hotels, event venues",
        ageRange: "30-55",
        painPoints: [
          "Needs consistent, high-quality cooking wood supply",
          "Fire flavor is part of the brand and menu identity",
          "Reliability of delivery on a commercial schedule",
          "Food safety and wood quality certifications",
        ],
        contentPreferences: ["B2B outreach and case studies", "Product spec sheets", "LinkedIn content", "Trade publication features"],
      },
      {
        id: "ce-3",
        name: "Gift Buyer",
        role: "Individual purchasing a premium gift",
        companySize: "N/A",
        industry: "Various",
        ageRange: "28-60",
        painPoints: [
          "Looking for a unique, luxury gift",
          "Wants beautiful packaging and presentation",
          "Needs reliable delivery timing for occasions",
          "Wants a memorable, shareable unboxing experience",
        ],
        contentPreferences: ["Gift guide blog posts", "Holiday email campaigns", "Social media unboxing content", "Google Shopping and product listings"],
      },
    ],

    brandPositioning: "The nation's premier firewood company. We deliver the highest-quality kiln-dried firewood and cooking wood, turning ordinary fires into extraordinary experiences.",
    toneAttributes: [
      { positive: "Premium", negative: "snobby", description: "Communicate luxury and quality without alienating. Aspirational, not exclusive.", example: "Experience the difference kiln-dried firewood makes -- cleaner, hotter, longer-lasting fires." },
      { positive: "Knowledgeable", negative: "preachy", description: "Share wood expertise in a way that educates and elevates the customer.", example: "Oak burns slow and steady. Cherry adds a sweet aroma. Here's how to pick the right wood for your fire." },
      { positive: "Warm", negative: "corny", description: "Fire-related warmth metaphors are okay in moderation. Don't overdo the puns.", example: "There's nothing like gathering around a real fire. We make sure yours is worth gathering for." },
    ],
    onVoiceExamples: [
      "Experience the difference kiln-dried firewood makes -- cleaner, hotter, longer-lasting fires.",
      "Oak burns slow and steady. Cherry adds a sweet aroma. Here's how to pick the right wood.",
      "From our kiln to your fireplace -- premium firewood, delivered.",
    ],
    offVoiceExamples: [
      { text: "Buy our cheap firewood bundles!", reason: "We're premium -- never use 'cheap'" },
      { text: "FIRE SALE! GET IT?!", reason: "Avoid puns in headlines, especially forced ones" },
      { text: "Our wood is better than the competition's", reason: "Don't trash competitors -- elevate our product instead" },
    ],

    services: [
      { name: "Residential Firewood Delivery", details: "Kiln-dried firewood for home fireplaces and fire pits" },
      { name: "Cooking Wood", details: "Restaurant-grade wood for pizza ovens, grills, and smokers" },
      { name: "Firewood Subscriptions", details: "Recurring delivery plans for year-round or seasonal use" },
      { name: "Gift Boxes & Bundles", details: "Curated firewood gift sets with firestarters and accessories" },
      { name: "Commercial Supply", details: "Bulk orders for restaurants, hotels, and event venues" },
    ],
    differentiators: [
      "Kiln-dried to less than 20% moisture (vs. 40-50% for typical firewood)",
      "USDA certified -- no bugs, mold, or fungus",
      "White-glove delivery and stacking service",
      "National delivery (not just local)",
      "Artisan-grade cooking wood trusted by top chefs",
    ],

    writingRules: [
      "Always say 'kiln-dried' when describing our firewood",
      "Use sensory language -- describe the crackle, warmth, aroma",
      "Position as luxury, never budget or utilitarian",
      "Include seasonal hooks in content when relevant",
      "Product descriptions should feel experiential, not transactional",
      "Mention USDA certification when discussing quality",
    ],
    doNotSay: [
      "Cheap / budget / affordable",
      "Just firewood (it's a premium product)",
      "Logs (say 'firewood' or 'cooking wood')",
      "Burn baby burn (or similar cliches)",
      "Competitor names in content",
      "Gas fireplace comparisons (don't disparage other fire types)",
    ],

    targetKeywords: ["kiln dried firewood delivery", "premium firewood", "cooking wood for pizza oven", "firewood subscription", "best firewood delivery", "oak firewood delivery"],
    competitorUrls: ["https://woodchucksplitter.com", "https://firewoodracks.com"],
    seoNotes: "E-commerce SEO is the priority. Product pages need rich schema (Product, Review, FAQ). Target long-tail 'best [wood type] for [use case]' keywords. Blog content supports top-of-funnel seasonal searches. Google Shopping feed optimization critical for gift buyers.",
  },

  {
    id: "southstack",
    name: "SouthStack",
    industry: "B2B SaaS / Project Management",
    website: "https://southstack.io",
    status: "Onboarding",
    color: "from-violet-500 to-indigo-600",
    initials: "SS",
    pocName: "Marcus Johnson",
    pocEmail: "marcus@southstack.io",
    pocPhone: "404-555-0400",
    pocRole: "CEO & Co-founder",
    renewalDate: "2027-03-15",
    scopeDocumentName: "SouthStack_2026_Scope.pdf",
    notes: "B2B project management SaaS. Just signed, onboarding in progress. Currently defining brand voice and content strategy. Marcus wants to position against Monday.com and Asana with a focus on engineering teams. Product-led growth model.",

    icps: [
      {
        id: "ss-1",
        name: "Engineering Manager",
        role: "Engineering Manager / Team Lead at mid-market SaaS",
        companySize: "50-500 employees",
        industry: "Software, Technology",
        ageRange: "28-42",
        painPoints: [
          "Existing PM tools are designed for PMs, not engineers",
          "Too much context-switching between tools",
          "Sprint planning feels like busywork",
          "Need better visibility into team capacity and velocity",
        ],
        contentPreferences: ["Technical blog posts", "Product comparison guides", "Developer community content (Reddit, HN)", "GitHub integrations documentation"],
      },
      {
        id: "ss-2",
        name: "VP of Engineering",
        role: "VP/SVP of Engineering at growth-stage company",
        companySize: "100-1,000 employees",
        industry: "SaaS, Fintech, Healthtech",
        ageRange: "35-50",
        painPoints: [
          "Scaling engineering processes across multiple teams",
          "Justifying tool consolidation to the CFO",
          "Need enterprise-grade security and compliance",
          "Want data-driven engineering metrics (DORA, cycle time)",
        ],
        contentPreferences: ["Whitepapers and benchmark reports", "Case studies from similar-sized companies", "Webinars with engineering leaders", "ROI calculators and comparison tools"],
      },
    ],

    brandPositioning: "The project management tool built for engineering teams. SouthStack understands how engineers actually work -- fewer meetings, better async collaboration, and metrics that matter.",
    toneAttributes: [
      { positive: "Technical", negative: "jargon-heavy", description: "Speak the language of engineers without being inaccessible to non-technical buyers.", example: "SouthStack integrates with your CI/CD pipeline so deployments update tickets automatically." },
      { positive: "Opinionated", negative: "preachy", description: "Have strong points of view about how engineering teams should work. Back it up.", example: "Sprint planning shouldn't take two hours. Here's how we cut it to 15 minutes." },
    ],
    onVoiceExamples: [
      "Built for engineers, not project managers who manage engineers.",
      "Your CI/CD pipeline already knows what shipped. SouthStack listens.",
    ],
    offVoiceExamples: [
      { text: "SouthStack empowers teams to achieve synergistic outcomes", reason: "Corporate jargon -- engineers will close the tab immediately" },
      { text: "The #1 project management tool", reason: "Unverifiable claim, and engineers are skeptical of superlatives" },
    ],

    services: [
      { name: "Core Platform", details: "Sprint planning, kanban boards, backlog management" },
      { name: "Engineering Metrics", details: "DORA metrics, cycle time, deployment frequency dashboards" },
      { name: "CI/CD Integrations", details: "GitHub, GitLab, Bitbucket, Jenkins auto-sync" },
    ],
    differentiators: [
      "Built specifically for engineering workflows (not generic PM)",
      "Deep CI/CD integration -- tickets update automatically from commits and deploys",
      "DORA metrics built in, not bolted on",
      "Async-first design -- fewer meetings, better documentation",
    ],

    writingRules: [
      "Use code examples and technical references when relevant",
      "Write for a technical audience first, then make it accessible",
      "Be specific about features -- no vague 'powerful' or 'flexible'",
      "Include benchmarks and data when making claims",
    ],
    doNotSay: [
      "Empower / enable / unlock potential",
      "Best-in-class / world-class / cutting-edge",
      "Synergy / holistic / paradigm",
      "Easy to use (show it instead)",
      "We're like [competitor] but better",
    ],

    targetKeywords: ["project management for engineers", "engineering team tools", "sprint planning software", "DORA metrics dashboard", "developer project management"],
    competitorUrls: ["https://monday.com", "https://asana.com", "https://linear.app", "https://shortcut.com"],
    seoNotes: "Onboarding -- SEO strategy TBD. Initial focus should be product-led content targeting engineering-specific pain points. Comparison pages (SouthStack vs. Linear, vs. Jira, vs. Asana) are high priority for bottom-funnel capture.",
  },
];
