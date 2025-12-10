import { Link } from "react-router-dom";
import { Star, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { City } from "@/data/mockData";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link to={`/us/${city.slug}`}>
      <Card variant="interactive" className="overflow-hidden group h-full">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={city.imageUrl} 
            alt={`Vape shops in ${city.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-xl mb-1">
              {city.name}, {city.state}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Store className="w-4 h-4 text-primary" />
                <span>{city.storeCount} stores</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-rating text-rating" />
                <span>{city.averageRating} avg</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
