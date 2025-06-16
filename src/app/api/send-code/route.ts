import type { NextRequest } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
const verifySid = process.env.TWILIO_VERIFY_SID!;

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" });

    return Response.json({ status: verification.status }, { status: 200 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
