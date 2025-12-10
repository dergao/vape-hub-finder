interface RatingBarProps {
  label: string;
  rating: number;
  maxRating?: number;
}

export function RatingBar({ label, rating, maxRating = 5 }: RatingBarProps) {
  const percentage = (rating / maxRating) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">{rating.toFixed(1)}</span>
    </div>
  );
}
