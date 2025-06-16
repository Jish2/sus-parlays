import { withAuth } from "@/middleware/auth";
import supabase from "@/lib/db";

export const GET = withAuth(async () => {
  try {
    const { data } = await supabase.rpc("get_parlay_vote_counts");

    const result = [];
    for (let i = 0; i < data.length; i++) {
      result.push({ yes: data[i].yes, no: data[i].no });
    }
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
