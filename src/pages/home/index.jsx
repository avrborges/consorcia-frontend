import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileSlider from "./MobileSlider";
import HomeNav from "./HomeNav";
import HomeHero from "./HomeHero";
import HomeFooter from "./HomeFooter";

/*
  Los @keyframes (floatA, floatB, fadeUp, fadeIn, pillIn) viven aquí porque:
  - Son usados por múltiples hijos (HomeHero, HomeFooter)
  - Tailwind no puede generar keyframes custom sin config
  - Al estar en el <main> se aplican a todos los hijos del árbol
*/

export default function HomePage({ onLogin, onRegister }) {
  const navigate = useNavigate();
  const [ready, setReady]       = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const goLogin    = onLogin    ?? (() => navigate("/login"));
  const goRegister = onRegister ?? (() => navigate("/register"));

  if (isMobile) {
    return <MobileSlider onLogin={goLogin} onRegister={goRegister} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#1a1f3e] font-['Raleway']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&family=Urbanist:wght@700;800&display=swap');

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-24px) rotate(8deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(18px) rotate(-6deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pillIn {
          from { opacity: 0; transform: scale(0.88) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <HomeNav   onLogin={goLogin} onRegister={goRegister} />
      <HomeHero  ready={ready}     onLogin={goLogin} onRegister={goRegister} />
      <HomeFooter ready={ready} />
    </main>
  );
}