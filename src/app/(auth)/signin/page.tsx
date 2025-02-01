"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { signinSchema } from "@/schemas/signinSchema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res?.error) {
        console.log(res.error);
        if (res.error === "CredentialsSignin") {
          toast({
            title: "Signin failed",
            description: res.code,
            variant: "destructive",
          });
        } else throw new Error(res.error);
      }
      if (res?.url) {
        toast({
          title: "Success",
          description: "You have been signed in",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Signin failed",
        description: "Something went wrong: " + (error as Error)?.message,
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
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Welcome Back</h1>
                    </div>
                    <FormField
                      name="identifier"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            Username / Email
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Password
                      form={form}
                      isSubmitting={isSubmitting}
                      name={"password"}
                      hasForgotPassword
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
                      "Sign in"
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
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="underline underline-offset-4"
                    >
                      Sign up
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
