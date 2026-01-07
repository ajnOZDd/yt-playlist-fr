// app/components/playlist/Playlist.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { FaUpload, FaYoutube, FaFolder, FaTimes, FaCheck } from "react-icons/fa";
import { VideoData, Playlist as PlaylistType } from "./types";
import List from "./List";
import VideoPlayer from "./VideoPlayer";

interface PlaylistProps {
  currentView?: string | null;
  onPlaylistsChange?: (playlists: PlaylistType[]) => void;
}

export default function Playlist({
  currentView,
  onPlaylistsChange,
}: PlaylistProps) {
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: "1",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "local",
      title: "Big Buck Bunny",
      artist: "Blender Foundation",
      duration: "0:30",
      thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
      color: "#ff595e",
      description: "Une animation open source de la Blender Foundation",
    },
  ]);

  const [basePlaylists, setBasePlaylists] = useState<
    Omit<PlaylistType, "videoCount">[]
  >([
    {
      id: "favorites",
      name: "Mes favoris",
      thumbnail: "https://i.imgur.com/zYIlgBl.jpg",
    },
  ]);

  // Calculer les playlists avec le nombre de vidéos
  const playlists = useMemo<PlaylistType[]>(() => {
    return basePlaylists.map((pl) => ({
      ...pl,
      videoCount: videos.filter((v) => v.playlist === pl.id).length,
    }));
  }, [videos, basePlaylists]);

  useEffect(() => {
    if (onPlaylistsChange) {
      onPlaylistsChange(playlists);
    }
  }, [playlists, onPlaylistsChange]);

  // Exposer la fonction pour ouvrir le modal d'ajout de playlist
  useEffect(() => {
    // Créer une fonction globale temporaire pour être appelée depuis page.tsx
    (window as any).openAddPlaylistModal = () => {
      setShowAddPlaylistModal(true);
    };
    return () => {
      delete (window as any).openAddPlaylistModal;
    };
  }, []);

  // Filtrer les vidéos selon currentView
  const filteredVideos =
    currentView === null || currentView === "all"
      ? videos
      : videos.filter((v) => v.playlist === currentView);

  const handleSelect = (video: VideoData) => {
    setCurrentVideo(video);
  };

  const handleClose = () => {
    setCurrentVideo(null);
  };

  const handleAddVideo = (newVideo: Partial<VideoData>) => {
    setVideos((prev) => [...prev, newVideo as VideoData]);
  };

  const handleAddPlaylist = (name: string, thumbnail: string) => {
    const newPlaylist: Omit<PlaylistType, "videoCount"> = {
      id: `playlist-${Date.now()}`,
      name,
      thumbnail: thumbnail || "https://i.imgur.com/zYIlgBl.jpg",
    };
    setBasePlaylists((prev) => [...prev, newPlaylist]);
    setShowAddPlaylistModal(false);
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
        position: "relative",
      }}
    >
      <List
        videos={filteredVideos}
        currentVideo={currentVideo}
        onSelect={handleSelect}
      />

      {currentVideo && (
        <VideoPlayer video={currentVideo} onClose={handleClose} />
      )}

      {/* Bouton flottant pour ajouter une vidéo */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#1DB954",
          border: "none",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(29, 185, 84, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(29, 185, 84, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(29, 185, 84, 0.4)";
        }}
      >
        <FaUpload />
      </button>

      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onAddVideo={handleAddVideo}
          playlists={playlists}
        />
      )}

      {showAddPlaylistModal && (
        <AddPlaylistModal
          onClose={() => setShowAddPlaylistModal(false)}
          onAddPlaylist={handleAddPlaylist}
        />
      )}
    </section>
  );
}

