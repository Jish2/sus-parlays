import type { NextRequest } from "next/server";
import twilio from "twilio";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
const verifySid = process.env.TWILIO_VERIFY_SID!;

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  try {
    const check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });

    const approved = check.status === "approved";

    if (!approved) {
      return Response.json({ error: "Invalid code" }, { status: 400 });
    }

    const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "48h" });

    (await cookies()).set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 48,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
