// app/components/playlist/VideoPlayer.tsx
"use client";

import { useEffect, useRef } from "react";
import { VideoData } from "./types";

interface VideoPlayerProps {
  video: VideoData;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const artPlayerInstance = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const initPlayer = () => {
      const container = playerRef.current;
      if (!container) return;

      // Nettoyer le contenu précédent
      container.innerHTML = "";

      if (video.type === "youtube" && video.youtubeId) {
        // Pour YouTube, utiliser iframe
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "12px";
        iframe.allow = "autoplay; encrypted-media";
        container.appendChild(iframe);
        artPlayerInstance.current = iframe;
      } else {
        // Pour les vidéos locales
        const videoEl = document.createElement("video");
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.style.width = "100%";
        videoEl.style.height = "100%";
        videoEl.style.borderRadius = "12px";
        videoEl.style.backgroundColor = "#000";
        videoEl.src = video.src;
        container.appendChild(videoEl);
        artPlayerInstance.current = videoEl;
      }
    };

    initPlayer();

    return () => {
      if (artPlayerInstance.current) {
        artPlayerInstance.current.remove();
      }
    };
  }, [video]);

  return (
    <div
      style={{
        flex: "60%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
        position: "relative",
        padding: "50px 80px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Dégradé animé */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 40% 40%, ${video.color}, #000)`,
          opacity: 0.9,
          filter: "blur(60px)",
          transition: "background 0.8s ease",
        }}
      />

      {/* Bouton fermer */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "6px",
          transition: "background 0.3s",
          zIndex: 2,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
        }
      >
        ✖
      </button>

      {/* Lecteur vidéo - taille fixe */}
      <div
        ref={playerRef}
        style={{
          width: "85%",
          maxWidth: "920px",
          height: "520px",
          margin: "0 auto",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.6)",
          zIndex: 1,
          position: "relative",
        }}
      />

      {/* Description */}
      <div
        style={{
          marginTop: "35px",
          zIndex: 2,
          color: "#fff",
          textAlign: "left",
          width: "85%",
          maxWidth: "920px",
          margin: "35px auto 0",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>{video.title}</h2>
        <p style={{ color: "#b3b3b3", fontSize: "15px" }}>
          {video.artist} • {video.duration}
        </p>
        <p
          style={{
            color: "#ccc",
            fontSize: "14px",
            lineHeight: 1.6,
            marginTop: "12px",
          }}
        >
          {video.description}
        </p>
      </div>
    </div>
  );
}