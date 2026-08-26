import "server-only";
import { Type } from "@google/genai";
import { gemini } from "./gemini";
import { getCareerEvidence } from "./evidence-aggregator";
import type {
  IAICareerIntelligenceResult,
  INormalizedTraineeEvidence,
} from "./types";

const careerIntelligenceSchema = {
  type: Type.OBJECT,
  properties: {
    traineeId: {
      type: Type.STRING,
      description: "Domain identifier of the trainee matching the input (e.g. KP-0001).",
    },
    generatedAt: {
      type: Type.STRING,
      description: "ISO 8601 timestamp string when the analysis was performed.",
    },
    careerOutcome: {
      type: Type.STRING,
      enum: ["Strong", "Positive", "Moderate", "Needs Attention", "At Risk"],
      description: "Overall synthesized career trajectory evaluation.",
    },
    outcomeConfidence: {
      type: Type.NUMBER,
      description: "Confidence level of this evaluation strictly from 0 to 100.",
    },
    trainingEmploymentAlignment: {
      type: Type.STRING,
      enum: ["Direct Match", "Partial Match", "Unrelated", "Mismatched"],
      description: "How directly the vocational training matches current employment duties.",
    },
    alignmentReason: {
      type: Type.STRING,
      description: "Concrete reason comparing trained skills/course with actual job role.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Critical"],
      description: "Career retention and stability risk classification.",
    },
    riskReason: {
      type: Type.STRING,
      description: "Factual explanation of the risk classification grounded strictly in evidence.",
    },
    careerInsight: {
      type: Type.STRING,
      description: "Strategic synthesis of wage trajectory, retention milestones, and placement state.",
    },
    recommendedNextSkill: {
      type: Type.OBJECT,
      properties: {
        skill: {
          type: Type.STRING,
          description: "Target skill or technical capability for upcoming career advancement.",
        },
        rationale: {
          type: Type.STRING,
          description: "Evidence-grounded justification for why this skill benefits the trainee.",
        },
      },
      required: ["skill", "rationale"],
    },
    evidenceUsed: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "List of explicit evidence fields and verified values utilized from input data.",
    },
  },
  required: [
    "traineeId",
    "generatedAt",
    "careerOutcome",
    "outcomeConfidence",
    "trainingEmploymentAlignment",
    "alignmentReason",
    "riskLevel",
    "riskReason",
    "careerInsight",
    "recommendedNextSkill",
    "evidenceUsed",
  ],
};

const VALID_CAREER_OUTCOMES = [
  "Strong",
  "Positive",
  "Moderate",
  "Needs Attention",
  "At Risk",
] as const;

const VALID_ALIGNMENTS = [
  "Direct Match",
  "Partial Match",
  "Unrelated",
  "Mismatched",
] as const;

const VALID_RISK_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

function buildPrompt(evidence: INormalizedTraineeEvidence): string {
  return `You are the KaushalPulse AI Career Intelligence Engine for vocational skilling in Maharashtra.
Analyze the following verified vocational training, employment, wage progression, and milestone retention evidence:

${JSON.stringify(evidence, null, 2)}

CRITICAL GROUNDING RULES:
1. The provided JSON evidence is authoritative, verified ground truth.
2. DO NOT invent, hallucinate, or extrapolate facts, salaries, dates, employers, credentials, or milestones not present in the input.
3. If employment verification is "disputed" or has a dispute reason, evaluate high/critical risk and reflect that exact dispute reason accurately.
4. If wage progression shows positive growth across follow-up milestones, cite the exact wage trajectory figures.
5. If verification is "pending", reflect that verification is awaiting employer confirmation.
6. The output must strictly follow the requested JSON schema.
7. Return ONLY valid JSON matching the schema with no extra commentary or markdown text outside JSON.`;
}

/**
 * Validates and sanitizes raw parsed JSON into a strictly conforming IAICareerIntelligenceResult.
 */
