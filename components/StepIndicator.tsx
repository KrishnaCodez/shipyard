import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface StepIndicatorProps {
  status: "done" | "ongoing" | "pending";
}

export function StepIndicator({ status }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "mt-0.5 h-5 w-5 rounded-full border-2 text-center text-[11px]/5",
        status === "done" && "border-primary bg-primary text-white",
        status === "ongoing" && "border-primary",
        status === "pending" && "border-muted-foreground"
      )}
    >
      {status === "done" && "✓"}
      {status === "ongoing" && (
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
      )}
    </div>
  );
}
