import { model, models, Schema } from "mongoose";

const traineeSchema = new Schema(
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
    },
    { timestamps: true }
);

const Trainee = models.Trainee || model("Trainee", traineeSchema);

export default Trainee;