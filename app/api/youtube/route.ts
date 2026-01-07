// app/api/youtube/route.ts
import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("id");
  const url = searchParams.get("url");

  if (!videoId && !url) {
    return NextResponse.json(
      { error: "Video ID or URL is required" },
      { status: 400 }
    );
  }

  try {
    let videoUrl = url || `https://www.youtube.com/watch?v=${videoId}`;

    // Valider l'URL YouTube
    if (!ytdl.validateURL(videoUrl)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Obtenir les informations de la vidéo avec options
    const info = await ytdl.getInfo(videoUrl, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
      lang: 'fr',
    });

    // Vérifier que les informations sont valides
    if (!info || !info.videoDetails) {
      throw new Error("Impossible de récupérer les informations de la vidéo");
    }

    // Extraire les métadonnées
    const videoDetails = info.videoDetails;

    // Trouver la meilleure thumbnail disponible
    const thumbnails = videoDetails.thumbnails || [];
    const thumbnail =
      thumbnails.find((t) => t && t.width && t.width >= 640)?.url ||
      thumbnails[thumbnails.length - 1]?.url ||
      `https://img.youtube.com/vi/${videoDetails.videoId}/maxresdefault.jpg`;

    // Calculer la durée en format MM:SS ou HH:MM:SS
    const durationSeconds = parseInt(videoDetails.lengthSeconds || "0");
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    let duration = "";
    if (hours > 0) {
      duration = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    // Retourner les métadonnées
    return NextResponse.json({
      id: videoDetails.videoId,
      title: videoDetails.title,
      artist: videoDetails.author?.name || videoDetails.ownerChannelName || "Unknown",
      duration,
      thumbnail,
      description: videoDetails.description || "",
      channelId: videoDetails.channelId,
      viewCount: videoDetails.viewCount,
    });
  } catch (error: any) {
    console.error("Error fetching YouTube info:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Messages d'erreur plus spécifiques
    let errorMessage = "Failed to fetch video information";
    if (error.message?.includes("Sign in to confirm your age")) {
      errorMessage = "Cette vidéo nécessite une vérification d'âge";
    } else if (error.message?.includes("Private video")) {
      errorMessage = "Cette vidéo est privée";
    } else if (error.message?.includes("Video unavailable")) {
      errorMessage = "Cette vidéo n'est pas disponible";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
