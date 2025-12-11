import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  MapPin, Phone, Clock, Star, Navigation, 
  ExternalLink, ChevronRight, Share2, Facebook 
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
                          key={product.name}
                          className="p-4 bg-secondary rounded-lg text-center"
                        >
                          {product.url ? (
                            <a 
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {product.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="font-medium">{product.name}</span>
                          )}
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
                        brand.url ? (
                          <a 
                            key={brand.name}
                            href={brand.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge variant="brand" className="text-sm px-3 py-1 hover:bg-primary/20 cursor-pointer inline-flex items-center gap-1">
                              {brand.name}
                              <ExternalLink className="w-3 h-3" />
                            </Badge>
                          </a>
                        ) : (
                          <Badge key={brand.name} variant="brand" className="text-sm px-3 py-1">
                            {brand.name}
                          </Badge>
                        )
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
                    {store.website && (
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-primary" />
                        <a 
                          href={store.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors text-sm"
                        >
                          {store.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    )}
                    {store.facebook && (
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <a 
                          href={store.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors text-sm"
                        >
                          Facebook Page
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Daily Giveaway Promo */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      🎁 Daily Vape Giveaway
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join our community groups for a chance to win free vape products every day!
                    </p>
                    <div className="space-y-2">
                      {/* WhatsApp */}
                      <a 
                        href="https://chat.whatsapp.com/example" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-green-600/10 hover:bg-green-600/20 transition-colors"
                      >
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span className="text-sm font-medium text-green-600">WhatsApp Group</span>
                      </a>
                      
                      {/* Telegram */}
                      <a 
                        href="https://t.me/example" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        <span className="text-sm font-medium text-blue-500">Telegram Channel</span>
                      </a>
                      
                      {/* Facebook */}
                      <a 
                        href="https://facebook.com/groups/example" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-sm font-medium text-blue-600">Facebook Group</span>
                      </a>
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