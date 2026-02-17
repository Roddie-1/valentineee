"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const photos = [
    { src: "/assets/us1.jpg", caption: "The beginning of something beautiful" },
    { src: "/assets/us2.jpg", caption: "Every moment with you is magic" },
    { src: "/assets/us3.jpg", caption: "Laughing together is my favorite hobby" },
    { src: "/assets/us4.jpg", caption: "Just you and me against the world" },
    { src: "/assets/us5.jpg", caption: "Creating memories that last forever" },
];

export default function ValentineUs() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context((self) => {
            const cards = self.selector?.(".polaroid-card");

            cards?.forEach((card: Element, index: number) => {
                gsap.fromTo(
                    card,
                    {
                        y: 100,
                        opacity: 0,
                        rotation: index % 2 === 0 ? -5 : 5
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotation: index % 2 === 0 ? -2 : 2, // Settle at a slight angle
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%", // Trigger when top of card is at 80% viewport height
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-32 bg-black overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-900/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6 backdrop-blur-sm">
                        <Camera size={14} />
                        <span>Captured Memories</span>
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white font-serif mb-4 drop-shadow-lg">
                        Our <span className="text-rose-500 italic">Moments</span>
                    </h2>
                    <p className="text-white/60 max-w-lg mx-auto font-light">
                        A glimpse into our story, frozen in time.
                    </p>
                </div>

                <div className="flex flex-col gap-24 md:gap-32 max-w-4xl mx-auto">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${index % 2 === 0 ? 'justify-start md:justify-start' : 'justify-end md:justify-end'} px-4 md:px-12`}
                        >
                            <div className="polaroid-card group relative transform transition-transform duration-500 hover:scale-105 hover:z-20 hover:rotate-0">
                                {/* Polaroid Frame */}
                                <div className="bg-white p-4 pb-16 shadow-2xl rotate-0 w-[280px] md:w-[350px] mx-auto">
                                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 filter sepia-[0.2] contrast-[1.1]">
                                        <Image
                                            src={photo.src}
                                            alt={`Us ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />

                                        {/* Vintage Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 text-center text-white/30 text-sm font-light italic">
                    And many more to come...
                </div>
            </div>
        </section>
    );
}
