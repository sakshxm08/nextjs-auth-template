"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResonse";
import { useState } from "react";
import AnimatedGrid from "@/components/backgrounds/AnimatedGrid";
import { Input } from "@/components/ui/input";
import { Loader, Mail, MoveLeft } from "lucide-react";
import { identifierSchema } from "@/schemas/identifierSchema";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ForgotPassword() {
  // submitted === true means the form has been attempted at least once.
  const [submitted, setSubmitted] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState("");
  // loading can be used for either the initial submission or for resending.
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof identifierSchema>>({
    resolver: zodResolver(identifierSchema),
    defaultValues: {
      identifier: "",
    },
  });

  // This function is used both for the initial submission and for resending.
  async function submitReset(identifier: string) {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/auth/forget-password", {
        identifier,
      });
      // Mark that we've submitted the form.
      setSubmitted(true);
      setEmailSentSuccess(res.data.success);
      setEmailSentMessage(res.data.message);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Email sent successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);
      setSubmitted(true);
      setEmailSentSuccess(false);
      toast({
        title: "Email was not sent",
        description:
          axiosError.response?.data.message ?? "Error resetting password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof identifierSchema>) {
    await submitReset(data.identifier);
  }

  async function handleOnResend() {
    // We need the current identifier value from the form.
    const identifier = form.getValues("identifier");
    if (!identifier) {
      toast({
        title: "Missing identifier",
        description: "Please enter your email or username.",
        variant: "destructive",
      });
      return;
    }
    await submitReset(identifier);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl flex items-center justify-center transition-all">
        <div className={cn("flex flex-col gap-6 w-fit transition-all")}>
          {loading ? (
            <div className="p-6 flex flex-col gap-2 items-center justify-center max-w-96 relative">
              <div className="p-4 rounded-full bg-primary-foreground">
                <Loader className="animate-spinner" />
              </div>
              <h4 className="font-bold text-lg">
                {submitted ? "Resending..." : "Resetting..."}
              </h4>
            </div>
          ) : submitted ? (
            <Card className="overflow-hidden transition-all">
              <div className="h-20">
                <AnimatedGrid fontSize="2rem" showTagline={false} />
              </div>
              <CardContent className="grid p-6 md:p-8 md:grid-cols-1 border-t pb-4">
                <div className="p-6 flex flex-col gap-2 items-center justify-center max-w-96 relative">
                  <div className="p-4 rounded-full bg-primary-foreground">
                    <Mail size={28} strokeWidth={1} />
                  </div>
                  <h4 className="font-bold text-lg">
                    {emailSentSuccess
                      ? "Check Your Email!"
                      : "Error Sending the Email"}
                  </h4>
                  <p className="text-center">{emailSentMessage}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Didn&apos;t receive the mail?{" "}
                    <span
                      className="underline hover:text-primary cursor-pointer"
                      onClick={handleOnResend}
                    >
                      Click to resend
                    </span>
                  </p>
                </div>
                <Button variant={"ghost"} asChild className="w-fit mx-auto">
                  <Link href={"/signin"}>
                    <MoveLeft />
                    Back to Login
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden transition-all">
              <div className="h-20">
                <AnimatedGrid fontSize="2rem" showTagline={false} />
              </div>
              <CardContent className="grid p-6 md:p-8 md:grid-cols-1 border-t">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 md:p-8"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Forgot password?</h1>
                        <p className="text-sm">
                          No worries, we&apos;ll send you reset instructions to
                          your email.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email / Username</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader className="animate-spinner" /> Resetting...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
                <Button variant={"ghost"} asChild className="w-fit mx-auto">
                  <Link href={"/signin"}>
                    <MoveLeft />
                    Back to Login
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
