import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroCarousel } from './hero-carousel';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 px-4 sm:py-24 sm:px-6">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl text-center sm:text-left">
              Revolutionize the Way You Shop
            </h1>
            
            {/* Brand Tagline */}
            <h2 className="text-xl font-semibold text-blue-700 sm:text-2xl md:text-3xl text-center sm:text-left italic">
              See it. Style it. Wear it — Virtually.
            </h2>

            <p className="text-lg text-gray-600 md:text-base transition-all duration-500 ease-in-out opacity-90 hover:opacity-100 text-center sm:text-left">
              Experience clothes virtually before you buy. Our AI-powered technology lets you see exactly how garments will look on you, making online shopping more confident and enjoyable.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8 justify-center sm:justify-start">
              <Link to="/try-room">
                <Button
                  size="lg"
                  className="gap-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                >
                  Try Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-gray-300 text-gray-800 hover:bg-gray-100 shadow-md transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Carousel */}
          <div className="flex justify-center">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
