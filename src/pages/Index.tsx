import { Helmet } from "react-helmet-async";
import { MapPin, Star, Shield, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { CityCard } from "@/components/city/CityCard";
import { cities } from "@/data/mockData";

const Index = () => {
  const totalStores = cities.reduce((sum, city) => sum + city.storeCount, 0);

  return (
    <>
      <Helmet>
        <title>VapeFinder - Find Vape Shops Near You | Vape Store Directory</title>
        <meta 
          name="description" 
          content={`Find the best vape shops near you. Browse ${totalStores.toLocaleString()}+ verified stores across ${cities.length} major US cities. Real reviews, live inventory, and exclusive deals.`}
        />
        <meta property="og:title" content="VapeFinder - Find Vape Shops Near You" />
        <meta property="og:description" content="The most comprehensive vape shop directory in the US. Find stores with live inventory and real reviews." />
        <link rel="canonical" href="https://vapefinder.com" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden bg-hero-pattern">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
            
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Find <span className="gradient-text">Vape Shops</span> Near You
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  The most comprehensive vape shop directory in the United States. 
                  Browse {totalStores.toLocaleString()}+ verified stores with real reviews and live inventory.
                </p>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <SearchBar variant="hero" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{totalStores.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Verified Stores</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{cities.length}</div>
                  <div className="text-sm text-muted-foreground">Major Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">50K+</div>
                  <div className="text-sm text-muted-foreground">User Reviews</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-card border-y border-border">
            <div className="container">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Location-Based Search</h3>
                  <p className="text-sm text-muted-foreground">Find stores nearest to you with precise GPS integration</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Open Now Filter</h3>
                  <p className="text-sm text-muted-foreground">Instantly see which stores are currently open</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Verified Reviews</h3>
                  <p className="text-sm text-muted-foreground">Real ratings for service, inventory, and pricing</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Brand Inventory</h3>
                  <p className="text-sm text-muted-foreground">Know which brands are in stock before you visit</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cities Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Browse by City
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore vape shops in major cities across the United States. 
                  Each listing includes detailed reviews, store hours, and brand availability.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cities.map((city, index) => (
                  <div 
                    key={city.slug} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CityCard city={city} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24 bg-hero-pattern relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
            <div className="container relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Own a Vape Shop?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                List your store on VapeFinder and reach thousands of potential customers. 
                Manage your profile, respond to reviews, and promote exclusive deals.
              </p>
              <a 
                href="/for-business" 
                className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl glow-effect hover:scale-105 transition-all duration-300"
              >
                Add Your Store Free
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
