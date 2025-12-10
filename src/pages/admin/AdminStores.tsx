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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Pencil, Trash2, Star, MapPin } from "lucide-react";
import { stores, type VapeStore } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminStores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeList, setStoreList] = useState<VapeStore[]>(stores);
  const [editingStore, setEditingStore] = useState<VapeStore | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredStores = storeList.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStoreList(storeList.filter(s => s.id !== id));
    toast({ title: "店铺已删除" });
  };

  const handleToggleSponsored = (id: string) => {
    setStoreList(storeList.map(s => 
      s.id === id ? { ...s, isSponsored: !s.isSponsored } : s
    ));
    toast({ title: "赞助状态已更新" });
  };

  const handleSave = (store: VapeStore) => {
    if (editingStore) {
      setStoreList(storeList.map(s => s.id === store.id ? store : s));
      toast({ title: "店铺已更新" });
    } else {
      setStoreList([...storeList, { ...store, id: Date.now().toString() }]);
      toast({ title: "店铺已添加" });
    }
    setIsDialogOpen(false);
    setEditingStore(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">店铺管理</h1>
          <p className="text-muted-foreground">管理所有 Vape 店铺信息</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStore(null)}>
              <Plus className="w-4 h-4 mr-2" />
              添加店铺
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStore ? "编辑店铺" : "添加店铺"}</DialogTitle>
            </DialogHeader>
            <StoreForm 
              store={editingStore} 
              onSave={handleSave} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索店铺名称或城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>店铺名称</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>评分</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>赞助</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <div className="font-medium">{store.name}</div>
                  <div className="text-sm text-muted-foreground">{store.address}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {store.city}, {store.state}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-rating text-rating" />
                    {store.rating} ({store.reviewCount})
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={store.isOpen ? "default" : "secondary"}>
                    {store.isOpen ? "营业中" : "已关门"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={store.isSponsored || false}
                    onCheckedChange={() => handleToggleSponsored(store.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingStore(store);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(store.id)}
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

interface StoreFormProps {
  store: VapeStore | null;
  onSave: (store: VapeStore) => void;
  onCancel: () => void;
}

function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const [formData, setFormData] = useState<Partial<VapeStore>>(store || {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    rating: 0,
    reviewCount: 0,
    subRatings: { service: 0, inventory: 0, pricing: 0 },
    isOpen: true,
    hours: {},
    coordinates: { lat: 0, lng: 0 },
    brands: [],
    featuredProducts: [],
    imageUrl: "",
    photos: [],
    description: "",
    hasCoupons: false,
    isSponsored: false,
    reviews: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: store?.id || "",
      slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
    } as VapeStore);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">店铺名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">地址</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">城市</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">州</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">邮编</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="isOpen">营业状态</Label>
          <Switch
            id="isOpen"
            checked={formData.isOpen}
            onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="isSponsored">赞助商</Label>
          <Switch
            id="isSponsored"
            checked={formData.isSponsored}
            onCheckedChange={(checked) => setFormData({ ...formData, isSponsored: checked })}
          />
        </div>
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
