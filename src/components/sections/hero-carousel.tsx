import { useEffect, useState } from 'react';

const IMAGES = [
  'https://humanaigc.github.io/outfit-anyone/content/teaser/t1.gif',
  'https://humanaigc.github.io/outfit-anyone/content/teaser/t2.gif',
];

const TRANSITION_DELAY = 5000; // 5 seconds

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % IMAGES.length);
    }, TRANSITION_DELAY);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[150px] md:h-[350px] w-[100%] overflow-hidden rounded-xl shadow-xl bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-300">
      {IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Virtual Try-on Demo ${index + 1}`}
          className={`absolute inset-0 w-full h-[150px] md:h-[350px] object-cover rounded-xl transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
