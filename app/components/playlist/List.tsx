"use client";
import { VideoData } from "./types";

interface PlaylistListProps {
  videos: VideoData[];
  currentVideo: string | null;
  onSelect: (video: VideoData) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  activeColor: string;
}

export default function PlaylistList({
  videos,
  currentVideo,
  onSelect,
}: PlaylistListProps) {
  return (
    <div
      style={{
        flex: currentVideo ? "40%" : "100%",
        transition: "flex 0.6s ease",
        overflowY: "auto",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src="https://i.imgur.com/zYIlgBl.jpg"
          alt="Playlist Cover"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            My Video Playlist
          </h1>
          <p style={{ color: "#b3b3b3" }}>By You • {videos.length} videos</p>
        </div>
      </header>

      <ul style={{ marginTop: "30px", padding: 0, listStyle: "none" }}>
        {videos.map((v, i) => (
          <li
            key={i}
            onClick={() => onSelect(v)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #282828",
              cursor: "pointer",
              transition: "background 0.3s",
              backgroundColor: currentVideo === v.src ? "#282828" : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#282828")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = currentVideo === v.src ? "#282828" : "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <video
                src={v.src}
                muted
                style={{
                  width: "90px",
                  height: "56px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: "bold", color: "#fff" }}>{v.title}</div>
                <div style={{ color: "#b3b3b3", fontSize: "13px" }}>
                  {v.artist}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: currentVideo === v.src ? "#1DB954" : "#b3b3b3",
                fontSize: "13px",
                minWidth: "50px",
                justifyContent: "flex-end",
                fontWeight: currentVideo === v.src ? "bold" : "normal",
              }}
            >
              {currentVideo === v.src ? "▶ En lecture" : v.duration}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}