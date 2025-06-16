import { AuthenticatedRequest, withAuth } from "@/middleware/auth";
import supabase from "@/lib/db";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const phone = req.user.phone;

    const { data } = await supabase
      .from("submissions")
      .select("*")
      .eq("phone", phone)
      .limit(1);

    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
