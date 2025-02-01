import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResonse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  code: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Project Name | Verification Code",
      react: VerificationEmail({ username, code }),
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
