import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { logout } from "@/store/userSlice";

const SignoutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();
  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      logout();
    } catch {
      toast({
        title: "Signout failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <Button variant={"outline"} onClick={handleSignout} disabled={isSigningOut}>
      {isSigningOut && <Loader className="animate-spin" />}
      {!isSigningOut ? "Signout" : "Signing out..."}
    </Button>
  );
};

export default SignoutButton;
