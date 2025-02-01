// File: /app/api/auth/reset-password/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ApiResponse } from "@/types/ApiResonse";

export const POST = async (req: Request) => {
  await dbConnect();
  let response: ApiResponse;

  try {
    const { token, userId, newPassword, confirmPassword } = await req.json();

    // Basic validation
    if (!token || !userId || !newPassword || !confirmPassword) {
      response = {
        success: false,
        message: "Missing required fields.",
      };
      return Response.json(response, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      response = {
        success: false,
        message: "Passwords do not match.",
      };
      return Response.json(response, { status: 400 });
    }

    // Hash the token provided by the user for comparison.
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user whose token matches and that the token has not expired.
    const user = await UserModel.findOne({
      _id: userId,
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      response = {
        success: false,
        message: "Invalid or expired link.",
      };
      return Response.json(response, { status: 400 });
    }

    const areOldAndNewPasswordsSame = await await bcrypt.compare(
      newPassword,
      user.password || ""
    );

    // Hash the new password before storing it.

    if (areOldAndNewPasswordsSame) {
      response = {
        success: false,
        message: "The new password cannot be same as the old one.",
      };
      return Response.json(response, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear reset token fields.
    user.password = hashedPassword;
    // If you store the password in a nested provider account as well, update that too.
    if (user.providerAccounts && user.providerAccounts.credentials) {
      user.providerAccounts.credentials.profile.password = hashedPassword;
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    response = {
      success: true,
      message: "Password updated successfully.",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in reset-password:", error);
    response = {
      success: false,
      message: "An error occurred. Please try again later.",
    };
    return Response.json(response, { status: 500 });
  }
};
