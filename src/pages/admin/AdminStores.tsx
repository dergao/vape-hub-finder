import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Pencil, Trash2, Star, MapPin, X, ExternalLink, Upload, Loader2 } from "lucide-react";
import { stores, brands as availableBrands, type VapeStore, type BrandItem, type ProductItem } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    toast({ title: "Store deleted" });
  };

  const handleToggleSponsored = (id: string) => {
    setStoreList(storeList.map(s => 
      s.id === id ? { ...s, isSponsored: !s.isSponsored } : s
    ));
    toast({ title: "Sponsored status updated" });
  };

  const handleSave = (store: VapeStore) => {
    if (editingStore) {
      setStoreList(storeList.map(s => s.id === store.id ? store : s));
      toast({ title: "Store updated" });
    } else {
      setStoreList([...storeList, { ...store, id: Date.now().toString() }]);
      toast({ title: "Store added" });
    }
    setIsDialogOpen(false);
    setEditingStore(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Management</h1>
          <p className="text-muted-foreground">Manage all vape store information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStore(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStore ? "Edit Store" : "Add Store"}</DialogTitle>
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
              placeholder="Search store name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sponsored</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    {store.isOpen ? "Open" : "Closed"}
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

const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayLabels: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday", 
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const { toast } = useToast();
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState<Partial<VapeStore>>(store || {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    facebook: "",
    rating: 0,
    reviewCount: 0,
    subRatings: { service: 0, inventory: 0, pricing: 0 },
    isOpen: true,
    hours: {
      monday: { open: "09:00", close: "21:00" },
      tuesday: { open: "09:00", close: "21:00" },
      wednesday: { open: "09:00", close: "21:00" },
      thursday: { open: "09:00", close: "21:00" },
      friday: { open: "09:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "11:00", close: "18:00" },
    },
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

  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandUrl, setNewBrandUrl] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductUrl, setNewProductUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: store?.id || "",
      slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
      reviews: store?.reviews || [],
    } as VapeStore);
  };

  const handleHoursChange = (day: string, field: "open" | "close", value: string) => {
    setFormData({
      ...formData,
      hours: {
        ...formData.hours,
        [day]: formData.hours?.[day] 
          ? { ...formData.hours[day], [field]: value }
          : { open: "09:00", close: "21:00", [field]: value },
      },
    });
  };

  const toggleDayClosed = (day: string) => {
    setFormData({
      ...formData,
      hours: {
        ...formData.hours,
        [day]: formData.hours?.[day] ? null : { open: "09:00", close: "21:00" },
      },
    });
  };

  const addBrand = () => {
    if (newBrandName && !formData.brands?.some(b => b.name === newBrandName)) {
      const newBrand: BrandItem = { name: newBrandName, url: newBrandUrl || undefined };
      setFormData({ ...formData, brands: [...(formData.brands || []), newBrand] });
      setNewBrandName("");
      setNewBrandUrl("");
    }
  };

  const removeBrand = (brandName: string) => {
    setFormData({ ...formData, brands: formData.brands?.filter(b => b.name !== brandName) });
  };

  const addProduct = () => {
    if (newProductName && !formData.featuredProducts?.some(p => p.name === newProductName)) {
      const newProduct: ProductItem = { name: newProductName, url: newProductUrl || undefined };
      setFormData({ ...formData, featuredProducts: [...(formData.featuredProducts || []), newProduct] });
      setNewProductName("");
      setNewProductUrl("");
    }
  };

  const removeProduct = (productName: string) => {
    setFormData({ ...formData, featuredProducts: formData.featuredProducts?.filter(p => p.name !== productName) });
  };

  const addBrandFromSuggestion = (brandName: string) => {
    if (!formData.brands?.some(b => b.name === brandName)) {
      const newBrand: BrandItem = { name: brandName };
      setFormData({ ...formData, brands: [...(formData.brands || []), newBrand] });
    }
  };

  // Image upload functions
  const uploadMainImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setUploadingMain(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `main-${Date.now()}.${fileExt}`;
      const filePath = `stores/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('store-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imageUrl: publicUrl });
      toast({ title: "Main image uploaded" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingMain(false);
    }
  };

  const uploadGalleryImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setUploadingGallery(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery-${Date.now()}.${fileExt}`;
      const filePath = `stores/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('store-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, photos: [...(formData.photos || []), publicUrl] });
      toast({ title: "Gallery image uploaded" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeMainImage = () => {
    setFormData({ ...formData, imageUrl: "" });
  };

  const removePhoto = (photo: string) => {
    setFormData({ ...formData, photos: formData.photos?.filter(p => p !== photo) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="products">Products/Brands</TabsTrigger>
          <TabsTrigger value="media">Images</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(xxx) xxx-xxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook Page</Label>
              <Input
                id="facebook"
                value={formData.facebook || ""}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                value={formData.coordinates?.lat || 0}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates!, lat: parseFloat(e.target.value) || 0 }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="0.0001"
                value={formData.coordinates?.lng || 0}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates!, lng: parseFloat(e.target.value) || 0 }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe the store's features and services..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label htmlFor="isOpen">Open Status</Label>
              <Switch
                id="isOpen"
                checked={formData.isOpen}
                onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label htmlFor="isSponsored">Sponsored</Label>
              <Switch
                id="isSponsored"
                checked={formData.isSponsored}
                onCheckedChange={(checked) => setFormData({ ...formData, isSponsored: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label htmlFor="hasCoupons">Has Coupons</Label>
              <Switch
                id="hasCoupons"
                checked={formData.hasCoupons}
                onCheckedChange={(checked) => setFormData({ ...formData, hasCoupons: checked })}
              />
            </div>
          </div>
        </TabsContent>

        {/* Ratings */}
        <TabsContent value="ratings" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Overall Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 0}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewCount">Review Count</Label>
              <Input
                id="reviewCount"
                type="number"
                min="0"
                value={formData.reviewCount || 0}
                onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Sub-Ratings (Shown on store detail page)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceRating">Service (0-5)</Label>
                <Input
                  id="serviceRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.subRatings?.service || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    subRatings: { ...formData.subRatings!, service: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventoryRating">Inventory (0-5)</Label>
                <Input
                  id="inventoryRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.subRatings?.inventory || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    subRatings: { ...formData.subRatings!, inventory: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingRating">Pricing (0-5)</Label>
                <Input
                  id="pricingRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.subRatings?.pricing || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    subRatings: { ...formData.subRatings!, pricing: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Hours */}
        <TabsContent value="hours" className="space-y-4 mt-4">
          <div className="space-y-3">
            {dayNames.map(day => (
              <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-24 font-medium">{dayLabels[day]}</div>
                <Switch
                  checked={formData.hours?.[day] !== null && formData.hours?.[day] !== undefined}
                  onCheckedChange={() => toggleDayClosed(day)}
                />
                {formData.hours?.[day] ? (
                  <>
                    <Input
                      type="time"
                      value={formData.hours[day]?.open || "09:00"}
                      onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={formData.hours[day]?.close || "21:00"}
                      onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                      className="w-32"
                    />
                  </>
                ) : (
                  <span className="text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Products/Brands */}
        <TabsContent value="products" className="space-y-6 mt-4">
          {/* Brands */}
          <div className="space-y-3">
            <Label>Available Brands</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBrand())}
              />
              <div className="flex gap-2">
                <Input
                  value={newBrandUrl}
                  onChange={(e) => setNewBrandUrl(e.target.value)}
                  placeholder="URL (optional)"
                />
                <Button type="button" onClick={addBrand}>Add</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(brand => (
                <Badge 
                  key={brand}
                  variant={formData.brands?.some(b => b.name === brand) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (formData.brands?.some(b => b.name === brand)) {
                      removeBrand(brand);
                    } else {
                      addBrandFromSuggestion(brand);
                    }
                  }}
                >
                  {brand}
                </Badge>
              ))}
            </div>
            {formData.brands && formData.brands.length > 0 && (
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Selected brands:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.brands.map(brand => (
                    <Badge key={brand.name} variant="secondary" className="gap-1">
                      {brand.name}
                      {brand.url && <ExternalLink className="w-3 h-3 text-primary" />}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeBrand(brand.name)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Products */}
          <div className="space-y-3">
            <Label>Featured Products</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Product name"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
              />
              <div className="flex gap-2">
                <Input
                  value={newProductUrl}
                  onChange={(e) => setNewProductUrl(e.target.value)}
                  placeholder="URL (optional)"
                />
                <Button type="button" onClick={addProduct}>Add</Button>
              </div>
            </div>
            {formData.featuredProducts && formData.featuredProducts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.featuredProducts.map(product => (
                  <Badge key={product.name} variant="secondary" className="gap-1">
                    {product.name}
                    {product.url && <ExternalLink className="w-3 h-3 text-primary" />}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeProduct(product.name)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Images */}
        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label>Main Image</Label>
            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadMainImage(file);
              }}
            />
            {formData.imageUrl ? (
              <div className="relative w-48 h-32 group">
                <img 
                  src={formData.imageUrl} 
                  alt="Main preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => mainImageInputRef.current?.click()}
                disabled={uploadingMain}
                className="w-48 h-32 flex flex-col items-center justify-center gap-2 border-dashed"
              >
                {uploadingMain ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Upload Main Image</span>
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <Label>Photo Gallery</Label>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadGalleryImage(file);
              }}
            />
            <div className="grid grid-cols-4 gap-3">
              {formData.photos?.map((photo, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={photo} 
                    alt={`Photo ${index + 1}`} 
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="h-24 flex flex-col items-center justify-center gap-1 border-dashed"
              >
                {uploadingGallery ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">Add Photo</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
