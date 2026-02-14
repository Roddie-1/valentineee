"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Camera, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const memories = [
    { id: 1, src: "/assets/10.jpg", title: "Our First Moment", date: "The Beginning" },
    { id: 2, src: "/assets/02.jpg", title: "hunting accsesories", date: "alamak tak nemu laa aksesoris disini" },
    { id: 3, src: "/assets/03.jpg", title: "night graduationt", date: "menggemparkan viska" },
    { id: 4, src: "/assets/04.jpg", title: "Organization us", date: "Foto yb osis" },
    { id: 5, src: "/assets/05.jpg", title: "hunting sarapan", date: "edisi kare ayam pagi rekomendasi mama atha" },
    { id: 6, src: "/assets/06.jpg", title: "Forever & Always", date: "Everyday Love" },
    { id: 7, src: "/assets/07.jpg", title: "night viska", date: "ampunn maamaaa" },
    { id: 8, src: "/assets/08.jpg", title: "kekuclukan", date: "ntah apa lah iniii" },
    { id: 9, src: "/assets/09.jpg", title: "hunting mie ayam", date: "fikss kita harus kesini lagii" },
    { id: 10, src: "/assets/01.JPG", title: "classmeet viska", date: "school date di labas" },
];

// Pinterest masonry heights
const heightClasses = [
    "h-[380px]", "h-[260px]", "h-[320px]", "h-[420px]", "h-[290px]",
    "h-[350px]", "h-[270px]", "h-[400px]", "h-[310px]", "h-[360px]",
];

const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

const lightboxImageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.15 } },
};

export default function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goNext = useCallback(() => {
        if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % memories.length);
    }, [selectedIndex]);

    const goPrev = useCallback(() => {
        if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + memories.length) % memories.length);
    }, [selectedIndex]);

    // Keyboard nav
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, goNext, goPrev]);

    // Lock scroll when lightbox open
    useEffect(() => {
        document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [selectedIndex]);

    // ── GSAP Animations ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            if (headingRef.current) {
                const headingElements = headingRef.current.children;
                gsap.fromTo(
                    headingElements,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        y: 0, opacity: 1, scale: 1,
                        duration: 1, stagger: 0.15, ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            // Cards stagger animation
            const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
            validCards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    {
                        y: 80,
                        opacity: 0,
                        rotateX: 8,
                        scale: 0.92,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        scale: 1,
                        duration: 0.9,
                        delay: i * 0.06,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Magnetic tilt effect on cards
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
            rotateX, rotateY,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = (index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;
        gsap.to(card, {
            rotateX: 0, rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="relative min-h-screen py-24 md:py-32 px-4 md:px-10 bg-white rounded-t-[80px] -mt-[20vh] z-30 overflow-hidden"
            style={{
                boxShadow: "0 -40px 80px rgba(190, 18, 60, 0.08), 0 -10px 30px rgba(0,0,0,0.06)",
            }}
        >
            {/* ── Animated gradient background ── */}
            <div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(251,113,133,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(244,63,94,0.08), transparent)",
                }}
            />
            {/* Subtle dot pattern */}
            <div
                className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(#be123c 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* ── Header ── */}
                <div ref={headingRef} className="text-center mb-16 md:mb-24 relative">
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 text-rose-600 text-sm font-medium mb-6 shadow-sm backdrop-blur-sm">
                        <Sparkles size={14} className="animate-pulse text-rose-400" />
                        <span className="tracking-widest uppercase text-[11px] font-bold font-sans">Captured Memories</span>
                        <Sparkles size={14} className="animate-pulse text-rose-400" />
                    </div>

                    <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-950 via-rose-800 to-rose-600 font-serif relative inline-block">
                        Our Special Moments
                        <Camera className="absolute -top-8 -right-10 md:-top-12 md:-right-14 text-rose-300/60 rotate-12 drop-shadow-lg hidden md:block" size={60} strokeWidth={1.5} />
                    </h2>

                    <p className="mt-6 text-rose-900/50 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed font-sans">
                        Every picture freezes a moment, but our memories keep them warm forever.
                    </p>
                </div>

                {/* ── Pinterest Masonry Grid ── */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5 [column-fill:_balance]">
                    {memories.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                            className="break-inside-avoid mb-4 md:mb-5 will-change-transform"
                            style={{ perspective: "800px" }}
                        >
                            <div
                                onClick={() => openLightbox(index)}
                                className={`
                                    relative ${heightClasses[index]} w-full rounded-2xl md:rounded-[1.4rem] overflow-hidden
                                    cursor-pointer group
                                    bg-gradient-to-br from-rose-100 to-pink-50
                                    shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
                                    hover:shadow-[0_20px_60px_rgba(190,18,60,0.18),0_8px_24px_rgba(0,0,0,0.08)]
                                    transition-shadow duration-500
                                    ring-1 ring-black/[0.04]
                                `}
                            >
                                {/* Photo */}
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-[0.85]"
                                />

                                {/* Top gradient for depth */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Bottom gradient with info */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                {/* Zoom icon */}
                                <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400">
                                    <ZoomIn size={18} className="text-white drop-shadow" />
                                </div>

                                {/* Title & Date */}
                                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                    <span className="text-rose-200/90 text-xs font-bold font-script tracking-wide block mb-1.5">{item.date}</span>
                                    <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-lg font-serif leading-snug">{item.title}</h3>
                                </div>

                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Lightbox ── */}
            <AnimatePresence mode="wait">
                {selectedIndex !== null && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeLightbox}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
                        style={{ background: "rgba(10,0,5,0.92)", backdropFilter: "blur(20px)" }}
                    >
                        {/* Close */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-[120] w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        >
                            <X size={22} />
                        </button>

                        {/* Prev */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-2 md:left-6 z-[120] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        >
                            <ChevronLeft size={26} />
                        </button>

                        {/* Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-2 md:right-6 z-[120] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        >
                            <ChevronRight size={26} />
                        </button>

                        {/* Image + Info */}
                        <motion.div
                            key={selectedIndex}
                            variants={lightboxImageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[88vh] w-full flex flex-col items-center"
                        >
                            <div className="relative w-full h-[65vh] md:h-[72vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                                <Image
                                    src={memories[selectedIndex].src}
                                    alt={memories[selectedIndex].title}
                                    fill
                                    sizes="90vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Caption */}
                            <div className="mt-5 md:mt-6 text-center px-4">
                                <h3 className="text-white text-xl md:text-2xl font-bold font-serif drop-shadow-lg mb-1">
                                    {memories[selectedIndex].title}
                                </h3>
                                <span className="text-rose-300/80 text-sm font-script block mb-2">{memories[selectedIndex].date}</span>
                                <div className="flex items-center justify-center gap-1.5 mt-2">
                                    {memories.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                                            className={`rounded-full transition-all duration-300 ${i === selectedIndex
                                                ? "w-6 h-2 bg-rose-400"
                                                : "w-2 h-2 bg-white/30 hover:bg-white/60"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
