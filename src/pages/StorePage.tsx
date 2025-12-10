import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  MapPin, Phone, Clock, Star, Navigation, 
  ExternalLink, ChevronRight, Share2 
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { RatingBar } from "@/components/store/RatingBar";
import { ReviewCard } from "@/components/store/ReviewCard";
import { PhotoGallery } from "@/components/store/PhotoGallery";
import { BannerAd } from "@/components/store/BannerAd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreBySlug, getCityBySlug } from "@/data/mockData";

const StorePage = () => {
  const { citySlug, storeSlug } = useParams<{ citySlug: string; storeSlug: string }>();
  const store = getStoreBySlug(citySlug || "", storeSlug || "");
  const city = getCityBySlug(citySlug || "");

  if (!store || !city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
            <p className="text-muted-foreground mb-4">The store you're looking for doesn't exist.</p>
            <Link to={`/us/${citySlug}`} className="text-primary hover:underline">
              Back to {city?.name || "city"}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = dayNames[new Date().getDay()];

  const formatHours = (hours: { open: string; close: string } | null) => {
    if (!hours) return "Closed";
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <>
      <Helmet>
        <title>{store.name} | Vape Shop in {city.name}, {city.state} | VapeFinder</title>
        <meta 
          name="description" 
          content={`${store.name} in ${city.name}, ${city.state}. ${store.description} Rated ${store.rating}/5 from ${store.reviewCount} reviews. ${store.isOpen ? "Open now" : "Currently closed"}.`}
        />
        <link rel="canonical" href={`https://vapefinder.com/us/${citySlug}/${storeSlug}`} />
      </Helmet>
      <LocalBusinessSchema store={store} />

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/us" className="hover:text-primary">US</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/us/${citySlug}`} className="hover:text-primary">{city.name}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground truncate max-w-[150px]">{store.name}</span>
            </nav>

            {/* Photo Gallery at Top */}
            <div className="mb-8">
              <PhotoGallery photos={store.photos} storeName={store.name} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={store.isOpen ? "open" : "closed"} className="text-sm">
                            {store.isOpen ? "Open Now" : "Closed"}
                          </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{store.address}, {store.city}, {store.state} {store.zipCode}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Rating Summary */}
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{store.rating}</div>
                        <div className="flex items-center gap-0.5 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(store.rating) ? "fill-rating text-rating" : "text-muted"}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{store.reviewCount} reviews</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <RatingBar label="Service" rating={store.subRatings.service} />
                        <RatingBar label="Inventory" rating={store.subRatings.inventory} />
                        <RatingBar label="Pricing" rating={store.subRatings.pricing} />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="default" className="h-12" asChild>
                        <a href={`tel:${store.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </a>
                      </Button>
                      <Button variant="outline" className="h-12" asChild>
                        <a 
                          href={`https://maps.google.com/?q=${store.coordinates.lat},${store.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </a>
                      </Button>
                      <Button variant="outline" className="h-12">
                        <Star className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                      <Button variant="outline" className="h-12">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{store.description}</p>
                  </CardContent>
                </Card>

                {/* Featured Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {store.featuredProducts.map(product => (
                        <div 
                          key={product}
                          className="p-4 bg-secondary rounded-lg text-center"
                        >
                          <span className="font-medium">{product}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Brands */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Brands</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {store.brands.map(brand => (
                        <Badge key={brand} variant="brand" className="text-sm px-3 py-1">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Banner Ad Space */}
                <BannerAd />

                {/* Reviews Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Reviews ({store.reviews.length})</span>
                      <Button variant="default" size="sm">
                        Write a Review
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {store.reviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dayNames.map(day => (
                        <li 
                          key={day}
                          className={`flex justify-between text-sm ${
                            day === today ? "font-semibold text-primary" : ""
                          }`}
                        >
                          <span className="capitalize">{day}</span>
                          <span className={store.hours[day] ? "" : "text-muted-foreground"}>
                            {formatHours(store.hours[day])}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a 
                        href={`tel:${store.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">
                        {store.address}<br />
                        {store.city}, {store.state} {store.zipCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StorePage;