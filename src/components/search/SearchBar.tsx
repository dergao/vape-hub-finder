import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/mockData";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

export function SearchBar({ variant = "hero" }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.state.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (citySlug?: string) => {
    if (citySlug) {
      navigate(`/us/${citySlug}`);
    } else if (filteredCities.length > 0) {
      navigate(`/us/${filteredCities[0].slug}`);
    }
    setShowSuggestions(false);
    setQuery("");
  };

  if (variant === "hero") {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="flex gap-2 p-2 bg-card rounded-2xl border border-border shadow-lg">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter city or zip code..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full h-12 pl-12 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <Button variant="hero" size="lg" onClick={() => handleSearch()}>
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in">
            {filteredCities.length > 0 ? (
              <ul>
                {filteredCities.slice(0, 5).map(city => (
                  <li key={city.slug}>
                    <button
                      onClick={() => handleSearch(city.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <span className="font-medium">{city.name}</span>
                        <span className="text-muted-foreground">, {city.state}</span>
                      </div>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {city.storeCount} stores
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-muted-foreground">
                No cities found matching "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