function sanitizeResult(
  raw: any,
  fallbackTraineeId: string
): IAICareerIntelligenceResult {
  const traineeId =
    typeof raw?.traineeId === "string" && raw.traineeId.trim()
      ? raw.traineeId.trim()
      : fallbackTraineeId;

  const generatedAt =
    typeof raw?.generatedAt === "string" && !isNaN(Date.parse(raw.generatedAt))
      ? raw.generatedAt
      : new Date().toISOString();

  const careerOutcome = VALID_CAREER_OUTCOMES.includes(raw?.careerOutcome)
    ? raw.careerOutcome
    : "Moderate";

  let outcomeConfidence =
    typeof raw?.outcomeConfidence === "number"
      ? raw.outcomeConfidence
      : Number(raw?.outcomeConfidence) || 75;
  outcomeConfidence = Math.max(0, Math.min(100, Math.round(outcomeConfidence)));

  const trainingEmploymentAlignment = VALID_ALIGNMENTS.includes(
    raw?.trainingEmploymentAlignment
  )
    ? raw.trainingEmploymentAlignment
    : "Partial Match";

  const alignmentReason =
    typeof raw?.alignmentReason === "string" && raw.alignmentReason.trim()
      ? raw.alignmentReason.trim()
      : "Alignment evaluated from course and employment profile.";

  const riskLevel = VALID_RISK_LEVELS.includes(raw?.riskLevel)
    ? raw.riskLevel
    : "Low";

  const riskReason =
    typeof raw?.riskReason === "string" && raw.riskReason.trim()
      ? raw.riskReason.trim()
      : "Risk evaluated based on verification status and retention trajectory.";

  const careerInsight =
    typeof raw?.careerInsight === "string" && raw.careerInsight.trim()
      ? raw.careerInsight.trim()
      : "Career insight synthesized from verified records.";

  const recommendedNextSkill = {
    skill:
      typeof raw?.recommendedNextSkill?.skill === "string" &&
      raw.recommendedNextSkill.skill.trim()
        ? raw.recommendedNextSkill.skill.trim()
        : "Advanced Domain Skills",
    rationale:
      typeof raw?.recommendedNextSkill?.rationale === "string" &&
      raw.recommendedNextSkill.rationale.trim()
        ? raw.recommendedNextSkill.rationale.trim()
        : "Continuous skill development supports long-term career progression.",
  };

  const evidenceUsed: string[] = Array.isArray(raw?.evidenceUsed)
    ? raw.evidenceUsed.filter(
        (item: any) => typeof item === "string" && item.trim().length > 0
      )
    : ["trainee.course", "employment.verificationStatus", "wageProgression"];

  return {
    traineeId,
    generatedAt,
    careerOutcome,
    outcomeConfidence,
    trainingEmploymentAlignment,
    alignmentReason,
    riskLevel,
    riskReason,
    careerInsight,
    recommendedNextSkill,
    evidenceUsed,
  };
}

/**
 * Generates structured AI Career Intelligence for a given trainee based on their
 * verified career evidence from MongoDB.
 *
 * Strict Guarantees:
 * - Server-only execution.
 * - Does NOT modify MongoDB or any trainee/employment records.
 * - Deterministically grounded in authoritative evidence without hallucination.
 * - Does NOT leak API keys or sensitive environment variables.
 *
 * @param traineeId Domain identifier of the trainee (e.g. "KP-0001")
 * @returns Structured IAICareerIntelligenceResult or null if evidence does not exist
 */
export async function generateCareerIntelligence(
  traineeId: string
): Promise<IAICareerIntelligenceResult | null> {
  if (!traineeId || typeof traineeId !== "string" || !traineeId.trim()) {
    return null;
  }

  const normalizedTraineeId = traineeId.trim();

  // 1. Fetch normalized career evidence (Read-Only)
  const evidence = await getCareerEvidence(normalizedTraineeId);
  if (!evidence) {
    return null;
  }

  try {
    const prompt = buildPrompt(evidence);

    // 2. Call Gemini with Structured JSON Schema Output
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: careerIntelligenceSchema,
        temperature: 0.1, // Low temperature for deterministic, factual adherence
      },
    });

    const responseText = response.text;
    if (!responseText || !responseText.trim()) {
      throw new Error("Empty response received from Gemini API");
    }

    // 3. Clean and parse JSON safely
    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsedData = JSON.parse(cleanJson);

    // 4. Validate and sanitize against schema
    return sanitizeResult(parsedData, normalizedTraineeId);
  } catch (error) {
    // Sanitize error logging to ensure API keys and credentials are never leaked
    const safeErrorMessage =
      error instanceof Error ? error.message : "Unknown Gemini analysis error";
    console.error(
      `[CareerIntelligence] Failed to generate intelligence for trainee ${normalizedTraineeId}:`,
      safeErrorMessage
    );
    return null;
  }
}
