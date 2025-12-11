import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CityCard } from "@/components/city/CityCard";
import { SearchBar } from "@/components/search/SearchBar";
import { CityListSchema } from "@/components/seo/CityListSchema";
import { cities } from "@/data/mockData";

const CountryPage = () => {
  const totalStores = cities.reduce((sum, city) => sum + city.storeCount, 0);

  return (
    <>
      <Helmet>
        <title>Vape Shops in United States | Browse All Cities | VapeFinder</title>
        <meta 
          name="description" 
          content={`Browse ${totalStores.toLocaleString()}+ vape shops across ${cities.length} major US cities. Find the best vape stores with reviews, hours, and inventory near you.`}
        />
        <link rel="canonical" href="https://vapefinder.com/us" />
      </Helmet>
      <CityListSchema cities={cities} totalStores={totalStores} />

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Breadcrumb & Header */}
          <section className="py-8 md:py-12 border-b border-border">
            <div className="container">
              <nav className="text-sm text-muted-foreground mb-4">
                <a href="/" className="hover:text-primary">Home</a>
                <span className="mx-2">/</span>
                <span className="text-foreground">United States</span>
              </nav>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Vape Shops in the <span className="gradient-text">United States</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Browse {totalStores.toLocaleString()} stores across {cities.length} cities
                  </p>
                </div>
                <div className="w-full md:w-80">
                  <SearchBar variant="compact" />
                </div>
              </div>
            </div>
          </section>

          {/* Cities Grid */}
          <section className="py-12">
            <div className="container">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city, index) => (
                  <div 
                    key={city.slug}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CityCard city={city} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEO Content */}
          <section className="py-12 bg-card border-t border-border">
            <div className="container max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">Finding the Best Vape Shop Near You</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="mb-4">
                  VapeFinder is the most comprehensive vape shop directory in the United States, 
                  helping vapers locate nearby stores with detailed information about inventory, 
                  pricing, and customer service ratings.
                </p>
                <p className="mb-4">
                  Whether you're looking for specific brands like Juul, Puff Bar, SMOK, or Vaporesso, 
                  our platform lets you filter stores by their product availability. Each store listing 
                  includes real customer reviews with detailed ratings for service quality, inventory 
                  selection, and price fairness.
                </p>
                <p>
                  Use our "Open Now" filter to instantly find stores that are currently operating, 
                  perfect for those urgent vape needs. Browse by city or enter your zip code to 
                  discover the best vape shops in your area.
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

export default CountryPage;
