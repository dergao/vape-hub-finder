import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { List, Map, Clock, X, Navigation } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreCard } from "@/components/store/StoreCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCityBySlug, getStoresByCity, brands } from "@/data/mockData";
import { useGeolocation } from "@/hooks/use-geolocation";
import { calculateDistance, formatDistance } from "@/lib/distance";

const CityPage = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = getCityBySlug(citySlug || "");
  const allStores = getStoresByCity(citySlug || "");

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const hasLocation = latitude !== null && longitude !== null;

  // Randomly select one sponsored store to feature (consistent per page load)
  const [randomSponsorIndex] = useState(() => Math.random());
  
  // Calculate distances for each store
  const storesWithDistance = useMemo(() => {
    return allStores.map(store => {
      const distance = hasLocation
        ? calculateDistance(latitude!, longitude!, store.coordinates.lat, store.coordinates.lng)
        : null;
      return { store, distance };
    });
  }, [allStores, hasLocation, latitude, longitude]);

  const filteredStores = useMemo(() => {
    let result = [...storesWithDistance];
    
    if (openNowOnly) {
      result = result.filter(item => item.store.isOpen);
    }
    
    if (selectedBrands.length > 0) {
      result = result.filter(item => 
        selectedBrands.some(brandName => item.store.brands.some(b => b.name === brandName))
      );
    }

    // Separate sponsored and non-sponsored stores
    const sponsoredStores = result.filter(s => s.store.isSponsored);
    const nonSponsoredStores = result.filter(s => !s.store.isSponsored);
    
    // Sort non-sponsored: by distance if available, otherwise open stores first then by rating
    if (hasLocation) {
      nonSponsoredStores.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
      nonSponsoredStores.sort((a, b) => {
        if (a.store.isOpen !== b.store.isOpen) return a.store.isOpen ? -1 : 1;
        return b.store.rating - a.store.rating;
      });
    }

    // Randomly select ONE sponsored store if multiple exist
    if (sponsoredStores.length > 1) {
      const selectedIndex = Math.floor(randomSponsorIndex * sponsoredStores.length);
      const selectedSponsor = sponsoredStores[selectedIndex];
      return [selectedSponsor, ...nonSponsoredStores];
    } else if (sponsoredStores.length === 1) {
      return [sponsoredStores[0], ...nonSponsoredStores];
    }
    
    return nonSponsoredStores;
  }, [storesWithDistance, openNowOnly, selectedBrands, randomSponsorIndex, hasLocation]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">City Not Found</h1>
            <p className="text-muted-foreground mb-4">The city you're looking for doesn't exist.</p>
            <Link to="/us" className="text-primary hover:underline">Browse all cities</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const openStoreCount = allStores.filter(s => s.isOpen).length;

  return (
    <>
      <Helmet>
        <title>{`Vape Shops in ${city.name}, ${city.state} | ${city.storeCount} Stores | VapeFinder`}</title>
        <meta 
          name="description" 
          content={`Find the best vape shops in ${city.name}, ${city.state}. Browse ${city.storeCount} stores with reviews, hours, and inventory. ${openStoreCount} stores open now.`}
        />
        <link rel="canonical" href={`https://vapefinder.com/us/${citySlug}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Header */}
          <section className="py-8 border-b border-border bg-card">
            <div className="container">
              <nav className="text-sm text-muted-foreground mb-4">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/us" className="hover:text-primary">United States</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{city.name}</span>
              </nav>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Vape Shops in <span className="gradient-text">{city.name}, {city.state}</span>
                  </h1>
                  <p className="text-muted-foreground">
                    {city.storeCount} stores · {openStoreCount} open now · {city.averageRating} avg rating
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="w-4 h-4 mr-1" />
                    Map
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="py-4 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
            <div className="container">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={openNowOnly ? "filterActive" : "filter"}
                  size="sm"
                  onClick={() => setOpenNowOnly(!openNowOnly)}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Open Now
                  {openNowOnly && <X className="w-3 h-3 ml-1" />}
                </Button>

                <div className="w-px h-6 bg-border mx-2" />

                <span className="text-sm text-muted-foreground mr-2">Brands:</span>
                <div className="flex flex-wrap gap-1.5">
                  {brands.slice(0, 8).map(brand => (
                    <Button
                      key={brand}
                      variant={selectedBrands.includes(brand) ? "filterActive" : "filter"}
                      size="sm"
                      onClick={() => toggleBrand(brand)}
                      className="text-xs px-2 py-1 h-7"
                    >
                      {brand}
                    </Button>
                  ))}
                </div>

                {(selectedBrands.length > 0 || openNowOnly) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBrands([]);
                      setOpenNowOnly(false);
                    }}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Store List */}
          <section className="py-8">
            <div className="container">
              {filteredStores.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No stores match your current filters.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBrands([]);
                      setOpenNowOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Showing {filteredStores.length} of {allStores.length} stores
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((item, index) => (
                      <div 
                        key={item.store.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <StoreCard 
                          store={item.store} 
                          citySlug={citySlug || ""} 
                          distance={item.distance !== null ? formatDistance(item.distance) : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* SEO Content */}
          <section className="py-12 bg-card border-t border-border">
            <div className="container max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">
                Finding the Best Vape Shops in {city.name}
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="mb-4">
                  {city.name}, {city.state} is home to {city.storeCount} vape shops, 
                  offering everything from beginner-friendly pod systems to advanced mod setups. 
                  With an average customer rating of {city.averageRating} stars, 
                  {city.name} vapers enjoy access to some of the best vape retailers in the country.
                </p>
                <p className="mb-4">
                  Popular brands available at {city.name} vape shops include Juul, SMOK, Vaporesso, 
                  and Puff Bar. Many stores also carry premium e-liquid brands and offer CBD products. 
                  Use our brand filter above to find stores that stock your preferred products.
                </p>
                <p>
                  Looking for a vape shop open right now? Our "Open Now" filter shows you 
                  {city.name} stores that are currently accepting customers. Each listing includes 
                  detailed hours, phone numbers for quick inquiries, and directions to help you 
                  get there fast.
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CityPage;
