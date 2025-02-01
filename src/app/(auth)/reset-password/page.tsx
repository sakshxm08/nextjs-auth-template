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
import { Suspense, useState } from "react";
import AnimatedGrid from "@/components/backgrounds/AnimatedGrid";
import { Input } from "@/components/ui/input";
import { Loader, MoveLeft } from "lucide-react";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const [isResetting, setIsResetting] = useState(false);

  const searchParams = useSearchParams();

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setIsResetting(true);
    try {
      const res = await axios.post<ApiResponse>("/api/auth/reset-password", {
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
        userId: searchParams.get("userId"),
        token: searchParams.get("token"),
      });
      toast({
        title: "Success",
        description: res.data.message,
      });
      router.push("/signin");

      console.log(res);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);
      toast({
        title: "Resetting password failed",
        description:
          axiosError.response?.data.message ?? "Error resetting password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl flex items-center justify-center">
        <div className={cn("flex flex-col gap-6 w-fit")}>
          <Card className="overflow-hidden">
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
                      <h1 className="text-2xl font-bold">
                        Create a new password
                      </h1>
                      <p className="text-sm">
                        Please choose a password that hasn&apos;t been used
                        before.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isResetting}>
                      {isResetting ? (
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
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPageFallback() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader className="animate-spinner" />
    </div>
  );
}
