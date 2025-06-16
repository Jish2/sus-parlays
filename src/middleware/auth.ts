import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload;
}

export async function verifyAuth(
  req: NextRequest
): Promise<
  | { success: true; user: JWTPayload; response: null }
  | { success: false; user: null; response: NextResponse }
> {
  try {
    const token = req.cookies.get("auth_token");

    if (!token) {
      return {
        success: false,
        user: null,
        response: NextResponse.json(
          { error: "No token found" },
          { status: 401 }
        ),
      };
    }

    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload & JWTPayload;

    return {
      success: true,
      user: decoded,
      response: null,
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      response: NextResponse.json(
        { error: (error as Error).message },
        { status: 401 }
      ),
    };
  }
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const auth = await verifyAuth(req);

    if (!auth.success) {
      return auth.response;
    }

    // Add the user to the request object
    (req as AuthenticatedRequest).user = auth.user;

    return handler(req as AuthenticatedRequest);
  };
}
