"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Heart, Trophy, RotateCcw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const questions = [
    {
        question: "Apa makanan favorit kita pas lagi ngedate?",
        options: ["Seblak", "Mie Ayam", "Martabak", "Ice Cream"],
        correct: 1,
        emoji: "🍜",
        success: "Yass! You know me so well! 🍜",
        error: "Salah huu, masa gatau sih? 😤",
    },
    {
        question: "Apa yang paling penting dari hubungan?",
        options: ["Kepercayaan", "Uang", "Trust & Communication", "Social Media"],
        correct: 2,
        emoji: "💬",
        success: "Bener banget! Komunikasi dan trust itu segalanya! 💕",
        error: "Hmm.. bukan itu sayang, coba lagi yaa 🥺",
    },
    {
        question: "Hal apa yang paling aku suka dari kamu?",
        options: ["Your Eyes", "Your Kindness", "Everything", "Your Cooking"],
        correct: 2,
        emoji: "💖",
        success: "Aww! You are my everything! ❤️",
        error: "Bener sih, tapi ada yang lebih tepat! 😘",
    },
];

const optionLabels = ["A", "B", "C", "D"];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [quizDone, setQuizDone] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const progressRef = useRef<HTMLDivElement>(null);

    // ── GSAP heading entrance ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headingRef.current) {
                gsap.fromTo(
                    headingRef.current.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            if (cardRef.current) {
                gsap.fromTo(
                    cardRef.current,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // ── Animate card transition on question change ──
    const animateCardIn = useCallback(() => {
        if (!cardRef.current) return;
        gsap.fromTo(
            cardRef.current,
            { x: 60, opacity: 0, rotateY: 5 },
            { x: 0, opacity: 1, rotateY: 0, duration: 0.6, ease: "power3.out" }
        );

        // Stagger option buttons
        const validOptions = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
        gsap.fromTo(
            validOptions,
            { y: 30, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)", delay: 0.2 }
        );
    }, []);

    // Animate options on mount / question change
    useEffect(() => {
        if (!quizDone) {
            const timer = setTimeout(animateCardIn, 50);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion, quizDone, animateCardIn]);

    // ── Progress bar animation ──
    useEffect(() => {
        if (progressRef.current) {
            gsap.to(progressRef.current, {
                width: `${((currentQuestion + (answered !== null ? 1 : 0)) / questions.length) * 100}%`,
                duration: 0.6,
                ease: "power2.out",
            });
        }
    }, [currentQuestion, answered]);

    const handleAnswer = (index: number) => {
        if (answered !== null) return; // prevent double click
        setAnswered(index);
        const correct = index === questions[currentQuestion].correct;
        setIsCorrect(correct);

        // Animate selected button
        const btn = optionRefs.current[index];
        if (btn) {
            gsap.to(btn, {
                scale: correct ? 1.05 : 0.95,
                duration: 0.3,
                ease: correct ? "back.out(2)" : "power2.out",
            });
        }

        // Shake wrong answers
        if (!correct && btn) {
            const tl = gsap.timeline();
            tl.to(btn, { x: -8, duration: 0.08 })
                .to(btn, { x: 8, duration: 0.08 })
                .to(btn, { x: -6, duration: 0.08 })
                .to(btn, { x: 6, duration: 0.08 })
                .to(btn, { x: 0, duration: 0.08 });
        }

        if (correct) {
            setScore(score + 1);
            // Mini confetti burst
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ["#f43f5e", "#fb7185", "#fda4af"],
            });
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                // Slide out
                if (cardRef.current) {
                    gsap.to(cardRef.current, {
                        x: -60, opacity: 0, rotateY: -5, duration: 0.3, ease: "power2.in",
                        onComplete: () => {
                            setCurrentQuestion(currentQuestion + 1);
                            setAnswered(null);
                            setIsCorrect(null);
                        },
                    });
                }
            } else {
                setQuizDone(true);
                // Big confetti
                confetti({
                    particleCount: 120,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ["#f43f5e", "#fb7185", "#fda4af", "#fff1f2"],
                });
            }
        }, correct ? 1200 : 1800);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setAnswered(null);
        setIsCorrect(null);
        setQuizDone(false);
    };

    const q = questions[currentQuestion];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen py-24 md:py-32 px-4 flex flex-col justify-center items-center overflow-hidden"
            style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fff1f2 20%, #ffe4e6 50%, #fff1f2 80%, #ffffff 100%)",
            }}
        >
            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-rose-200/25 blur-3xl" />
                <div className="absolute bottom-20 left-[10%] w-64 h-64 rounded-full bg-pink-300/20 blur-3xl" />
            </div>

            {/* ── Header ── */}
            <div ref={headingRef} className="text-center mb-10 md:mb-14 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-200/50 text-rose-500 mb-6 shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="tracking-widest uppercase text-[11px] font-bold font-sans">Love Game</span>
                    <Sparkles size={14} className="animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-700 to-pink-600 font-serif">
                    How Well Do You Know Me?
                </h2>
                <p className="mt-4 text-rose-800/40 text-base md:text-lg font-sans max-w-lg mx-auto">
                    Jawab quiz ini dan buktikan kamu emang yang paling ngerti akuu 💕
                </p>
            </div>

            {/* ── Progress Bar ── */}
            <div className="w-full max-w-2xl mb-8 relative z-10">
                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-rose-400 font-sans tracking-wide">
                        {quizDone ? "Completed!" : `Question ${currentQuestion + 1} of ${questions.length}`}
                    </span>
                    <span className="text-xs font-bold text-rose-400 font-sans flex items-center gap-1">
                        <Heart size={12} className="fill-rose-400 text-rose-400" />
                        {score} / {questions.length}
                    </span>
                </div>
                <div className="h-2 rounded-full bg-rose-100 overflow-hidden shadow-inner">
                    <div
                        ref={progressRef}
                        className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 shadow-sm"
                        style={{ width: "0%" }}
                    />
                </div>
            </div>

            {/* ── Quiz Card ── */}
            <div className="w-full max-w-2xl relative z-10" style={{ perspective: "800px" }}>
                {!quizDone ? (
                    <div
                        ref={cardRef}
                        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(244,63,94,0.1),0_2px_8px_rgba(0,0,0,0.04)] border border-rose-100/60 p-8 md:p-10 text-center"
                    >
                        {/* Question emoji */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-3xl shadow-sm">
                            {q.emoji}
                        </div>

                        {/* Question text */}
                        <h3 className="text-xl md:text-2xl font-bold text-rose-950 font-serif mb-8 leading-relaxed">
                            {q.question}
                        </h3>

                        {/* Options grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {q.options.map((option, index) => {
                                let btnStyle = "bg-white hover:bg-rose-50 border-rose-200/60 text-rose-900 hover:border-rose-300 hover:shadow-md";

                                if (answered !== null) {
                                    if (index === q.correct) {
                                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-emerald-100 shadow-md ring-2 ring-emerald-200";
                                    } else if (index === answered && !isCorrect) {
                                        btnStyle = "bg-red-50 border-red-300 text-red-500 shadow-red-100";
                                    } else {
                                        btnStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        ref={(el) => { optionRefs.current[index] = el; }}
                                        onClick={() => handleAnswer(index)}
                                        disabled={answered !== null}
                                        className={`
                                            relative p-4 md:p-5 rounded-2xl border-2
                                            font-semibold text-base md:text-lg font-sans
                                            transition-all duration-300
                                            flex items-center gap-3 text-left
                                            disabled:cursor-default
                                            ${btnStyle}
                                        `}
                                    >
                                        <span className={`
                                            w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold
                                            ${answered !== null && index === q.correct
                                                ? "bg-emerald-400 text-white"
                                                : answered !== null && index === answered && !isCorrect
                                                    ? "bg-red-400 text-white"
                                                    : "bg-rose-100 text-rose-500"
                                            }
                                        `}>
                                            {answered !== null && index === q.correct
                                                ? "✓"
                                                : answered !== null && index === answered && !isCorrect
                                                    ? "✗"
                                                    : optionLabels[index]
                                            }
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feedback text */}
                        {answered !== null && (
                            <div className={`mt-6 p-4 rounded-xl text-sm font-medium font-sans ${isCorrect
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-600 border border-rose-200"
                                }`}>
                                {isCorrect ? q.success : q.error}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── Completion Card ── */
                    <div
                        ref={cardRef}
                        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(244,63,94,0.1)] border border-rose-100/60 p-10 md:p-14 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200/50">
                            <Trophy size={36} className="text-white" />
                        </div>

                        <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-pink-600 font-serif mb-3">
                            Quiz Selesai! 🎉
                        </h3>

                        <p className="text-rose-800/50 text-lg font-sans mb-2">
                            Skor kamu:
                        </p>

                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif my-4">
                            {score} / {questions.length}
                        </div>

                        <p className="text-rose-600 text-lg font-sans mb-8 font-medium">
                            {score === questions.length
                                ? "PERFECT! Kamu emang yang paling ngerti aku! 🥹❤️"
                                : score >= 2
                                    ? "Hampir sempurna! Kamu emang pacar yang perhatian 💕"
                                    : "Yaudah gapapa, yang penting kamu sayang aku kan? 😘"
                            }
                        </p>

                        <button
                            onClick={resetQuiz}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold font-sans shadow-lg shadow-rose-300/40 hover:shadow-xl hover:shadow-rose-300/50 hover:scale-105 transition-all duration-300"
                        >
                            <RotateCcw size={18} />
                            Main Lagi
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
