import { NextResponse } from "next/server";
import { generateCareerIntelligence } from "@/lib/ai/career-intelligence";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const traineeId = searchParams.get("traineeId");

    if (!traineeId) {
      return NextResponse.json(
        { error: "traineeId is required" },
        { status: 400 }
      );
    }

    const result = await generateCareerIntelligence(traineeId);

    if (!result) {
      return NextResponse.json(
        { error: "Career intelligence could not be generated" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Career intelligence API error:", error);

    return NextResponse.json(
      { error: "Failed to generate career intelligence" },
      { status: 500 }
    );
  }
}
