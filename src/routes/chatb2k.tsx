import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, MessageSquare, User, Utensils, Dumbbell, CheckSquare, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chatb2k")({
  component: ChatB2KLayout,
  head: () => ({
    meta: [
      { title: "ResoFit AI Coach — Sovereign Health & CEO OS" },
      { name: "description", content: "Your Nigerian AI health, fitness, nutrition, habit, and CEO productivity coach. Personalized meal plans, workouts, and executive protocols." },
      { property: "og:title", content: "ResoFit AI Coach" },
      { property: "og:description", content: "Personalized Nigerian health, fitness and CEO operating system." },
    ],
  }),
});

const NAV = [
  { to: "/chatb2k", label: "Today", icon: LayoutDashboard, exact: true },
  { to: "/chatb2k/coach", label: "AI Coach", icon: MessageSquare, exact: false },
  { to: "/chatb2k/meals", label: "Meals", icon: Utensils, exact: false },
  { to: "/chatb2k/workouts", label: "Workouts", icon: Dumbbell, exact: false },
  { to: "/chatb2k/habits", label: "Habits", icon: CheckSquare, exact: false },
  { to: "/chatb2k/ceo", label: "CEO OS", icon: Brain, exact: false },
  { to: "/chatb2k/onboarding", label: "Profile", icon: User, exact: false },
] as const;

function ChatB2KLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login", replace: true });
    }
  }, [loading, user, nav]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-telemetry">// AUTHENTICATING</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="border-b border-gold/10 sticky top-14 z-30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex gap-1 overflow-x-auto scrollbar-hide">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors",
                  active
                    ? "text-gold border-gold"
                    : "text-muted-foreground border-transparent hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </div>
    </div>
  );
}
