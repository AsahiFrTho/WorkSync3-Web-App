import { model, models, Schema } from "mongoose";

export interface ITrainingPeriod {
  startDate?: Date;
  endDate?: Date;
  hours?: number;
}

export interface ICertificate {
  certificateId?: string;
  issueDate?: Date;
  nsqfLevel?: number;
  issuer?: string;
  grade?: string;
}

export interface ITrainee {
  traineeId: string;
  name: string;
  district: string;
  course: string;
  status: "enrolled" | "completed" | "certified" | "employed" | "retained";
  monthlyWage: number;
  trainingProvider?: string;
  trainingPeriod?: ITrainingPeriod;
  skills?: string[];
  certificate?: ICertificate;
  createdAt?: Date;
  updatedAt?: Date;
}

const trainingPeriodSchema = new Schema<ITrainingPeriod>(
  {
    startDate: { type: Date },
    endDate: { type: Date },
    hours: { type: Number, min: 0 },
  },
  { _id: false }
);

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, trim: true },
    issueDate: { type: Date },
    nsqfLevel: { type: Number, default: 4 },
    issuer: { type: String, trim: true },
    grade: { type: String, trim: true },
  },
  { _id: false }
);

const traineeSchema = new Schema<ITrainee>(
  {
    traineeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["enrolled", "completed", "certified", "employed", "retained"],
      default: "enrolled",
    },
    monthlyWage: {
      type: Number,
      default: 0,
    },
    trainingProvider: {
      type: String,
      trim: true,
    },
    trainingPeriod: {
      type: trainingPeriodSchema,
    },
    skills: {
      type: [String],
      default: [],
    },
    certificate: {
      type: certificateSchema,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && models.Trainee) {
  delete (models as any).Trainee;
}

const Trainee = models.Trainee || model<ITrainee>("Trainee", traineeSchema);

export default Trainee;
