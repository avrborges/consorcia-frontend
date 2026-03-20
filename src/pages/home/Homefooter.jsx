import React from "react";
import { APP_VERSION } from "./homeConstants";

export default function HomeFooter({ ready }) {
  return (
    <footer
      className="relative z-10 text-center pb-8"
      style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeIn 0.6s 0.8s ease forwards" : "none" }}
    >
      <div className="flex items-center justify-center gap-2 font-['Raleway'] text-[11px] text-[rgba(240,244,248,0.2)] tracking-[0.06em]">
        <span>by ARTHEMYSA</span>
        <span className="w-1 h-1 rounded-full bg-[#5b9ea0] opacity-60" />
        <span>{APP_VERSION}</span>
      </div>
    </footer>
  );
}