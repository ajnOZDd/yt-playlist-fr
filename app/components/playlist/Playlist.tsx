"use client";
import { useState, useRef } from "react";
import { VideoData } from "./types";
import List from "./List";
import VideoPlayer from "./VideoPlayer";

export default function Playlist() {
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSelect = (video: VideoData) => {
    if (videoRef.current) videoRef.current.pause();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentVideo(video);
      setIsAnimating(false);
    }, 200);
  };

  const handleClose = () => {
    if (videoRef.current) videoRef.current.pause();
    setCurrentVideo(null);
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        background: "#181818",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <List
        videos={videos}
        currentVideo={currentVideo?.src || null}
        onSelect={handleSelect}
        videoRef={videoRef}
        activeColor={currentVideo?.color || "#1DB954"}
      />
      {currentVideo && (
        <VideoPlayer
          video={currentVideo}
          onClose={handleClose}
          videoRef={videoRef}
          isAnimating={isAnimating}
        />
      )}
    </section>
  );
}

/* Données */
const videos: VideoData[] = [
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    color: "#ff595e",
    title: "Blinding Lights (Live)",
    artist: "The Weeknd",
    duration: "3:20",
    description:
      "Une performance live électrisante de The Weeknd, mêlant lumière, rythme et intensité visuelle.",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    color: "#4361ee",
    title: "Levitating (Music Video)",
    artist: "Dua Lipa",
    duration: "3:24",
    description:
      "Le clip officiel de 'Levitating', un mélange captivant de pop, de danse et d’univers rétro futuriste.",
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    color: "#f4a261",
    title: "Peaches (Live at Home)",
    artist: "Justin Bieber",
    duration: "3:18",
    description:
      "Justin Bieber interprète 'Peaches' dans une ambiance intime, entre chaleur et authenticité.",
  },
];
