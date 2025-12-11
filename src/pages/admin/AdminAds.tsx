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
import { Plus, Pencil, Trash2, ExternalLink, Search, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stores } from "@/data/mockData";

// Banner Ad interface
interface BannerAd {
  id: string;
  name: string;
  type: "list_banner" | "detail_banner";
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
}

// Sponsored Store interface
interface SponsoredStore {
  id: string;
  storeId: string;
  storeName: string;
  storeCity: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
}

const mockBannerAds: BannerAd[] = [
  {
    id: "1",
    name: "Juul New Product Promo",
    type: "list_banner",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
    targetUrl: "https://juul.com",
    isActive: true,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    impressions: 15420,
    clicks: 892,
  },
  {
    id: "2",
    name: "SMOK Detail Page Ad",
    type: "detail_banner",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",
    targetUrl: "https://smok.com",
    isActive: true,
    startDate: "2024-02-01",
    endDate: "2025-06-30",
    impressions: 8930,
    clicks: 456,
  },
];

const mockSponsoredStores: SponsoredStore[] = [
  {
    id: "1",
    storeId: "1",
    storeName: "Cloud 9 Vape Lounge",
    storeCity: "Los Angeles",
    isActive: true,
    startDate: "2024-12-01",
    endDate: "2025-03-31",
    impressions: 12500,
    clicks: 1890,
  },
  {
    id: "2",
    storeId: "2",
    storeName: "Vapor Paradise",
    storeCity: "Los Angeles",
    isActive: true,
    startDate: "2024-11-15",
    endDate: "2025-02-15",
    impressions: 9800,
    clicks: 1450,
  },
];

