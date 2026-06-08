import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";

// Mobile-only sticky bar with the primary "Shop" CTA. Appears after first scroll.
export function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 md:hidden pointer-events-none">
      <Link
        to="/shop"
        onClick={() => track("cta_click", { cta: "sticky_shop", surface: "mobile" })}
        className="pointer-events-auto block w-full text-center font-mono uppercase tracking-widest text-xs min-h-12 py-3.5 bg-gradient-gold text-primary-foreground shadow-gold rounded-none"
      >
        Enter the Shop →
      </Link>
    </div>
  );
}
