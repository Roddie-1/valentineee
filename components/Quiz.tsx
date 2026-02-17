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
        question: "Dimana pertama kali kita ketemu?",
        options: ["Di Sekolah", "Di Mall", "Lewat Online", "Di OSIS"],
        correct: 3,
        emoji: "👋",
        success: "Bener! Di OSIS, awal mula segalanya 🥹",
        error: "Masa lupa sih sayangku? 😤",
    },
    {
        question: "Apa makanan favorit kita pas lagi ngedate?",
        options: ["Seblak", "Mie Ayam", "Martabak", "Ice Cream"],
        correct: 1,
        emoji: "🍜",
        success: "Yass! Mie Ayam emang the best! 🍜",
        error: "Waduh salah, masa gatau sih? 😤",
    },
    {
        question: "Lagu apa yang jadi lagu 'kita banget'?",
        options: ["Alexandra - Reality Club", "Perfect - Ed Sheeran", "Aku Milikmu - Dewa 19", "Bersamamu - Jazz"],
        correct: 0,
        emoji: "🎵",
        success: "Alexandra - Reality Club, lagu kita banget karena pertama kali kita ekspos di IG! 🎶💕",
        error: "Bukan itu sayangku, dengerin lagi deh 😘",
    },
    {
        question: "Apa panggilan sayang kita satu sama lain?",
        options: ["bubub", "Sayang", "Cinta", "Yang"],
        correct: 1,
        emoji: "🥰",
        success: "Iya dong, Sayang! Panggilan paling manis,simple,tulus,dan romantis 💗",
        error: "Hmm bukan itu deh, coba lagi yaa 🥺",
    },
    {
        question: "Kita keluar bareng pertama kemana?",
        options: ["Nonton Bioskop", "Ngegym Bareng", "Makan di Resto", "Jalan di Taman"],
        correct: 1,
        emoji: "�",
        success: "Yes! Ngegym bareng, unik banget firstly kita! 😂❤️",
        error: "Waduh lupa ya? Itu momen berharga loh 🥺",
    },
    {
        question: "Apa kebiasaan kita yang paling sering dilakuin bareng?",
        options: ["chatingan Malam", "Masak Bareng", "Olahraga", "Nonton Film"],
        correct: 0,
        emoji: "📱",
        success: "Bener! chatingan malam itu udah ritual kita! 🌙",
        error: "Bukan itu sayang, yang tiap malam itu loh 😉",
    },
    {
        question: "Kalo kita lagi berantem, siapa yang biasanya minta maaf duluan?",
        options: ["Kamu", "Aku", "Dua-duanya", "Gapernah berantem"],
        correct: 2,
        emoji: "🤗",
        success: "Yes! Karena kita sama-sama nggak kuat marahan lama 🥹💕",
        error: "Hmm, yang bener itu kita berdua kok 😘",
    },
    {
        question: "Apa impian terbesar kita berdua?",
        options: ["Punya Rumah", "Keliling Dunia", "Hidup Sukses & Bahagia Bareng", "Jadi Dewasa"],
        correct: 2,
        emoji: "✨",
        success: "Yang penting kita sukses & bahagia bareng, itu udah sangat sangat cukup 🥹❤️",
        error: "Semua penting, tapi satu ini yang paling utama 💫",
    },
    {
        question: "Hal kecil apa yang bikin hubungan kita spesial?",
        options: ["Hadiah Mahal", "Selalu Ada Satu Sama Lain", "Liburan Mewah", "Foto Bareng"],
        correct: 1,
        emoji: "�",
        success: "Bener banget! Kehadiran kita satu sama lain itu segalanya 🤍",
        error: "Yang paling berharga itu bukan materi loh sayang 💕",
    },
    {
        question: "Dimana kira pertama kali untuk memutuskan saling berkomitmen dan saling menyayangi dan mencintai?",
        options: ["Di Chat", "Di Telepon", "Di Omah Prahu", "Di Sekolah"],
        correct: 2,
        emoji: "💝",
        success: "Omah Prahu waduk cengklik, tempat paling bersejarah buat kita, dimana semuanya bermula! 🥹❤️",
        error: "Masa lupa tempat se spesial itu sih sayang 😢�",
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
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
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
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        // Stagger option buttons
        const validOptions = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
        gsap.fromTo(
            validOptions,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out", delay: 0.15 }
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

    // Warm reminder messages for wrong answers
    const wrongReminders = [
        "Coba diingat lagi sayang, pasti kamu bisa! 🥰",
        "Hmm bukan itu deh, ayo coba lagi ya! 💕",
        "Nggak apa-apa, pikirin lagi pelan-pelan ya sayang 🌸",
        "Almost! Coba sekali lagi, aku percaya kamu pasti ingat 💖",
        "Hehe bukan itu, tapi gapapa, coba lagi yuk! 🥺",
    ];

    const handleAnswer = (index: number) => {
        if (answered !== null) return; // prevent double click
        setAnswered(index);
        const correct = index === questions[currentQuestion].correct;
        setIsCorrect(correct);

        const btn = optionRefs.current[index];

        if (correct) {
            // ✅ Correct: small inline feedback + advance
            if (btn) {
                gsap.to(btn, { scale: 1.02, duration: 0.2, ease: "power2.out" });
            }
            setScore(score + 1);

            // Auto advance after showing success text
            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setAnswered(null);
                    setIsCorrect(null);
                } else {
                    setQuizDone(true);
                    confetti({
                        particleCount: 100,
                        spread: 80,
                        origin: { y: 0.5 },
                        colors: ["#f43f5e", "#fb7185", "#fda4af", "#fff1f2"],
                    });
                }
            }, 2500);
        } else {
            // ❌ Wrong: gentle shake + warm reminder, then let them retry
            if (btn) {
                const tl = gsap.timeline();
                tl.to(btn, { x: -6, duration: 0.06 })
                    .to(btn, { x: 6, duration: 0.06 })
                    .to(btn, { x: -4, duration: 0.06 })
                    .to(btn, { x: 0, duration: 0.06 });
            }

            const randomReminder = wrongReminders[Math.floor(Math.random() * wrongReminders.length)];

            Swal.fire({
                title: "Hmm, bukan itu sayang.. 🥺",
                text: randomReminder,
                icon: "info",
                confirmButtonText: "Coba Lagi 💕",
                confirmButtonColor: "#f43f5e",
                background: "#fff1f2",
                color: "#881337",
                customClass: {
                    popup: "rounded-2xl",
                },
            }).then(() => {
                // Reset so they can try again
                setAnswered(null);
                setIsCorrect(null);
                // Reset button scale
                optionRefs.current.forEach((b) => {
                    if (b) gsap.set(b, { scale: 1, x: 0 });
                });
            });
        }
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
            <div className="w-full max-w-2xl relative z-10">
                {!quizDone ? (
                    <div
                        ref={cardRef}
                        className="bg-white/90 rounded-3xl shadow-lg border border-rose-100/60 p-8 md:p-10 text-center"
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
                                    if (isCorrect && index === q.correct) {
                                        // Only show green if CORRECT answer was chosen
                                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-md ring-2 ring-emerald-200";
                                    } else if (index === answered && !isCorrect) {
                                        // Show red on the wrong selected answer
                                        btnStyle = "bg-red-50 border-red-300 text-red-500";
                                    } else if (isCorrect) {
                                        // Dim other options only when correct
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
                                            ${isCorrect && answered !== null && index === q.correct
                                                ? "bg-emerald-400 text-white"
                                                : answered !== null && index === answered && !isCorrect
                                                    ? "bg-red-400 text-white"
                                                    : "bg-rose-100 text-rose-500"
                                            }
                                        `}>
                                            {isCorrect && answered !== null && index === q.correct
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

                        {/* Feedback text - only for correct answers */}
                        {answered !== null && isCorrect && (
                            <div className="mt-6 p-4 rounded-2xl text-base font-semibold font-sans bg-emerald-50 text-emerald-700 border border-emerald-200 text-center">
                                {q.success}
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
                                ? "PERFECT! Kamu emang yang paling ngerti hubungan kita! 🥹❤️"
                                : score >= 8
                                    ? "Hampir sempurna! Kamu emang pasangan yang luar biasa! 💕"
                                    : score >= 5
                                        ? "Lumayan! Tapi masih banyak yang harus diingat ya sayang �"
                                        : "Yaudah gapapa, yang penting kita tetap sayang kan? 🥺�"
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
