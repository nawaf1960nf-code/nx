import type { EssayQuestion } from "../types";

/** KSU-style open-ended questions for Compensation Management (AI-graded). */
export const COMPENSATION_MANAGEMENT_ESSAYS: EssayQuestion[] = [
  {
    id: "cm-es-1",
    difficulty: "medium",
    chapter: 1,
    topic: "pay-model",
    kind: "essay",
    prompt:
      "Describe the pay model. List its four compensation objectives and its four policy choices.",
    modelAnswer:
      "The pay model has three parts: objectives, policies and techniques. The four OBJECTIVES are Efficiency (performance, quality, cost control), Fairness (procedural and distributive equity), Compliance (with laws) and Ethics (achieving results the right way). The four POLICY CHOICES are Internal Alignment (comparisons among jobs/skills inside the firm), External Competitiveness (pay vs competitors), Employee Contributions (the pay mix) and Management (right people, right pay, right objectives).",
    keyPoints: [
      "Objectives: Efficiency, Fairness, Compliance, Ethics",
      "Policy: Internal Alignment",
      "Policy: External Competitiveness",
      "Policy: Employee Contributions and Management",
    ],
  },
  {
    id: "cm-es-2",
    difficulty: "hard",
    chapter: 13,
    topic: "retirement-plans",
    kind: "essay",
    prompt:
      "Compare Defined Benefit (DB) and Defined Contribution (DC) retirement plans across risk, cost, the employee's role and the outcome.",
    modelAnswer:
      "In a Defined Benefit (pension) plan the benefit level is promised, the employer bears the risk, cost is fixed, the employee has no active role, and it encourages retention. In a Defined Contribution plan (e.g., 401k) the employer contribution is defined, the employee bears the investment risk, cost varies with ability to pay, the employee must manage investments, and it facilitates mobility.",
    keyPoints: [
      "DB: promised benefit; DC: defined contribution",
      "Risk: DB on employer, DC on employee",
      "Employee role: none (DB) vs manages investments (DC)",
      "Outcome: DB retention vs DC mobility",
    ],
  },
  {
    id: "cm-es-3",
    difficulty: "medium",
    chapter: 7,
    topic: "pay-policies",
    kind: "essay",
    prompt:
      "Explain the three competitive pay-level policies (lead, match, lag) and when a firm might choose each.",
    modelAnswer:
      "Lead the market: pay above competitors to attract and retain the best talent (useful when quality of talent is critical). Match (market pricing): pay the same as competitors — the most common policy, balancing cost and attraction. Lag the market: pay below competitors, often offset by other returns such as a strong culture, mission or future growth (useful when ability to pay is limited). Firms may also use a hybrid policy across different job families.",
    keyPoints: [
      "Lead = above market to attract/retain the best",
      "Match = same as competitors (most common)",
      "Lag = below market, offset by other returns",
      "When each is appropriate",
    ],
  },
  {
    id: "cm-es-4",
    difficulty: "medium",
    chapter: 12,
    topic: "flexible-benefits",
    kind: "essay",
    prompt:
      "Discuss the advantages and disadvantages of flexible benefit programs, including the meaning of adverse selection.",
    modelAnswer:
      "Advantages: they satisfy the unique needs of a diverse workforce, improve understanding through involvement, make new benefits cheaper to introduce, and contain costs via a fixed dollar maximum. Disadvantages: employees may make bad choices (gaps in coverage), administration is more burdensome/expensive, nondiscrimination rules apply (Section 125), and adverse selection occurs — employees who will use a benefit heavily are the ones who select it, which raises its cost.",
    keyPoints: [
      "Advantage: meets diverse needs / involvement / cost containment",
      "Disadvantage: bad choices and higher administration",
      "Adverse selection = heavy users self-select, raising cost",
      "Nondiscrimination (Section 125)",
    ],
  },
  {
    id: "cm-es-5",
    difficulty: "medium",
    chapter: 16,
    topic: "expatriate-pay",
    kind: "short",
    prompt:
      "Write a short note on the balance sheet approach to expatriate compensation.",
    modelAnswer:
      "The balance sheet approach is the most widely used method of expatriate compensation. Its objective is to maintain equivalent purchasing power and standard of living between the home and host countries, so the expatriate is neither better nor worse off. Its components are base salary, taxes (often tax equalization), housing, goods and services, and incentives/premiums.",
    keyPoints: [
      "Most widely used expatriate method",
      "Goal: equivalent purchasing power / standard of living (home vs host)",
      "Components: base salary, taxes, housing, goods & services, incentives",
    ],
  },
  {
    id: "cm-es-6",
    difficulty: "hard",
    chapter: 7,
    topic: "labor-theories",
    kind: "short",
    prompt:
      "Write a short note on Efficiency Wage Theory and Compensating Differentials.",
    modelAnswer:
      "Efficiency Wage Theory argues that paying high wages can LOWER total labor costs by attracting better talent, reducing turnover and increasing effort. Compensating Differentials (Adam Smith) are higher wages paid for jobs with negative or undesirable characteristics (e.g., danger or remoteness), to compensate workers for those drawbacks.",
    keyPoints: [
      "Efficiency wages: high pay can lower total labor cost (talent, turnover, effort)",
      "Compensating differentials = higher pay for undesirable job features",
      "Compensating differentials linked to Adam Smith",
    ],
  },
];
