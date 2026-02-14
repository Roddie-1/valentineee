"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Rose3D from "./Rose3D";

export default function Hero() {
    const ref = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Add physics-based smoothing
    const smoothScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Text moves up faster (foreground element feeling)
    const yText = useTransform(smoothScroll, [0, 1], ["0%", "100%"]);
    const opacityText = useTransform(smoothScroll, [0, 0.5], [1, 0]);
    const scaleText = useTransform(smoothScroll, [0, 1], [1, 0.9]);

    // Rose moves slower (background element feeling) but scales slightly
    const yRose = useTransform(smoothScroll, [0, 1], ["0%", "40%"]);
    const scaleRose = useTransform(smoothScroll, [0, 1], [1, 1.1]);

    const scrollToNext = () => {
        const nextSection = document.getElementById("gallery");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div ref={ref} className="relative h-screen w-full flex flex-col md:flex-row items-center justify-between overflow-hidden bg-gradient-to-b from-rose-100 to-pink-50 px-4 md:px-20">
            {/* Floating Hearts & Petals Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {mounted && [...Array(20)].map((_, i) => {
                    // Pre-calculate random values to ensure consistency within the render
                    const xPos = Math.random() * 100;
                    const scaleVal = Math.random() * 0.5 + 0.5;
                    const rotationVal = Math.random() * 360;
                    const durationVal = Math.random() * 15 + 10;
                    const delayVal = Math.random() * 10;
                    const driftVal = Math.random() * 20 - 10;
                    const iconSize = Math.random() * 30 + 10;
                    const fontSizeVal = Math.random() * 20 + 20;

                    return (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                y: "110vh",
                                x: xPos + "vw",
                                scale: scaleVal,
                                rotate: rotationVal,
                            }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                y: "-10vh",
                                rotate: "+=360",
                                x: `+=${driftVal}vw`,
                            }}
                            transition={{
                                duration: durationVal,
                                repeat: Infinity,
                                delay: delayVal,
                                ease: "linear",
                            }}
                            className="absolute text-pink-300/40"
                        >
                            {i % 2 === 0 ? (
                                <Heart size={iconSize} fill="currentColor" />
                            ) : (
                                <span style={{ fontSize: `${fontSizeVal}px` }}>🌸</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                style={{ y: yText, opacity: opacityText, scale: scaleText }}
                className="z-10 text-center md:text-left max-w-2xl mt-10 md:mt-0"
            >
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1, type: "spring" }}
                    className="text-6xl md:text-8xl font-normal text-rose-500 drop-shadow-sm mb-6 leading-snug font-serif"
                >
                    Happy Valentine's <br />
                    <span className="flex items-center justify-center md:justify-start gap-4 mt-2">
                        My Love!
                        <Heart className="text-rose-500 fill-rose-500 drop-shadow-md animate-pulse" size={64} />
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-lg md:text-2xl text-rose-900/70 font-semibold mb-8 font-sans leading-relaxed"
                >
                    To the one who makes my heart skip a beat. <br />
                    <span className="block mt-4 text-rose-400/80 font-normal text-xl font-serif leading-relaxed">
                        "Aku cuma mau bilang, having you is the best thing that ever happened to me."
                    </span>
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    onClick={scrollToNext}
                    className="px-10 py-4 bg-rose-500 text-white rounded-full font-bold shadow-xl shadow-rose-300/50 hover:bg-rose-600 transition-all z-20 flex items-center gap-2 mx-auto md:mx-0 group font-sans"
                >
                    Let's Start Our Journey
                    <span className="group-hover:translate-x-1 transition-transform">✨</span>
                </motion.button>
            </motion.div>

            <motion.div
                style={{ y: yRose, scale: scaleRose }}
                className="absolute md:relative w-full md:w-[60%] h-[500px] md:h-[800px] z-10 bottom-0 md:bottom-auto opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto"
            >
                <Rose3D />
            </motion.div>

            {/* Removed SVG Wave for cleaner Parallax Transition */}

        </div>
    );
}
