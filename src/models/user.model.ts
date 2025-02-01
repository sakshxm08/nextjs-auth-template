import { Schema, Document, Model, model, models } from "mongoose";
import { GitHubProfile } from "next-auth/providers/github";
import { GoogleProfile } from "next-auth/providers/google";

// Profile interfaces for different providers
interface BaseProfile {
  email: string;
  name?: string;
  image?: string;
}

interface CredentialsProfile extends BaseProfile {
  username?: string;
  password?: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
}

export type Provider = "credentials" | "github" | "google";

export type ProviderProfile =
  | GoogleProfile
  | GitHubProfile
  | CredentialsProfile;

interface ProviderAccount {
  providerAccountId: string;
  profile: ProviderProfile;
  lastUsed: Date;
  isVerified: boolean;
}

interface ProviderAccounts {
  [provider: string]: ProviderAccount;
}

export interface User extends Document {
  name?: string;
  username?: string;
  email: string;
  password?: string;
  image?: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  // Auth-related fields
  providers: Array<"credentials" | "github" | "google">;
  primaryProvider: "credentials" | "github" | "google";
  providerAccounts: ProviderAccounts;
  lastLogin?: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    username: {
      type: String,
      required: [
        function (this: User) {
          // Only required if credentials is the primary provider
          return this.primaryProvider === "credentials";
        },
        "Username is required for credentials login",
      ],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email address",
      ],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [
        function (this: User) {
          // Only required if credentials is the primary provider
          return this.primaryProvider === "credentials";
        },
        "Password is required for credentials login",
      ],
    },
    verifyCode: {
      type: String,
      required: [
        function (this: User) {
          // Only required for credentials users who aren't verified
          return (
            this.primaryProvider === "credentials" &&
            !this.providerAccounts?.credentials?.isVerified
          );
        },
        "Verification Code is required",
      ],
    },
    verifyCodeExpiry: {
      type: Date,
      required: function (this: User) {
        return !!this.verifyCode;
      },
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    image: {
      type: String,
    },
    // Auth-related fields
    providers: [
      {
        type: String,
        enum: ["credentials", "github", "google"],
        required: true,
      },
    ],
    primaryProvider: {
      type: String,
      enum: ["credentials", "github", "google"],
      required: true,
    },
    providerAccounts: {
      type: Object,
      default: {},
      of: new Schema(
        {
          providerAccountId: { type: String, required: true },
          profile: { type: Schema.Types.Mixed },
          lastUsed: { type: Date, default: Date.now },
          isVerified: { type: Boolean, default: false, required: true },
        },
        { _id: false }
      ),
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to handle default values and validation
UserSchema.pre("save", function (next) {
  // If this is a new user, set primaryProvider
  if (this.isNew && !this.primaryProvider) {
    this.primaryProvider = this.providers[0];
  }

  next();
});

const UserModel =
  (models.User as Model<User>) || model<User>("User", UserSchema);

export default UserModel;