export default function AdminAds() {
  const [bannerAds, setBannerAds] = useState<BannerAd[]>(mockBannerAds);
  const [sponsoredStores, setSponsoredStores] = useState<SponsoredStore[]>(mockSponsoredStores);
  const [editingBanner, setEditingBanner] = useState<BannerAd | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<SponsoredStore | null>(null);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("banners");
  const { toast } = useToast();

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isActiveNow = (item: { isActive: boolean; startDate: string; endDate: string }) => {
    const now = new Date();
    return item.isActive && now >= new Date(item.startDate) && now <= new Date(item.endDate);
  };

  // Banner handlers
  const handleDeleteBanner = (id: string) => {
    setBannerAds(bannerAds.filter(a => a.id !== id));
    toast({ title: "Banner ad deleted" });
  };

  const handleToggleBanner = (id: string) => {
    setBannerAds(bannerAds.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    toast({ title: "Banner status updated" });
  };

  const handleSaveBanner = (ad: BannerAd) => {
    if (editingBanner) {
      setBannerAds(bannerAds.map(a => a.id === ad.id ? ad : a));
      toast({ title: "Banner ad updated" });
    } else {
      setBannerAds([...bannerAds, { ...ad, id: Date.now().toString() }]);
      toast({ title: "Banner ad added" });
    }
    setIsBannerDialogOpen(false);
    setEditingBanner(null);
  };

  // Sponsor handlers
  const handleDeleteSponsor = (id: string) => {
    setSponsoredStores(sponsoredStores.filter(s => s.id !== id));
    toast({ title: "Sponsored store removed" });
  };

  const handleToggleSponsor = (id: string) => {
    setSponsoredStores(sponsoredStores.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    toast({ title: "Sponsor status updated" });
  };

  const handleSaveSponsor = (sponsor: SponsoredStore) => {
    if (editingSponsor) {
      setSponsoredStores(sponsoredStores.map(s => s.id === sponsor.id ? sponsor : s));
      toast({ title: "Sponsored store updated" });
    } else {
      setSponsoredStores([...sponsoredStores, { ...sponsor, id: Date.now().toString() }]);
      toast({ title: "Sponsored store added" });
    }
    setIsSponsorDialogOpen(false);
    setEditingSponsor(null);
  };

  const getTypeLabel = (type: BannerAd["type"]) => {
    return type === "list_banner" ? "List Banner" : "Detail Banner";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ads & Sponsors Management</h1>
          <p className="text-muted-foreground">Manage banner ads and sponsored store placements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Impressions</div>
          <div className="text-2xl font-bold">
            {(bannerAds.reduce((acc, ad) => acc + ad.impressions, 0) + 
              sponsoredStores.reduce((acc, s) => acc + s.impressions, 0)).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Clicks</div>
          <div className="text-2xl font-bold">
            {(bannerAds.reduce((acc, ad) => acc + ad.clicks, 0) + 
              sponsoredStores.reduce((acc, s) => acc + s.clicks, 0)).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Banners</div>
          <div className="text-2xl font-bold">
            {bannerAds.filter(ad => isActiveNow(ad)).length} / {bannerAds.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Sponsors</div>
          <div className="text-2xl font-bold">
            {sponsoredStores.filter(s => isActiveNow(s)).length} / {sponsoredStores.length}
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Banner Ads</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsored Stores</TabsTrigger>
        </TabsList>

        {/* Banner Ads Tab */}
        <TabsContent value="banners">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Banner Advertisements</h2>
              <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingBanner(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingBanner ? "Edit Banner" : "Add Banner"}</DialogTitle>
                  </DialogHeader>
                  <BannerForm 
                    banner={editingBanner} 
                    onSave={handleSaveBanner} 
                    onCancel={() => setIsBannerDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Validity Period</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannerAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <img src={ad.imageUrl} alt={ad.name} className="w-20 h-12 object-cover rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ad.name}</div>
                      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" />{ad.targetUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.type === "list_banner" ? "default" : "secondary"}>
                        {getTypeLabel(ad.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{ad.startDate} ~ {ad.endDate}</div>
                        {isExpired(ad.endDate) ? (
                          <Badge variant="destructive" className="mt-1 text-xs">Expired</Badge>
                        ) : isActiveNow(ad) ? (
                          <Badge variant="open" className="mt-1 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="mt-1 text-xs">Scheduled</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{ad.impressions.toLocaleString()} views</div>
                        <div className="text-muted-foreground">{ad.clicks} clicks ({(ad.clicks / ad.impressions * 100).toFixed(1)}%)</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={ad.isActive} onCheckedChange={() => handleToggleBanner(ad.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingBanner(ad); setIsBannerDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(ad.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Sponsored Stores Tab */}
        <TabsContent value="sponsors">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sponsored Stores</h2>
              <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingSponsor(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingSponsor ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle>
                  </DialogHeader>
                  <SponsorForm 
                    sponsor={editingSponsor} 
                    onSave={handleSaveSponsor} 
                    onCancel={() => setIsSponsorDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Validity Period</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsoredStores.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-primary" />
                        <span className="font-medium">{sponsor.storeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{sponsor.storeCity}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sponsor.startDate} ~ {sponsor.endDate}</div>
                        {isExpired(sponsor.endDate) ? (
                          <Badge variant="destructive" className="mt-1 text-xs">Expired</Badge>
                        ) : isActiveNow(sponsor) ? (
                          <Badge variant="open" className="mt-1 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="mt-1 text-xs">Scheduled</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sponsor.impressions.toLocaleString()} views</div>
                        <div className="text-muted-foreground">{sponsor.clicks} clicks ({(sponsor.clicks / sponsor.impressions * 100).toFixed(1)}%)</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={sponsor.isActive} onCheckedChange={() => handleToggleSponsor(sponsor.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingSponsor(sponsor); setIsSponsorDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSponsor(sponsor.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Banner Form Component
interface BannerFormProps {
  banner: BannerAd | null;
  onSave: (banner: BannerAd) => void;
  onCancel: () => void;
}

function BannerForm({ banner, onSave, onCancel }: BannerFormProps) {
  const [formData, setFormData] = useState<Partial<BannerAd>>(banner || {
    name: "",
    type: "list_banner",
    imageUrl: "",
    targetUrl: "",
    isActive: true,
    startDate: "",
    endDate: "",
    impressions: 0,
    clicks: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: banner?.id || "" } as BannerAd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ad Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Ad Type</Label>
        <Select value={formData.type} onValueChange={(value: BannerAd["type"]) => setFormData({ ...formData, type: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="list_banner">List Page Banner</SelectItem>
            <SelectItem value="detail_banner">Detail Page Banner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." required />
        {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input id="targetUrl" value={formData.targetUrl} onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })} placeholder="https://..." required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Enable Immediately</Label>
        <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

// Sponsor Form Component
interface SponsorFormProps {
  sponsor: SponsoredStore | null;
  onSave: (sponsor: SponsoredStore) => void;
  onCancel: () => void;
}

function SponsorForm({ sponsor, onSave, onCancel }: SponsorFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<SponsoredStore>>(sponsor || {
    storeId: "",
    storeName: "",
    storeCity: "",
    isActive: true,
    startDate: "",
    endDate: "",
    impressions: 0,
    clicks: 0,
  });

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const handleSelectStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setFormData({ ...formData, storeId: store.id, storeName: store.name, storeCity: store.city });
      setSearchQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeId) return;
    onSave({ ...formData, id: sponsor?.id || "" } as SponsoredStore);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Store</Label>
        {formData.storeName ? (
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <div>
                <div className="font-medium">{formData.storeName}</div>
                <div className="text-sm text-muted-foreground">{formData.storeCity}</div>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormData({ ...formData, storeId: "", storeName: "", storeCity: "" })}>
              Change
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search store name or city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {filteredStores.length > 0 ? (
                  filteredStores.map(store => (
                    <button
                      key={store.id}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                      onClick={() => handleSelectStore(store.id)}
                    >
                      <Store className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.city}, {store.state}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-muted-foreground">No stores found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Enable Immediately</Label>
        <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!formData.storeId}>Save</Button>
      </div>
    </form>
  );
}
