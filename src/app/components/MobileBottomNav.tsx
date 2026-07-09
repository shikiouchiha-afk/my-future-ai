"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { triggerHaptic } from "@/lib/mobileFeedback";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/premium", label: "Premium", icon: "✨" },
  { href: "/settings", label: "Profile", icon: "👤" },
  { href: "/", label: "Help", icon: "🛟" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobileNav" aria-label="Mobile navigation">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`item ${active ? "active" : ""}`}
            onClick={() => triggerHaptic(8)}
          >
            <span className="icon" aria-hidden="true">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        );
      })}

      <style jsx>{`
        .mobileNav {
          position: fixed;
          left: 10px;
          right: 10px;
          bottom: calc(8px + env(safe-area-inset-bottom));
          z-index: 60;
          display: none;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          padding: 8px;
          border-radius: 16px;
          background: rgba(8, 14, 30, 0.84);
          border: 1px solid rgba(145, 174, 219, 0.28);
          backdrop-filter: blur(16px);
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-height: 50px;
          border-radius: 12px;
          color: #c9dcff;
          text-decoration: none;
          font-size: 0.72rem;
          letter-spacing: 0.01em;
          transition: transform 140ms ease, background 140ms ease;
        }

        .item:active {
          transform: scale(0.97);
        }

        .item.active {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(34, 211, 238, 0.28));
          color: white;
          border: 1px solid rgba(177, 214, 255, 0.35);
        }

        .icon {
          font-size: 0.95rem;
          line-height: 1;
        }

        @media (max-width: 900px) {
          .mobileNav {
            display: grid;
          }
        }
      `}</style>
    </nav>
  );
}
