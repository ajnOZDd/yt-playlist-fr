// app/components/Sidebar.tsx
"use client";

import { useState } from "react";
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaListUl,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { Playlist } from "./playlist/types";

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
  playlists: Playlist[];
  onPlaylistSelect: (playlistId: string | null) => void;
  currentView: string | null;
  onAddPlaylist?: () => void;
}

export default function Sidebar({
  onToggle,
  playlists,
  onPlaylistSelect,
  currentView,
  onAddPlaylist,
}: SidebarProps) {
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
        transition: "width 0.4s ease",
        zIndex: 99,
        overflowY: "auto",
      }}
    >
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
            }}
          >
            {isOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
        </div>

        {isOpen && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#282828",
              borderRadius: "20px",
              padding: "6px 12px",
              marginBottom: "25px",
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

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <NavItem
            icon={<FaHome />}
            label="Accueil"
            open={isOpen}
            active={currentView === null}
            onClick={() => onPlaylistSelect(null)}
          />
          <NavItem
            icon={<FaListUl />}
            label="Toutes les vidéos"
            open={isOpen}
            active={currentView === "all"}
            onClick={() => onPlaylistSelect("all")}
          />
        </nav>

        {isOpen && (
          <div style={{ marginTop: "30px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <h3
                style={{
                  color: "#b3b3b3",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                MES PLAYLISTS
              </h3>
              <button
                onClick={onAddPlaylist}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#b3b3b3",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.3s, background 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1DB954";
                  e.currentTarget.style.background = "#1DB95422";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#b3b3b3";
                  e.currentTarget.style.background = "transparent";
                }}
                title="Ajouter une playlist"
              >
                <FaPlus />
              </button>
            </div>
            {playlists.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => onPlaylistSelect(pl.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background:
                        currentView === pl.id ? "#1DB95422" : "transparent",
                      color: currentView === pl.id ? "#fff" : "#b3b3b3",
                      transition: "background 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (currentView !== pl.id) {
                        e.currentTarget.style.background = "#282828";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentView !== pl.id) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#b3b3b3";
                      }
                    }}
                  >
                    <img
                      src={pl.thumbnail}
                      alt={pl.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        // Image de fallback si l'URL n'est pas valide
                        e.currentTarget.src =
                          "https://i.imgur.com/zYIlgBl.jpg";
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        {pl.name}
                      </div>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {pl.videoCount} vidéos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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

function NavItem({
  icon,
  label,
  active = false,
  open = true,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  open?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
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
        background: active ? "#1DB95422" : "transparent",
        transition: "background 0.3s, color 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1DB95422";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active ? "#1DB95422" : "transparent";
        e.currentTarget.style.color = active ? "#fff" : "#b3b3b3";
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {open && label}
    </div>
  );
}