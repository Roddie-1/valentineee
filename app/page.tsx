import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Quiz from "@/components/Quiz";
import ValentineQuestion from "@/components/ValentineQuestion";
import Reasons from "@/components/Reasons";
import Timeline from "@/components/Timeline";
import Closing from "@/components/Closing";
import ValentineUs from "@/components/ValentineUs";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <Hero />
            <Gallery />
            <Timeline />
            <Quiz />
            <Reasons />
            <ValentineQuestion />
            <ValentineUs />
            <Closing />



        </main>
    );
}
