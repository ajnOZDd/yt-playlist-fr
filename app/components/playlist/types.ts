// app/components/playlist/types.ts
export interface VideoData {
  id: string;
  src: string;
  type: 'youtube' | 'local';
  youtubeId?: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  color: string;
  description?: string;
  playlist?: string;
}

export interface Playlist {
  id: string;
  name: string;
  thumbnail: string;
  videoCount: number;
}