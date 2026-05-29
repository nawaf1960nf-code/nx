import type { TopicId } from "./types";

/**
 * Knowledge Base — concise, syllabus-grounded notes for each topic.
 *
 * This serves as the retrieval source ("RAG context") for the AI features.
 * When the AI generates questions, explanations or analysis it is instructed
 * to rely ONLY on this content, which keeps everything within the course
 * material (Chapters 4, 7, 8, 10, 11) and prevents hallucination.
 */
export const KNOWLEDGE_BASE: Record<TopicId, string> = {
  "flower-of-service":
    "The Flower of Service depicts a core product surrounded by supplementary service elements grouped into two categories: facilitating services (needed for service delivery or that aid use of the core product) and enhancing services (that add extra value). The eight petals are: Information, Order-Taking, Billing, Payment (facilitating) and Consultation, Hospitality, Safekeeping, Exceptions (enhancing). A well-designed flower has petals that are fresh and well-formed; poorly delivered supplementary elements are like wilted petals.",
  "facilitating-services":
    "Facilitating supplementary services are required for service delivery or aid the use of the core product. The four facilitating petals are: Information (directions, hours, prices, terms, warnings, confirmation), Order-Taking (applications, order entry, reservations, check-in), Billing (accurate, clear, timely statements), and Payment (self-service, direct to payee, automatic deductions). Without them the core service cannot be delivered.",
  "enhancing-services":
    "Enhancing supplementary services add extra value for customers and differentiate a firm from competitors. The four enhancing petals are: Consultation (advice, counseling, tutoring), Hospitality (greeting, food/beverages, restrooms, waiting facilities), Safekeeping (looking after customers' possessions: parking, baggage, storage), and Exceptions (special requests, problem solving, handling complaints/suggestions/compliments, restitution).",
  "branding-alternatives":
    "Service branding strategies (a brand architecture spectrum): Branded House (single brand spans all products, e.g. Virgin), Sub-Brands (master brand is primary with a distinct product sub-brand), Endorsed Brands (product brand primary, endorsed by corporate brand, e.g. Courtyard by Marriott), and House of Brands (separate, unrelated brands, e.g. P&G). Tiering uses brands/sub-brands to distinguish service levels (e.g. hotel classes).",
  "new-service-development":
    "New service development ranges from style changes and service improvements (lowest innovation) to major process/product innovations. The hierarchy: style changes, service improvements, supplementary service innovations, process line extensions, product line extensions, major process innovations, and major service innovations (highest). Because services are intangible, firms should use service blueprinting and physical evidence to make new concepts tangible and reduce failure risk.",
  "marketing-communications":
    "Service communications face challenges from intangibility (mental impalpability, generality, non-searchability, abstractness). Tactics to overcome intangibility include: using tangible cues/physical evidence, metaphors, documentation, and vivid/interactive imagery. The marketing communications mix spans personal selling, advertising, sales promotion, publicity/PR, instructional materials, and corporate design. Communication objectives include positioning, managing demand, educating customers, and building loyalty.",
  "5ws-model":
    "The 5 Ws model structures service communications planning: WHO is the target audience; WHAT do we need to communicate and achieve (objectives); HOW should we communicate it (the message/strategy); WHERE should we communicate it (the media channels); WHEN should the communications take place (timing).",
  "word-of-mouth":
    "Word of mouth (WOM) is highly credible because it comes from other customers, and it is especially influential for services that are high in experience and credence qualities. Firms can stimulate positive WOM through referral incentives/reward schemes, encouraging reviews and testimonials, and creating buzz. Online WOM (eWOM) includes reviews and social media. WOM is more persuasive than firm-controlled messages.",
  "corporate-design":
    "Corporate design uses a consistent, unified set of tangible visual elements—names, logos, color schemes, signage, uniforms, vehicles, stationery, building/interior design—to create a recognizable brand identity and make the intangible tangible. It is vital for services because customers use these visual cues to evaluate quality and to distinguish one provider from another.",
  blueprinting:
    "Blueprinting is a tool for designing and specifying intangible service processes, building on flowcharting by also showing customer interactions, frontstage and backstage employee actions, support processes, and physical evidence. It identifies the line of interaction, line of visibility, and line of internal interaction, and pinpoints fail points and waits where problems can occur.",
  flowcharting:
    "Flowcharting is a technique that maps the sequence of steps involved in delivering a service to customers, helping clarify how the nature of customer involvement differs across the four service categories (people processing, possession processing, mental stimulus processing, information processing). It shows the flow of the process but, unlike a blueprint, does not distinguish frontstage/backstage or specify standards and fail points.",
  "service-blueprint":
    "A service blueprint specifies in detail how a service process is constructed, distinguishing what customers experience frontstage from the backstage activities and support processes they cannot see, separated by the line of visibility. Key components: physical evidence, customer actions, frontstage (onstage) contact employee actions, backstage contact employee actions, support processes, the line of interaction, line of visibility, and line of internal interaction. Blueprints reveal fail points, waits, and service standards.",
  "fail-proofing":
    "Fail-proofing (poka-yokes) designs procedures that prevent errors before they occur, for both employees (e.g. checklists, height bars, computer prompts) and customers (e.g. locks, beeps, signs). On a blueprint, fail points are steps where there is a significant risk of problems that can hurt service quality; fail-proofing methods are built in at these points to maintain reliability.",
  "service-standards":
    "Service standards translate quality goals into specific, measurable operational targets (e.g. answer the phone within three rings, deliver within 30 minutes). On a blueprint, standards are set for each frontstage step, ideally based on customer expectations, and used to manage execution time and reduce excessive waits. Standards should be expressed as a range and revised as customer expectations rise.",
  ssts:
    "Self-service technologies (SSTs) let customers produce a service independently without direct employee involvement (e.g. ATMs, online check-in, kiosks, automated phone systems). Benefits include convenience, speed, cost savings, and 24/7 access; risks include customer confusion, technology failure, and lack of recovery. Customers adopt SSTs when they offer clear advantages, are easy to use, reliable, and fun. Firms must manage SST failures and provide recovery options.",
  servicescape:
    "The servicescape is the physical environment in which a service is delivered and where the firm and customer interact, including all tangible elements that facilitate performance and communicate the service. It serves to shape customer experiences/behaviors, signal quality and position the firm, form part of the value proposition, and facilitate the service encounter. Dimensions include ambient conditions, spatial layout/functionality, and signs, symbols & artifacts.",
  "ambient-conditions":
    "Ambient conditions are the background characteristics of the environment that affect the human senses—music, scent, color, lighting, temperature, noise, and air quality. They are perceived both separately and holistically and influence mood and behavior, often below conscious awareness. Music tempo/volume, aromas, and color (warm vs. cool hues) measurably affect how long customers stay and how much they spend.",
  "pleasure-arousal":
    "In the affect/feelings model, two key emotional dimensions drive responses to environments: pleasure (how pleasant vs. unpleasant a person feels) and arousal (how stimulated/alert vs. sleepy a person feels). Pleasant, appropriately arousing environments encourage approach behaviors. The combination matters: high arousal is positive in a pleasant environment but negative in an unpleasant one (it becomes distress).",
  "mehrabian-russell":
    "The Mehrabian-Russell Stimulus-Response Model explains how environments affect behavior: environmental stimuli plus the individual's emotional state (described by pleasure and arousal) lead to either approach or avoidance responses. Approach behaviors include desire to stay, explore, work, affiliate, and spend; avoidance behaviors are the opposite. The internal emotional response mediates between the servicescape and behavior.",
  "role-stress":
    "Frontline service employees often experience role stress from conflicting demands. Sources include: organization/client conflict (rules vs. customer wishes), person/role conflict (job duties vs. self-perception/personality), and inter-client conflict (incompatible demands from different customers). Stress also arises from being the meat in the sandwich between management and customers, and from emotional labor.",
  "boundary-spanners":
    "Boundary spanners are frontline employees who operate at the boundary between the organization and its customers, linking the inside of the firm to the outside world. They perform both operational and marketing tasks, and because they straddle this boundary they are subject to role conflict and role stress. They are central to service quality, customer satisfaction, and brand image.",
  empowerment:
    "Empowerment gives employees the authority, tools, information, and discretion to make decisions and resolve customer problems on the spot. The enablement/empowerment view requires giving the competencies and resources needed. Empowerment suits customized, relationship-based services with non-routine problems; a production-line (standardized) approach suits simple, high-volume, low-variation services. Empowerment increases satisfaction and faster recovery but costs more in training.",
  "service-culture":
    "A service culture consists of shared values and beliefs that put excellent service and customer satisfaction at the center of the organization, supported by stories, role models, and norms. It is built through leadership, internal communications, hiring, and reward systems. A strong service culture aligns employees toward delivering value and underpins the satisfaction-loyalty-profit chain.",
  "internal-marketing":
    "Internal marketing treats employees as internal customers and jobs as internal products, aiming to attract, develop, motivate, and retain qualified employees so they can deliver service quality. Activities include training, internal communications, empowerment, recognition, and creating service-minded, customer-oriented staff. It is essential because, in services, employees ARE the brand and satisfied employees produce satisfied customers.",
  "cycle-of-success":
    "The Cycle of Success is a virtuous circle: investing in good wages, training, and empowerment produces broadened job designs, motivated and capable employees, low turnover, high service quality, and satisfied/loyal customers, which generate higher margins that fund further investment. It is a long-term, human-resource-focused strategy contrasting with the cycles of failure and mediocrity.",
  "cycle-of-failure":
    "The Cycle of Failure is a vicious circle from minimizing labor costs: narrow job design, low pay, little training and selection lead to bored, dissatisfied employees, poor service quality, and high employee turnover (the employee cycle), which causes dissatisfied customers, low customer loyalty, and constant customer churn (the customer cycle). It traps firms in low margins and ongoing recruitment costs.",
  "emotional-labor":
    "Emotional labor is the effort of expressing socially desired emotions during service transactions—displaying feelings (smiling, friendliness, empathy) the employee may not actually feel, in line with display rules. Performing it repeatedly causes stress, burnout, and dissonance when felt and displayed emotions diverge. Firms can ease it through training, support, and a positive culture.",
};

/** Build a compact context block for the AI given a set of topics. */
export function buildContext(topics: TopicId[]): string {
  const seen = new Set<TopicId>();
  const lines: string[] = [];
  for (const t of topics) {
    if (seen.has(t)) continue;
    seen.add(t);
    if (KNOWLEDGE_BASE[t]) {
      lines.push(`### ${t}\n${KNOWLEDGE_BASE[t]}`);
    }
  }
  return lines.join("\n\n");
}
