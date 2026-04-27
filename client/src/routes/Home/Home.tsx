import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

const Reveal = ({ children, className = "", delayMs = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};

type StoryItem = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

const storyItems: StoryItem[] = [
  {
    title: "How We Met",
    text: "A night of karaoke and laughs",
    image: "/whereis.jpg",
    imageAlt: "How we met",
  },
  {
    title: "Adventures Big & Small",
    text: "Traveling to Japan, camping out in the desert, to swimming in the ocean. Each a unforgettable moment",
    image: "/japan.jpg",
    imageAlt: "Our adventures",
  },
  {
    title: "The Proposal",
    text: "A day of excited family members and our closest friends to cherish this special moment as we continue our future together",
    image: "/proposal.jpg",
    imageAlt: "The proposal",
  },
];

const StoryImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  if (!src) {
    return (
      <div className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-100/60 flex items-center justify-center text-zinc-500 text-sm tracking-wide">
        Image placeholder
      </div>
    );
  }

  return <img src={src} alt={alt} className={`w-full aspect-4/3 object-cover rounded-2xl shadow-lg ${className}`} />;
};

const Home = () => {
  const [isPoop, setIsPoop] = useState(false);

  useEffect(() => {
    const num = Math.floor(Math.random() * 20000);
    if (num == 1) {
      const loadPoop = new Image();
      loadPoop.src = "./poop.jpg";
      loadPoop.onload = () => {
        setIsPoop(true);
        setTimeout(() => setIsPoop(false), 600);
      };
    }
  }, []);

  return (
    <div className="relative w-full bg-linear-to-b from-white via-rose-50/30 to-white text-zinc-800">
      <div id="main-img" className="w-full relative overflow-hidden">
        <img src={isPoop ? "./poop.jpg" : "./Home.jpg"} className="aspect-video object-cover w-full max-h-170 grayscale-25" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/15 to-black/55" />

        <Reveal className="absolute inset-0 flex items-end justify-center pb-12 px-4">
          <div className="text-center text-white max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-xs sm:text-sm">Our Story</p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-light leading-tight">A love we can't wait to celebrate</h1>
          </div>
        </Reveal>
      </div>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-12 sm:space-y-16">
        {storyItems.map((item, index) => (
          <Reveal key={item.title} delayMs={index * 120}>
            <article className={`grid md:grid-cols-2 gap-7 sm:gap-10 items-center ${index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="space-y-4">
                <p className="uppercase tracking-[0.22em] text-xs text-rose-500">Chapter {index + 1}</p>
                <h2 className="text-2xl sm:text-4xl font-light leading-snug">{item.title}</h2>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">{item.text}</p>
              </div>
              <StoryImage src={item.image} alt={item.imageAlt} />
            </article>
          </Reveal>
        ))}
      </section>

      <Reveal className="px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-zinc-900 text-white px-6 sm:px-10 py-10 sm:py-14 shadow-2xl text-center">
          <p className="uppercase tracking-[0.2em] text-xs sm:text-sm text-rose-200">Celebrate With Us</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light">We would love to celebrate with you</h2>
          <div id="footer" className="mt-7 flex flex-col gap-2 sm:text-xl">
            <h3 className="font-medium">August 8th, 2026</h3>
            <h3 className="font-medium">41303 Valley of the Falls Dr</h3>
            <h3 className="font-medium">Forest Falls, CA 92339</h3>
          </div>
        </div>
      </Reveal>

      <div className="h-6" />
    </div>
  );
};

export default Home;
