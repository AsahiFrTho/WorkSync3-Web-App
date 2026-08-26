import { NextResponse } from "next/server";
import { generateCareerIntelligence } from "@/lib/ai/career-intelligence";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const traineeId = searchParams.get("traineeId");

    if (!traineeId || !traineeId.trim()) {
      return NextResponse.json(
        { success: false, error: "traineeId parameter is required" },
        { status: 400 }
      );
    }

    const { result, notFound, source } = await generateCareerIntelligence(traineeId);

    if (notFound || !result) {
      return NextResponse.json(
        { success: false, error: `Trainee record '${traineeId}' not found in database` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      source,
    });
  } catch (error) {
    const safeErrorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Career intelligence API error:", safeErrorMessage);

    return NextResponse.json(
      { success: false, error: "Failed to generate career intelligence" },
      { status: 500 }
    );
  }
}
