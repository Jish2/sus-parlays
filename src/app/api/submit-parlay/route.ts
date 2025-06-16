import { AuthenticatedRequest, withAuth } from "@/middleware/auth";
import supabase from "@/lib/db";
import { isPast10AmPST } from "@/lib/utils";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  if (isPast10AmPST()) {
    return Response.json(
      { error: "Submission period has ended" },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const selections = body.parsed_selections;
    const phone = req.user.phone;

    const { error } = await supabase.from("submissions").insert({
      phone: phone,
      selection: JSON.stringify(selections),
    });

    if (error) {
      return Response.json({ error: error }, { status: 500 });
    }

    const votes = [];
    for (let i = 0; i < selections.length; i++) {
      votes.push({ parlay_id: i, vote: selections[i] });
    }

    const { error: voteError } = await supabase
      .from("vote_counts")
      .insert(votes);

    if (error || voteError) {
      return Response.json({ error: error || voteError }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
