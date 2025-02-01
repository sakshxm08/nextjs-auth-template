"use client";

import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSession } from "next-auth/react";
import { RootState } from "@/store/store";
import { setLoading, setUser } from "@/store/userSlice";
import { Loader } from "lucide-react";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const sessionUser = session?.user || null;
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
      if (
        status === "authenticated" &&
        sessionUser &&
        user?.email !== sessionUser.email
      ) {
        dispatch(setUser(sessionUser)); // Sync only if the user data changes
      } else if (status === "unauthenticated" && user !== null) {
        dispatch(setUser(null)); // Only clear user data if it's not already null
      }
    }
  }, [status, sessionUser, user, dispatch]);

  return (
    <main className="w-full">
      {status === "loading" ? (
        <div className="h-screen w-full flex items-center justify-center">
          <Loader className="animate-spinner" />
        </div>
      ) : (
        <div className="p-4 w-full">{children}</div>
      )}
    </main>
  );
};

export default Dashboard;
