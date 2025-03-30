// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { sendEmail } from "@/lib/email";

// export async function GET(request: Request) {
//   try {
//     const headersList = headers();
//     const cronSecret = headersList.get("x-cron-secret");

//     if (cronSecret !== process.env.CRON_SECRET) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const today = new Date().toISOString().split("T")[0];

//     // Update products scheduled for today
//     const productsToList = await prisma.product.updateMany({
//       where: {
//         status: "APPROVED",
//         releaseDate: today,
//       },
//       data: {
//         status: "LISTED",
//       },
//     });

//     // Notify users whose products are now listed
//     const listedProducts = await prisma.product.findMany({
//       where: {
//         status: "LISTED",
//         releaseDate: today,
//       },
//       include: {
//         user: {
//           select: {
//             email: true,
//           },
//         },
//       },
//     });

//     for (const product of listedProducts) {
//       if (product.user.email) {
//         await sendEmail(
//           product.user.email,
//           "Your product is now live!",
//           `Your product "${product.name}" is now listed on our platform.`
//         );
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       listed: productsToList.count,
//     });
//   } catch (error) {
//     console.error("Error processing daily products:", error);
//     return NextResponse.json(
//       { error: "Failed to process daily products" },
//       { status: 500 }
//     );
//   }
// }
