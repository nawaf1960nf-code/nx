import type { Question } from "./types";

/**
 * Question bank for Services Marketing (Chapters 4, 7, 8, 10, 11).
 *
 * Every question is grounded in the course slides (Lovelock & Wirtz 7/e)
 * provided by the student, including the real examples used in the material
 * (British Airways, Allstate, Prudential, McDonald's, BP, FedEx, the
 * restaurant "service drama", the Mehrabian-Russell model, etc.).
 *
 * The exam engine samples 30 questions per attempt; the AI generator can
 * extend this set at runtime when an API key is configured.
 *
 * Difficulty guide:
 *  - easy:   definitions & core concepts
 *  - medium: understanding, application & comparison
 *  - hard:   analytical scenarios & easily-confused concepts
 */
export const QUESTION_BANK: Question[] = [
  // ══════════════════════════ Chapter 4 ══════════════════════════
  // Flower of Service
  {
    id: "fos-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "In the Flower of Service, what does the centre of the flower represent?",
    options: ["The core product", "A facilitating petal", "An enhancing petal", "The delivery process"],
    correctIndex: 0,
    explanation:
      "The centre is the core product — the central component supplying the principal, problem-solving benefits customers seek. The eight petals are the supplementary services.",
  },
  {
    id: "fos-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "The Flower of Service has eight petals of supplementary services surrounding the core.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "There are eight clusters (petals): four facilitating (Information, Order-Taking, Billing, Payment) and four enhancing (Consultation, Hospitality, Safekeeping, Exceptions).",
  },
  {
    id: "fos-e3",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "The eight petals of the Flower of Service are classified into which two types?",
    options: ["Facilitating and enhancing", "Tangible and intangible", "Core and peripheral", "Internal and external"],
    correctIndex: 0,
    explanation:
      "Supplementary services are classified as either facilitating (needed for delivery or to use the core) or enhancing (adding extra value).",
  },
  {
    id: "fos-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "According to the course, in a well-managed service organization, the petals and core are:",
    options: [
      "Fresh and well-formed",
      "Standardized and identical",
      "Minimised to cut cost",
      "Hidden from the customer",
    ],
    correctIndex: 0,
    explanation:
      "The slides state that in a well-managed service organization the petals and core are 'fresh and well-formed'.",
  },
  {
    id: "fos-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "What helps determine which supplementary services should be included in the Flower of Service?",
    options: [
      "Market positioning strategy",
      "The CEO's preference",
      "The number of employees",
      "The size of the building",
    ],
    correctIndex: 0,
    explanation:
      "Market positioning strategy helps determine which supplementary services should be included.",
  },
  {
    id: "fos-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "flower-of-service",
    prompt: "An airline's flights are on time, but its website gives confusing fare info, check-in is slow, and bills contain errors. Using the Flower of Service, the main weakness is in its:",
    options: [
      "Facilitating supplementary services",
      "Core product",
      "Enhancing supplementary services",
      "Brand architecture",
    ],
    correctIndex: 0,
    explanation:
      "Information, Order-Taking/check-in and Billing are all facilitating petals. The core (the flight) is fine; the facilitating services are failing.",
  },

  // Facilitating Services
  {
    id: "fac-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Which of these is a FACILITATING supplementary service?",
    options: ["Billing", "Hospitality", "Consultation", "Safekeeping"],
    correctIndex: 0,
    explanation:
      "The facilitating petals are Information, Order-Taking, Billing and Payment. The others listed are enhancing.",
  },
  {
    id: "fac-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Facilitating supplementary services are either needed for service delivery or help in the use of the core product.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "That is the slide's definition of facilitating supplementary services.",
  },
  {
    id: "fac-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Reservations, applications (e.g., club memberships) and check-in belong to which facilitating petal?",
    options: ["Order-Taking", "Information", "Billing", "Payment"],
    correctIndex: 0,
    explanation:
      "Order-Taking covers applications, order entry, and reservations/check-in.",
  },
  {
    id: "fac-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Directions to the service site, schedules, prices, warnings and confirmation of reservations are examples of which petal?",
    options: ["Information", "Order-Taking", "Payment", "Consultation"],
    correctIndex: 0,
    explanation:
      "These are all Information elements — relevant information customers need to obtain full value from a service.",
  },
  {
    id: "fac-m3",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Inserting a card into a machine, electronic funds transfer, and automatic deduction from financial deposits are forms of which petal?",
    options: ["Payment", "Billing", "Order-Taking", "Information"],
    correctIndex: 0,
    explanation:
      "Payment includes self-service (card/cash/EFT), direct to payee/intermediary, and automatic deduction.",
  },
  {
    id: "fac-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "What is the key difference between the Billing and Payment petals?",
    options: [
      "Billing tells the customer the amount due; Payment is the actual transfer of funds",
      "Billing transfers funds; Payment issues the statement",
      "They are identical",
      "Billing is enhancing; Payment is facilitating",
    ],
    correctIndex: 0,
    explanation:
      "Billing covers statements/invoices/amount-due displays; Payment covers how the customer actually pays (self-service, direct to payee, automatic deduction).",
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
      "The enhancing petals are Consultation, Hospitality, Safekeeping and Exceptions; they add extra value for the customer.",
  },
  {
    id: "enh-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Enhancing supplementary services add extra value for the customer.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "By definition, enhancing services add extra value, unlike facilitating services which are needed for delivery/use.",
  },
  {
    id: "enh-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Valet parking, baggage handling, coat rooms and storage of customers' possessions belong to which enhancing petal?",
    options: ["Safekeeping", "Hospitality", "Consultation", "Exceptions"],
    correctIndex: 0,
    explanation:
      "Safekeeping covers caring for possessions customers bring (parking, valet, coat rooms, baggage, storage) and goods they buy/rent.",
  },
  {
    id: "enh-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Greeting, food and beverages, waiting facilities and washrooms are examples of which enhancing petal?",
    options: ["Hospitality", "Safekeeping", "Consultation", "Exceptions"],
    correctIndex: 0,
    explanation:
      "Hospitality reflects pleasure at meeting new customers and greeting returning ones (greeting, refreshments, waiting amenities, etc.).",
  },
  {
    id: "enh-m3",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "Handling complaints, special dietary/medical requests, warranties and refunds fall under which petal?",
    options: ["Exceptions", "Consultation", "Hospitality", "Safekeeping"],
    correctIndex: 0,
    explanation:
      "Exceptions are supplementary services that fall outside the routine — special requests, complaint handling, problem solving and restitution.",
  },
  {
    id: "enh-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "How does Consultation differ from Information, according to the course?",
    options: [
      "Consultation is a dialogue probing customer needs to develop a tailored solution; Information is a simple response to questions",
      "Consultation is printed; Information is spoken",
      "They are the same petal",
      "Consultation is facilitating; Information is enhancing",
    ],
    correctIndex: 0,
    explanation:
      "Unlike Information (a simple response or printed facts), Consultation involves a dialogue to probe requirements and develop a tailored solution.",
  },
  {
    id: "enh-h2",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "enhancing-services",
    prompt: "A consultant assists a client who suffered an accident, then offers a refund for a failed service. These two actions map to which petal and its sub-categories?",
    options: [
      "Exceptions — problem solving and restitution",
      "Hospitality — greeting and amenities",
      "Safekeeping — caring for possessions",
      "Consultation — tailored advice",
    ],
    correctIndex: 0,
    explanation:
      "Exceptions include problem solving (assisting customers after accidents/failures) and restitution (refunds, compensation, free repair).",
  },

  // Branding Alternatives
  {
    id: "brand-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "A single brand that covers all of a company's products (e.g., Virgin Group) is called a:",
    options: ["Branded House", "House of Brands", "Endorsed brand", "Subbrand"],
    correctIndex: 0,
    explanation:
      "A Branded House applies one corporate brand across all offerings — the course example is Virgin Group (also FedEx).",
  },
  {
    id: "brand-e2",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "Separate, stand-alone, often unrelated brands (e.g., P&G, Yum! Brands) form which strategy?",
    options: ["House of Brands", "Branded House", "Subbrands", "Endorsed brands"],
    correctIndex: 0,
    explanation:
      "A House of Brands uses separate stand-alone brands — the course examples are Yum! Brands and P&G.",
  },
  {
    id: "brand-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "'Raffles Class at Singapore Airlines' is the course example for which branding strategy?",
    options: ["Subbrands", "Branded House", "House of Brands", "Endorsed brands"],
    correctIndex: 0,
    explanation:
      "Raffles Class at Singapore Airlines is the slide's example of Subbrands (a master brand with distinct sub-brands).",
  },
  {
    id: "brand-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "'Starwood Hotels & Resorts' (and Courtyard by Marriott) are course examples of which strategy?",
    options: ["Endorsed brands", "Branded House", "House of Brands", "Subbrands"],
    correctIndex: 0,
    explanation:
      "Endorsed brands — the product brand is primary, endorsed by the corporate brand (Starwood, Courtyard by Marriott, Ritz-Carlton).",
  },
  {
    id: "brand-m3",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "The branding spectrum (Aaker & Joachimsthaler) runs from corporate branding to:",
    options: ["Individual product branding", "Generic branding", "No branding", "Price branding"],
    correctIndex: 0,
    explanation:
      "The spectrum runs from corporate branding (Branded House) to individual product branding (House of Brands), with Subbrands and Endorsed brands in between.",
  },
  {
    id: "brand-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "British Airways offers seven distinct air travel products (First, Club World, World Traveller Plus, World Traveller, Club Europe, Euro-Traveller, Shuttle). This best illustrates:",
    options: [
      "Subbrands under a master brand",
      "A House of Brands of unrelated companies",
      "A single undifferentiated Branded House",
      "Endorsed brands led by the product name",
    ],
    correctIndex: 0,
    explanation:
      "BA's seven distinct travel products are sub-brands distinguished within the master BA brand (the course's Subbrands example).",
  },
  {
    id: "brand-h2",
    type: "comparison",
    difficulty: "hard",
    chapter: 4,
    topic: "branding-alternatives",
    prompt: "According to Don Schultz (quoted in the course), the brand promise / value proposition is:",
    options: [
      "The heart and soul of the brand — not merely a tag line, icon, color or graphic",
      "Simply the company logo",
      "Only the advertising slogan",
      "The price of the service",
    ],
    correctIndex: 0,
    explanation:
      "The course quotes that the brand promise is 'the heart and soul of the brand', though tag lines, icons and colors may contribute.",
  },

  // New Service Development
  {
    id: "nsd-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "new-service-development",
    prompt: "Which is the LOWEST/most modest level of service innovation?",
    options: ["Style changes", "Major service innovations", "Major process innovations", "Product line extensions"],
    correctIndex: 0,
    explanation:
      "Style changes (e.g., repainting, new uniforms) are the most modest; major service innovations are the most radical.",
  },
  {
    id: "nsd-e2",
    type: "definition",
    difficulty: "easy",
    chapter: 4,
    topic: "new-service-development",
    prompt: "New core products for previously undefined markets are called:",
    options: ["Major service innovations", "Style changes", "Service improvements", "Process-line extensions"],
    correctIndex: 0,
    explanation:
      "Major service innovations are new core products for previously undefined markets — the highest level in the hierarchy.",
  },
  {
    id: "nsd-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "new-service-development",
    prompt: "Telephone-based or internet-based banking is the course example of which innovation category?",
    options: ["Process-line extensions", "Style changes", "Major service innovations", "Service improvements"],
    correctIndex: 0,
    explanation:
      "Process-line extensions are alternative delivery procedures — the slide example is telephone/internet banking.",
  },
  {
    id: "nsd-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 4,
    topic: "new-service-development",
    prompt: "In new service development, the course notes that the core product is often:",
    options: [
      "Of secondary importance — many innovations are in supplementary services or delivery",
      "The only thing that matters",
      "Irrelevant to success",
      "Always a major service innovation",
    ],
    correctIndex: 0,
    explanation:
      "The slides state the core product is often of secondary importance; many innovations are in supplementary services or service delivery.",
  },
  {
    id: "nsd-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 4,
    topic: "new-service-development",
    prompt: "A firm only repaints its branches and gives staff new uniforms. On the hierarchy of new service categories, this is a:",
    options: ["Style change", "Major process innovation", "Product line extension", "Major service innovation"],
    correctIndex: 0,
    explanation:
      "Visible changes in service design/scripts such as repainting and new uniforms are style changes — the most modest category.",
  },
  {
    id: "nsd-h2",
    type: "multiple-choice",
    difficulty: "hard",
    chapter: 4,
    topic: "new-service-development",
    prompt: "Which is identified as a market-research success factor in new service development?",
    options: [
      "Scientific studies conducted early, with a well-defined concept before field studies",
      "Skipping research to launch faster",
      "Relying only on the CEO's intuition",
      "Avoiding any customer input",
    ],
    correctIndex: 0,
    explanation:
      "Success factors include scientific studies early in development and a product concept well defined before field studies; market knowledge is of utmost importance.",
  },

  // ══════════════════════════ Chapter 7 ══════════════════════════
  // Marketing Communications
  {
    id: "mc-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "In the 7Ps, the marketing communication element is defined in the course as:",
    options: ["Promotion & Education", "Price & Place", "People & Process", "Product & Physical evidence"],
    correctIndex: 0,
    explanation:
      "The course defines the marketing communication element of the 7Ps as 'Promotion & Education'.",
  },
  {
    id: "mc-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Marketing communication is more than just advertising (it includes PR, personal selling, etc.).",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The slides state communication is more than advertising — it includes public relations and professional sales people, especially in services.",
  },
  {
    id: "mc-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Which is one of the six specific roles of marketing communications?",
    options: [
      "Stimulate or dampen demand to match capacity",
      "Set the company's share price",
      "Replace all frontline employees",
      "Eliminate the core product",
    ],
    correctIndex: 0,
    explanation:
      "The six roles include positioning/differentiating, helping evaluation, promoting personnel, adding value, facilitating involvement, and stimulating/dampening demand to match capacity.",
  },
  {
    id: "mc-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Showing employees at work in ads mainly helps to:",
    options: [
      "Promote the contribution of personnel and set customer expectations",
      "Hide backstage operations",
      "Reduce service quality",
      "Avoid positioning the service",
    ],
    correctIndex: 0,
    explanation:
      "Ads showing employees at work promote personnel contribution, make the service tangible and personalized, and help set customer expectations.",
  },
  {
    id: "mc-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "A theatre uses advertising and sales promotions to shift customers to off-peak shows. Which role of marketing communications is this?",
    options: [
      "Stimulate or dampen demand to match capacity",
      "Position and differentiate the service",
      "Promote contributions of personnel",
      "Facilitate customer involvement in production",
    ],
    correctIndex: 0,
    explanation:
      "Because live performances are time-specific and can't be stored, communications change the timing of use to match demand with available capacity.",
  },

  // 5Ws Model
  {
    id: "5w-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "5ws-model",
    prompt: "In the '5 Ws' model, the 'Who' question concerns:",
    options: ["Our target audience", "The media budget", "The competitor", "The slogan"],
    correctIndex: 0,
    explanation:
      "WHO = 'Who is our target audience?' — the first of the 5 Ws.",
  },
  {
    id: "5w-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 7,
    topic: "5ws-model",
    prompt: "The '5 Ws' model is a checklist for marketing communications planning.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The 5 Ws (Who, What, How, Where, When) are a planning checklist for marketing communications.",
  },
  {
    id: "5w-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "5ws-model",
    prompt: "The course groups the target audience into which three broad categories?",
    options: [
      "Prospects, users, and employees",
      "Buyers, sellers, and regulators",
      "Adults, teens, and children",
      "Local, national, and global",
    ],
    correctIndex: 0,
    explanation:
      "The three broad target-audience categories are prospects, users, and employees.",
  },
  {
    id: "5w-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "5ws-model",
    prompt: "Why does the course say the traditional communication mix is used to reach prospects?",
    options: [
      "Because prospects are not known in advance",
      "Because prospects are the cheapest to reach",
      "Because prospects are existing loyal users",
      "Because prospects are employees",
    ],
    correctIndex: 0,
    explanation:
      "Prospects are reached via the traditional communication mix because they are not known in advance; users are reached via more cost-effective channels.",
  },
  {
    id: "5w-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "5ws-model",
    prompt: "A team has defined the audience and the message but keeps missing seasonal demand peaks. Which W needs attention?",
    options: ["When (timing of communications)", "Who (target audience)", "What (the message)", "How (the method)"],
    correctIndex: 0,
    explanation:
      "Aligning communications with seasonal peaks is the WHEN question — when do communications need to take place.",
  },

  // Word of Mouth
  {
    id: "wom-e1",
    type: "true-false",
    difficulty: "easy",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "Recommendations from other customers (word of mouth) are viewed as more credible.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "WOM messages originate outside the organization and recommendations from other customers are viewed as more credible.",
  },
  {
    id: "wom-e2",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "Which is a NEW type of online word of mouth mentioned in the course?",
    options: ["Blogs and Twitter", "Billboards", "Radio jingles", "Printed flyers"],
    correctIndex: 0,
    explanation:
      "The slides list blogs and Twitter as new types of online WOM, plus media coverage.",
  },
  {
    id: "wom-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "'Bring two friends, and the third eats for free' is an example of:",
    options: [
      "A promotion that encourages customers to persuade others (stimulating WOM)",
      "A referral that reduces service quality",
      "A corporate design strategy",
      "A self-service technology",
    ],
    correctIndex: 0,
    explanation:
      "This is a promotion that encourages customers to persuade others — a strategy to stimulate positive WOM.",
  },
  {
    id: "wom-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "Offering an existing customer a voucher or cash for introducing new customers is called a:",
    options: ["Referral incentive scheme", "Trade show", "Banner ad", "Service blueprint"],
    correctIndex: 0,
    explanation:
      "Developing referral incentive schemes (free service, voucher or cash for introductions) is a strategy to stimulate positive WOM.",
  },
  {
    id: "wom-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "word-of-mouth",
    prompt: "A firm's brochure features quotes from satisfied customers and references other buyers clients can call. Which WOM strategies are these?",
    options: [
      "Presenting/publicizing testimonials and referencing other purchasers",
      "Banner advertising and search-engine ads",
      "Corporate design and IMC",
      "Self-billing and payment handling",
    ],
    correctIndex: 0,
    explanation:
      "Publicizing testimonials and referencing other purchasers/knowledgeable individuals are listed strategies to stimulate positive WOM.",
  },

  // Corporate Design
  {
    id: "cd-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 7,
    topic: "corporate-design",
    prompt: "Corporate design uses a unified, distinctive visual appearance across tangible elements such as:",
    options: ["Logos, uniforms and physical facilities", "Only the price list", "Only the payroll system", "Only the menu"],
    correctIndex: 0,
    explanation:
      "Many service firms employ a unified visual appearance for all tangible elements — logos, uniforms, physical facilities.",
  },
  {
    id: "cd-e2",
    type: "multiple-choice",
    difficulty: "easy",
    chapter: 7,
    topic: "corporate-design",
    prompt: "McDonald's 'Golden Arches' is a course example of:",
    options: [
      "A trademarked symbol used as the primary logo, with the name secondary",
      "A self-service technology",
      "A referral incentive scheme",
      "An ambient condition",
    ],
    correctIndex: 0,
    explanation:
      "The slides cite McDonald's 'Golden Arches' as a trademarked symbol used as the primary logo with the name secondary.",
  },
  {
    id: "cd-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "corporate-design",
    prompt: "BP's bright green and yellow service stations illustrate corporate design's aim to:",
    options: [
      "Provide a recognizable theme linking all the firm's operations through physical evidence",
      "Reduce the number of employees",
      "Increase the price of fuel",
      "Replace word of mouth",
    ],
    correctIndex: 0,
    explanation:
      "BP's consistent green/yellow stations give a recognizable theme linking all operations via physical evidence.",
  },
  {
    id: "cd-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 7,
    topic: "corporate-design",
    prompt: "In the FedEx 'family of companies', subbrands are differentiated by:",
    options: [
      "A different color scheme for the second word (Express red/orange, Ground green)",
      "Using completely unrelated names",
      "Removing the FedEx name entirely",
      "Changing the core product every year",
    ],
    correctIndex: 0,
    explanation:
      "Each FedEx subbrand uses a different color for the second word (Express red/orange, Ground green) to create differentiation.",
  },
  {
    id: "cd-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 7,
    topic: "corporate-design",
    prompt: "Why are easily recognizable corporate symbols especially important for international marketers, per the course?",
    options: [
      "In markets where the local language is not in Roman script or many people are illiterate",
      "Because symbols are cheaper than products",
      "Because symbols replace the need for staff",
      "Because symbols set the firm's prices",
    ],
    correctIndex: 0,
    explanation:
      "Recognizable symbols matter where the local language isn't written in Roman script or a significant portion of the population is illiterate.",
  },

  // ══════════════════════════ Chapter 8 ══════════════════════════
  // Flowcharting
  {
    id: "fc-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "flowcharting",
    prompt: "Flowcharting is a technique for displaying:",
    options: [
      "The nature and sequence of the steps in delivering service to customers",
      "The company's annual profit",
      "Employee salaries",
      "The corporate logo",
    ],
    correctIndex: 0,
    explanation:
      "Flowcharting shows the nature and sequence of the different steps in delivering service, helping understand the total customer experience.",
  },
  {
    id: "fc-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "flowcharting",
    prompt: "Flowcharting shows how customer involvement differs across which four service types?",
    options: [
      "People, possession, mental-stimulus and information processing",
      "Easy, medium, hard and expert",
      "Branded House, Subbrands, Endorsed, House of Brands",
      "Information, billing, payment and order-taking",
    ],
    correctIndex: 0,
    explanation:
      "The four categories are people processing, possession processing, mental-stimulus processing and information processing.",
  },
  {
    id: "fc-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 8,
    topic: "flowcharting",
    prompt: "How does a flowchart differ from a blueprint, per the course?",
    options: [
      "A flowchart describes an existing process simply; a blueprint specifies in detail how the process is built, with visibility and fail points",
      "A flowchart is only for goods",
      "A blueprint cannot show any steps",
      "There is no difference",
    ],
    correctIndex: 0,
    explanation:
      "A flowchart describes an existing process in a simple form; a blueprint is a more complex version detailing construction, what's visible, and fail points.",
  },

  // Blueprinting
  {
    id: "bp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "blueprinting",
    prompt: "Blueprinting is described in the course as:",
    options: [
      "The key tool to design new services or redesign existing ones — a more complex flowchart",
      "A pricing method",
      "A recruitment technique",
      "An advertising channel",
    ],
    correctIndex: 0,
    explanation:
      "Blueprinting is the key tool for designing/redesigning services and is a more complex version of flowcharting.",
  },
  {
    id: "bp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "blueprinting",
    prompt: "Which is an advantage of blueprinting listed in the course?",
    options: [
      "Distinguishes front-stage from back-stage and identifies potential fail points",
      "Sets the company's share price",
      "Eliminates the need for employees",
      "Guarantees zero competition",
    ],
    correctIndex: 0,
    explanation:
      "Advantages include distinguishing front-stage/back-stage, clarifying interactions/support, identifying fail points, and pinpointing waits.",
  },
  {
    id: "bp-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "blueprinting",
    prompt: "When developing a service blueprint, the course recommends:",
    options: [
      "Define the 'big picture' before drilling down to detail",
      "Start with the finest detail and never zoom out",
      "Ignore customer-visible steps",
      "Only map the accounting process",
    ],
    correctIndex: 0,
    explanation:
      "Identify the key activities, then define the 'big picture' before 'drilling down' to a higher level of detail.",
  },
  {
    id: "bp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "blueprinting",
    prompt: "A manager wants to set a maximum acceptable customer waiting time at each step. Blueprinting helps because it:",
    options: [
      "Identifies the stages where customers wait and supports developing waiting-time standards",
      "Calculates quarterly dividends",
      "Designs the company logo",
      "Replaces the core product",
    ],
    correctIndex: 0,
    explanation:
      "An advantage of blueprints is identifying stages where customers wait and developing standards for maximum customer waiting time.",
  },

  // Service Blueprint (drama)
  {
    id: "sbp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "In the restaurant 'service drama', what separates front-stage actions from back-stage actions?",
    options: ["The line of visibility", "The line of credit", "The price line", "The waiting line"],
    correctIndex: 0,
    explanation:
      "Below the line of visibility the blueprint specifies back-stage actions ensuring each front-stage step meets expectations.",
  },
  {
    id: "sbp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "In the restaurant drama, making a reservation, valet parking and leaving coats occur in which act?",
    options: ["Act 1 — prologue and introductory scenes", "Act 2 — core product delivery", "Act 3 — the drama concludes", "There are no acts"],
    correctIndex: 0,
    explanation:
      "Act 1 covers the reservation, arrival, valet parking, coat room and a drink at the bar while waiting.",
  },
  {
    id: "sbp-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "In Act 2 (core product delivery), which is cited as a potential fail point?",
    options: [
      "Incomplete or unclear menu information, or items not actually available",
      "The valet parking the car",
      "Thanking the guest at the end",
      "Printing the final bill",
    ],
    correctIndex: 0,
    explanation:
      "Act 2 fail points include incomplete/unclear menu info and menu items not being available; errors in transmitting information are a common cause of quality failure.",
  },
  {
    id: "sbp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "service-blueprint",
    prompt: "In Act 3 of the restaurant drama, what do customers expect?",
    options: [
      "An accurate, clear, prompt bill, payment handled politely, and thanks for their patronage",
      "A long, drawn-out closing with many surprises",
      "To re-order the core product",
      "To park their own car",
    ],
    correctIndex: 0,
    explanation:
      "Act 3 should move quickly and smoothly with no surprises: an accurate/clear/prompt bill, polite payment handling, and thanks — the act should be short.",
  },

  // Fail-Proofing
  {
    id: "fp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "Fail-safe (poka-yoke) methods are needed for:",
    options: ["Both employees and customers", "Only managers", "Only machines", "Only suppliers"],
    correctIndex: 0,
    explanation:
      "The course states fail-safe methods (poka-yokes) are needed for both employees and customers.",
  },
  {
    id: "fp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "From the customer's perspective, the MOST serious fail points are those that:",
    options: [
      "Prevent customers from reaching or enjoying the core product",
      "Affect only the company's internal reports",
      "Concern employee uniforms",
      "Relate to the firm's logo",
    ],
    correctIndex: 0,
    explanation:
      "The most serious fail points are those that cause failure to reach or enjoy the core product (e.g., reservations and seating in a restaurant).",
  },
  {
    id: "fp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "fail-proofing",
    prompt: "A restaurant finds customers can't get through by phone and reservations are recorded inaccurately. In fail-proofing terms these are:",
    options: [
      "Critical fail points in the reservation step that block access to the core product",
      "Enhancing services adding extra value",
      "Ambient conditions",
      "Corporate design choices",
    ],
    correctIndex: 0,
    explanation:
      "Reservation failures (can't get through, table not available, inaccurate recording) are among the most serious fail points because they block the core product.",
  },

  // Service Standards
  {
    id: "ss-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "service-standards",
    prompt: "Service standards must be expressed in ways that allow:",
    options: ["Objective measurement", "Subjective guesses only", "No measurement at all", "Secret evaluation"],
    correctIndex: 0,
    explanation:
      "Standards should be expressed so they allow objective measurement, and include time parameters and prescriptions for style/behavior.",
  },
  {
    id: "ss-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "service-standards",
    prompt: "'Process 80% of orders within 24 hours' is an example of a:",
    options: ["Performance/process goal that employees are accountable for", "Fail point", "Ambient condition", "Brand endorsement"],
    correctIndex: 0,
    explanation:
      "This is a specific process and team performance goal for which employees are accountable.",
  },
  {
    id: "ss-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "service-standards",
    prompt: "The course says perceptions of service experiences tend to be cumulative. A consequence is that:",
    options: [
      "The first impression affects quality evaluations during later stages",
      "Only the last step matters",
      "Standards are unnecessary",
      "Customers ignore early failures",
    ],
    correctIndex: 0,
    explanation:
      "Because perceptions are cumulative, the first impression influences quality evaluations in later stages of delivery.",
  },
  {
    id: "ss-h2",
    type: "comparison",
    difficulty: "hard",
    chapter: 8,
    topic: "service-standards",
    prompt: "For which type of service is a single front-stage failure relatively MORE serious?",
    options: ["A low-contact service", "A high-contact service", "Both equally", "Neither"],
    correctIndex: 0,
    explanation:
      "The course states that for a low-contact service, a single front-stage failure is relatively more serious than for a high-contact service.",
  },

  // SSTs
  {
    id: "sst-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 8,
    topic: "ssts",
    prompt: "Self-service technologies (SSTs) are described as:",
    options: [
      "The ultimate form of customer involvement, where the customer's time/effort replaces employees'",
      "A way to eliminate the core product",
      "A pricing strategy",
      "A type of advertising",
    ],
    correctIndex: 0,
    explanation:
      "SSTs are the ultimate form of customer involvement; the customer's time and effort replace those of employees.",
  },
  {
    id: "sst-e2",
    type: "true-false",
    difficulty: "easy",
    chapter: 8,
    topic: "ssts",
    prompt: "Convenience and 24/7 access are advantages of SSTs.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Advantages of SSTs include convenience, 24/7 access and fast completion of transactions.",
  },
  {
    id: "sst-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "ssts",
    prompt: "Which is listed as a DISADVANTAGE of SSTs?",
    options: [
      "Anxiety/stress for some customers and loss of the social experience",
      "Lower prices",
      "24/7 availability",
      "Faster transactions",
    ],
    correctIndex: 0,
    explanation:
      "Disadvantages include anxiety/stress for some customers, loss of social experience, and technical problems (system down, forgotten passwords).",
  },
  {
    id: "sst-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 8,
    topic: "ssts",
    prompt: "For customers to accept an SST, the course says it must be:",
    options: [
      "Reliable, easy to use, and better than the personal alternatives",
      "Cheaper for the firm regardless of customer experience",
      "Available only at peak times",
      "More confusing than staffed service",
    ],
    correctIndex: 0,
    explanation:
      "Firms must ensure SSTs are reliable and easy to use, and the SST must be better than the personal alternatives.",
  },
  {
    id: "sst-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 8,
    topic: "ssts",
    prompt: "A supermarket's self-checkout freezes and there is no way to get help. Which SST success requirement was violated?",
    options: [
      "Providing systems for immediate service recovery when the technology fails",
      "Charging the customer more",
      "Adding more hospitality",
      "Increasing ambient scent",
    ],
    correctIndex: 0,
    explanation:
      "A key requirement is providing systems for immediate service recovery when the technology fails.",
  },

  // ══════════════════════════ Chapter 10 ══════════════════════════
  // Servicescape
  {
    id: "scape-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "servicescape",
    prompt: "Which is one of the four purposes of service environments?",
    options: [
      "Shape customers' experience and behaviors",
      "Set the firm's dividend policy",
      "Replace word of mouth",
      "Eliminate supplementary services",
    ],
    correctIndex: 0,
    explanation:
      "The four purposes: shape experience/behaviors; support image/positioning/differentiation; form part of the value proposition; facilitate the encounter and enhance productivity.",
  },
  {
    id: "scape-e2",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "servicescape",
    prompt: "Which is one of the three core dimensions of the servicescape?",
    options: [
      "Signs, symbols and artifacts",
      "Quarterly dividends",
      "Word of mouth",
      "Branding spectrum",
    ],
    correctIndex: 0,
    explanation:
      "The three core dimensions are ambient conditions; spatial layout and functionality; and signs, symbols and artifacts.",
  },
  {
    id: "scape-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "servicescape",
    prompt: "Using symbolic cues to communicate the distinctive nature and quality of the experience is the environment acting as a:",
    options: ["Message-creating medium", "Attention-creating medium", "Effect-creating medium", "Payment medium"],
    correctIndex: 0,
    explanation:
      "The environment influences buyers as a message-creating medium (symbolic cues), an attention-creating medium, and an effect-creating medium.",
  },
  {
    id: "scape-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "servicescape",
    prompt: "In the Servicescape Model, internal responses are grouped as:",
    options: [
      "Cognitive, emotional and psychological",
      "Cheap, medium and premium",
      "Local, national and global",
      "Verbal, written and digital",
    ],
    correctIndex: 0,
    explanation:
      "Internal responses are cognitive (perceptions/beliefs of quality), emotional (feelings/moods) and psychological (pain/comfort).",
  },
  {
    id: "scape-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "servicescape",
    prompt: "The course stresses that the key to effective servicescape design is:",
    options: [
      "How well each individual dimension fits with everything else (a holistic view)",
      "Maximising one dimension regardless of the others",
      "Removing all ambient conditions",
      "Copying a competitor exactly",
    ],
    correctIndex: 0,
    explanation:
      "The key to effective design is how well each individual dimension fits with everything else — no dimension can be optimised in isolation.",
  },

  // Ambient Conditions
  {
    id: "amb-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "Ambient conditions relate to:",
    options: ["The five senses", "The firm's pricing", "The referral scheme", "The brand spectrum"],
    correctIndex: 0,
    explanation:
      "Ambient conditions relate to the five senses — lighting, color, temperature, scent, sounds, noise and music.",
  },
  {
    id: "amb-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "According to the course, fast-tempo and loud music tends to:",
    options: [
      "Increase arousal levels, with people adjusting their pace to the rhythm",
      "Put customers to sleep",
      "Have no effect at all",
      "Lower the lighting",
    ],
    correctIndex: 0,
    explanation:
      "Fast tempo and loud music raise arousal; people tend to adjust their pace to the rhythm. Music has power even at barely audible levels.",
  },
  {
    id: "amb-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "The three dimensions of color are:",
    options: [
      "Hue, value and chroma",
      "Red, green and blue",
      "Warm, cool and neutral",
      "Light, medium and dark",
    ],
    correctIndex: 0,
    explanation:
      "Color is defined by hue (the shade), value (brightness/darkness) and chroma (intensity/saturation).",
  },
  {
    id: "amb-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "A store wants customers to make quick impulse purchases. Per the course, which colors are most appropriate?",
    options: [
      "Warm colors — they encourage fast decision making",
      "Cool colors — they slow decisions down",
      "Only black and white",
      "Color has no documented effect",
    ],
    correctIndex: 0,
    explanation:
      "Warm colors encourage fast decision making (good for impulse purchases); cool colors are preferred for high-involvement decisions.",
  },
  {
    id: "amb-h2",
    type: "multiple-choice",
    difficulty: "hard",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "An 'ambient scent' is best defined as one that:",
    options: [
      "Pervades the environment without relating to a particular product",
      "Comes only from a specific product on sale",
      "Is detectable only by staff",
      "Has no effect on mood",
    ],
    correctIndex: 0,
    explanation:
      "An ambient scent pervades the environment and does not relate to a particular product; scents affect mood, evaluation and purchase.",
  },

  // Pleasure & Arousal
  {
    id: "pa-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "Russell's Model of Affect uses which two main dimensions?",
    options: ["Pleasure and arousal", "Price and place", "Speed and cost", "Hue and chroma"],
    correctIndex: 0,
    explanation:
      "Russell's Model of Affect explains feelings along pleasure (like/dislike) and arousal (level of stimulation).",
  },
  {
    id: "pa-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "In Russell's model, arousal depends on the environment's:",
    options: ["'Information load'", "Price level", "Number of employees", "Brand name"],
    correctIndex: 0,
    explanation:
      "Arousal — how stimulated a person feels — depends on the 'information load' of the environment, from deep sleep to highest activity.",
  },
  {
    id: "pa-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "Per the course, increased arousal in an UNPLEASANT environment leads customers to feel:",
    options: ["Distressed", "Relaxed and happy", "Neutral", "More loyal"],
    correctIndex: 0,
    explanation:
      "Arousal amplifies the effect: pleasant + arousal = stronger positive response; unpleasant + arousal = feeling distressed.",
  },
  {
    id: "pa-h2",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "A spa wants customers to feel relaxed. The advantage of Russell's model here is that it:",
    options: [
      "Offers a simple, direct way to set goals for emotional states",
      "Eliminates the need for staff",
      "Guarantees higher prices",
      "Removes ambient conditions",
    ],
    correctIndex: 0,
    explanation:
      "The model's advantage is a simple, direct approach that lets firms set goals for emotional states (e.g., a spa wanting customers relaxed).",
  },

  // Mehrabian-Russell
  {
    id: "mr-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "The Mehrabian-Russell Stimulus-Response Model says environments lead to which two broad behaviors?",
    options: ["Approach or avoidance", "Buy or sell", "Hire or fire", "Save or spend"],
    correctIndex: 0,
    explanation:
      "Outcomes are either approach or avoidance of the environment, plus outcomes such as amount spent and satisfaction.",
  },
  {
    id: "mr-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "In the Mehrabian-Russell model, what is central to how we respond to environmental stimuli?",
    options: [
      "Our feelings/emotions",
      "The firm's share price",
      "The competitor's ads",
      "The legal contract",
    ],
    correctIndex: 0,
    explanation:
      "The model holds that our feelings are central; feelings (not just perceptions or thoughts) drive behavior.",
  },
  {
    id: "mr-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "Customers enter a cramped, noisy, badly lit store and quickly leave without browsing. In Mehrabian-Russell terms this is:",
    options: [
      "Avoidance behavior driven by an unpleasant emotional response",
      "Approach behavior driven by pleasure",
      "A corporate design success",
      "A facilitating service",
    ],
    correctIndex: 0,
    explanation:
      "The unpleasant environment produces negative feelings leading to avoidance (leaving, not exploring or spending).",
  },
  {
    id: "mr-h2",
    type: "multiple-choice",
    difficulty: "hard",
    chapter: 10,
    topic: "mehrabian-russell",
    prompt: "The course notes that the more complex the cognitive process, the:",
    options: [
      "Greater its potential effect on feelings",
      "Smaller its effect on feelings",
      "Lower the price must be",
      "Fewer employees are needed",
    ],
    correctIndex: 0,
    explanation:
      "Affect is driven by perceptions and cognitive processes; the more complex the cognitive process, the greater its potential effect on feelings.",
  },

  // ══════════════════════════ Chapter 11 ══════════════════════════
  // Boundary Spanners
  {
    id: "bs-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "From the customer's perspective, the most important aspect of the service is:",
    options: [
      "The encounter with service staff",
      "The annual report",
      "The corporate logo",
      "The dividend",
    ],
    correctIndex: 0,
    explanation:
      "From the customer's perspective, the encounter with service employees is the most important aspect of the service.",
  },
  {
    id: "bs-e2",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "Occasional service encounters that shape customer perceptions are called:",
    options: ["Moments of truth", "Fail points", "Ambient conditions", "Referral schemes"],
    correctIndex: 0,
    explanation:
      "Occasional encounters are 'moments of truth' that shape customers' perceptions of the company.",
  },
  {
    id: "bs-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "Boundary spanners are frontline employees who:",
    options: [
      "Link the organization to the outside world, pursuing both operational and marketing goals",
      "Only work in accounting",
      "Never meet customers",
      "Set corporate strategy from headquarters",
    ],
    correctIndex: 0,
    explanation:
      "Boundary spanners link the organization to the outside world and must pursue operational and marketing goals simultaneously.",
  },
  {
    id: "bs-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "boundary-spanners",
    prompt: "A bank automates many transactions via ATM, IVR and its website. Per the course, frontline employees are now:",
    options: [
      "Still crucially important, as encounters remain 'moments of truth'",
      "Completely unnecessary",
      "Only useful for accounting",
      "Replaced entirely by machines",
    ],
    correctIndex: 0,
    explanation:
      "Even in low-contact services with automation, frontline employees remain very important and encounters are moments of truth.",
  },

  // Role Stress
  {
    id: "rs-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "role-stress",
    prompt: "Which is one of the three sources of role stress for frontline staff?",
    options: [
      "Organization versus client",
      "Profit versus revenue",
      "Logo versus uniform",
      "Hue versus chroma",
    ],
    correctIndex: 0,
    explanation:
      "The three sources are organization vs. client, person vs. role, and client vs. client.",
  },
  {
    id: "rs-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "role-stress",
    prompt: "The dilemma of following company rules versus meeting a customer's request is which type of conflict?",
    options: ["Organization versus client", "Person versus role", "Client versus client", "Cycle of success"],
    correctIndex: 0,
    explanation:
      "Organization vs. client is the dilemma between following company rules and meeting customer requests.",
  },
  {
    id: "rs-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "role-stress",
    prompt: "A naturally reserved employee must constantly act outgoing, clashing with their personality and beliefs. This is:",
    options: ["Person versus role conflict", "Organization versus client conflict", "Client versus client conflict", "Internal marketing"],
    correctIndex: 0,
    explanation:
      "Person vs. role conflict is the tension between job requirements and the employee's own personality and beliefs.",
  },
  {
    id: "rs-h2",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "role-stress",
    prompt: "Two customers argue and a staff member must step in to resolve it. This source of role stress is:",
    options: ["Client versus client", "Person versus role", "Organization versus client", "Cycle of mediocrity"],
    correctIndex: 0,
    explanation:
      "Client vs. client conflict involves disputes between customers that require employee intervention.",
  },

  // Emotional Labor
  {
    id: "el-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "Emotional labor is the act of:",
    options: [
      "Expressing socially desired emotions during service transactions",
      "Lifting heavy objects at work",
      "Calculating the customer's bill",
      "Designing the servicescape",
    ],
    correctIndex: 0,
    explanation:
      "Emotional labor is expressing socially desired emotions during service transactions.",
  },
  {
    id: "el-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "Per the course, what helps alleviate the strain of emotional labor?",
    options: [
      "Good HR practices — selective hiring and training",
      "Cutting wages",
      "Removing all customer contact",
      "Ignoring employee wellbeing",
    ],
    correctIndex: 0,
    explanation:
      "Good human-resource practices help alleviate the stress of emotional labor through selective hiring and training.",
  },
  {
    id: "el-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "emotional-labor",
    prompt: "A flight attendant must stay warm and cheerful with a rude passenger despite feeling angry. This requirement is an example of:",
    options: ["Emotional labor", "A House of Brands strategy", "Flowcharting", "An ambient condition"],
    correctIndex: 0,
    explanation:
      "Displaying socially desired emotions (cheerfulness) regardless of true feelings is emotional labor.",
  },

  // Cycle of Failure
  {
    id: "cof-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "The Cycle of Failure has two interlocking loops. They are the:",
    options: ["Employee cycle and the customer cycle", "Profit cycle and the loss cycle", "Hue cycle and chroma cycle", "Front-stage and back-stage cycle"],
    correctIndex: 0,
    explanation:
      "It comprises an employee cycle (narrow jobs, boredom, high turnover) and a customer cycle (dissatisfaction, rapid turnover).",
  },
  {
    id: "cof-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "Which features describe the EMPLOYEE side of the Cycle of Failure?",
    options: [
      "Narrow job design, emphasis on rules, boredom and high turnover",
      "Intensive training and profit sharing",
      "Empowerment and long-term relationships",
      "Attractive wages and benefits",
    ],
    correctIndex: 0,
    explanation:
      "The employee cycle: narrow job design, emphasis on rules, boredom, weak service response and high employee turnover.",
  },
  {
    id: "cof-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "Deliberately slowing service or treating guests rudely is referred to in the course as:",
    options: ["Service sabotage", "Service blueprinting", "Internal marketing", "Empowerment"],
    correctIndex: 0,
    explanation:
      "Service sabotage involves covert or overt, routine or intermittent behaviors such as deliberately slowing service or being rude.",
  },
  {
    id: "cof-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "A call centre uses narrow jobs and rule-focus, suffers bored staff and high turnover, and constantly faces dissatisfied customers. This illustrates the:",
    options: ["Cycle of Failure", "Cycle of Success", "Mehrabian-Russell model", "Flower of Service"],
    correctIndex: 0,
    explanation:
      "Narrow jobs, boredom, high employee turnover and customer dissatisfaction are the textbook Cycle of Failure.",
  },

  // Cycle of Success
  {
    id: "cos-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "The Cycle of Success reflects:",
    options: [
      "A long-term view with investment in people, attractive wages and intensive training",
      "Minimising labor cost at all times",
      "Eliminating customer service",
      "Random hiring with no training",
    ],
    correctIndex: 0,
    explanation:
      "The Cycle of Success takes a long-term view: investment in people, attractive wages/benefits and intensive training.",
  },
  {
    id: "cos-m1",
    type: "comparison",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "In the Cycle of Success, why do customers remain loyal?",
    options: [
      "They appreciate the continuity and quality of service",
      "They have no other choice",
      "Prices are always lowest",
      "Staff change frequently",
    ],
    correctIndex: 0,
    explanation:
      "Happier employees deliver higher-quality service, and customers stay loyal because they appreciate continuity and quality.",
  },
  {
    id: "cos-h1",
    type: "comparison",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-success",
    prompt: "The Cycle of Mediocrity is typically found in which kind of organization?",
    options: [
      "Large bureaucratic organizations where success is measured by the absence of mistakes",
      "Small empowered start-ups",
      "Firms with profit sharing and high involvement",
      "Organizations with no rules at all",
    ],
    correctIndex: 0,
    explanation:
      "The Cycle of Mediocrity appears in large bureaucracies: standardized service, promotions by seniority, success measured by absence of mistakes.",
  },

  // Empowerment
  {
    id: "emp-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "empowerment",
    prompt: "Empowerment is most appropriate when the strategy is based on:",
    options: [
      "Customization, differentiation, long-term relationships and complex technologies",
      "High-volume, standardized, low-variation service",
      "Eliminating all customer contact",
      "Minimising wages",
    ],
    correctIndex: 0,
    explanation:
      "Empowerment suits strategies based on customization/differentiation, long-term relationships and complex technologies.",
  },
  {
    id: "emp-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "empowerment",
    prompt: "The involvement model distributes which four things throughout the organization?",
    options: [
      "Information, knowledge, power and rewards",
      "Hue, value, chroma and tone",
      "Prospects, users, employees and managers",
      "Information, billing, payment and order-taking",
    ],
    correctIndex: 0,
    explanation:
      "The involvement model distributes information, knowledge, power and rewards throughout the organization.",
  },
  {
    id: "emp-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "empowerment",
    prompt: "Which is one of the levels of involvement listed in the course?",
    options: [
      "Suggestion involvement",
      "Marketing involvement",
      "Pricing involvement",
      "Branding involvement",
    ],
    correctIndex: 0,
    explanation:
      "Levels of involvement: suggestion involvement, job involvement, and high involvement (including profit sharing).",
  },
  {
    id: "emp-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "empowerment",
    prompt: "A firm offers highly standardized, high-volume, low-variation service. Compared with empowerment, this context usually fits:",
    options: [
      "A standardized 'production-line' approach",
      "Maximum empowerment and profit sharing",
      "Complete elimination of rules",
      "Customized one-to-one relationships",
    ],
    correctIndex: 0,
    explanation:
      "Empowerment suits customized, relationship-based, complex services; standardized high-volume service fits a production-line approach.",
  },

  // Service Culture
  {
    id: "sc-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "service-culture",
    prompt: "A service culture consists of:",
    options: [
      "Shared perceptions and values about what is important",
      "A list of product prices",
      "The legal terms of employment",
      "The company's logo guidelines",
    ],
    correctIndex: 0,
    explanation:
      "A service culture is shared perceptions and values about what is important; a strong culture focuses the whole organization on the front line.",
  },
  {
    id: "sc-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "service-culture",
    prompt: "The 'inverted organizational pyramid' means:",
    options: [
      "The front line is placed at the top, supported by management",
      "Managers are the most important and sit at the top",
      "Customers are removed from the chart",
      "Profit sits above all employees",
    ],
    correctIndex: 0,
    explanation:
      "The inverted pyramid places the front line at the top, supported by management below.",
  },
  {
    id: "sc-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "service-culture",
    prompt: "A leader changes employees' values to align with the firm and motivates them to perform better. This is described as:",
    options: [
      "Charismatic/transformational leadership",
      "A House of Brands strategy",
      "Service sabotage",
      "Flowcharting",
    ],
    correctIndex: 0,
    explanation:
      "Charismatic/transformational leadership changes employees' values to align with the firm and motivates higher performance.",
  },

  // Internal Marketing
  {
    id: "im-e1",
    type: "definition",
    difficulty: "easy",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "Internal marketing is described as essential in:",
    options: [
      "Large service businesses, to ensure effective delivery and build employee trust/loyalty",
      "Only manufacturing firms",
      "Only one-person businesses",
      "Only government agencies",
    ],
    correctIndex: 0,
    explanation:
      "Internal marketing is essential in large service businesses: it ensures effective delivery, harmonious relationships and employee trust/loyalty.",
  },
  {
    id: "im-m1",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "In the Service Talent Cycle, 'hire the right people' includes competing for:",
    options: [
      "'Talent market share' by being a preferred employer",
      "The lowest wages possible",
      "The largest building",
      "The cheapest advertising",
    ],
    correctIndex: 0,
    explanation:
      "Hiring the right people means competing for 'talent market share' and being a preferred employer, using structured interviews, behavior observation, personality tests and realistic job previews.",
  },
  {
    id: "im-m2",
    type: "multiple-choice",
    difficulty: "medium",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "When selecting employees, the course notes that the best predictor of future behavior is:",
    options: [
      "Past behavior",
      "The candidate's age",
      "The candidate's salary expectation",
      "The candidate's address",
    ],
    correctIndex: 0,
    explanation:
      "Observing behavior is a key selection tool because past behavior is the best predictor of future behavior.",
  },
  {
    id: "im-h1",
    type: "scenario",
    difficulty: "hard",
    chapter: 11,
    topic: "internal-marketing",
    prompt: "A firm trains staff in culture and product knowledge, empowers them, builds teams, and rewards them with recognition and goal achievement. These are all steps of the:",
    options: [
      "Service Talent Cycle supported by internal marketing",
      "Flower of Service",
      "Mehrabian-Russell model",
      "Branding spectrum",
    ],
    correctIndex: 0,
    explanation:
      "Hiring, training, empowering, team-building and motivating via rewards are the Service Talent Cycle, supported by internal marketing.",
  },

  // ── A few extra True/False items to strengthen each difficulty pool ──
  {
    id: "x-fac-tf",
    type: "true-false",
    difficulty: "easy",
    chapter: 4,
    topic: "facilitating-services",
    prompt: "Order-Taking includes reservations and check-in.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "Order-Taking covers applications, order entry, and reservations/check-in.",
  },
  {
    id: "x-sst-tf",
    type: "true-false",
    difficulty: "easy",
    chapter: 8,
    topic: "ssts",
    prompt: "An ATM is an example of a self-service technology (SST).",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "ATMs (and IVR and websites) let customers self-produce the service — classic SSTs.",
  },
  {
    id: "x-scape-tf",
    type: "true-false",
    difficulty: "easy",
    chapter: 10,
    topic: "servicescape",
    prompt: "Spatial layout and functionality is one of the three core servicescape dimensions.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The three dimensions are ambient conditions; spatial layout & functionality; and signs, symbols & artifacts.",
  },
  {
    id: "x-mc-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    prompt: "Information and consultation are ways marketing communications add value to the product.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The course states information & consultation represent important ways to add value through communication content.",
  },
  {
    id: "x-cof-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "cycle-of-failure",
    prompt: "High employee turnover in the Cycle of Failure leads customers to constantly deal with new, unfamiliar faces.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The customer cycle includes constantly dealing with new faces and rapid customer turnover.",
  },
  {
    id: "x-emp-tf",
    type: "true-false",
    difficulty: "medium",
    chapter: 11,
    topic: "empowerment",
    prompt: "High involvement, the deepest level of involvement, can include profit sharing.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "Levels of involvement are suggestion, job, and high involvement (which can include profit sharing).",
  },
  {
    id: "x-bp-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 8,
    topic: "blueprinting",
    prompt: "A blueprint shows everything visible to the customer and where potential fail points lie.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "A blueprint specifies in detail how the process is built, including what's visible to the customer and the fail points.",
  },
  {
    id: "x-amb-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 10,
    topic: "ambient-conditions",
    prompt: "Music can have a powerful effect even at barely audible levels.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The course states music has a powerful effect even at barely audible levels.",
  },
  {
    id: "x-pa-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 10,
    topic: "pleasure-arousal",
    prompt: "Emotions during service encounters are an important driver of customer loyalty.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The course states emotions during service encounters are an important driver of customer loyalty.",
  },
  {
    id: "x-cd-tf",
    type: "true-false",
    difficulty: "hard",
    chapter: 7,
    topic: "corporate-design",
    prompt: "Corporate design strategies are part and parcel of the communications mix.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "The course explicitly states corporate design strategies are part and parcel of the communication mix.",
  },
];
