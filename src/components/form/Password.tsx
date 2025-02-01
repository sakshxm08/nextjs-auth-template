import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import Link from "next/link";

interface PasswordProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  name: Path<T>;
  hasForgotPassword?: boolean;
}

function Password<T extends FieldValues>({
  form,
  isSubmitting,
  name,
  hasForgotPassword = false,
}: PasswordProps<T>) {
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");

  // detect if caps lock is on
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLockOn = e.getModifierState("CapsLock");

    if (capsLockOn) {
      setCapsLockOnMessage("Caps Lock is ON");
    } else {
      setCapsLockOnMessage("");
    }
  };
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <div className="flex justify-between">
            <FormLabel className="text-sm">Password</FormLabel>
            {hasForgotPassword && (
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <FormControl>
            <Input
              type="password"
              {...field}
              onKeyDown={handleKeyPress}
              onKeyUp={handleKeyPress}
              disabled={isSubmitting}
            />
          </FormControl>
          <FormMessage className="text-xs" />
          {!!capsLockOnMessage && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-bold">
              {capsLockOnMessage}
            </p>
          )}
        </FormItem>
      )}
    />
  );
}

export default Password;
