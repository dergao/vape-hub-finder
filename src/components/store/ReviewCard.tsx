import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "@/data/mockData";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">{review.userName}</span>
            <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < review.rating ? "fill-rating text-rating" : "text-muted"}`}
              />
            ))}
          </div>
          
          <p className="text-foreground mb-4">{review.content}</p>
          
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Service: <span className="text-foreground font-medium">{review.serviceRating}/5</span></span>
            <span>Inventory: <span className="text-foreground font-medium">{review.inventoryRating}/5</span></span>
            <span>Pricing: <span className="text-foreground font-medium">{review.pricingRating}/5</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}