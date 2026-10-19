"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-reads the server page every few seconds while something is still pending (payment confirmation, recording). */
export function AutoRefresh({ everyMs = 3000, maxTimes = 40 }: { everyMs?: number; maxTimes?: number }) {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      if (++n > maxTimes) clearInterval(id);
      else router.refresh();
    }, everyMs);
    return () => clearInterval(id);
  }, [router, everyMs, maxTimes]);
  return null;
}
