"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.volume = 0.5; // Set init volume to 50%

        // Try to play automatically
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.log("Autoplay blocked. Waiting for interaction.", error);
                    setIsPlaying(false);

                    // Fallback: Play on first click
                    const handleFirstClick = () => {
                        audio.play().then(() => {
                            setIsPlaying(true);
                            document.removeEventListener("click", handleFirstClick);
                        });
                    };
                    document.addEventListener("click", handleFirstClick);
                });
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 transition-all duration-300 hover:scale-110">
            <audio
                ref={audioRef}
                src="/music/kasihputih.mp3"
                loop
                onEnded={() => {
                    // Force loop in case browser misses it
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                    }
                }}
            />

            <button
                onClick={togglePlay}
                className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/20 backdrop-blur-md shadow-lg transition-all duration-500 ${isPlaying ? "bg-rose-500/80 text-white animate-spin-slow" : "bg-black/50 text-white/70"
                    }`}
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? (
                    <Music size={20} className="animate-pulse" />
                ) : (
                    <VolumeX size={20} />
                )}
            </button>
        </div>
    );
}
