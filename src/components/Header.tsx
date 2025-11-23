import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  scrollY: number;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Header({ scrollY, onLoginClick, onSignupClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const isScrolled = scrollY > 20;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer">
            <Logo variant="dark" iconSize={32} showWordmark={true} />
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredMenu('product')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors">
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredMenu('solutions')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors">
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#resources" className="text-gray-700 hover:text-gray-900 transition-colors">
              Resources
            </a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onLoginClick} className="text-gray-700 hover:text-gray-900 transition-colors px-4 py-2">
              Login
            </button>
            <button onClick={onSignupClick} className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 group">
              <span>Try for Free</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#product" className="text-gray-700 hover:text-gray-900">Product</a>
              <a href="#solutions" className="text-gray-700 hover:text-gray-900">Solutions</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
              <a href="#resources" className="text-gray-700 hover:text-gray-900">Resources</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
              <button onClick={onLoginClick} className="text-gray-700 hover:text-gray-900">Login</button>
              <button onClick={onSignupClick} className="bg-gray-900 text-white px-6 py-2.5 rounded-full w-full">
                Try for Free →
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
