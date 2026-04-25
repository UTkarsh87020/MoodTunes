import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | one | all
  const [likedSongs, setLikedSongs] = useState(new Set(['1', '3', '6', '9', '12']));
  const audioRef = useRef(null);

  const playSong = useCallback((song, songQueue = []) => {
    if (!song.audioUrl) {
      setCurrentSong(song);
      setIsPlaying(false);
      if (songQueue.length) setQueue(songQueue);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = song.audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(() => {});
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    if (songQueue.length) setQueue(songQueue);
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (audioRef.current && currentSong.audioUrl) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
    setIsPlaying(p => !p);
  }, [currentSong, isPlaying]);

  const playNext = useCallback(() => {
    if (!queue.length) return;
    const next = (queueIndex + 1) % queue.length;
    setQueueIndex(next);
    playSong(queue[next], queue);
  }, [queue, queueIndex, playSong]);

  const playPrev = useCallback(() => {
    if (!queue.length) return;
    const prev = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prev);
    playSong(queue[prev], queue);
  }, [queue, queueIndex, playSong]);

  const toggleLike = useCallback((songId) => {
    setLikedSongs(prev => {
      const next = new Set(prev);
      next.has(songId) ? next.delete(songId) : next.add(songId);
      return next;
    });
  }, []);

  const handleVolumeChange = useCallback((v) => {
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
  }, [isMuted, volume]);

  const seekTo = useCallback((pct) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
      setProgress(pct * duration);
    }
  }, [duration]);

  return (
    <PlayerContext.Provider value={{
      currentSong, queue, setQueue, queueIndex, isPlaying, volume, isMuted,
      progress, setProgress, duration, setDuration, shuffle, setShuffle,
      repeat, setRepeat, likedSongs, audioRef,
      playSong, togglePlay, playNext, playPrev, toggleLike,
      handleVolumeChange, toggleMute, seekTo,
    }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          if (repeat === 'one') { audioRef.current.play(); }
          else playNext();
        }}
      />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
