"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResonse";
import { useState } from "react";
import AnimatedGrid from "@/components/backgrounds/AnimatedGrid";
import { Loader, MoveLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const handleOnResend = async () => {
    setResending(true);
    setResendMessage("");
    try {
      const res = await axios.post<ApiResponse>(
        "/api/auth/resend-verify-code",
        {
          username: params.username,
        }
      );
      console.log(res.data);
      toast({
        title: "Success",
        description:
          res.data.message || "Verification code resent successfully.",
      });
      setResendMessage("A new verification code has been sent to your email.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);
      toast({
        title: "Resend Failed",
        description:
          axiosError.response?.data.message ??
          "Error resending verification code.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    setIsVerifying(true);
    try {
      const res = await axios.post<ApiResponse>("/api/auth/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: res.data.message,
      });
      console.log(res);
      router.replace("/signin");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);
      toast({
        title: "Verification failed",
        description: axiosError.response?.data.message ?? "Error signing up",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl flex items-center justify-center">
        <div className={cn("flex flex-col gap-6 w-fit")}>
          {resending ? (
            <div className="p-6 flex flex-col gap-2 items-center justify-center max-w-96 relative">
              <div className="p-4 rounded-full bg-primary-foreground">
                <Loader className="animate-spinner" />
              </div>
              <h4 className="font-bold text-lg">Sending again...</h4>
            </div>
          ) : (
            <Card className="overflow-hidden">
              <div className="h-20">
                <AnimatedGrid fontSize="2rem" showTagline={false} />
              </div>
              <CardContent className="grid p-6 md:p-8 md:grid-cols-1 border-t gap-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-6 md:px-8"
                  >
                    <div className="flex flex-col gap-6">
                      <h1 className="text-2xl font-bold">Verify your email</h1>
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                              <InputOTP
                                disabled={isVerifying}
                                maxLength={6}
                                {...field}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormDescription>
                              Please enter the verification code sent to your
                              email.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isVerifying}>
                        {isVerifying ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </form>
                </Form>
                {resendMessage && (
                  <p className="text-xs text-green-500 text-center">
                    {resendMessage}
                  </p>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Didn&apos;t receive the mail?{" "}
                  <span
                    className="underline hover:text-primary cursor-pointer"
                    onClick={handleOnResend}
                  >
                    Click to resend
                  </span>
                </p>
                <Button variant={"ghost"} asChild className="w-fit mx-auto">
                  <Link href={"/signup"}>
                    <MoveLeft />
                    Back to Signup
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
