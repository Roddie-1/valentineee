"use client";

import { useRef, useEffect } from "react";
import { Sparkles, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
    { text: "kamuu orangnya lucuu dann ceriaa", emoji: "😊", color: "from-pink-400 to-rose-500" },
    { text: "kamuu meliki hatii nurani yang baik,murah hati,rendah hati", emoji: "❤️", color: "from-rose-400 to-red-500" },
    { text: "Kamuu dapat membuatku termotivasi dan berkemang lebih baik", emoji: "🌟", color: "from-amber-400 to-orange-500" },
    { text: "Kita punya selera humor yang sama & beberapa selera sama lainnya", emoji: "😂", color: "from-violet-400 to-purple-500" },
    { text: "kamuu memilki paras cantik dan anggun yang melelehkan dirikuu", emoji: "💕", color: "from-pink-500 to-rose-600" },
    { text: "kamuu bisaa mengaturr waktu dengan baikk akuu jadii salutt", emoji: "⏳", color: "from-cyan-400 to-teal-500" },
    { text: "Kamu bikin aku jadi orang yang lebih baik,lebih majuuu, karenaa kamu jugaa sosok yang luar biasaa", emoji: "✨", color: "from-yellow-400 to-amber-500" },
    { text: "suaramuu indahh, nyanyian muu merduu, andai ada lagu yang kamu buat khusus untuk dirikuu", emoji: "🎵", color: "from-fuchsia-400 to-pink-500" },
];

export default function Reasons() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const heartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading
            if (headingRef.current) {
                gsap.fromTo(
                    headingRef.current.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                        scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
                    }
                );
            }

            // Center heart pulse
            if (heartRef.current) {
                gsap.fromTo(
                    heartRef.current,
                    { scale: 0, opacity: 0, rotation: -20 },
                    {
                        scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.4)",
                        scrollTrigger: { trigger: heartRef.current, start: "top 80%", toggleActions: "play none none none" },
                    }
                );
                // Continuous heartbeat
                gsap.to(heartRef.current, {
                    scale: 1.1,
                    duration: 0.6,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut",
                    delay: 1.5,
                });
            }

            // Cards stagger
            const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
            validCards.forEach((card, i) => {
                const isLeft = i % 2 === 0;
                gsap.fromTo(
                    card,
                    { x: isLeft ? -60 : 60, opacity: 0, scale: 0.9, rotateY: isLeft ? 10 : -10 },
                    {
                        x: 0, opacity: 1, scale: 1, rotateY: 0,
                        duration: 0.8, ease: "power3.out",
                        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
                        delay: i * 0.06,
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
                background: "linear-gradient(180deg, #ffffff 0%, #fff1f2 25%, #ffe4e6 50%, #fff1f2 75%, #ffffff 100%)",
            }}
        >
            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-16 left-[8%] w-72 h-72 rounded-full bg-rose-200/20 blur-3xl" />
                <div className="absolute bottom-20 right-[12%] w-80 h-80 rounded-full bg-pink-300/15 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-100/25 blur-3xl" />
            </div>

            {/* ── Header ── */}
            <div ref={headingRef} className="text-center mb-16 md:mb-20 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-200/50 text-rose-500 mb-6 shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="tracking-widest uppercase text-[11px] font-bold font-sans">From My Heart</span>
                    <Sparkles size={14} className="animate-pulse" />
                </div>

                <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-700 to-pink-600 font-serif drop-shadow-sm">
                    Reasons I Love You
                </h2>

                <p className="mt-4 text-rose-800/40 text-base md:text-lg max-w-lg mx-auto font-sans">
                    Ada sejuta alasan, tapi ini beberapa yang paling spesial 💕
                </p>
            </div>

            {/* ── Center Heart ── */}
            <div className="relative z-10 flex justify-center mb-12">
                <div
                    ref={heartRef}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-300/40"
                >
                    <Heart size={28} className="text-white fill-white" />
                </div>
            </div>

            {/* ── Reason Cards ── */}
            <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {reasons.map((reason, index) => (
                    <div
                        key={index}
                        ref={(el) => { cardsRef.current[index] = el; }}
                        style={{ perspective: "600px" }}
                    >
                        <div
                            className="
                                relative p-5 md:p-6 rounded-2xl md:rounded-3xl
                                bg-white/80 backdrop-blur-sm border border-rose-100/60
                                shadow-[0_4px_20px_rgba(244,63,94,0.06),0_1px_3px_rgba(0,0,0,0.03)]
                                hover:shadow-[0_12px_40px_rgba(244,63,94,0.12),0_4px_12px_rgba(0,0,0,0.05)]
                                hover:-translate-y-1
                                transition-all duration-500 group cursor-default
                                flex items-center gap-4
                            "
                        >
                            {/* Emoji badge */}
                            <div className={`
                                flex-shrink-0 w-12 h-12 rounded-xl
                                bg-gradient-to-br ${reason.color}
                                flex items-center justify-center text-2xl
                                shadow-md group-hover:shadow-lg
                                group-hover:scale-110 group-hover:rotate-6
                                transition-all duration-300
                            `}>
                                {reason.emoji}
                            </div>

                            {/* Text */}
                            <p className="text-rose-900/70 font-semibold text-base md:text-lg font-sans leading-snug group-hover:text-rose-800 transition-colors duration-300">
                                {reason.text}
                            </p>

                            {/* Decorative line */}
                            <div className={`
                                absolute bottom-0 left-6 right-6 h-[2px] rounded-full
                                bg-gradient-to-r ${reason.color} opacity-0
                                group-hover:opacity-30 transition-opacity duration-500
                            `} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Bottom love message ── */}
            <div className="relative z-10 text-center mt-14 md:mt-20">
                <p className="text-rose-400 text-lg md:text-xl font-script font-bold">
                    ...dan masih banyak lagi alasan yang gak bisa aku sebutin satu-satu 🥹
                </p>
            </div>
        </section>
    );
}
