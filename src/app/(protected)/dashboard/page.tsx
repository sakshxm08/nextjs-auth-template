"use client";

import SignoutButton from "@/components/SignoutButton";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);

  const userImage = useMemo(() => {
    return (
      user?.image ||
      `https://ui-avatars.com/api/?name=${user?.username || "Anonymous"}&size=200`
    );
  }, [user?.image, user?.username]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
      <Card className="max-w-lg p-4">
        <CardContent className="flex flex-col gap-2 items-center justify-center">
          <Image
            src={userImage}
            alt={user?.name || user?.username || "User"}
            width={50}
            height={50}
            className="rounded-full border-2 border-white shadow"
            priority
          />
          <span>{user?.email}</span>
          {user?.username && <span>{user?.username}</span>}
          {user?.name && <span>{user?.name}</span>}
        </CardContent>
      </Card>
      <SignoutButton />
    </div>
  );
}
