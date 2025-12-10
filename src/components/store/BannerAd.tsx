import { Card, CardContent } from "@/components/ui/card";

export function BannerAd() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[200px] bg-gradient-to-r from-secondary to-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Advertisement</p>
            <p className="text-lg font-medium text-foreground">Your Ad Here</p>
            <p className="text-xs text-muted-foreground mt-1">728 x 200</p>
          </div>
          <span className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded">
            Ad
          </span>
        </div>
      </CardContent>
    </Card>
  );
}