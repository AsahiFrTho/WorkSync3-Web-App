import { connectToDatabase } from "@/lib/mongodb";
import Trainee, { type ITrainee } from "@/models/trainee";
import EmploymentRecord, { type IEmploymentRecord } from "@/models/employment-record";
import type {
  INormalizedTraineeEvidence,
  ITraineeEvidence,
  IEmploymentEvidence,
  IFollowUpEvidence,
  IVerificationMetadataEvidence,
  IWageProgressionEvidence,
} from "./types";

/**
 * Normalizes any Date or ISO date string into a clean YYYY-MM-DD string.
 * Returns null if the value is missing or invalid.
 */
function formatDate(dateValue?: Date | string | null): string | null {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

/**
 * Gathers and normalizes verified career evidence from MongoDB for a given trainee.
 *
 * Strict Guarantees:
 * 1. Read-Only: Uses .lean() and executes zero mutation queries (no save, update, delete).
 * 2. Data Minimization: Excludes internal DB keys (_id, __v), emails, auth tokens, system metadata.
 * 3. Deterministic Grounding: Captures exact database states without interpretation or invention.
 *
 * @param traineeId Domain identifier of the trainee (e.g. "KP-0001")
 * @returns INormalizedTraineeEvidence or null if the trainee does not exist
 */
export async function getCareerEvidence(
  traineeId: string
): Promise<INormalizedTraineeEvidence | null> {
  if (!traineeId || typeof traineeId !== "string" || !traineeId.trim()) {
    return null;
  }

  await connectToDatabase();

  const normalizedTraineeId = traineeId.trim();

  // 1. Fetch Trainee Profile (Read-Only)
  const traineeDoc = (await Trainee.findOne({
    traineeId: normalizedTraineeId,
  }).lean()) as ITrainee | null;

  if (!traineeDoc) {
    return null;
  }

  // 2. Fetch Current Employment Record (Read-Only)
  const employmentDoc = (await EmploymentRecord.findOne({
    traineeId: normalizedTraineeId,
    isCurrent: true,
  }).lean()) as IEmploymentRecord | null;

  // 3. Assemble Normalized Trainee Evidence
  const traineeEvidence: ITraineeEvidence = {
    traineeId: traineeDoc.traineeId,
    name: traineeDoc.name,
    course: traineeDoc.course,
    district: traineeDoc.district,
    status: traineeDoc.status,
    trainingProvider: traineeDoc.trainingProvider || null,
    trainingPeriod: traineeDoc.trainingPeriod
      ? {
          startDate: formatDate(traineeDoc.trainingPeriod.startDate),
          endDate: formatDate(traineeDoc.trainingPeriod.endDate),
          hours: typeof traineeDoc.trainingPeriod.hours === "number" ? traineeDoc.trainingPeriod.hours : null,
        }
      : null,
    skills: Array.isArray(traineeDoc.skills) ? traineeDoc.skills : [],
    certificate: traineeDoc.certificate
      ? {
          certificateId: traineeDoc.certificate.certificateId || null,
          issueDate: formatDate(traineeDoc.certificate.issueDate),
          nsqfLevel: typeof traineeDoc.certificate.nsqfLevel === "number" ? traineeDoc.certificate.nsqfLevel : null,
          issuer: traineeDoc.certificate.issuer || null,
          grade: traineeDoc.certificate.grade || null,
        }
      : null,
  };

  // 4. Calculate Wage Progression & Milestone Trajectory
  const startingWage = employmentDoc?.monthlyWage ?? traineeDoc.monthlyWage ?? 0;

  // Extract completed follow-up milestones with valid recorded wages
  const rawFollowUps = Array.isArray(employmentDoc?.followUps) ? employmentDoc.followUps : [];
  const completedWithWage = rawFollowUps.filter(
    (f) =>
      (f.status === "retained" || f.status === "wage_increased") &&
      typeof f.currentWage === "number" &&
      f.currentWage > 0
  );

  const latestFollowUp = completedWithWage.length > 0 ? completedWithWage[completedWithWage.length - 1] : null;
  const latestWage = latestFollowUp?.currentWage ?? startingWage;
  const wageDelta = latestWage - startingWage;
  const growthPercentage = startingWage > 0 ? Number(((wageDelta / startingWage) * 100).toFixed(2)) : 0;

  const wageProgression: IWageProgressionEvidence = {
    startingWage,
    latestWage,
    wageDelta,
    growthPercentage,
  };

  // 5. Assemble Normalized Employment Evidence
  let employmentEvidence: IEmploymentEvidence;

  if (!employmentDoc) {
    employmentEvidence = {
      hasRecord: false,
      employerName: null,
      jobRole: null,
      employmentType: null,
      district: null,
      startDate: null,
      endDate: null,
      isCurrent: false,
      startingWage: null,
      latestWage: null,
      trainingRelevance: null,
      verificationStatus: null,
      verificationMetadata: null,
      followUps: [],
      notes: null,
    };
  } else {
    const normalizedFollowUps: IFollowUpEvidence[] = rawFollowUps.map((f) => ({
      milestone: f.milestone,
      status: f.status,
      dueDate: formatDate(f.dueDate) || "",
      completedDate: formatDate(f.completedDate),
      currentWage: typeof f.currentWage === "number" ? f.currentWage : null,
      verifiedBy: f.verifiedBy || null,
      notes: f.notes || null,
    }));

    const verificationMetadata: IVerificationMetadataEvidence = {
      verifiedAt: formatDate(employmentDoc.verificationMetadata?.verifiedAt),
      verifiedBy: employmentDoc.verificationMetadata?.verifiedBy || null,
      method: employmentDoc.verificationMetadata?.method || null,
      disputeReason: employmentDoc.verificationMetadata?.disputeReason || null,
      remarks: employmentDoc.verificationMetadata?.remarks || null,
    };

    employmentEvidence = {
      hasRecord: true,
      employerName: employmentDoc.employerName || null,
      jobRole: employmentDoc.jobRole || null,
      employmentType: employmentDoc.employmentType || null,
      district: employmentDoc.district || null,
      startDate: formatDate(employmentDoc.startDate),
      endDate: formatDate(employmentDoc.endDate),
      isCurrent: Boolean(employmentDoc.isCurrent),
      startingWage: employmentDoc.monthlyWage ?? null,
      latestWage,
      trainingRelevance: employmentDoc.trainingRelevance || null,
      verificationStatus: employmentDoc.verificationStatus || null,
      verificationMetadata,
      followUps: normalizedFollowUps,
      notes: employmentDoc.notes || null,
    };
  }

  return {
    trainee: traineeEvidence,
    employment: employmentEvidence,
    wageProgression,
    aggregatedAt: new Date().toISOString(),
  };
}
