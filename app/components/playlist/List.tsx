// app/components/playlist/List.tsx
"use client";

import { FaYoutube } from "react-icons/fa";
import { VideoData } from "./types";

interface VideoListProps {
  videos: VideoData[];
  currentVideo: VideoData | null;
  onSelect: (video: VideoData) => void;
}

export default function List({
  videos,
  currentVideo,
  onSelect,
}: VideoListProps) {
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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
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
            Ma bibliothèque
          </h1>
          <p style={{ color: "#b3b3b3" }}>{videos.length} vidéos</p>
        </div>
      </header>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {videos.map((v) => (
          <li
            key={v.id}
            onClick={() => onSelect(v)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #282828",
              cursor: "pointer",
              backgroundColor:
                currentVideo?.id === v.id ? "#282828" : "transparent",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#282828")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentVideo?.id === v.id ? "#282828" : "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "90px",
                  height: "56px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {v.title}
                  {v.type === "youtube" && (
                    <FaYoutube color="#FF0000" size={14} />
                  )}
                </div>
                <div style={{ color: "#b3b3b3", fontSize: "13px" }}>
                  {v.artist}
                </div>
              </div>
            </div>

            <div
              style={{
                color: currentVideo?.id === v.id ? "#1DB954" : "#b3b3b3",
                fontSize: "13px",
                fontWeight: currentVideo?.id === v.id ? "bold" : "normal",
              }}
            >
              {currentVideo?.id === v.id ? "▶ En lecture" : v.duration}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}