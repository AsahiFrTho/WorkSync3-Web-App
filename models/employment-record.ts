import { model, models, Schema, type Types } from "mongoose";

export type EmploymentType = "wage_employment" | "self_employment" | "apprenticeship";
export type VerificationStatus = "pending" | "verified" | "disputed" | "flagged";
export type FollowUpMilestone = "30_day" | "90_day" | "180_day" | "365_day";
export type FollowUpStatus = "pending" | "retained" | "left_job" | "wage_increased" | "unreachable";
export type VerificationMethod = "employer_portal" | "hr_call" | "offer_letter" | "payslip" | "pf_uan";

export interface IFollowUp {
  milestone: FollowUpMilestone;
  dueDate: Date;
  completedDate?: Date;
  status: FollowUpStatus;
  currentWage?: number;
  verifiedBy?: string;
  notes?: string;
}

export interface IVerificationMetadata {
  verifiedAt?: Date;
  verifiedBy?: string;
  method?: VerificationMethod;
  disputeReason?: string;
  remarks?: string;
}

export interface IEmploymentRecord {
  trainee: Types.ObjectId;
  traineeId: string;
  employerName: string;
  employerContactEmail?: string;
  jobRole: string;
  employmentType: EmploymentType;
  district: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  monthlyWage: number;
  verificationStatus: VerificationStatus;
  verificationMetadata?: IVerificationMetadata;
  followUps?: IFollowUp[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    milestone: {
      type: String,
      enum: ["30_day", "90_day", "180_day", "365_day"],
      required: true,
    },
    dueDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "retained", "left_job", "wage_increased", "unreachable"],
      default: "pending",
    },
    currentWage: { type: Number, min: 0 },
    verifiedBy: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: true, timestamps: true }
);

const verificationMetadataSchema = new Schema<IVerificationMetadata>(
  {
    verifiedAt: { type: Date },
    verifiedBy: { type: String, trim: true },
    method: {
      type: String,
      enum: ["employer_portal", "hr_call", "offer_letter", "payslip", "pf_uan"],
      default: "employer_portal",
    },
    disputeReason: { type: String, trim: true },
    remarks: { type: String, trim: true },
  },
  { _id: false }
);

const employmentRecordSchema = new Schema<IEmploymentRecord>(
  {
    // trainee (ObjectId) enables native Mongoose population (.populate('trainee'))
    trainee: {
      type: Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
      index: true,
    },
    // traineeId (String domain identifier) enables fast direct lookups without joins
    traineeId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    employerName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    employerContactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["wage_employment", "self_employment", "apprenticeship"],
      default: "wage_employment",
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: true,
      index: true,
    },
    monthlyWage: {
      type: Number,
      required: true,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "disputed", "flagged"],
      default: "pending",
      index: true,
    },
    verificationMetadata: {
      type: verificationMetadataSchema,
      default: () => ({}),
    },
    followUps: {
      type: [followUpSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Guarantee at DB level that a trainee has at most ONE active current employment record
employmentRecordSchema.index(
  { traineeId: 1, isCurrent: 1 },
  { unique: true, partialFilterExpression: { isCurrent: true } }
);

employmentRecordSchema.index({ traineeId: 1, createdAt: -1 });
employmentRecordSchema.index({ verificationStatus: 1, createdAt: -1 });
employmentRecordSchema.index({ district: 1, verificationStatus: 1 });

const EmploymentRecord =
  models.EmploymentRecord ||
  model<IEmploymentRecord>("EmploymentRecord", employmentRecordSchema);

export default EmploymentRecord;
