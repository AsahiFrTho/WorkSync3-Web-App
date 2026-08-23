import { connectToDatabase } from "@/lib/mongodb";
import Trainee from "@/models/trainee";

export async function GET() {
    try {
        await connectToDatabase();

        const trainees = await Trainee.find()
            .sort({ createdAt: -1 })
            .lean();

        return Response.json({ trainees });
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof Error ? error.message : "Could not load trainees",
            },
            { status: 500 }
        );
    }
}