import { GithubIcon, LinkedinIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">VirtualTryOn</span>
            </a>
            <p className="mt-2 text-sm text-gray-500">
              See it. Style it. Wear it — Virtually.
            </p>
            <p className="mt-4 text-xs text-gray-400 max-w-xs">
              Revolutionizing the way you shop with AI-powered virtual try-on experiences.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Product</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition">About</a>
              <a href="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
              <a href="/try-room" className="text-gray-600 hover:text-blue-600 transition">Try Room</a>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Company</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
            
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Follow Us</h3>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://www.linkedin.com/in/mirfan-ahmad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/mirfan-ahmad/Virtual-Try-On"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} VirtualTryOn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
