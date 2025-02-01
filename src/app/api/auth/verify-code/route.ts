import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResonse";

export const POST = async (req: Request) => {
  await dbConnect();
  let response: ApiResponse;

  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      response = {
        success: false,
        message: "User does not exist",
      };
      return Response.json(response, { status: 400 });
    }

    const isUserVerified = user.providerAccounts?.credentials?.isVerified;

    if (isUserVerified) {
      response = {
        success: false,
        message: "User already verified",
      };
      return Response.json(response, { status: 400 });
    }

    const isCodeExpired = new Date(user.verifyCodeExpiry as Date) < new Date();

    if (isCodeExpired) {
      response = {
        success: false,
        message: "Code has expired. Please sign up again.",
      };
      return Response.json(response, { status: 400 });
    }

    const isCodeValid = user.verifyCode === code;

    if (!isCodeValid) {
      response = {
        success: false,
        message: "Incorrect Code",
      };
      return Response.json(response, { status: 400 });
    }

    user.providerAccounts.credentials.isVerified = true;
    user.markModified("providerAccounts.credentials.isVerified");
    await user.save();
    response = {
      success: true,
      message: "User verified successfully",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.log("Error verifying the user", error);
    response = {
      success: false,
      message: "Error verifying the user",
    };
    return Response.json(response, { status: 500 });
  }
};
