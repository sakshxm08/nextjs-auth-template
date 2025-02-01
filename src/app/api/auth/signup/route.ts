import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResonse";

export const POST = async (req: Request) => {
  await dbConnect();
  let response: ApiResponse;

  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      "providerAccounts.credentials.isVerified": true,
    });

    if (existingUserVerifiedByUsername) {
      response = {
        success: false,
        message: "Username already taken",
      };
      return Response.json(response, { status: 400 });
    }

    // const existingUserWithCredentials = await UserModel.findOne({
    //   email,
    //   providers: { $in: ["credentials"] },
    // });

    const existingUserVerifiedByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    if (existingUserVerifiedByEmail) {
      if (
        existingUserVerifiedByEmail.providerAccounts?.credentials?.isVerified &&
        existingUserVerifiedByEmail.providers.includes("credentials")
      ) {
        response = {
          success: false,
          message: "User already exists with this email",
        };
        return Response.json(response, { status: 400 });
      }
      existingUserVerifiedByEmail.password = hashedPassword;
      existingUserVerifiedByEmail.username = username;
      existingUserVerifiedByEmail.verifyCode = verifyCode;
      existingUserVerifiedByEmail.verifyCodeExpiry = verifyCodeExpiry;
      existingUserVerifiedByEmail.providers.push("credentials");
      existingUserVerifiedByEmail.providerAccounts["credentials"] = {
        providerAccountId: email,
        profile: {
          email: email as string,
          username: username as string,
          password: hashedPassword as string,
          verifyCode: verifyCode as string,
          verifyCodeExpiry: new Date(verifyCodeExpiry) as Date,
        },
        lastUsed: new Date(),
        isVerified: false,
      };
      existingUserVerifiedByEmail.markModified("providerAccounts.credentials");
      await existingUserVerifiedByEmail.save();
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: verifyCodeExpiry,
        providers: ["credentials"],
        primaryProvider: "credentials",
        providerAccounts: {
          credentials: {
            providerAccountId: email,
            profile: {
              email: email as string,
              username: username as string,
              password: hashedPassword as string,
              verifyCode: verifyCode as string,
              verifyCodeExpiry: verifyCodeExpiry as Date,
            },
            lastUsed: new Date(),
            isVerified: false,
          },
        },
      });

      await newUser.save();
    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
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
      message: "Please verify your email",
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.log("Error signing up the user", error);
    response = {
      success: false,
      message: "Error signing up the user",
    };
    return Response.json(response, { status: 500 });
  }
};
