import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Quiz from "@/components/Quiz";
import ValentineQuestion from "@/components/ValentineQuestion";
import Reasons from "@/components/Reasons";
import Timeline from "@/components/Timeline";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <Hero />
            <Gallery />
            <Timeline />
            <Quiz />
            <Reasons />
            <ValentineQuestion />

            <footer className="py-8 text-center text-primary/60 text-sm">
                <p>Made with ❤️ for you</p>
            </footer>
        </main>
    );
}
