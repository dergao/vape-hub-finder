import { Link, useLocation } from "react-router-dom";
import { Search, MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Vape<span className="gradient-text">Finder</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/us" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith("/us") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Browse Cities
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link 
            to="/for-business" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            For Business
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="hero" size="sm" className="hidden md:flex" asChild>
            <Link to="/add-store">Add Your Store</Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-slide-up">
          <nav className="flex flex-col gap-3">
            <Link 
              to="/us" 
              className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Cities
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/for-business" 
              className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
            </Link>
            <Button variant="hero" size="sm" className="mt-2" asChild>
              <Link to="/add-store" onClick={() => setMobileMenuOpen(false)}>Add Your Store</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
