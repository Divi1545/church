"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface VideoPlayerProps {
  onVideoComplete: () => void;
}

const VIDEO_SRC = "/video/welcome.mp4";
const SKIP_DELAY_MS = 15_000;

export default function VideoPlayer({ onVideoComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleEnded = useCallback(() => {
    onVideoComplete();
  }, [onVideoComplete]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleTapToPlay = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Full-width video container — breaks out of parent padding on mobile */}
      <div
        className="relative w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 md:rounded-2xl
                    overflow-hidden shadow-lg bg-navy/5"
        style={{ aspectRatio: "9 / 16" }}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onClick={handleTapToPlay}
        />

        {/* Tap to play overlay for mobile browsers that block autoplay */}
        {!isPlaying && (
          <button
            onClick={handleTapToPlay}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center
                       bg-black/30 text-white transition-opacity duration-300"
            aria-label="Tap to play video"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-90"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="mt-2 text-sm font-body opacity-80">
              Tap to play
            </span>
          </button>
        )}

        {/* Mute / Unmute toggle */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 z-20 p-3 rounded-full
                     bg-navy/60 backdrop-blur-sm text-white
                     hover:bg-navy/80 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          {isMuted ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </button>
      </div>

      {showSkip && (
        <div className="px-4 md:px-0">
          <button
            onClick={onVideoComplete}
            className="animate-fade-in-up w-full py-3.5 px-6 bg-gold hover:bg-gold-light
                       text-navy font-heading font-semibold text-base rounded-xl
                       transition-all duration-300 hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
          >
            Skip to Form →
          </button>
        </div>
      )}
    </div>
  );
}
