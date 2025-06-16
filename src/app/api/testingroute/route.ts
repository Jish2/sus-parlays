import { AuthenticatedRequest, withAuth } from "@/middleware/auth";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  // You now have access to the verified user through req.user
  // console.log(req.user.phone);
  // jwt.verify(req.cookies['auth_token']

  return Response.json({ message: "Hello, world!" });
});
