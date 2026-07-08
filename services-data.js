// Rigelwise service content. Plain ES module.
const SERVICES = {
  "strategic-consulting": {
    index: "01", title: "Strategic Consulting", file: "Service-Strategic-Consulting.dc.html",
    tagline: "Where to grow — and whether it holds up.",
    intro: "Before a single euro is committed, we pressure-test the ambition. Market sizing, competitive reality, unit economics and entry sequencing — turned into a decision you can defend to a board.",
    included: [
      { t: "Market assessment", d: "Demand, saturation and the honest size of the opportunity." },
      { t: "Feasibility & modelling", d: "Financial models that show what has to be true to win." },
      { t: "Entry strategy", d: "Which market, which order, which mode of entry." },
      { t: "Risk & regulation map", d: "The obstacles named early, not discovered late." }
    ],
    steps: [
      { t: "Immersion", d: "We learn the business, the numbers and the appetite for risk." },
      { t: "Analysis", d: "Primary and secondary research into the target market." },
      { t: "Modelling", d: "Scenarios, sensitivities and a recommended path." },
      { t: "Decision", d: "A clear go / hold / reshape, with the reasoning attached." }
    ],
    outcomes: [
      { n: "3–6 wk", l: "typical engagement" },
      { n: "1", l: "recommended path, defensible" },
      { n: "0", l: "surprises left for later" }
    ],
    next: "business-setup"
  },
  "business-setup": {
    index: "02", title: "Business Setup", file: "Service-Business-Setup.dc.html",
    tagline: "Entity, licensing and compliant entry.",
    intro: "The unglamorous foundations that everything else stands on. We incorporate, license and register your operation so it is legitimate, tax-efficient and ready to trade from day one.",
    included: [
      { t: "Entity structuring", d: "The right vehicle for tax, liability and control." },
      { t: "Incorporation & registration", d: "Company formation and statutory registrations." },
      { t: "Licensing & permits", d: "Sector approvals secured before you open." },
      { t: "Banking & payroll setup", d: "Accounts, payments and people, ready to run." }
    ],
    steps: [
      { t: "Structure", d: "We design the entity and ownership map." },
      { t: "Incorporate", d: "Formation, filings and registered address." },
      { t: "License", d: "Sector-specific permits and approvals." },
      { t: "Activate", d: "Banking, payroll and systems switched on." }
    ],
    outcomes: [
      { n: "4–8 wk", l: "to trading-ready" },
      { n: "100%", l: "compliant from day one" },
      { n: "1", l: "point of accountability" }
    ],
    next: "brand-ip"
  },
  "brand-ip": {
    index: "03", title: "Brand & IP Management", file: "Service-Brand-IP.dc.html",
    tagline: "Identity, trademarks and protection.",
    intro: "A brand that travels, and the legal armour to keep it yours. We build the identity system and register the marks that protect it across every market you enter.",
    included: [
      { t: "Identity system", d: "Naming, logo, typography and the rules that hold them." },
      { t: "Trademark registration", d: "Marks filed and protected in each jurisdiction." },
      { t: "IP portfolio management", d: "Ongoing stewardship of your intangible assets." },
      { t: "Brand guidelines", d: "A system your teams and partners can apply." }
    ],
    steps: [
      { t: "Discovery", d: "What the brand must mean in a new market." },
      { t: "Design", d: "Identity, voice and the applied system." },
      { t: "Protect", d: "Trademark searches and multi-region filings." },
      { t: "Steward", d: "Renewals, monitoring and enforcement." }
    ],
    outcomes: [
      { n: "6–10 wk", l: "to a launch-ready brand" },
      { n: "EU + UK", l: "trademark coverage" },
      { n: "1", l: "coherent identity everywhere" }
    ],
    next: "digital-presence"
  },
  "digital-presence": {
    index: "04", title: "Digital Presence", file: "Service-Digital-Presence.dc.html",
    tagline: "Websites and platforms that convert.",
    intro: "The digital front door to your new market. We design and build websites, e-commerce and platforms that reflect the brand and turn attention into enquiries and sales.",
    included: [
      { t: "Website & e-commerce", d: "Considered, fast, and built to convert." },
      { t: "Platform development", d: "Booking, portals and custom tools where needed." },
      { t: "SEO & analytics", d: "Findable, measured and continuously improved." },
      { t: "Content & localisation", d: "Language and tone tuned to each market." }
    ],
    steps: [
      { t: "Architecture", d: "Structure, journeys and content model." },
      { t: "Design", d: "Interface and brand expression in digital." },
      { t: "Build", d: "Development, integration and QA." },
      { t: "Optimise", d: "Launch, measure and refine against goals." }
    ],
    outcomes: [
      { n: "8–12 wk", l: "design to launch" },
      { n: "100/100", l: "performance target" },
      { n: "∞", l: "iterated after launch" }
    ],
    next: "marketing"
  },
  "marketing": {
    index: "05", title: "Marketing & Advertising", file: "Service-Marketing.dc.html",
    tagline: "Positioning, campaigns and demand.",
    intro: "Getting the right proposition in front of the right audience. We define positioning and run campaigns across the funnel — measured against pipeline, not vanity metrics.",
    included: [
      { t: "Positioning & messaging", d: "The story that makes you the obvious choice." },
      { t: "Campaign strategy", d: "Channels and budget mapped to the funnel." },
      { t: "Creative & production", d: "Assets that hold to the brand standard." },
      { t: "Performance media", d: "Paid channels managed against real outcomes." }
    ],
    steps: [
      { t: "Position", d: "Sharpen the message for a new audience." },
      { t: "Plan", d: "Channel mix, budget and calendar." },
      { t: "Produce", d: "Creative built to brand and platform." },
      { t: "Perform", d: "Launch, measure, reallocate to what works." }
    ],
    outcomes: [
      { n: "Full", l: "funnel coverage" },
      { n: "Weekly", l: "performance reporting" },
      { n: "ROI", l: "the only metric that matters" }
    ],
    next: "sales"
  },
  "sales": {
    index: "06", title: "Sales", file: "Service-Sales.dc.html",
    tagline: "Pipeline, partnerships and revenue.",
    intro: "Demand becomes revenue only when someone closes it. We build the sales motion — process, partnerships and, where useful, the people — to convert interest into signed business.",
    included: [
      { t: "Sales strategy", d: "The motion, the model and the targets." },
      { t: "Pipeline & CRM", d: "Process and tooling that make forecasting real." },
      { t: "Partnerships & channels", d: "Distributors and partners in-market." },
      { t: "Team enablement", d: "Playbooks, training and hiring support." }
    ],
    steps: [
      { t: "Design", d: "Define the motion and ideal customer." },
      { t: "Equip", d: "CRM, playbooks and materials in place." },
      { t: "Open", d: "First conversations and partnerships." },
      { t: "Scale", d: "Hand over to a running, forecastable team." }
    ],
    outcomes: [
      { n: "Repeatable", l: "sales motion" },
      { n: "In-market", l: "partnerships" },
      { n: "Forecastable", l: "pipeline" }
    ],
    next: "export-import"
  },
  "export-import": {
    index: "07", title: "Export, Import & Customs", file: "Service-Export-Import.dc.html",
    tagline: "Cross-border trade, cleared.",
    intro: "Moving goods across borders without the friction. We handle customs, documentation and duties so your products arrive on time and fully compliant, post-Brexit and beyond.",
    included: [
      { t: "Customs clearance", d: "Declarations handled, delays avoided." },
      { t: "Duties & tariffs", d: "Classification and relief, correctly applied." },
      { t: "Trade documentation", d: "Certificates, origin and licensing." },
      { t: "Compliance advisory", d: "Rules of the road for each corridor." }
    ],
    steps: [
      { t: "Assess", d: "Map goods, corridors and obligations." },
      { t: "Classify", d: "Tariff codes and duty position." },
      { t: "Clear", d: "Declarations and documentation filed." },
      { t: "Monitor", d: "Ongoing compliance as rules change." }
    ],
    outcomes: [
      { n: "UK ⇄ EU", l: "corridors covered" },
      { n: "On-time", l: "clearance" },
      { n: "Zero", l: "compliance gaps" }
    ],
    next: "accountancy"
  },
  "accountancy": {
    index: "08", title: "Accountancy", file: "Service-Accountancy.dc.html",
    tagline: "Books, tax and local compliance.",
    intro: "The financial record-keeping that keeps you legal and informed. We run bookkeeping, tax and reporting to local standards, so the numbers are always current and defensible.",
    included: [
      { t: "Bookkeeping", d: "Accurate, current, audit-ready records." },
      { t: "Tax & VAT", d: "Filings and planning across jurisdictions." },
      { t: "Management accounts", d: "The numbers you actually run on." },
      { t: "Statutory reporting", d: "Year-end and regulatory filings." }
    ],
    steps: [
      { t: "Onboard", d: "Set up ledgers and reporting cadence." },
      { t: "Record", d: "Ongoing bookkeeping and reconciliation." },
      { t: "Report", d: "Management and statutory accounts." },
      { t: "Advise", d: "Tax planning and financial guidance." }
    ],
    outcomes: [
      { n: "Monthly", l: "management accounts" },
      { n: "On-time", l: "every filing" },
      { n: "Local", l: "standards, met" }
    ],
    next: "logistics"
  },
  "logistics": {
    index: "09", title: "Logistics & Warehouse", file: "Service-Logistics.dc.html",
    tagline: "Storage, fulfilment and delivery.",
    intro: "Getting product to customers reliably. We arrange warehousing, fulfilment and last-mile so your operation can promise — and keep — a delivery standard worthy of the brand.",
    included: [
      { t: "Warehousing", d: "Space and handling in-market." },
      { t: "Fulfilment", d: "Pick, pack and dispatch at standard." },
      { t: "Distribution", d: "Carrier management and last-mile." },
      { t: "Inventory systems", d: "Visibility and control over stock." }
    ],
    steps: [
      { t: "Design", d: "Network and fulfilment model." },
      { t: "Set up", d: "Warehousing, systems and carriers." },
      { t: "Run", d: "Daily fulfilment and dispatch." },
      { t: "Optimise", d: "Cost, speed and reliability tuned." }
    ],
    outcomes: [
      { n: "In-market", l: "warehousing" },
      { n: "Next-day", l: "capable fulfilment" },
      { n: "Live", l: "inventory visibility" }
    ],
    next: "events"
  },
  "events": {
    index: "10", title: "Events & Exhibitions", file: "Service-Events.dc.html",
    tagline: "Presence at the moments that matter.",
    intro: "Trade shows, launches and private moments — designed and run end to end. We create the physical presence that builds relationships a website never will.",
    included: [
      { t: "Exhibition stands", d: "Design and build worthy of the brand." },
      { t: "Launch events", d: "Curated moments for the right room." },
      { t: "Logistics & production", d: "Every detail handled on the day." },
      { t: "Follow-up systems", d: "Leads captured and routed to sales." }
    ],
    steps: [
      { t: "Concept", d: "The idea and the guest experience." },
      { t: "Produce", d: "Build, logistics and staffing." },
      { t: "Deliver", d: "Flawless execution on the day." },
      { t: "Convert", d: "Leads captured and followed up." }
    ],
    outcomes: [
      { n: "End-to-end", l: "production" },
      { n: "On-brand", l: "every touchpoint" },
      { n: "Tracked", l: "leads to pipeline" }
    ],
    next: "strategic-consulting"
  }
};
if (typeof window !== "undefined") { window.RW_SERVICES = SERVICES; }
export { SERVICES };
export default SERVICES;
