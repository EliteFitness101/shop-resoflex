import { Skeleton } from "@/components/ui/skeleton";
import { GoldButton } from "@/components/GoldButton";
import { AlertTriangle } from "lucide-react";

/** Lightweight skeleton matching the RouteHero + grid layout to prevent CLS. */
export function RouteSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <section className="border-y border-gold/15 bg-[#060607]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
          <div className="space-y-4">
            <Skeleton className="h-3 w-32 !rounded-none bg-gold/10" />
            <Skeleton className="h-10 sm:h-14 w-3/4 !rounded-none bg-gold/10" />
            <Skeleton className="h-4 w-full max-w-md !rounded-none bg-gold/5" />
            <Skeleton className="h-12 w-48 !rounded-none bg-gold/15" />
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 !rounded-none bg-gold/5" />
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-44 !rounded-none bg-gold/5" />
        ))}
      </div>
    </div>
  );
}

/** Inline error boundary shell — preserves Industrial Luxe aesthetic. */
export function RouteErrorBoundary({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
      <AlertTriangle className="mx-auto size-8 text-gold mb-4" />
      <div className="text-telemetry mb-2">// ERR · NODE_UNREACHABLE</div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold">Channel temporarily disrupted</h2>
      <p className="mt-3 text-sm text-muted-foreground break-words">{error?.message ?? "Unknown signal loss."}</p>
      {reset && (
        <GoldButton className="mt-6 !rounded-none" onClick={reset}>
          Retry transmission
        </GoldButton>
      )}
    </div>
  );
}
