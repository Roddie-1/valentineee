"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Closing() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context((self) => {
            // Safely select elements with the class 'reveal-text'
            // self.selector is scoped to containerRef
            const targets = self.selector?.(".reveal-text");

            if (targets && targets.length > 0) {
                gsap.fromTo(
                    targets,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.5,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: containerRef.current?.querySelector(".text-container"),
                            start: "top 60%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full">
            {/* 1. Sticky Image Section */}
            <div className="sticky top-0 h-screen w-full -z-10 overflow-hidden">
                <Image
                    src="/assets/athalia.jpeg"
                    alt="Us Together"
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    quality={100}
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* 2. Spacer */}
            <div className="h-[40vh] w-full bg-transparent pointer-events-none" />

            {/* 3. Text Overlay Section */}
            <div className="text-container relative z-10 min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-black/80 to-black text-center px-4 pt-20 pb-40">
                <div className="flex flex-col items-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="reveal-text inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 mb-8 shadow-lg">
                        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                        <span className="tracking-[0.2em] uppercase text-xs font-bold font-sans">Forever & Always</span>
                        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                    </div>

                    {/* Main Heading */}
                    <h2 className="reveal-text text-5xl md:text-8xl font-bold text-white font-serif drop-shadow-2xl mb-6 tracking-tight">
                        Happy <span className="text-rose-500">Valentine's</span> Day
                    </h2>

                    {/* Subtext */}
                    <p className="reveal-text text-white/80 text-lg md:text-2xl font-light font-sans max-w-2xl leading-relaxed drop-shadow-md">
                        Thank you for being the best part of my life. <br />
                        I love you more than words can say.
                    </p>

                    {/* Decorative Line */}
                    <div className="reveal-text mt-12 w-16 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full opacity-80" />
                </div>
            </div>
        </section>
    );
}
