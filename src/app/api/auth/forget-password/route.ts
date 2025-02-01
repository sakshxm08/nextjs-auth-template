// File: /app/api/auth/forgot-password/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/helpers/sendResetPasswordEmail";
import { ApiResponse } from "@/types/ApiResonse";

export const POST = async (req: Request) => {
  await dbConnect();
  let response: ApiResponse;

  try {
    const { identifier } = await req.json();

    // Find the user by email or username.
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    // Always return a generic response to prevent user enumeration.

    if (!user) {
      response = {
        success: true,
        message:
          "If an account with that email or username exists, we've sent a password reset link to the email. It is valid for 24 hours.",
      };
      return Response.json(response, { status: 200 });
    }

    // Check if the user's account is verified.
    // Adjust the property check as per your schema.
    if (!user.providerAccounts?.credentials?.isVerified) {
      // Option 1: Do not allow password reset until verified.
      // Option 2: You could optionally send the verification email again.
      response = {
        success: false,
        message:
          "Your account is not verified. Please sign up again to verify your account.",
      };
      return Response.json(response, { status: 403 });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token so that even if someone gains access to your DB, they can’t use the token directly.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiry (e.g. 1 hour from now)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Save the hashed token and expiry to the user's document.
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Construct the reset password link.
    // Ensure NEXT_PUBLIC_APP_URL is defined in your .env file.
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&userId=${user._id}`;

    // Send the reset link via email using your helper.
    const emailResponse = await sendResetPasswordEmail(
      user.email,
      user?.username || "",
      resetLink
    );

    if (!emailResponse.success) {
      response = {
        success: false,
        message: emailResponse.message || "Error sending email",
      };
      return Response.json(response, { status: 500 });
    }

    response = {
      success: true,
      message:
        "We've sent a password reset link to your email. It is valid for 24 hours.",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    response = {
      success: false,
      message: "An error occurred. Please try again later.",
    };
    return Response.json(response, { status: 500 });
  }
};
