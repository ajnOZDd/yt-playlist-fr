"use client";

import { useState } from "react";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaPlus,
  FaListUl,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";

export default function Sidebar({
  onToggle,
}: {
  onToggle?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isOpen ? "260px" : "70px",
        height: "100vh",
        backdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(18, 18, 18, 0.85)",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "24px 15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#b3b3b3",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.4)",
        transition: "width 0.4s ease, backdrop-filter 0.4s ease",
        zIndex: 99,
      }}
    >
      {/* 🔝 Header + Toggle */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            marginBottom: "25px",
          }}
        >
          {isOpen && (
            <h2
              style={{
                color: "#1DB954",
                fontSize: "22px",
                fontWeight: "bold",
                transition: "opacity 0.3s ease",
                opacity: isOpen ? 1 : 0,
              }}
            >
              MyTunes
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            {isOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
        </div>

        {/* 🔍 Barre de recherche */}
        {isOpen && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#282828",
              borderRadius: "20px",
              padding: "6px 12px",
              marginBottom: "25px",
              transition: "opacity 0.3s ease",
            }}
          >
            <FaSearch style={{ color: "#b3b3b3", marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Rechercher..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
        )}

        {/* 🧭 Navigation principale */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: isOpen ? "flex-start" : "center",
          }}
        >
          <NavItem icon={<FaHome />} label="Accueil" open={isOpen} active />
          <NavItem icon={<FaListUl />} label="Bibliothèque" open={isOpen} />
          <NavItem icon={<FaPlus />} label="Créer" open={isOpen} />
          <NavItem icon={<FaHeart />} label="Favoris" open={isOpen} />
        </nav>
      </div>

      {/* 🦶 Footer */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid #282828",
            paddingTop: "20px",
            fontSize: "13px",
            color: "#808080",
            textAlign: "center",
          }}
        >
          <p>© 2026 MyTunes</p>
          <p style={{ color: "#555", marginTop: "6px" }}>Made with ❤️</p>
        </div>
      )}
    </aside>
  );
}

/* 🔘 Élément de navigation */
function NavItem({
  icon,
  label,
  active = false,
  open = true,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  open?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: open ? "12px" : "0",
        justifyContent: open ? "flex-start" : "center",
        color: active ? "#fff" : "#b3b3b3",
        fontWeight: active ? "bold" : "normal",
        fontSize: "15px",
        padding: "8px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        transition: "background 0.3s, color 0.3s, gap 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.background = "#1DB95422");
        (e.currentTarget.style.color = "#fff");
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.background = "transparent");
        (e.currentTarget.style.color = active ? "#fff" : "#b3b3b3");
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {open && label}
    </div>
  );
}
