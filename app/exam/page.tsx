import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ExamFlow } from "@/components/exam/ExamFlow";

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-300" />
        </div>
      }
    >
      <ExamFlow />
    </Suspense>
  );
}
