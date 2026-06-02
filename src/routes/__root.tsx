import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { CurrencyProvider } from "@/lib/currency";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { ChatB2K } from "@/components/ChatB2K";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 telemetry-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="relative max-w-lg w-full text-center glass-panel rounded-2xl p-10 sm:p-14 shadow-gold border-gold/40">
        <div className="text-telemetry mb-3 inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
          ERR · CLEARANCE_REVOKED · 404
        </div>
        <div className="font-display text-7xl sm:text-8xl font-bold bg-gradient-gold bg-clip-text text-transparent leading-none">404</div>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl font-semibold">Sovereign Access Denied</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This coordinate is outside the perimeter. The sector you requested does not exist, has been decommissioned, or requires elevated clearance.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" className="font-mono uppercase tracking-widest text-xs px-5 py-2.5 rounded bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90 transition">
            Return to Command
          </Link>
          <Link to="/shop" className="font-mono uppercase tracking-widest text-xs px-5 py-2.5 rounded border border-gold/40 text-gold hover:bg-gold/10 transition">
            Enter the Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel rounded-lg p-10">
        <div className="text-telemetry mb-2">ERR · SYSTEM_FAULT</div>
        <h1 className="font-display text-xl text-gold">This sector did not load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Telemetry interrupted. Try re-syncing.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex font-mono uppercase tracking-widest text-xs px-4 py-2 rounded bg-gradient-gold text-primary-foreground"
        >
          Re-sync
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#050505" },
      { title: "ResoFlex OS™ — Sovereign Performance Operating System" },
      { name: "description", content: "Nigerian luxury fitness & wellness commerce. Elite supplements, meal plans, referral monetization, and sovereign training programs." },
      { property: "og:site_name", content: "ResoFlex OS" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ResoFlex OS™ — Sovereign Performance Operating System" },
      { property: "og:description", content: "Nigerian luxury fitness & wellness commerce. Elite supplements, meal plans, referral monetization, and sovereign training programs." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ResoFlex OS™ — Sovereign Performance Operating System" },
      { name: "twitter:description", content: "Nigerian luxury fitness & wellness commerce. Elite supplements, meal plans, referral monetization, and sovereign training programs." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/6Eau1IDWDDhZUhfxU2V2gQiCmo03/social-images/social-1779092194932-IMG_1140.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/6Eau1IDWDDhZUhfxU2V2gQiCmo03/social-images/social-1779092194932-IMG_1140.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ResoFlex OS",
        description: "Nigerian luxury fitness & wellness commerce platform.",
        slogan: "Sovereign Performance Operating System",
      }),
    }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <TopNav />
          <main className="min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0">
            <Outlet />
          </main>
          <Footer />
          <BottomNav />
          <ChatB2K />
          <Toaster />
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
