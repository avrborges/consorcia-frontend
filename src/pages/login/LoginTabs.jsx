import React from "react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

const TABS = [
  { id: "login",    label: "Ingresar",    Icon: FiLogIn    },
  { id: "register", label: "Registrarse", Icon: FiUserPlus },
];

export default function LoginTabs({ activeTab, onSelect }) {
  return (
    <div
      role="tablist"
      className="flex gap-1 bg-[rgba(45,50,80,0.07)] rounded-[14px] p-1 mb-6"
    >
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onSelect(id)}
          className={`
            flex-1 flex items-center justify-center gap-[6px]
            py-[9px] rounded-[10px] border-none outline-none
            text-[13px] font-['Raleway'] font-semibold
            cursor-pointer touch-manipulation
            transition-all duration-200
            ${activeTab === id
              ? "bg-[#2a6b6e] text-white shadow-[0_4px_14px_rgba(42,107,110,0.30)]"
              : "bg-transparent text-[rgba(45,50,80,0.4)] hover:text-[rgba(45,50,80,0.7)]"
            }
          `}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}