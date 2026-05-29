import type { Question } from "./types";

/**
 * Static question bank for Services Marketing (Chapters 4, 7, 8, 10, 11).
 *
 * Every question is tagged with a topic, chapter, difficulty and type, and
 * carries a concise explanation. The exam engine samples 30 questions per
 * attempt; the AI generator can extend this set at runtime when configured.
 *
 * Difficulty guide:
 *  - easy:   definitions & core concepts
 *  - medium: understanding, application & comparison
 *  - hard:   analysis, scenarios & easily-confused concepts
 */
export const QUESTION_BANK: Question[] = [
  // ──────────────────────────── Chapter 4 ────────────────────────────
  // Flower of Service
  {
    id: "fos-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "In the Flower of Service model, what does the centre of the flower represent?",
    options: ["The core product", "A facilitating service", "An enhancing service", "The brand logo"],
    correctIndex: 0,
    explanation:
      "The centre of the flower is the core product; the petals around it are the supplementary services (facilitating and enhancing).",
  },
  {
    id: "fos-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "The Flower of Service has eight supplementary-service petals surrounding the core product.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "There are eight petals: four facilitating (Information, Order-Taking, Billing, Payment) and four enhancing (Consultation, Hospitality, Safekeeping, Exceptions).",
  },
  {
    id: "fos-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "A petal that is poorly designed or badly delivered is best described as:",
    options: ["A wilted petal that hurts perceptions of the whole flower", "An irrelevant element", "A core product failure", "A pricing problem"],
    correctIndex: 0,
    explanation:
      "Lovelock likens a badly executed supplementary service to a wilted or poorly attached petal, spoiling the impression of the entire flower even if the core is good.",
  },
  {
    id: "fos-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "An airline's flights are punctual, but its website gives confusing fare information, check-in is slow, and bills contain errors. Using the Flower of Service, the airline's main weakness is in its:",
    options: ["Facilitating supplementary services", "Core product", "Enhancing supplementary services", "Brand architecture"],
    correctIndex: 0,
    explanation:
      "Information, Order-Taking/check-in and Billing are all facilitating petals. The core product (the flight) is fine; the facilitating services are failing.",
  },

  // Facilitating Services
  {
    id: "fac-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Which of the following is a FACILITATING supplementary service?",
    options: ["Billing", "Hospitality", "Consultation", "Safekeeping"],
    correctIndex: 0,
    explanation:
      "Facilitating petals are Information, Order-Taking, Billing, and Payment. Hospitality, Consultation and Safekeeping are enhancing.",
  },
  {
    id: "fac-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Facilitating supplementary services are needed for service delivery or aid in the use of the core product.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "By definition facilitating services are required to deliver the core service or to help customers use it.",
  },
  {
    id: "fac-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Reservations, applications and check-in all belong to which facilitating petal?",
    options: ["Order-Taking", "Information", "Billing", "Payment"],
    correctIndex: 0,
    explanation:
      "Order-Taking covers applications, order entry and reservations/check-in once a customer is ready to buy.",
  },
  {
    id: "fac-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "A clear, accurate, on-time monthly statement that customers can verify relates to which petal, and why is it sensitive?",
    options: [
      "Billing — inaccurate or unclear bills directly anger customers and erode trust",
      "Payment — it concerns how funds are transferred",
      "Information — it only tells customers the hours",
      "Exceptions — it handles special requests",
    ],
    correctIndex: 0,
    explanation:
      "Billing must be clear, accurate and timely; customers frequently scrutinise bills, so errors here strongly damage satisfaction.",
  },

  // Enhancing Services
  {
    id: "enh-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Which is an ENHANCING supplementary service?",
    options: ["Hospitality", "Billing", "Payment", "Order-Taking"],
    correctIndex: 0,
    explanation:
      "Enhancing petals are Consultation, Hospitality, Safekeeping and Exceptions; they add value beyond what is strictly required.",
  },
  {
    id: "enh-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Looking after customers' children, parking their cars and storing their luggage are examples of which enhancing petal?",
    options: ["Safekeeping", "Hospitality", "Consultation", "Exceptions"],
    correctIndex: 0,
    explanation:
      "Safekeeping covers caring for customers' possessions (parking, baggage, storage, valet) while they use the core service.",
  },
  {
    id: "enh-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Handling complaints, special requests, and problem solving falls under which enhancing petal?",
    options: ["Exceptions", "Consultation", "Hospitality", "Safekeeping"],
    correctIndex: 0,
    explanation:
      "Exceptions are supplementary services outside the normal routine — special requests, problem solving, complaint/compliment handling and restitution.",
  },
  {
    id: "enh-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "A financial adviser offers tailored advice and tutoring to help a client choose products. This is which petal — and how does it differ from mere Information?",
    options: [
      "Consultation — it involves dialogue and advice tailored to needs, not just facts",
      "Information — it is simply a list of product facts",
      "Hospitality — it concerns making the customer comfortable",
      "Exceptions — it handles unusual requests",
    ],
    correctIndex: 0,
    explanation:
      "Consultation involves a dialogue to probe needs and give tailored advice/counseling, whereas Information just supplies one-way facts.",
  },

  // ──────────────────────────── Chapter 7 ────────────────────────────
  // Branding Alternatives
  {
    id: "brand-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "branding-alternatives",
    prompt: "A single master brand used across all of a company's products (e.g. Virgin) is called a:",
    options: ["Branded House", "House of Brands", "Endorsed brand", "Sub-brand"],
    correctIndex: 0,
    explanation:
      "A Branded House applies one corporate brand to all offerings; a House of Brands uses separate, independent brands.",
  },
  {
    id: "brand-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "branding-alternatives",
    prompt: "'Courtyard by Marriott' is an example of which branding strategy?",
    options: ["Endorsed brand", "Branded House", "House of Brands", "Generic brand"],
    correctIndex: 0,
    explanation:
      "In an endorsed brand the product brand is primary but is backed (endorsed) by the corporate brand, as in 'Courtyard by Marriott'.",
  },
  {
    id: "brand-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 7,
    topic: "branding-alternatives",
    prompt: "P&G markets Tide, Ariel and Gillette as separate, seemingly unrelated brands. Which strategy is this, and what is its main advantage over a Branded House?",
    options: [
      "House of Brands — it isolates each brand's risk and lets each target a distinct segment",
      "Branded House — it maximises corporate brand equity transfer",
      "Sub-brands — it ties products tightly to one master brand",
      "Endorsed brands — the corporate name reassures buyers of each product",
    ],
    correctIndex: 0,
    explanation:
      "A House of Brands keeps brands independent, so problems with one do not damage others and each can be precisely positioned — unlike a Branded House where all share one identity.",
  },

  // New Service Development
  {
    id: "nsd-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "new-service-development",
    prompt: "Which represents the LOWEST level of service innovation?",
    options: ["Style changes", "Major service innovation", "Major process innovation", "Product line extension"],
    correctIndex: 0,
    explanation:
      "Style changes (e.g. new décor or uniforms) are the most modest innovations; major service/process innovations are the most radical.",
  },
  {
    id: "nsd-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "new-service-development",
    prompt: "Why is making a new service concept tangible (via blueprints and physical evidence) especially important in new service development?",
    options: [
      "Services are intangible, so tangibility helps test and communicate the concept and reduces failure",
      "It eliminates the need for market research",
      "It guarantees the service will be profitable",
      "It removes the role of frontline employees",
    ],
    correctIndex: 0,
    explanation:
      "Because services are intangible, blueprints and physical evidence let firms visualise, test and refine new concepts before launch, lowering failure risk.",
  },
  {
    id: "nsd-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "new-service-development",
    prompt: "A bank lets existing current-account holders open a savings account through the same app with no new process. On the innovation hierarchy this is best classified as a:",
    options: ["Product line extension", "Major service innovation", "Style change", "Major process innovation"],
    correctIndex: 0,
    explanation:
      "Adding a new offering to the existing line for current customers using existing processes is a product line extension, not a radical innovation.",
  },

  // Marketing Communications
  {
    id: "mc-e1",
    type: "true-false",
    difficulty: "easy",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Intangibility makes services harder to communicate than physical goods.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Intangibility (mental impalpability, generality, abstractness, non-searchability) makes services difficult to depict and evaluate, complicating communication.",
  },
  {
    id: "mc-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Which tactic best helps overcome the intangibility of a service in advertising?",
    options: [
      "Using tangible cues, vivid imagery, metaphors and documentation",
      "Lowering the price as much as possible",
      "Removing all images from the advertisement",
      "Focusing only on abstract slogans",
    ],
    correctIndex: 0,
    explanation:
      "Tangible cues/physical evidence, vivid and interactive imagery, metaphors and documentation make intangible benefits concrete.",
  },
  {
    id: "mc-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Which of these is a common objective of services marketing communication?",
    options: [
      "Educating customers and managing demand",
      "Eliminating the need for frontline staff",
      "Hiding the price from customers",
      "Avoiding any positioning message",
    ],
    correctIndex: 0,
    explanation:
      "Service communications aim to position the service, manage demand, educate customers (often co-producers), and build relationships/loyalty.",
  },
  {
    id: "mc-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "A clinic struggles to advertise its 'caring expertise.' Which intangibility problem is this, and which fix fits best?",
    options: [
      "Abstractness — use vivid concrete imagery and documentation of outcomes",
      "Non-searchability — lower the price",
      "Generality — remove all visuals",
      "Perishability — extend opening hours",
    ],
    correctIndex: 0,
    explanation:
      "An abstract benefit like 'caring expertise' is hard to picture; concrete imagery, testimonials and documented outcomes make it tangible.",
  },

  // 5Ws Model
  {
    id: "5w-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "5ws-model",
    prompt: "In the 5 Ws communications model, 'WHO' refers to:",
    options: ["The target audience", "The media budget", "The competitor", "The CEO"],
    correctIndex: 0,
    explanation:
      "WHO = the target audience the communication is aimed at.",
  },
  {
    id: "5w-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "5ws-model",
    prompt: "Choosing the media channels for a campaign answers which of the 5 Ws?",
    options: ["Where", "Who", "What", "When"],
    correctIndex: 0,
    explanation:
      "WHERE concerns the channels/media used to reach the audience; WHEN is timing; WHAT is the message/objective.",
  },
  {
    id: "5w-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "5ws-model",
    prompt: "A team has defined the audience and the message but keeps missing seasonal peaks. Which W needs attention?",
    options: ["When (timing of communications)", "Who (target audience)", "What (the message)", "Where (the channel)"],
    correctIndex: 0,
    explanation:
      "Aligning communications with seasonal demand peaks is the WHEN (timing) decision.",
  },

  // Word of Mouth
  {
    id: "wom-e1",
    type: "true-false",
    difficulty: "easy",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "Word of mouth is generally seen as more credible than firm-produced advertising.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "WOM comes from other customers rather than the firm, so it carries higher credibility, especially for experience/credence services.",
  },
  {
    id: "wom-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "Which action most directly stimulates positive word of mouth?",
    options: [
      "Referral reward schemes and encouraging reviews/testimonials",
      "Hiding contact information",
      "Reducing service quality to cut costs",
      "Stopping all social media activity",
    ],
    correctIndex: 0,
    explanation:
      "Referral incentives, review encouragement and testimonials are classic ways firms stimulate and harness positive WOM.",
  },
  {
    id: "wom-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "WOM tends to matter MOST for which type of service attributes?",
    options: [
      "Experience and credence qualities, which are hard to judge before purchase",
      "Search qualities, which are easy to verify in advance",
      "Tangible packaging features",
      "Price-only attributes",
    ],
    correctIndex: 0,
    explanation:
      "Because experience and credence qualities cannot be assessed beforehand, customers lean on others' WOM to reduce perceived risk.",
  },

  // Corporate Design
  {
    id: "cd-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "corporate-design",
    prompt: "Corporate design uses elements such as logos, colour schemes, uniforms and signage mainly to:",
    options: [
      "Create a consistent, recognisable brand identity",
      "Replace the need for any advertising",
      "Set the firm's prices",
      "Manage employee payroll",
    ],
    correctIndex: 0,
    explanation:
      "Corporate design provides unified tangible cues that build a recognisable identity and make the intangible service tangible.",
  },
  {
    id: "cd-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "corporate-design",
    prompt: "A bank's branches each use different colours, signage and uniforms. What is the main risk, in corporate-design terms?",
    options: [
      "Inconsistent visual cues weaken brand recognition and perceived quality",
      "Customers will pay more for variety",
      "Employees will be over-empowered",
      "The core product will become tangible",
    ],
    correctIndex: 0,
    explanation:
      "Corporate design relies on consistency; varying visual elements confuses customers and dilutes the brand's recognisability and image.",
  },

  // ──────────────────────────── Chapter 8 ────────────────────────────
  // Blueprinting
  {
    id: "bp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "blueprinting",
    prompt: "Service blueprinting is primarily a tool for:",
    options: [
      "Designing and specifying intangible service processes in detail",
      "Setting the company's share price",
      "Recruiting frontline staff",
      "Writing advertising copy",
    ],
    correctIndex: 0,
    explanation:
      "Blueprinting maps and specifies how a service process works, including customer and employee actions and physical evidence.",
  },
  {
    id: "bp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "blueprinting",
    prompt: "Compared with a simple flowchart, a service blueprint additionally shows:",
    options: [
      "Frontstage vs. backstage actions, physical evidence and fail points",
      "Only the sequence of customer steps",
      "Just the company's pricing tiers",
      "The firm's organisational chart",
    ],
    correctIndex: 0,
    explanation:
      "A blueprint extends flowcharting by distinguishing frontstage/backstage actions, support processes, physical evidence, fail points and standards.",
  },
  {
    id: "bp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "blueprinting",
    prompt: "While blueprinting a restaurant, the team marks a step where orders are frequently lost between waiter and kitchen. This step should be identified as a:",
    options: ["Fail point", "Line of visibility", "Physical evidence element", "Service standard"],
    correctIndex: 0,
    explanation:
      "A step with significant risk of error/breakdown is a fail point; fail-proofing should be designed in there.",
  },

  // Flowcharting
  {
    id: "fc-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "flowcharting",
    prompt: "Flowcharting is mainly used to:",
    options: [
      "Map the sequence of steps in delivering a service",
      "Calculate employee salaries",
      "Measure ambient temperature",
      "Design the company logo",
    ],
    correctIndex: 0,
    explanation:
      "Flowcharting visualises the sequence of steps in service delivery and clarifies the nature of customer involvement.",
  },
  {
    id: "fc-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 8,
    topic: "flowcharting",
    prompt: "A key limitation of a flowchart compared with a blueprint is that a flowchart:",
    options: [
      "Does not distinguish frontstage from backstage or specify standards and fail points",
      "Cannot show any sequence of steps",
      "Is only usable for goods, not services",
      "Requires a vector database to build",
    ],
    correctIndex: 0,
    explanation:
      "Flowcharts show flow but lack the line of visibility, physical evidence, standards and fail points that blueprints add.",
  },

  // Service Blueprint components
  {
    id: "sbp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "On a service blueprint, the line that separates what customers see (frontstage) from what they don't (backstage) is the:",
    options: ["Line of visibility", "Line of interaction", "Line of internal interaction", "Line of order"],
    correctIndex: 0,
    explanation:
      "The line of visibility divides frontstage (onstage) activities customers experience from backstage activities they cannot see.",
  },
  {
    id: "sbp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "Which component appears at the TOP of a standard service blueprint?",
    options: ["Physical evidence", "Support processes", "Backstage contact employee actions", "Line of internal interaction"],
    correctIndex: 0,
    explanation:
      "Blueprints are typically read top-down: physical evidence, customer actions, frontstage, line of visibility, backstage, line of internal interaction, support processes.",
  },
  {
    id: "sbp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "A hotel wants to redesign check-in so guests wait less. The blueprint is most useful for this because it reveals:",
    options: [
      "Waits and execution times at each frontstage step, against set standards",
      "The hotel's quarterly profit",
      "Competitors' pricing strategies",
      "The CEO's compensation",
    ],
    correctIndex: 0,
    explanation:
      "Blueprints expose waits and the time each step takes versus standards, helping target the steps that create delays.",
  },

  // Fail-Proofing
  {
    id: "fp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "Fail-proofing (poka-yoke) methods are designed to:",
    options: [
      "Prevent errors before they happen",
      "Increase the price of the service",
      "Replace all employees with machines",
      "Slow down the service deliberately",
    ],
    correctIndex: 0,
    explanation:
      "Poka-yokes are error-prevention devices/procedures for employees and customers, built in at fail points.",
  },
  {
    id: "fp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "An ATM that beeps until you remove your card is an example of fail-proofing aimed at:",
    options: [
      "Customer errors (forgetting the card)",
      "Employee errors only",
      "Ambient conditions",
      "Brand architecture",
    ],
    correctIndex: 0,
    explanation:
      "This poka-yoke targets a customer error (leaving the card behind); fail-proofing can target both employee and customer mistakes.",
  },

  // Service Standards
  {
    id: "ss-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "service-standards",
    prompt: "'Answer the phone within three rings' is an example of a:",
    options: ["Service standard", "Fail point", "Ambient condition", "Brand endorsement"],
    correctIndex: 0,
    explanation:
      "A service standard is a specific, measurable operational target for a step in the process.",
  },
  {
    id: "ss-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-standards",
    prompt: "Effective service standards should ideally be based on:",
    options: [
      "Customer expectations and be measurable",
      "Whatever is cheapest for the firm",
      "The CEO's personal taste only",
      "Competitor secrecy",
    ],
    correctIndex: 0,
    explanation:
      "Standards should reflect customer expectations, be specific and measurable, and be revised as expectations rise.",
  },
  {
    id: "ss-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 8,
    topic: "service-standards",
    prompt: "Why are service standards often expressed as a range rather than a single fixed number?",
    options: [
      "To allow for natural variability while still managing customer expectations",
      "Because firms cannot measure services at all",
      "To hide performance from managers",
      "Because customers never notice waits",
    ],
    correctIndex: 0,
    explanation:
      "Service delivery varies, so standards are often a range (e.g. 5–8 minutes) that keeps performance acceptable while remaining realistic.",
  },

  // SSTs
  {
    id: "sst-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "ssts",
    prompt: "Self-service technologies (SSTs) allow customers to:",
    options: [
      "Produce a service themselves without direct employee involvement",
      "Avoid paying for the service",
      "Force employees to work overtime",
      "Eliminate the core product",
    ],
    correctIndex: 0,
    explanation:
      "SSTs (ATMs, kiosks, online check-in) let customers self-produce the service independently of staff.",
  },
  {
    id: "sst-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "ssts",
    prompt: "Customers are MOST likely to adopt an SST when it is:",
    options: [
      "Easy to use, reliable and offers a clear advantage",
      "Slower than the staffed option",
      "Confusing but cheap for the firm",
      "Available only once a year",
    ],
    correctIndex: 0,
    explanation:
      "Adoption rises when SSTs provide clear benefits, are easy to use, reliable and even enjoyable; failures and confusion deter use.",
  },
  {
    id: "sst-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "ssts",
    prompt: "A supermarket's self-checkout keeps freezing with no staff nearby to help. What is the key SST management failure?",
    options: [
      "No provision for handling SST failure and service recovery",
      "Too much hospitality",
      "Excessive empowerment of staff",
      "Over-investment in ambient scent",
    ],
    correctIndex: 0,
    explanation:
      "A core SST risk is technology failure without recovery support; firms must plan for failures and provide easy help/recovery.",
  },

  // ──────────────────────────── Chapter 10 ────────────────────────────
  // Servicescape
  {
    id: "scape-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "servicescape",
    prompt: "The servicescape refers to:",
    options: [
      "The physical environment where the service is delivered and the firm and customer interact",
      "The firm's pricing structure",
      "The list of supplementary services",
      "The company's annual report",
    ],
    correctIndex: 0,
    explanation:
      "The servicescape is the designed physical environment of service delivery, including all tangible elements customers experience.",
  },
  {
    id: "scape-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "servicescape",
    prompt: "Which is one of the three core dimensions of the servicescape?",
    options: [
      "Signs, symbols and artifacts",
      "Quarterly dividends",
      "Word of mouth",
      "Brand architecture",
    ],
    correctIndex: 0,
    explanation:
      "The three dimensions are ambient conditions; spatial layout & functionality; and signs, symbols & artifacts.",
  },
  {
    id: "scape-m2",
    type: "true-false",
    difficulty: "medium",
    chapter: 10,
    topic: "servicescape",
    prompt: "One role of the servicescape is to signal quality and help position the firm.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The servicescape shapes experience, signals quality/position, forms part of the value proposition and facilitates the encounter.",
  },
  {
    id: "scape-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "servicescape",
    prompt: "A premium spa uses soft lighting, calming scent, plush layout and tasteful art. In servicescape terms, these elements primarily work to:",
    options: [
      "Shape customer experience and communicate the firm's quality/positioning",
      "Replace the need for trained staff",
      "Set the legal terms of service",
      "Eliminate the core product",
    ],
    correctIndex: 0,
    explanation:
      "Such cues across all three dimensions craft the experience and convey a premium positioning, a central purpose of the servicescape.",
  },

  // Ambient Conditions
  {
    id: "amb-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "Which of the following is an AMBIENT condition?",
    options: ["Background music", "The reservation form", "The employee's job title", "The referral scheme"],
    correctIndex: 0,
    explanation:
      "Ambient conditions are background sensory characteristics: music, scent, colour, lighting, temperature, noise, air quality.",
  },
  {
    id: "amb-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "A notable feature of ambient conditions is that they:",
    options: [
      "Often affect customers below conscious awareness",
      "Are always consciously noticed and analysed",
      "Have no effect on spending",
      "Only matter in online services",
    ],
    correctIndex: 0,
    explanation:
      "Ambient cues like scent and tempo influence mood and behaviour, frequently without customers consciously noticing.",
  },
  {
    id: "amb-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "A restaurant plays slow music during quiet afternoons. Research on ambient music tempo suggests this will tend to make diners:",
    options: [
      "Stay longer and potentially spend more",
      "Eat faster and leave quickly",
      "Ignore the food entirely",
      "Demand louder music to spend less",
    ],
    correctIndex: 0,
    explanation:
      "Slow-tempo music tends to slow customers' pace, lengthening stays and often increasing spend — a classic ambient effect.",
  },

  // Pleasure & Arousal
  {
    id: "pa-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "In the affect model of environments, the two key emotional dimensions are:",
    options: ["Pleasure and arousal", "Price and place", "Speed and cost", "Trust and risk"],
    correctIndex: 0,
    explanation:
      "Environmental responses are described along pleasure (pleasant–unpleasant) and arousal (stimulated–sleepy).",
  },
  {
    id: "pa-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "High arousal in an environment is most likely to produce a POSITIVE response when:",
    options: [
      "The environment is also pleasant",
      "The environment is unpleasant",
      "Pleasure is completely absent",
      "Arousal is always negative regardless of pleasure",
    ],
    correctIndex: 0,
    explanation:
      "Arousal amplifies the existing feeling: in a pleasant setting it boosts excitement (positive), but in an unpleasant one it becomes distress.",
  },

  // Mehrabian-Russell Model
  {
    id: "mr-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "The Mehrabian-Russell Stimulus-Response Model says environments lead to two broad behaviours:",
    options: ["Approach or avoidance", "Buy or sell", "Hire or fire", "Insource or outsource"],
    correctIndex: 0,
    explanation:
      "The model holds that environmental stimuli plus emotional state (pleasure/arousal) drive either approach or avoidance behaviours.",
  },
  {
    id: "mr-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "In the Mehrabian-Russell model, what mediates between the servicescape stimulus and the behavioural response?",
    options: [
      "The customer's internal emotional state (pleasure and arousal)",
      "The firm's share price",
      "The competitor's advertising",
      "The legal contract",
    ],
    correctIndex: 0,
    explanation:
      "The internal affective state (described by pleasure and arousal) mediates between environmental stimuli and approach/avoidance.",
  },
  {
    id: "mr-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "Customers enter a cramped, noisy, badly lit store and quickly leave without browsing. In Mehrabian-Russell terms this is:",
    options: [
      "Avoidance behaviour driven by an unpleasant emotional response",
      "Approach behaviour driven by pleasure",
      "Empowerment of customers",
      "A facilitating service failure",
    ],
    correctIndex: 0,
    explanation:
      "The unpleasant servicescape produces a negative emotional state, leading to avoidance (leaving, not exploring or spending).",
  },

  // ──────────────────────────── Chapter 11 ────────────────────────────
  // Role Stress
  {
    id: "rs-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "role-stress",
    prompt: "Role stress in frontline service work mainly arises from:",
    options: [
      "Conflicting demands placed on the employee",
      "Having too little contact with customers",
      "Excessively high pay",
      "Too much vacation time",
    ],
    correctIndex: 0,
    explanation:
      "Frontline staff face conflicting demands (organisation vs. customer, self vs. role, client vs. client), producing role stress.",
  },
  {
    id: "rs-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "role-stress",
    prompt: "When company rules clash with what a customer wants, the employee experiences:",
    options: [
      "Organization/client conflict",
      "Inter-client conflict",
      "Person/role conflict",
      "Cycle of success",
    ],
    correctIndex: 0,
    explanation:
      "Organization/client conflict occurs when the firm's rules and the customer's wishes are incompatible.",
  },
  {
    id: "rs-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "role-stress",
    prompt: "A reserved employee must constantly act bubbly and outgoing, which clashes with their personality. This is best labelled:",
    options: [
      "Person/role conflict",
      "Organization/client conflict",
      "Inter-client conflict",
      "Internal marketing",
    ],
    correctIndex: 0,
    explanation:
      "Person/role conflict is the tension between the job's required behaviours and the employee's own personality/self-perception.",
  },

  // Boundary Spanners
  {
    id: "bs-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "Boundary spanners are employees who:",
    options: [
      "Work at the link between the organisation and its customers",
      "Only work in the back office",
      "Set corporate strategy from headquarters",
      "Never interact with customers",
    ],
    correctIndex: 0,
    explanation:
      "Boundary spanners operate at the firm–customer boundary, connecting the inside of the organisation to the outside world.",
  },
  {
    id: "bs-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "Why are boundary spanners particularly prone to role stress?",
    options: [
      "They straddle the firm and the customer, performing both operational and marketing tasks with conflicting demands",
      "They have no contact with anyone",
      "They never face customers",
      "They only handle backstage support",
    ],
    correctIndex: 0,
    explanation:
      "Because they sit between the organisation and customers and juggle operational and marketing roles, boundary spanners absorb conflicting demands.",
  },

  // Empowerment
  {
    id: "emp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "empowerment",
    prompt: "Empowerment gives frontline employees:",
    options: [
      "Authority and discretion to make decisions and solve problems",
      "Lower wages and fewer tools",
      "No responsibility for customers",
      "Only scripted, fixed responses",
    ],
    correctIndex: 0,
    explanation:
      "Empowerment provides authority, information, tools and discretion to act on customers' behalf.",
  },
  {
    id: "emp-m1",
    type: "comparison",
    difficulty: "medium",
    chapter: 11,
    topic: "empowerment",
    prompt: "A production-line (standardised) approach is generally MORE suitable than empowerment when the service is:",
    options: [
      "Simple, high-volume and low-variation",
      "Highly customised with non-routine problems",
      "Built on long-term relationships",
      "Full of unpredictable special requests",
    ],
    correctIndex: 0,
    explanation:
      "Standardisation fits simple, high-volume, low-variability services; empowerment fits customised, relationship-based, non-routine work.",
  },
  {
    id: "emp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "empowerment",
    prompt: "A luxury hotel lets staff spend up to a set amount to fix any guest complaint on the spot. The main trade-off of this empowerment is:",
    options: [
      "Faster recovery and satisfaction, but higher training and labour costs",
      "Lower service quality and slower recovery",
      "No effect on customer satisfaction",
      "Guaranteed lower costs everywhere",
    ],
    correctIndex: 0,
    explanation:
      "Empowerment speeds recovery and lifts satisfaction but requires more investment in selection, training and may raise costs/inconsistency.",
  },

  // Service Culture
  {
    id: "sc-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "service-culture",
    prompt: "A service culture is best described as:",
    options: [
      "Shared values and beliefs that put excellent service at the centre of the organisation",
      "A list of the firm's product prices",
      "The legal terms of employment",
      "The company's logo guidelines",
    ],
    correctIndex: 0,
    explanation:
      "A service culture is the shared values, beliefs and norms prioritising service excellence and customer satisfaction.",
  },
  {
    id: "sc-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "service-culture",
    prompt: "Leaders tell stories of staff going the extra mile and reward such behaviour. This builds a service culture mainly by:",
    options: [
      "Reinforcing shared values and norms through role models and recognition",
      "Cutting the marketing budget",
      "Reducing the number of supplementary services",
      "Lowering service standards",
    ],
    correctIndex: 0,
    explanation:
      "Stories, role models and reward systems are key mechanisms leaders use to embed and reinforce a service culture.",
  },

  // Internal Marketing
  {
    id: "im-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "Internal marketing treats employees as:",
    options: [
      "Internal customers whose needs must be met to deliver service quality",
      "Replaceable costs to minimise at all times",
      "Outsiders with no role in the brand",
      "Pure machines",
    ],
    correctIndex: 0,
    explanation:
      "Internal marketing views employees as internal customers and jobs as internal products, to attract, develop and retain good staff.",
  },
  {
    id: "im-m1",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "Internal marketing is based on the idea that satisfied employees help produce satisfied customers.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "A central premise is the link between employee satisfaction and customer satisfaction — in services, employees are the brand.",
  },
  {
    id: "im-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "A firm invests in training, internal communication, recognition and empowerment for staff. These are all tools of:",
    options: ["Internal marketing", "House of Brands strategy", "Flowcharting", "Ambient conditioning"],
    correctIndex: 0,
    explanation:
      "Training, internal communications, empowerment and recognition are classic internal-marketing activities to build service-minded staff.",
  },

  // Cycle of Success
  {
    id: "cos-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "The Cycle of Success is associated with:",
    options: [
      "Investing in employees through good pay, training and empowerment",
      "Minimising every labour cost",
      "Eliminating customer service",
      "Random hiring with no training",
    ],
    correctIndex: 0,
    explanation:
      "The Cycle of Success is a virtuous loop based on long-term investment in employees, yielding quality, loyalty and higher margins.",
  },
  {
    id: "cos-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "In the Cycle of Success, broadened job design and employee investment lead to higher margins because they produce:",
    options: [
      "Motivated staff, low turnover, high quality and loyal customers",
      "Bored staff and constant churn",
      "Dissatisfied customers who leave",
      "Lower service quality",
    ],
    correctIndex: 0,
    explanation:
      "Investment yields capable, satisfied employees, low turnover, high quality and loyal customers — generating the margins that fund more investment.",
  },

  // Cycle of Failure
  {
    id: "cof-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "The Cycle of Failure typically begins with a firm's decision to:",
    options: [
      "Minimise labour costs with low pay, narrow jobs and little training",
      "Heavily invest in employee development",
      "Empower all frontline staff",
      "Pay premium wages",
    ],
    correctIndex: 0,
    explanation:
      "The Cycle of Failure starts from minimising labour costs (low pay, narrow job design, minimal training/selection).",
  },
  {
    id: "cof-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "The Cycle of Failure has two interlocking loops. They are the:",
    options: [
      "Employee cycle and the customer cycle",
      "Pricing cycle and the branding cycle",
      "Ambient cycle and the arousal cycle",
      "Frontstage cycle and the backstage cycle",
    ],
    correctIndex: 0,
    explanation:
      "It comprises an employee cycle (dissatisfaction, poor quality, high turnover) and a customer cycle (dissatisfaction, low loyalty, churn).",
  },
  {
    id: "cof-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "A call centre pays minimum wage, gives one day of training, and suffers 120% annual turnover and angry customers. This illustrates the:",
    options: [
      "Cycle of Failure",
      "Cycle of Success",
      "Mehrabian-Russell model",
      "Flower of Service",
    ],
    correctIndex: 0,
    explanation:
      "Low pay and minimal training driving high turnover and customer dissatisfaction is the textbook Cycle of Failure.",
  },

  // Emotional Labor
  {
    id: "el-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "Emotional labor refers to:",
    options: [
      "Expressing socially desired emotions during service, even if not genuinely felt",
      "Physically heavy manual work",
      "Calculating customers' bills",
      "Designing the servicescape",
    ],
    correctIndex: 0,
    explanation:
      "Emotional labor is displaying the emotions a job requires (e.g. smiling, empathy) according to display rules, regardless of true feelings.",
  },
  {
    id: "el-m1",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "Sustained emotional labor can lead to stress and burnout when displayed and felt emotions diverge.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The gap between felt and displayed emotions (emotional dissonance) is a known source of stress and burnout.",
  },
  {
    id: "el-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "A flight attendant must stay warm and cheerful with a rude passenger despite feeling angry. This requirement is an example of emotional labor; firms can ease its strain mainly through:",
    options: [
      "Training, support and a positive service culture",
      "Cutting wages further",
      "Removing all customer contact",
      "Ignoring employee wellbeing",
    ],
    correctIndex: 0,
    explanation:
      "Emotional labor strain is reduced by training, managerial support and a positive culture that helps staff cope with display demands.",
  },

  // ── A few extra cross-topic items to deepen each difficulty pool ──
  {
    id: "x-fos-m2",
    type: "comparison",
    difficulty: "medium",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "What is the key difference between facilitating and enhancing petals?",
    options: [
      "Facilitating are needed to deliver/use the core; enhancing add extra value and differentiate",
      "Facilitating add value; enhancing are mandatory",
      "There is no difference",
      "Enhancing are always free; facilitating always cost money",
    ],
    correctIndex: 0,
    explanation:
      "Facilitating services enable delivery/use of the core product; enhancing services go beyond that to add value and differentiate the firm.",
  },
  {
    id: "x-sst-tf",
    type: "true-false",
    difficulty: "easy",
    chapter: 8,
    topic: "ssts",
    prompt: "An ATM is an example of a self-service technology.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "ATMs let customers perform banking services themselves without a teller — a classic SST.",
  },
  {
    id: "x-scape-tf",
    type: "true-false",
    difficulty: "easy",
    chapter: 10,
    topic: "servicescape",
    prompt: "Spatial layout and functionality is one dimension of the servicescape.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The three dimensions are ambient conditions; spatial layout & functionality; and signs, symbols & artifacts.",
  },
  {
    id: "x-brand-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 7,
    topic: "branding-alternatives",
    prompt: "In a Branded House strategy, a problem with one product can affect perceptions of the whole brand.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Because a Branded House shares one identity across all offerings, trouble with one product can spill over to the entire brand.",
  },
  {
    id: "x-emp-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "empowerment",
    prompt: "Empowerment is generally the best approach for every type of service, regardless of context.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "False. Empowerment suits customised, non-routine services; standardised high-volume services may be better with a production-line approach.",
  },
  {
    id: "x-bp-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "The line of interaction on a blueprint separates customer actions from frontstage employee actions.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The line of interaction sits between customer actions and frontstage (onstage) contact-employee actions.",
  },
  {
    id: "x-mc-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Non-searchability means service attributes can be fully inspected before purchase.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "False. Non-searchability means service attributes generally cannot be searched/inspected before purchase — a key intangibility challenge.",
  },
  {
    id: "x-cof-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "High employee turnover in the Cycle of Failure tends to lower customer loyalty.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Constant turnover means inexperienced staff and inconsistent service, feeding customer dissatisfaction and low loyalty.",
  },
  {
    id: "x-amb-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "Ambient conditions are perceived only separately, never holistically.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "False. Ambient cues are perceived both separately and holistically, combining to shape overall mood and behaviour.",
  },
  {
    id: "x-fp-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "Fail-proofing can target both employee errors and customer errors.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Poka-yokes are designed for both employees (e.g. prompts, checklists) and customers (e.g. beeps, locks, signs).",
  },

  // ── Additional medium-level items for a richer medium pool ──
  {
    id: "cd-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "corporate-design",
    prompt: "Why is corporate design especially important for services compared with goods?",
    options: [
      "Services are intangible, so consistent visual cues help customers judge and recognise the brand",
      "Services have no employees to manage",
      "Services never use advertising",
      "Goods cannot have logos",
    ],
    correctIndex: 0,
    explanation:
      "Because services are intangible, customers rely on consistent tangible visual cues (logos, colours, uniforms) to evaluate and recognise the firm.",
  },
  {
    id: "fc-m1",
    type: "comparison",
    difficulty: "medium",
    chapter: 8,
    topic: "flowcharting",
    prompt: "Flowcharting helps managers see how customer involvement differs across which categories?",
    options: [
      "People, possession, mental-stimulus and information processing",
      "Easy, medium and hard services",
      "Branded House vs. House of Brands",
      "Pleasure and arousal",
    ],
    correctIndex: 0,
    explanation:
      "Flowcharts clarify how the customer's role differs across the four service categories: people, possession, mental-stimulus and information processing.",
  },
  {
    id: "sbp-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "Backstage contact-employee actions are separated from frontstage actions by the:",
    options: ["Line of visibility", "Line of interaction", "Line of internal interaction", "Physical evidence band"],
    correctIndex: 0,
    explanation:
      "The line of visibility divides frontstage (visible) from backstage (invisible) contact-employee actions.",
  },
  {
    id: "pa-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "Within the pleasure–arousal framework, a 'pleasant and stimulating' environment tends to encourage:",
    options: ["Approach behaviours (stay, explore, spend)", "Avoidance behaviours", "No behavioural change", "Only complaints"],
    correctIndex: 0,
    explanation:
      "Pleasant, suitably arousing settings promote approach behaviours such as staying longer, exploring and spending more.",
  },
  {
    id: "bs-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "Boundary spanners typically perform which combination of tasks?",
    options: [
      "Both operational and marketing tasks",
      "Only accounting tasks",
      "Only legal tasks",
      "Only backstage maintenance",
    ],
    correctIndex: 0,
    explanation:
      "Boundary spanners carry out both operational duties and marketing/relationship tasks at the customer interface.",
  },
  {
    id: "sc-m1",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "service-culture",
    prompt: "A strong service culture underpins the satisfaction–loyalty–profit chain.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "A service culture aligns staff toward value delivery, supporting the chain linking employee/customer satisfaction, loyalty and profit.",
  },
  {
    id: "cos-m1",
    type: "comparison",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "The main contrast between the Cycle of Success and the Cycle of Failure is the firm's stance toward:",
    options: [
      "Investing in employees vs. minimising labour costs",
      "Advertising vs. public relations",
      "Ambient scent vs. lighting",
      "Branded House vs. sub-brands",
    ],
    correctIndex: 0,
    explanation:
      "Success comes from long-term employee investment; failure comes from cost-minimisation in pay, training and job design.",
  },
  {
    id: "el-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "The rules a firm sets for which emotions employees should display to customers are called:",
    options: ["Display rules", "Service standards", "Fail points", "Ambient conditions"],
    correctIndex: 0,
    explanation:
      "Display rules specify the socially desired emotions employees are expected to express during service encounters.",
  },
];
