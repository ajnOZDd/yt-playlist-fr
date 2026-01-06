"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playlist from "./components/playlist/Playlist";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main
      style={{
        display: "flex",
        transition: "margin-left 0.4s ease",
        marginLeft: sidebarOpen ? "260px" : "70px",
        height: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Sidebar onToggle={setSidebarOpen} />

      {/* 🧾 Contenu principal avec espacement ajusté */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 60px", // haut/bas et droite
          paddingLeft: sidebarOpen ? "40px" : "20px", // 👈 espace à gauche dynamique
          transition: "padding-left 0.4s ease",
        }}
      >
        <Playlist />
      </div>
    </main>
  );
}