// ============================================================================
// ADD VIDEO MODAL
// ============================================================================
function AddVideoModal({
  onClose,
  onAddVideo,
  playlists,
}: {
  onClose: () => void;
  onAddVideo: (video: Partial<VideoData>) => void;
  playlists: PlaylistType[];
}) {
  const [mode, setMode] = useState<"youtube" | "local" | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchYouTubeInfo = async () => {
    if (!youtubeUrl.trim()) {
      alert("Veuillez entrer une URL YouTube");
      return;
    }

    setLoading(true);
    try {
      // Utiliser l'API route avec ytdl-core en passant l'URL complète
      const response = await fetch(
        `/api/youtube?url=${encodeURIComponent(youtubeUrl.trim())}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la récupération des informations"
        );
      }

      const data = await response.json();
      setVideoInfo({
        id: data.id,
        title: data.title,
        artist: data.artist,
        duration: data.duration,
        thumbnail: data.thumbnail,
        description: data.description,
      });
    } catch (error: any) {
      console.error("Error fetching YouTube info:", error);
      alert(
        error.message || "Erreur lors de la récupération des informations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const duration = Math.floor(video.duration);
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;

      setVideoInfo({
        src: url,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Vidéo locale",
        duration: `${mins}:${secs.toString().padStart(2, "0")}`,
        thumbnail: url,
        description: `Fichier local: ${file.name}`,
      });
    };

    video.src = url;
  };

  const downloadImageAsBase64 = async (url: string): Promise<string> => {
    // Passe par l'API interne pour éviter les erreurs CORS côté client
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Erreur lors du téléchargement de l'image");
    }
    const data = await response.json();
    if (!data?.dataUrl) {
      throw new Error("Réponse image invalide");
    }
    return data.dataUrl as string;
  };

  const handleConfirm = async () => {
    if (!videoInfo) return;

    let finalThumbnail = videoInfo.thumbnail;

    // Télécharger la thumbnail en base64 si c'est une URL
    if (videoInfo.thumbnail && videoInfo.thumbnail.startsWith("http")) {
      try {
        finalThumbnail = await downloadImageAsBase64(videoInfo.thumbnail);
      } catch (error) {
        console.error("Erreur lors du téléchargement de la thumbnail:", error);
        // On garde l'URL originale en cas d'erreur
      }
    }

    const newVideo: Partial<VideoData> = {
      id: mode === "youtube" ? videoInfo.id : Date.now().toString(),
      type: mode === "youtube" ? "youtube" : "local",
      youtubeId: mode === "youtube" ? videoInfo.id : undefined,
      src:
        mode === "youtube"
          ? `https://www.youtube.com/watch?v=${videoInfo.id}`
          : videoInfo.src,
      title: videoInfo.title,
      artist: videoInfo.artist,
      duration: videoInfo.duration,
      thumbnail: finalThumbnail,
      color: "#1DB954",
      description: videoInfo.description,
      playlist: selectedPlaylist === "all" ? undefined : selectedPlaylist,
    };

    onAddVideo(newVideo);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#282828",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Ajouter une vidéo
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {!mode && (
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => setMode("youtube")}
              style={{
                flex: 1,
                padding: "40px 20px",
                background: "#1DB954",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1ed760")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1DB954")
              }
            >
              <FaYoutube size={40} />
              <span>YouTube</span>
            </button>
            <button
              onClick={() => {
                setMode("local");
                fileInputRef.current?.click();
              }}
              style={{
                flex: 1,
                padding: "40px 20px",
                background: "#1DB954",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1ed760")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1DB954")
              }
            >
              <FaFolder size={40} />
              <span>Vidéo locale</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleLocalFile}
              style={{ display: "none" }}
            />
          </div>
        )}

        {mode === "youtube" && !videoInfo && (
          <div>
            <input
              type="text"
              placeholder="Collez l'URL YouTube ici..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                background: "#181818",
                border: "1px solid #404040",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "14px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={fetchYouTubeInfo}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#1DB954",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Chargement..." : "Récupérer les infos"}
            </button>
          </div>
        )}

        {videoInfo && (
          <div>
            <div
              style={{
                background: "#181818",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
              <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>
                {videoInfo.title}
              </h3>
              <p style={{ color: "#b3b3b3", fontSize: "14px" }}>
                {videoInfo.artist} • {videoInfo.duration}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#b3b3b3",
                }}
              >
                Ajouter à une playlist
              </label>
              <select
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#181818",
                  border: "1px solid #404040",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "14px",
                }}
              >
                <option value="all">Toutes les vidéos</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleConfirm}
              style={{
                width: "100%",
                padding: "12px",
                background: "#1DB954",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <FaCheck />
              Confirmer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ADD PLAYLIST MODAL
// ============================================================================
function AddPlaylistModal({
  onClose,
  onAddPlaylist,
}: {
  onClose: () => void;
  onAddPlaylist: (name: string, thumbnail: string) => void;
}) {
  const [name, setName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Fonction pour télécharger et convertir l'image en base64
  const downloadImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement de l'image");
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Erreur de conversion"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw error;
    }
  };

  // Prévisualiser l'image quand l'URL change
  const handleThumbnailUrlChange = async (url: string) => {
    setThumbnailUrl(url);
    if (url.trim()) {
      try {
        const base64 = await downloadImageAsBase64(url.trim());
        setPreviewImage(base64);
      } catch (error) {
        setPreviewImage(null);
      }
    } else {
      setPreviewImage(null);
    }
  };

  const handleConfirm = async () => {
    if (!name.trim()) {
      alert("Veuillez entrer un nom pour la playlist");
      return;
    }

    setDownloading(true);
    try {
      let finalThumbnail = "https://i.imgur.com/zYIlgBl.jpg"; // Image par défaut

      if (thumbnailUrl.trim()) {
        try {
          // Télécharger et convertir l'image en base64
          finalThumbnail = await downloadImageAsBase64(thumbnailUrl.trim());
        } catch (error) {
          console.error("Erreur lors du téléchargement de l'image:", error);
          alert("Impossible de télécharger l'image. Utilisation de l'image par défaut.");
          // On garde l'image par défaut
        }
      }

      onAddPlaylist(name.trim(), finalThumbnail);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#282828",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Créer une playlist
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#b3b3b3",
            }}
          >
            Nom de la playlist
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ma nouvelle playlist"
            style={{
              width: "100%",
              padding: "12px",
              background: "#181818",
              border: "1px solid #404040",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#b3b3b3",
            }}
          >
            URL de l'image (optionnel)
          </label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => handleThumbnailUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: "100%",
              padding: "12px",
              background: "#181818",
              border: "1px solid #404040",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          {previewImage && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={previewImage}
                alt="Aperçu"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#1DB954",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                ✓ Image téléchargée et prête à être sauvegardée localement
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={downloading}
          style={{
            width: "100%",
            padding: "12px",
            background: downloading ? "#404040" : "#1DB954",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "16px",
            cursor: downloading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          {downloading ? (
            <>⏳ Téléchargement...</>
          ) : (
            <>
              <FaCheck />
              Créer la playlist
            </>
          )}
        </button>
      </div>
    </div>
  );
}