"use client";
import { VideoData } from "./types";

interface VideoPlayerProps {
  video: VideoData;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isAnimating: boolean;
}

export default function VideoPlayer({
  video,
  onClose,
  videoRef,
  isAnimating,
}: VideoPlayerProps) {

  return (
    <div
      style={{
        flex: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#000",
        position: "relative",
        transition: "all 0.6s ease",
        padding: "50px 80px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* 🌈 Dégradé animé */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 40% 40%, ${video.color}, #000)`,
          animation: "gradientMove 10s infinite alternate",
          opacity: 0.9,
          filter: "blur(60px)",
          transition: "background 0.8s ease",
        }}
      />

      {/* ✖ Bouton fermer */}
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
      >
        ✖
      </button>

      {/* 🎥 Vidéo principale */}
      <video
        ref={videoRef}
        src={video.src}
        controls
        autoPlay
        style={{
          width: "85%",
          maxWidth: "920px",
          borderRadius: "12px",
          outline: "none",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.6)",
          zIndex: 1,
          opacity: isAnimating ? 0 : 1,
          transition: "opacity 0.5s ease, transform 0.5s ease",
          transform: isAnimating ? "scale(0.95)" : "scale(1)",
        }}
      />

      {/* 📝 Description */}
      <div
        style={{
          marginTop: "35px",
          zIndex: 2,
          color: "#fff",
          textAlign: "left",
          width: "85%",
          maxWidth: "920px",
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

      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 30% 30%;
          }
          100% {
            background-position: 70% 70%;
          }
        }
      `}</style>
    </div>
  );
}