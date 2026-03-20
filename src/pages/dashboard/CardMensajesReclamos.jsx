import React from "react";
import { FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { SectionCard, CardHeader } from "./SectionCard";

function StatCard({ icon: Icon, iconBg, iconBorder, iconColor, count, label, ctaLabel, onCta, delay }) {
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={Icon} title={label} />
      <div className="px-5 py-[14px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
          <div>
            <p className="font-['Urbanist'] text-[20px] font-extrabold text-[#2d3250] m-0 leading-none">{count}</p>
            <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] mt-[2px] mb-0">{label.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={onCta}
          className="px-[14px] py-[7px] rounded-[10px] bg-[#2a6b6e] border-none font-['Raleway'] text-[12px] font-semibold text-white cursor-pointer touch-manipulation whitespace-nowrap flex-shrink-0 transition-colors duration-150 hover:bg-[#235b5e]"
        >
          Ver →
        </button>
      </div>
    </SectionCard>
  );
}

export function CardMensajes({ navigate, delay, data }) {
  return (
    <StatCard
      icon={FiMessageSquare}
      iconBg="rgba(91,158,160,0.10)"
      iconBorder="rgba(91,158,160,0.2)"
      iconColor="#5b9ea0"
      count={data?.mensajes.sinLeer}
      label="Mensajes"
      onCta={() => navigate("/mensajes")}
      delay={delay}
    />
  );
}

export function CardReclamos({ navigate, delay, data }) {
  return (
    <StatCard
      icon={FiAlertCircle}
      iconBg="rgba(249,177,122,0.10)"
      iconBorder="rgba(249,177,122,0.25)"
      iconColor="#c87941"
      count={data?.reclamos.abiertos}
      label="Reclamos"
      onCta={() => navigate("/reclamos")}
      delay={delay}
    />
  );
}