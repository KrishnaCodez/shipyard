import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!WEBHOOK_SECRET || !svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error", { status: 400 });
  }

  const payload = await req.json();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        image_url,
        first_name,
        last_name,
        email_addresses,
        username,
      } = evt.data;
      console.log("userId:", evt.data.id);

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          image: image_url || "",
          email: email_addresses[0].email_address,
        },
        create: {
          clerkId: id,
          image: image_url || "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          email: email_addresses[0].email_address,
          role: "USER",
          username: username || "",
          onboarded: false,
        },
      });

      const clerk = await clerkClient();

      await clerk.users.updateUserMetadata(id, {
        publicMetadata: {
          role: "USER",
          onBoarded: false,
        },
      });

      console.log("User created/updated");
    }

    return new Response("", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);

    return new Response("Invalid signature", { status: 400 });
  }
}
