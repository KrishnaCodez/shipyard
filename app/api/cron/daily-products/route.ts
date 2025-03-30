// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";

// export async function GET(request: Request) {
//   try {
//     // Verify cron secret to ensure this is called by Vercel
//     const headersList = headers();
//     const cronSecret = headersList.get("x-cron-secret");

//     if (cronSecret !== process.env.CRON_SECRET) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     // Update products scheduled for today
//     await prisma.product.updateMany({
//       where: {
//         status: "APPROVED",
//         releaseDate: {
//           gte: today,
//           lt: tomorrow,
//         },
//       },
//       data: {
//         status: "LISTED",
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error processing daily products:", error);
//     return NextResponse.json(
//       { error: "Failed to process daily products" },
//       { status: 500 }
//     );
//   }
// }
