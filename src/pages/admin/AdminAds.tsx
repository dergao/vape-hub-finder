import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Image, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ad {
  id: string;
  name: string;
  type: "list_banner" | "detail_banner" | "sponsored_store";
  imageUrl: string;
  targetUrl: string;
  position: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
}

const mockAds: Ad[] = [
  {
    id: "1",
    name: "Juul 新品推广",
    type: "list_banner",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
    targetUrl: "https://juul.com",
    position: 1,
    isActive: true,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    impressions: 15420,
    clicks: 892,
  },
  {
    id: "2",
    name: "SMOK 店铺详情广告",
    type: "detail_banner",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",
    targetUrl: "https://smok.com",
    position: 1,
    isActive: true,
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    impressions: 8930,
    clicks: 456,
  },
  {
    id: "3",
    name: "Vaporesso 品牌广告",
    type: "detail_banner",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    targetUrl: "https://vaporesso.com",
    position: 2,
    isActive: false,
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    impressions: 5200,
    clicks: 234,
  },
];

export default function AdminAds() {
  const [adList, setAdList] = useState<Ad[]>(mockAds);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filteredAds = activeTab === "all" 
    ? adList 
    : adList.filter(ad => ad.type === activeTab);

  const handleDelete = (id: string) => {
    setAdList(adList.filter(a => a.id !== id));
    toast({ title: "广告已删除" });
  };

  const handleToggleActive = (id: string) => {
    setAdList(adList.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
    toast({ title: "广告状态已更新" });
  };

  const handleSave = (ad: Ad) => {
    if (editingAd) {
      setAdList(adList.map(a => a.id === ad.id ? ad : a));
      toast({ title: "广告已更新" });
    } else {
      setAdList([...adList, { ...ad, id: Date.now().toString() }]);
      toast({ title: "广告已添加" });
    }
    setIsDialogOpen(false);
    setEditingAd(null);
  };

  const getTypeLabel = (type: Ad["type"]) => {
    switch (type) {
      case "list_banner": return "列表页横幅";
      case "detail_banner": return "详情页横幅";
      case "sponsored_store": return "赞助商店铺";
    }
  };

  const getTypeBadgeVariant = (type: Ad["type"]) => {
    switch (type) {
      case "list_banner": return "default";
      case "detail_banner": return "secondary";
      case "sponsored_store": return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">广告管理</h1>
          <p className="text-muted-foreground">管理店铺列表和详情页广告位</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAd(null)}>
              <Plus className="w-4 h-4 mr-2" />
              添加广告
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAd ? "编辑广告" : "添加广告"}</DialogTitle>
            </DialogHeader>
            <AdForm 
              ad={editingAd} 
              onSave={handleSave} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">总展示次数</div>
          <div className="text-2xl font-bold">
            {adList.reduce((acc, ad) => acc + ad.impressions, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">总点击次数</div>
          <div className="text-2xl font-bold">
            {adList.reduce((acc, ad) => acc + ad.clicks, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">平均点击率</div>
          <div className="text-2xl font-bold">
            {(adList.reduce((acc, ad) => acc + ad.clicks, 0) / 
              adList.reduce((acc, ad) => acc + ad.impressions, 0) * 100).toFixed(2)}%
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="list_banner">列表页横幅</TabsTrigger>
            <TabsTrigger value="detail_banner">详情页横幅</TabsTrigger>
            <TabsTrigger value="sponsored_store">赞助商店铺</TabsTrigger>
          </TabsList>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>预览</TableHead>
                <TableHead>广告名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>展示/点击</TableHead>
                <TableHead>点击率</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.name}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ad.name}</div>
                    <a 
                      href={ad.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ad.targetUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(ad.type)}>
                      {getTypeLabel(ad.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{ad.impressions.toLocaleString()} 展示</div>
                      <div className="text-muted-foreground">{ad.clicks.toLocaleString()} 点击</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(ad.clicks / ad.impressions * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={ad.isActive}
                      onCheckedChange={() => handleToggleActive(ad.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingAd(ad);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tabs>
      </Card>
    </div>
  );
}

interface AdFormProps {
  ad: Ad | null;
  onSave: (ad: Ad) => void;
  onCancel: () => void;
}

function AdForm({ ad, onSave, onCancel }: AdFormProps) {
  const [formData, setFormData] = useState<Partial<Ad>>(ad || {
    name: "",
    type: "list_banner",
    imageUrl: "",
    targetUrl: "",
    position: 1,
    isActive: true,
    startDate: "",
    endDate: "",
    impressions: 0,
    clicks: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: ad?.id || "",
    } as Ad);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">广告名称</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">广告类型</Label>
        <Select
          value={formData.type}
          onValueChange={(value: Ad["type"]) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list_banner">列表页横幅</SelectItem>
            <SelectItem value="detail_banner">详情页横幅</SelectItem>
            <SelectItem value="sponsored_store">赞助商店铺</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">图片URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
        />
        {formData.imageUrl && (
          <img 
            src={formData.imageUrl} 
            alt="预览" 
            className="w-full h-32 object-cover rounded mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl">跳转链接</Label>
        <Input
          id="targetUrl"
          value={formData.targetUrl}
          onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">开始日期</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">结束日期</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">立即启用</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
