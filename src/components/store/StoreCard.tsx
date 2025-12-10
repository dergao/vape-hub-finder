import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VapeStore } from "@/data/mockData";

interface StoreCardProps {
  store: VapeStore;
  citySlug: string;
}

export function StoreCard({ store, citySlug }: StoreCardProps) {
  return (
    <Card variant="interactive" className="overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={store.imageUrl} 
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={store.isOpen ? "open" : "closed"}>
            <Clock className="w-3 h-3 mr-1" />
            {store.isOpen ? "Open Now" : "Closed"}
          </Badge>
        </div>

        {/* Coupon Badge */}
        {store.hasCoupons && (
          <div className="absolute top-3 right-3">
            <Badge variant="coupon">
              <Tag className="w-3 h-3 mr-1" />
              Coupons
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 fill-rating text-rating" />
          <span className="font-semibold text-sm">{store.rating}</span>
          <span className="text-xs text-muted-foreground">({store.reviewCount})</span>
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/us/${citySlug}/${store.slug}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {store.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{store.address}, {store.zipCode}</span>
        </div>

        {/* Brands */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {store.brands.slice(0, 3).map(brand => (
            <Badge key={brand} variant="brand" className="text-xs">
              {brand}
            </Badge>
          ))}
          {store.brands.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{store.brands.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={`tel:${store.phone}`}>
              <Phone className="w-4 h-4 mr-1" />
              Call
            </a>
          </Button>
          <Button variant="default" size="sm" className="flex-1" asChild>
            <Link to={`/us/${citySlug}/${store.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
