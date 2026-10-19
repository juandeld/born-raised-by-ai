"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sets <html lang> from /colorear/<es|en>/... so screen readers pick the right voice. */
export function LangSetter() {
  const path = usePathname();
  useEffect(() => {
    const seg = path.split("/")[2];
    document.documentElement.lang = seg === "en" ? "en" : "es";
  }, [path]);
  return null;
}
