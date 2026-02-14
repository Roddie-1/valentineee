"use client";

import { useRef, useEffect } from "react";
import { Heart, MapPin, MessageCircleHeart, Sparkles, Infinity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
    {
        title: "First Meet",
        desc: "Awal mula kita bertemu yang tak terlupakan, di organisasi osis yang dimana membawa kita bersama dari tahun ketahun",
        emoji: "💫",
        icon: MapPin,
        color: "from-pink-400 to-rose-500",
        dotColor: "bg-pink-400",
    },
    {
        title: "First Date",
        desc: "seinget ku first date kita sihh nge gym yaa, pokoknyaa yaa keluar bareng awal awal tu nge gym dehh",
        emoji: "☕",
        icon: Heart,
        color: "from-rose-400 to-red-500",
        dotColor: "bg-rose-400",
    },
    {
        title: "Confession",
        desc: "Hari dimana aku memberanikan diri bilang suka, karena aku melihat beberapa tanda tanda dan chance yang dapat meyakinkan diriku untuk berani menyatakan perasaan. tepatnya pada 20 november 2025 kemarinn di Omah Prahu Waduk Cengklik ",
        emoji: "💌",
        icon: MessageCircleHeart,
        color: "from-red-400 to-rose-600",
        dotColor: "bg-red-400",
    },
    {
        title: "Now",
        desc: "and yeahh, Masih bersama dan akan terus berlanjut, kita akan melangkah maju bersama, mungkin akan banyak halangan dan cobaan kedepannyamm, tapi aku berharap bisaa bertahan dan melewati itu semua bersama sama   ✨",
        emoji: "💕",
        icon: Infinity,
        color: "from-rose-500 to-pink-600",
        dotColor: "bg-rose-500",
    },
];

