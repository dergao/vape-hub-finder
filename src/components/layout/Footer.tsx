import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Vape<span className="gradient-text">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The most comprehensive vape shop directory in the United States. Find stores near you with real-time inventory and reviews.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Popular Cities</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/us/los-angeles" className="hover:text-primary transition-colors">Los Angeles</Link></li>
              <li><Link to="/us/new-york" className="hover:text-primary transition-colors">New York</Link></li>
              <li><Link to="/us/miami" className="hover:text-primary transition-colors">Miami</Link></li>
              <li><Link to="/us/chicago" className="hover:text-primary transition-colors">Chicago</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/for-business" className="hover:text-primary transition-colors">For Business</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Age Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VapeFinder. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Must be 21+ to use this site. Products contain nicotine.
          </p>
        </div>
      </div>
    </footer>
  );
}
