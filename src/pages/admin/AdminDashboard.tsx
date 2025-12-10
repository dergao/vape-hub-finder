import { Card } from "@/components/ui/card";
import { Store, MapPin, MessageSquare, Megaphone, TrendingUp, Users } from "lucide-react";
import { cities, stores } from "@/data/mockData";

export default function AdminDashboard() {
  const totalStores = stores.length;
  const totalCities = cities.length;
  const totalReviews = stores.reduce((acc, store) => acc + store.reviews.length, 0);
  const sponsoredStores = stores.filter(s => s.isSponsored).length;

  const stats = [
    { label: "总店铺数", value: totalStores, icon: Store, color: "text-blue-500" },
    { label: "覆盖城市", value: totalCities, icon: MapPin, color: "text-green-500" },
    { label: "用户评论", value: totalReviews, icon: MessageSquare, color: "text-yellow-500" },
    { label: "赞助商店铺", value: sponsoredStores, icon: Megaphone, color: "text-primary" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">欢迎使用 VapeFinder 后台管理系统</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            热门城市
          </h2>
          <div className="space-y-3">
            {cities.slice(0, 5).map((city, index) => (
              <div key={city.slug} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-6">{index + 1}.</span>
                  <span className="font-medium">{city.name}, {city.state}</span>
                </div>
                <span className="text-sm text-muted-foreground">{city.storeCount} 家店铺</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            最新评论
          </h2>
          <div className="space-y-3">
            {stores.flatMap(s => s.reviews.map(r => ({ ...r, storeName: s.name }))).slice(0, 5).map((review) => (
              <div key={review.id} className="py-2 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{review.userName}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{review.content}</p>
                <p className="text-xs text-primary mt-1">{review.storeName}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
