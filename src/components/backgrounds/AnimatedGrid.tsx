import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AuroraText } from "@/components/ui/aurora-text";

interface AnimatedGridProps {
  fontSize?: string;
  showTagline?: boolean;
}

export default function AnimatedGrid({
  fontSize = "3rem",
  showTagline = true,
}: AnimatedGridProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background p-10">
      <div className="whitespace-pre-wrap w-full flex flex-col gap-2 justify-center select-none items-center text-center tracking-tighter text-black dark:text-white">
        <h1 className="font-extrabold" style={{ fontSize }}>
          Project
          <AuroraText>Name</AuroraText>
        </h1>
        {showTagline && (
          <>
            <div className="h-px w-full bg-gray-300"></div>
            <h4 className="text-muted-foreground tracking-widest w-full font-extralight">
              Tagline comes here
            </h4>
          </>
        )}
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
    </div>
  );
}
