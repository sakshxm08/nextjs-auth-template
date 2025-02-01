// File: /app/api/auth/resend-code/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResonse";

export const POST = async (req: Request) => {
  await dbConnect();
  let response: ApiResponse;

  try {
    const { username } = await req.json(); // identifier can be email or username

    // Find the user by email or username.
    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      response = {
        success: false,
        message: "User not found.",
      };
      return Response.json(response, { status: 404 });
    }

    // If the user is already verified, do not resend the code.
    if (user.providerAccounts?.credentials?.isVerified) {
      response = {
        success: false,
        message: "User is already verified.",
      };
      return Response.json(response, { status: 400 });
    }

    // Generate a new 6-digit verification code.
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    // Update the user's verification code and expiry.
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;

    // Also update the code and expiry in the providerAccounts object if present.
    if (user.providerAccounts && user.providerAccounts.credentials) {
      user.providerAccounts.credentials.profile.verifyCode = verifyCode;
      user.providerAccounts.credentials.profile.verifyCodeExpiry =
        verifyCodeExpiry;
    }

    await user.save();

    // Send the verification email with the new code.
    const emailResponse = await sendVerificationEmail(
      user.email,
      user?.username || username,
      verifyCode
    );

    if (!emailResponse.success) {
      response = {
        success: false,
        message: emailResponse.message,
      };
      return Response.json(response, { status: 500 });
    }

    response = {
      success: true,
      message:
        "Verification code resent successfully. Please check your email.",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("Error resending verification code", error);
    response = {
      success: false,
      message: "Error resending verification code.",
    };
    return Response.json(response, { status: 500 });
  }
};
