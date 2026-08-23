import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        const db = await connectToDatabase();

        return Response.json({
            connected: true,
            database: db.connection.name,
        });
    } catch (error) {
        return Response.json(
            {
                connected: false,
                error:
                    error instanceof Error ? error.message : "Database connection failed",
            },
            { status: 500 }
        );
    }
}