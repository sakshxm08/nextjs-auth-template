"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResonse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import GithubLoginButton from "@/components/GithubLoginButton";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import AnimatedGrid from "@/components/backgrounds/AnimatedGrid";
import Password from "@/components/form/Password";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAllowed, setIsUsernameAllowed] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 500);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // FUNCTIONALITIES
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        try {
          const res = await axios.get<ApiResponse>(
            `/api/auth/check-unique-username?username=${debouncedUsername}`
          );
          setUsernameMessage(res.data.message);
          setIsUsernameAllowed(res.data.success);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setIsUsernameAllowed(false);
          console.error(axiosError);
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (!isUsernameAllowed) {
      form.setError("username", {
        message: usernameMessage || "This username is already taken.",
      });
      return; // Stop further execution
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>("/api/auth/signup", data);
      toast({
        title: "Success",
        description: res.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);

      toast({
        title: "Signup failed",
        description: axiosError.response?.data.message ?? "Error signing up",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8 flex flex-col gap-6 md:shadow-xl z-10"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Create an account</h1>
                    </div>
                    <FormField
                      name="username"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">Username</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setUsername(e.target.value);
                                if (e.target.value.trim() !== "") {
                                  setIsCheckingUsername(true);
                                } else {
                                  setIsCheckingUsername(false);
                                  setUsernameMessage("");
                                }
                              }}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          {
                            <>
                              {isCheckingUsername ? (
                                <p className="text-muted-foreground text-xs flex items-center gap-1">
                                  <Loader className="animate-spinner w-4 h-4" />{" "}
                                  Checking username...
                                </p>
                              ) : (
                                !!usernameMessage &&
                                (isUsernameAllowed ? (
                                  <p className="text-xs text-green-500 flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-check"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    {usernameMessage}
                                  </p>
                                ) : (
                                  <p className="text-xs text-red-500 flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-circle-x"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="m15 9-6 6" />
                                      <path d="m9 9 6 6" />
                                    </svg>
                                    {usernameMessage}
                                  </p>
                                ))
                              )}
                            </>
                          }
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Password
                      form={form}
                      isSubmitting={isSubmitting}
                      name={"password"}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 animate-spinner" />
                        Please wait
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                  <div className="relative text-center text-sm">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <span className="relative bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <GithubLoginButton />
                    <GoogleLoginButton />
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="underline underline-offset-4"
                    >
                      Log in
                    </Link>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block">
                <AnimatedGrid />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
