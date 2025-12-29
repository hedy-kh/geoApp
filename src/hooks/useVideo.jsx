// src/hooks/useVideo.js
import { useState, useCallback, useEffect } from "react";
import { useVideoPlayer } from "expo-video";

export default function useVideo(source, options = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Create player with useVideoPlayer - pass source directly
  const player = useVideoPlayer(source, (player) => {
    // Configuration callback
    player.loop = options.loop || false;
    player.volume = options.volume !== undefined ? options.volume : 1.0;
    player.muted = options.muted || false;
  });

  useEffect(() => {
    if (!player) {
      setError("Failed to create video player");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    // Set up event listeners
    const playingSubscription = player.addListener("playingChange", (event) => {
      setIsPlaying(event.isPlaying);
    });

    const timeSubscription = player.addListener(
      "currentTimeChange",
      (event) => {
        setCurrentTime(event.currentTime);
      }
    );

    const durationSubscription = player.addListener(
      "durationChange",
      (event) => {
        setDuration(event.duration);
      }
    );

    // Cleanup subscriptions
    return () => {
      playingSubscription?.remove();
      timeSubscription?.remove();
      durationSubscription?.remove();
    };
  }, [player]);

  const togglePlay = useCallback(() => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  }, [player, isPlaying]);

  const play = useCallback(() => {
    if (player) {
      player.play();
    }
  }, [player]);

  const pause = useCallback(() => {
    if (player) {
      player.pause();
    }
  }, [player]);

  const stop = useCallback(() => {
    if (player) {
      player.pause();
      player.seekTo(0);
    }
  }, [player]);

  const toggleMute = useCallback(() => {
    if (player) {
      player.muted = !player.muted;
    }
  }, [player]);

  const seekTo = useCallback(
    (seconds) => {
      if (player) {
        player.seekTo(seconds);
      }
    },
    [player]
  );

  const getPlayer = useCallback(() => player, [player]);

  return {
    player,
    getPlayer,
    isLoading,
    error,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    play,
    pause,
    stop,
    toggleMute,
    seekTo,
  };
}
