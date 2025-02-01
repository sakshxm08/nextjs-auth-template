import UserModel from "@/models/user.model";
// import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResonse";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  // await dbConnect();
  let response: ApiResponse;

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      response = {
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid username",
      };
      return Response.json(response, { status: 400 });
    }
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      "providerAccounts.credentials.isVerified": true,
    });

    if (existingVerifiedUser) {
      response = {
        success: false,
        message: "Username already taken",
      };
      return Response.json(response, { status: 400 });
    }

    response = {
      success: true,
      message: "Username is available",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    response = {
      success: false,
      message: "Error checking username",
    };
    return Response.json(response, { status: 500 });
  }
}
