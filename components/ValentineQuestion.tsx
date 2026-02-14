"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";

export default function ValentineQuestion() {
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Function to move the "No" button randomly
    const moveNoButton = () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoBtnPosition({ x, y });
    };

    const handleYesClick = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
        });

        Swal.fire({
            title: "YAY! ❤️",
            text: "Aku tau kamu bakal bilang YES! I love you so much sayang!",
            icon: "success",
            confirmButtonColor: "#ff4d6d",
            confirmButtonText: "Love you too! 😘",
            backdrop: `
        rgba(0,0,123,0.4)
        url("/nyan-cat.gif")
        left top
        no-repeat
      `,
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 py-20 px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center bg-white p-10 rounded-3xl shadow-2xl max-w-2xl border-4 border-primary/20"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8 font-serif leading-tight">
                    Will you be my Valentine?
                </h2>
                <p className="text-xl text-gray-600 mb-12">
                    Please say yes yaa, jangan bikin aku nangis... 🥺
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative h-32">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleYesClick}
                        className="px-10 py-4 bg-green-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-green-600 transition-colors z-10"
                    >
                        YES! 😍
                    </motion.button>

                    <motion.button
                        animate={noBtnPosition}
                        onHoverStart={moveNoButton}
                        onClick={moveNoButton}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="px-10 py-4 bg-red-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        onMouseEnter={() => setIsHovered(true)}
                    >
                        No 😢
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
