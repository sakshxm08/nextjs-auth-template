import { Illustration, NotFound } from "@/components/ui/not-found";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="relative flex flex-col w-full justify-center min-h-svh bg-background p-6 md:p-8">
      <div className="relative max-w-5xl mx-auto w-full">
        <Illustration className="absolute inset-0 w-full h-[40vh] opacity-[0.05] dark:opacity-[0.03] text-foreground" />
        <NotFound
          title="Page not found"
          description="Lost, this page is. In another system, it may be."
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
