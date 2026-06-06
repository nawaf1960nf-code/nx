import type { EssayQuestion } from "../types";

/** KSU-style open-ended questions for International Business (AI-graded). */
export const INTERNATIONAL_BUSINESS_ESSAYS: EssayQuestion[] = [
  {
    id: "ib-es-1",
    difficulty: "medium",
    chapter: 8,
    topic: "fdi-theories",
    kind: "essay",
    prompt:
      "Discuss the main theories that explain why firms undertake Foreign Direct Investment (FDI).",
    modelAnswer:
      "Four theories explain FDI. (1) International Product Life Cycle: firms export first, then invest abroad as the product matures. (2) Market Imperfections (internalization): firms invest to internalize transactions when imperfections (trade barriers, specialized knowledge) make markets inefficient. (3) Eclectic Theory (OLI): firms invest when location, ownership and internalization advantages combine. (4) Market Power: firms invest to build a dominant position, often via vertical integration (backward toward inputs or forward toward outputs).",
    keyPoints: [
      "International Product Life Cycle",
      "Market Imperfections / internalization",
      "Eclectic Theory (Location, Ownership, Internalization)",
      "Market Power / vertical integration",
    ],
  },
  {
    id: "ib-es-2",
    difficulty: "medium",
    chapter: 9,
    topic: "integration-levels",
    kind: "essay",
    prompt:
      "Explain the five levels of regional economic integration, from least to most integrated.",
    modelAnswer:
      "(1) Free Trade Area: members remove internal barriers but each keeps its own external barriers. (2) Customs Union: adds a common external trade policy. (3) Common Market: also allows free movement of labor and capital. (4) Economic Union: adds coordinated economic policies. (5) Political Union: economic AND political integration with coordinated political systems. Each level is deeper than the previous one.",
    keyPoints: [
      "Free Trade Area (internal barriers removed)",
      "Customs Union (common external policy)",
      "Common Market (free movement of labor & capital)",
      "Economic Union (coordinated economic policies)",
      "Political Union (economic + political integration)",
    ],
  },
  {
    id: "ib-es-3",
    difficulty: "hard",
    chapter: 11,
    topic: "ppp",
    kind: "essay",
    prompt:
      "What is Purchasing Power Parity (PPP)? Explain why it predicts long-term exchange rates better than short-term ones.",
    modelAnswer:
      "PPP states that the exchange rate between two currencies equals the ratio of their price levels, applied to a basket of goods (the Big Mac Index is a simple measure). Exchange rates adjust to inflation differences — high inflation depreciates a currency. PPP predicts long-term rates (10+ years) better than short-term because short-term rates are distorted by transportation costs, trade barriers, and business confidence/human psychology.",
    keyPoints: [
      "PPP = exchange rate equals ratio of price levels (basket of goods)",
      "Big Mac Index as a simple PPP measure",
      "Inflation differences drive currency depreciation/appreciation",
      "Short-term distorted by transport costs, trade barriers, psychology",
    ],
  },
  {
    id: "ib-es-4",
    difficulty: "medium",
    chapter: 12,
    topic: "intl-strategies",
    kind: "essay",
    prompt:
      "Compare the multinational (multidomestic) strategy with the global strategy, including one advantage and one drawback of each.",
    modelAnswer:
      "A multidomestic strategy adapts products and marketing to local preferences: advantage — close fit to local buyers and perceived high value; drawback — it cannot exploit scale economies, so cost structure is higher. A global strategy offers the same products and marketing everywhere: advantage — cost savings from standardization (scale and location economies) and knowledge sharing; drawback — it may overlook important local differences in preferences.",
    keyPoints: [
      "Multidomestic adapts to local preferences",
      "Multidomestic drawback: no scale economies / higher cost",
      "Global standardizes products and marketing",
      "Global drawback: overlooks local differences",
    ],
  },
  {
    id: "ib-es-5",
    difficulty: "medium",
    chapter: 14,
    topic: "export-financing",
    kind: "short",
    prompt:
      "Write a short note ranking the four export/import financing methods by exporter risk, and name the safest for the exporter.",
    modelAnswer:
      "Ordered from lowest to highest exporter risk: Advance Payment (safest for the exporter — paid before shipment), Letter of Credit (importer's bank pledges payment), Documentary Collection (a bank acts as intermediary without accepting risk), and Open Account (riskiest for the exporter — ship now, bill later; most favorable to the importer).",
    keyPoints: [
      "Advance Payment = safest for exporter",
      "Letter of Credit next",
      "Documentary Collection",
      "Open Account = riskiest for exporter",
    ],
  },
  {
    id: "ib-es-6",
    difficulty: "hard",
    chapter: 14,
    topic: "investment-entry",
    kind: "essay",
    prompt:
      "Compare a wholly owned subsidiary, a joint venture and a strategic alliance as investment entry modes, noting a key trade-off of each.",
    modelAnswer:
      "A wholly owned subsidiary is fully owned and controlled by one parent — full day-to-day control and coordination, but expensive and high risk. A joint venture is a separate company jointly owned by two or more entities — reduces risk and aids market penetration/channel access, but risks partner conflict and loss of control. A strategic alliance is cooperation WITHOUT forming a separate company — shares cost and taps partners' strengths, but risks partner conflict and creating a future competitor.",
    keyPoints: [
      "Wholly owned subsidiary: full control but expensive/high risk",
      "Joint venture: separate jointly owned company, reduced risk but partner conflict",
      "Strategic alliance: cooperation without a separate company",
      "Shared risk: partner conflict / creating a competitor",
    ],
  },
];
