import { connectToDatabase } from "@/lib/mongodb";
import EmploymentRecord from "@/models/employment-record";
import Trainee from "@/models/trainee";

export async function POST() {
  try {
    await connectToDatabase();

    // Ensure trainee KP-0001 exists
    const trainee = await Trainee.findOneAndUpdate(
      { traineeId: "KP-0001" },
      {
        name: "Rahul Pawar",
        district: "Pune",
        course: "Electrician",
        status: "employed",
        monthlyWage: 16800,
      },
      {
        new: true,
        upsert: true,
      }
    );

    const startDate = new Date("2024-04-01");
    const addDays = (d: Date, days: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    // Upsert employment record for KP-0001
    const employmentRecord = await EmploymentRecord.findOneAndUpdate(
      { traineeId: "KP-0001", isCurrent: true },
      {
        trainee: trainee._id,
        traineeId: "KP-0001",
        employerName: "Deccan Electricals Pvt. Ltd.",
        employerContactEmail: "hr@deccanelectricals.com",
        jobRole: "Junior Maintenance Electrician",
        employmentType: "wage_employment",
        district: "Pune",
        startDate,
        isCurrent: true,
        monthlyWage: 16800,
        verificationStatus: "verified",
        verificationMetadata: {
          verifiedAt: new Date("2024-04-05T10:30:00.000Z"),
          verifiedBy: "HR Manager - Deccan Electricals",
          method: "employer_portal",
          remarks: "Confirmed joining in industrial maintenance wing",
        },
        followUps: [
          {
            milestone: "30_day",
            dueDate: addDays(startDate, 30),
            completedDate: addDays(startDate, 30),
            status: "retained",
            currentWage: 16800,
            verifiedBy: "Yashaswi Follow-up Cell",
            notes: "30-day retention confirmed on shift",
          },
          {
            milestone: "90_day",
            dueDate: addDays(startDate, 90),
            completedDate: addDays(startDate, 90),
            status: "retained",
            currentWage: 16800,
            verifiedBy: "Yashaswi Follow-up Cell",
            notes: "90-day retention confirmed",
          },
          {
            milestone: "180_day",
            dueDate: addDays(startDate, 180),
            completedDate: addDays(startDate, 180),
            status: "retained",
            currentWage: 17500,
            verifiedBy: "Yashaswi Follow-up Cell",
            notes: "6-month milestone completed with increment",
          },
          {
            milestone: "365_day",
            dueDate: addDays(startDate, 365),
            status: "pending",
          },
        ],
        notes: "Placed via campus drive batch 2024",
      },
      {
        new: true,
        upsert: true,
      }
    );

    return Response.json({
      success: true,
      created: true,
      employmentRecord,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        created: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not seed employment record",
      },
      { status: 500 }
    );
  }
}
