import { useEffect, useState } from "react";

export function ScarcityBanner() {
  const [seats, setSeats] = useState(47);
  useEffect(() => {
    const t = setInterval(() => setSeats((s) => Math.max(12, s - (Math.random() > 0.7 ? 1 : 0))), 8000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-gold/10 border-b border-gold/20 text-center text-xs font-mono uppercase tracking-widest py-2 px-4">
      <span className="text-gold">⬢ Q2 ENROLLMENT OPEN</span>
      <span className="text-muted-foreground mx-2">·</span>
      <span>Only <span className="text-gold font-semibold">{seats}</span> sovereign seats remaining</span>
    </div>
  );
}
