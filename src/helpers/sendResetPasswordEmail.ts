import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResonse";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";

export const sendResetPasswordEmail = async (
  email: string,
  username: string,
  resetPasswordLink: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Project Name | Reset Password",
      react: ResetPasswordEmail({ username, resetPasswordLink }),
    });
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    console.log("Error sending email", emailError);
    return {
      success: false,
      message: "Error sending email",
    };
  }
};
