// app/page.tsx
"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playlist from "./components/playlist/Playlist";
import { Playlist as PlaylistType } from "./components/playlist/types";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

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
      <Sidebar
        onToggle={setSidebarOpen}
        playlists={playlists}
        onPlaylistSelect={setCurrentView}
        currentView={currentView}
        onAddPlaylist={() => {
          // Appeler la fonction globale pour ouvrir le modal
          if ((window as any).openAddPlaylistModal) {
            (window as any).openAddPlaylistModal();
          }
        }}
      />

      {/* Contenu principal avec espacement ajusté */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 60px",
          paddingLeft: sidebarOpen ? "40px" : "20px",
          transition: "padding-left 0.4s ease",
        }}
      >
        <Playlist
          currentView={currentView}
          onPlaylistsChange={setPlaylists}
        />
      </div>
    </main>
  );
}
