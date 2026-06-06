import type { EssayQuestion } from "../types";

/**
 * KSU-style open-ended questions for Services Marketing. Each has a concise
 * model answer + key points used to ground the AI grader (partial credit by
 * how many key points the student covers). Mix of "essay" (discuss/explain/
 * compare) and "short" (short note) — mirroring King Saud University exams.
 */
export const SERVICES_MARKETING_ESSAYS: EssayQuestion[] = [
  {
    id: "sm-es-1",
    difficulty: "medium",
    chapter: 4,
    topic: "flower-of-service",
    kind: "essay",
    prompt:
      "Using the Flower of Service, explain the difference between facilitating and enhancing supplementary services, and give an example of each.",
    modelAnswer:
      "The Flower of Service places the core product at the centre, surrounded by eight petals of supplementary services grouped into two types. Facilitating services are needed to deliver the core product or to help customers use it — Information, Order-Taking, Billing and Payment (e.g., providing booking/confirmation information). Enhancing services add extra value beyond what is strictly necessary — Consultation, Hospitality, Safekeeping and Exceptions (e.g., a welcoming lounge / hospitality). A well-managed firm keeps all petals 'fresh and well-formed'.",
    keyPoints: [
      "Facilitating = needed for delivery or to use the core product",
      "Facilitating petals: Information, Order-Taking, Billing, Payment",
      "Enhancing = add extra value for the customer",
      "Enhancing petals: Consultation, Hospitality, Safekeeping, Exceptions",
      "A correct example of each type",
    ],
  },
  {
    id: "sm-es-2",
    difficulty: "medium",
    chapter: 7,
    topic: "marketing-communications",
    kind: "essay",
    prompt:
      "Services are intangible. Discuss the problems intangibility creates for marketing communications and how firms overcome them.",
    modelAnswer:
      "Intangibility creates problems such as abstractness, generality, non-searchability (can't inspect before purchase) and mental impalpability (hard to picture benefits). Firms overcome these by using tangible cues/physical evidence, vivid and interactive imagery, documentation, and metaphors that make benefits concrete (e.g., Allstate's 'You're in good hands', Prudential's Rock of Gibraltar). Showing employees at work and using testimonials also makes the service tangible and sets expectations.",
    keyPoints: [
      "Intangibility problems: abstractness, generality, non-searchability, mental impalpability",
      "Use tangible cues / physical evidence",
      "Use metaphors and vivid imagery",
      "A relevant example (e.g., Allstate / Prudential)",
    ],
  },
  {
    id: "sm-es-3",
    difficulty: "medium",
    chapter: 8,
    topic: "blueprinting",
    kind: "essay",
    prompt:
      "Compare a flowchart with a service blueprint. What does a blueprint add, and why is it useful?",
    modelAnswer:
      "A flowchart describes an existing process simply, showing the sequence of steps and how customer involvement differs by service type. A service blueprint is a more complex tool that additionally distinguishes front-stage from back-stage actions via the line of visibility, shows support processes and physical evidence, identifies potential fail points, and pinpoints customer waits so standards (e.g., maximum waiting time) can be set. It is useful for designing/redesigning services and improving quality.",
    keyPoints: [
      "Flowchart = simple description of an existing process",
      "Blueprint distinguishes front-stage vs back-stage (line of visibility)",
      "Blueprint identifies fail points and waits",
      "Blueprint supports standards and service (re)design",
    ],
  },
  {
    id: "sm-es-4",
    difficulty: "hard",
    chapter: 11,
    topic: "cycle-of-failure",
    kind: "essay",
    prompt:
      "Explain the Cycle of Failure and contrast it with the Cycle of Success. What should a manager do to move from one to the other?",
    modelAnswer:
      "The Cycle of Failure starts from minimizing labor costs: narrow job design, low pay and little training produce an employee cycle (boredom, weak service, high turnover) and a customer cycle (dissatisfaction, low loyalty, rapid churn), trapping the firm in low margins. The Cycle of Success takes a long-term view: investment in good pay, training and empowerment yields motivated, capable employees, low turnover, high quality and loyal customers, generating higher margins. A manager moves from failure to success by investing in people — broadening jobs, paying and training well, and empowering frontline staff.",
    keyPoints: [
      "Cycle of Failure begins with minimizing labor costs (narrow jobs, low pay, little training)",
      "Failure has two loops: employee cycle and customer cycle",
      "Cycle of Success = long-term investment in people → quality & loyalty",
      "Manager fix: invest in pay, training, broadened jobs and empowerment",
    ],
  },
  {
    id: "sm-es-5",
    difficulty: "medium",
    chapter: 10,
    topic: "mehrabian-russell",
    kind: "short",
    prompt:
      "Write a short note on the Mehrabian-Russell Stimulus-Response Model and its two behavioral outcomes.",
    modelAnswer:
      "The Mehrabian-Russell model holds that environmental stimuli, filtered through a person's emotional state (pleasure and arousal), drive behavior. Feelings — not just perceptions — are central. The two broad behavioral outcomes are approach (stay, explore, spend, affiliate) and avoidance (the opposite), along with outcomes such as amount spent and satisfaction.",
    keyPoints: [
      "Feelings are central to responding to the environment",
      "Emotional state described by pleasure and arousal",
      "Two outcomes: approach or avoidance",
    ],
  },
  {
    id: "sm-es-6",
    difficulty: "medium",
    chapter: 4,
    topic: "branding-alternatives",
    kind: "short",
    prompt:
      "Write a short note on the spectrum of branding alternatives for services, with an example of each level.",
    modelAnswer:
      "The spectrum runs from corporate to individual product branding: Branded House (one brand across all offerings, e.g., Virgin), Subbrands (a master brand with distinct sub-brands, e.g., Raffles Class at Singapore Airlines / British Airways' travel classes), Endorsed Brands (product brand primary, backed by the corporate brand, e.g., Courtyard by Marriott / Starwood), and House of Brands (separate, stand-alone brands, e.g., P&G / Yum! Brands).",
    keyPoints: [
      "Branded House (e.g., Virgin)",
      "Subbrands (e.g., Raffles Class / British Airways)",
      "Endorsed Brands (e.g., Courtyard by Marriott)",
      "House of Brands (e.g., P&G / Yum!)",
    ],
  },
];
