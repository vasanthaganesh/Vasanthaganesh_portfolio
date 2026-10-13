import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollRail from "@/components/ScrollRail";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Work from "@/components/Work";
import Journal from "@/components/Journal";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <ScrollRail />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Journal />
        <Contact />
      </main>
    </>
  );
}
