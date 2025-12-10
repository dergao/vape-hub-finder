import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Pencil, Trash2, Star, Store } from "lucide-react";
import { cities, type City } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminCities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityList, setCityList] = useState<City[]>(cities);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredCities = cityList.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (slug: string) => {
    setCityList(cityList.filter(c => c.slug !== slug));
    toast({ title: "城市已删除" });
  };

  const handleSave = (city: City) => {
    if (editingCity) {
      setCityList(cityList.map(c => c.slug === editingCity.slug ? city : c));
      toast({ title: "城市已更新" });
    } else {
      setCityList([...cityList, city]);
      toast({ title: "城市已添加" });
    }
    setIsDialogOpen(false);
    setEditingCity(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">城市管理</h1>
          <p className="text-muted-foreground">管理覆盖城市和区域</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCity(null)}>
              <Plus className="w-4 h-4 mr-2" />
              添加城市
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCity ? "编辑城市" : "添加城市"}</DialogTitle>
            </DialogHeader>
            <CityForm 
              city={editingCity} 
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
              placeholder="搜索城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>缩略图</TableHead>
              <TableHead>城市名称</TableHead>
              <TableHead>州</TableHead>
              <TableHead>店铺数量</TableHead>
              <TableHead>平均评分</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCities.map((city) => (
              <TableRow key={city.slug}>
                <TableCell>
                  <img 
                    src={city.imageUrl} 
                    alt={city.name}
                    className="w-16 h-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.state}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Store className="w-4 h-4 text-muted-foreground" />
                    {city.storeCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-rating text-rating" />
                    {city.averageRating}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingCity(city);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(city.slug)}
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

interface CityFormProps {
  city: City | null;
  onSave: (city: City) => void;
  onCancel: () => void;
}

function CityForm({ city, onSave, onCancel }: CityFormProps) {
  const [formData, setFormData] = useState<Partial<City>>(city || {
    name: "",
    state: "",
    storeCount: 0,
    averageRating: 0,
    imageUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
    } as City);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">城市名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">州</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storeCount">店铺数量</Label>
          <Input
            id="storeCount"
            type="number"
            value={formData.storeCount}
            onChange={(e) => setFormData({ ...formData, storeCount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="averageRating">平均评分</Label>
          <Input
            id="averageRating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.averageRating}
            onChange={(e) => setFormData({ ...formData, averageRating: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">缩略图URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
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
