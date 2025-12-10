import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Trash2, Star, CheckCircle, XCircle } from "lucide-react";
import { stores, type Review } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ReviewWithStore extends Review {
  storeName: string;
  storeId: string;
}

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Flatten reviews from all stores
  const allReviews: ReviewWithStore[] = stores.flatMap(store => 
    store.reviews.map(review => ({
      ...review,
      storeName: store.name,
      storeId: store.id,
    }))
  );

  const [reviewList, setReviewList] = useState<ReviewWithStore[]>(allReviews);

  const filteredReviews = reviewList.filter(review => 
    review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setReviewList(reviewList.filter(r => r.id !== id));
    toast({ title: "评论已删除" });
  };

  const handleApprove = (id: string) => {
    toast({ title: "评论已通过审核" });
  };

  const handleReject = (id: string) => {
    setReviewList(reviewList.filter(r => r.id !== id));
    toast({ title: "评论已拒绝" });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < rating ? 'fill-rating text-rating' : 'text-muted'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">评论管理</h1>
        <p className="text-muted-foreground">审核和管理用户评论</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索评论..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>店铺</TableHead>
              <TableHead>评分</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>日期</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{review.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{review.storeName}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">总体</span>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">服务</span>
                      {renderStars(review.serviceRating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">库存</span>
                      {renderStars(review.inventoryRating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-12">价格</span>
                      {renderStars(review.pricingRating)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate" title={review.content}>
                    {review.content}
                  </p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {review.date}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleApprove(review.id)}
                      title="通过"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleReject(review.id)}
                      title="拒绝"
                    >
                      <XCircle className="w-4 h-4 text-orange-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(review.id)}
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