export default function Timeline() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
    const connectorLineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── Heading reveal ──
            if (headingRef.current) {
                gsap.fromTo(
                    headingRef.current.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            // ── Main vertical line draws in ──
            if (lineRef.current) {
                gsap.fromTo(
                    lineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        duration: 1.5,
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: lineRef.current,
                            start: "top 80%",
                            end: "bottom 20%",
                            scrub: 1,
                        },
                    }
                );
            }

            // ── Timeline dots pop in ──
            dotsRef.current.filter(Boolean).forEach((dot, i) => {
                gsap.fromTo(
                    dot!,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1, opacity: 1,
                        duration: 0.6,
                        ease: "back.out(2)",
                        scrollTrigger: {
                            trigger: dot!,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                        delay: i * 0.05,
                    }
                );
            });

            // ── Cards slide & fade in ──
            cardsRef.current.filter(Boolean).forEach((card, i) => {
                const isLeft = i % 2 === 0;
                gsap.fromTo(
                    card!,
                    {
                        x: isLeft ? -80 : 80,
                        opacity: 0,
                        rotateY: isLeft ? 8 : -8,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        rotateY: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card!,
                            start: "top 82%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // ── Horizontal connector lines draw in ──
            connectorLineRefs.current.filter(Boolean).forEach((line) => {
                gsap.fromTo(
                    line!,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 0.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: line!,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-32 px-4 overflow-hidden"
            style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fff5f7 30%, #ffe4e8 70%, #ffffff 100%)",
            }}
        >
            {/* Ambient floating shapes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-rose-200/20 blur-3xl" />
                <div className="absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-pink-300/15 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-100/20 blur-3xl" />
            </div>

            {/* ── Header ── */}
            <div ref={headingRef} className="text-center mb-20 md:mb-28 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-200/50 text-rose-500 mb-6 shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="tracking-widest uppercase text-[11px] font-bold font-sans">Our Story</span>
                    <Sparkles size={14} className="animate-pulse" />
                </div>

                <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-700 to-pink-600 font-serif drop-shadow-sm">
                    Our Journey
                </h2>

                <p className="mt-4 text-rose-800/40 text-base md:text-lg max-w-md mx-auto font-sans">
                    Setiap langkah bersama kamu, selalu terasa istimewa.
                </p>
            </div>

            {/* ── Timeline ── */}
            <div className="relative max-w-4xl mx-auto z-10">
                {/* Vertical line (draws on scroll) */}
                <div
                    ref={lineRef}
                    className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-[3px] h-full origin-top"
                    style={{
                        background: "linear-gradient(180deg, #fda4af, #e11d48, #be123c, #fda4af)",
                    }}
                />

                {milestones.map((item, index) => {
                    const isLeft = index % 2 === 0;
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className={`relative flex items-center mb-16 md:mb-20 w-full ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                                } flex-row`}
                        >
                            {/* ── Dot on timeline ── */}
                            <div
                                ref={(el) => { dotsRef.current[index] = el; }}
                                className={`
                                    absolute left-6 md:left-1/2 -translate-x-1/2 z-20
                                    w-12 h-12 md:w-14 md:h-14 rounded-full
                                    bg-white shadow-lg shadow-rose-200/50
                                    border-[3px] border-rose-300
                                    flex items-center justify-center
                                `}
                            >
                                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-inner`}>
                                    <Icon size={16} className="text-white drop-shadow" strokeWidth={2.5} />
                                </div>
                                {/* Pulse ring */}
                                <div className={`absolute inset-0 rounded-full ${item.dotColor} opacity-20 animate-ping`} />
                            </div>

                            {/* ── Horizontal connector ── */}
                            <div
                                ref={(el) => { connectorLineRefs.current[index] = el; }}
                                className={`
                                    hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-[calc(50%-56px)]
                                    ${isLeft ? "left-[calc(50%+28px)] origin-left" : "right-[calc(50%+28px)] origin-right"}
                                `}
                                style={{ background: "linear-gradient(90deg, #fda4af, #fecdd3)" }}
                            />

                            {/* ── Spacer for the other side ── */}
                            <div className="hidden md:block w-1/2" />

                            {/* ── Card ── */}
                            <div
                                ref={(el) => { cardsRef.current[index] = el; }}
                                className={`
                                    ml-16 md:ml-0 md:w-[calc(50%-56px)]
                                    ${isLeft ? "md:mr-auto" : "md:ml-auto"}
                                `}
                                style={{ perspective: "600px" }}
                            >
                                <div
                                    className={`
                                        relative p-6 md:p-8 rounded-2xl md:rounded-3xl
                                        bg-white/80 backdrop-blur-sm
                                        border border-rose-100/80
                                        shadow-[0_4px_24px_rgba(244,63,94,0.08),0_1px_4px_rgba(0,0,0,0.04)]
                                        hover:shadow-[0_12px_40px_rgba(244,63,94,0.15),0_4px_12px_rgba(0,0,0,0.06)]
                                        transition-all duration-500 group
                                        hover:-translate-y-1
                                        ${isLeft ? "md:text-right" : "md:text-left"} text-left
                                    `}
                                >
                                    {/* Emoji badge */}
                                    <span className={`
                                        inline-flex items-center justify-center w-10 h-10 rounded-xl
                                        bg-gradient-to-br ${item.color} shadow-md
                                        text-lg mb-4
                                        group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300
                                    `}>
                                        {item.emoji}
                                    </span>

                                    <h3 className={`
                                        text-xl md:text-2xl font-bold font-serif mb-2
                                        text-transparent bg-clip-text bg-gradient-to-r ${item.color}
                                    `}>
                                        {item.title}
                                    </h3>

                                    <p className="text-rose-900/50 font-sans text-sm md:text-base leading-relaxed">
                                        {item.desc}
                                    </p>

                                    {/* Decorative corner accent */}
                                    <div className={`
                                        absolute ${isLeft ? "md:-right-3 -left-3 md:left-auto" : "-left-3"} top-6
                                        w-6 h-6 rounded-full
                                        bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-30
                                        blur-md transition-opacity duration-500
                                    `} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* End marker */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 bottom-0 z-20">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-300/40 ring-4 ring-white" />
                </div>
            </div>
        </section>
    );
}
