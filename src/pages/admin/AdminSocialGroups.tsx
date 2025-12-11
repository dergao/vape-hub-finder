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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, ExternalLink, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialGroup {
  id: string;
  name: string;
  platform: "whatsapp" | "telegram" | "facebook";
  url: string;
  memberCount: number;
  isActive: boolean;
  description: string;
}

const platformConfig = {
  whatsapp: { label: "WhatsApp", color: "bg-green-500" },
  telegram: { label: "Telegram", color: "bg-blue-500" },
  facebook: { label: "Facebook", color: "bg-indigo-600" },
};

const mockGroups: SocialGroup[] = [
  {
    id: "1",
    name: "Daily Vape Giveaway",
    platform: "whatsapp",
    url: "https://chat.whatsapp.com/example",
    memberCount: 1250,
    isActive: true,
    description: "Daily giveaways and exclusive deals",
  },
  {
    id: "2",
    name: "Vape Enthusiasts",
    platform: "telegram",
    url: "https://t.me/example",
    memberCount: 3400,
    isActive: true,
    description: "Community for vape enthusiasts",
  },
  {
    id: "3",
    name: "VapeFinder Community",
    platform: "facebook",
    url: "https://facebook.com/groups/example",
    memberCount: 5600,
    isActive: true,
    description: "Official Facebook community group",
  },
];

export default function AdminSocialGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<SocialGroup[]>(mockGroups);
  const [editingGroup, setEditingGroup] = useState<SocialGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    toast({ title: "Group deleted" });
  };

  const handleToggleActive = (id: string) => {
    setGroups(groups.map(g => 
      g.id === id ? { ...g, isActive: !g.isActive } : g
    ));
    toast({ title: "Status updated" });
  };

  const handleSave = (group: SocialGroup) => {
    if (editingGroup) {
      setGroups(groups.map(g => g.id === group.id ? group : g));
      toast({ title: "Group updated" });
    } else {
      setGroups([...groups, { ...group, id: Date.now().toString() }]);
      toast({ title: "Group added" });
    }
    setIsDialogOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Groups Management</h1>
          <p className="text-muted-foreground">Manage WhatsApp, Telegram & Facebook groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGroup(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGroup ? "Edit Group" : "Add Group"}</DialogTitle>
            </DialogHeader>
            <GroupForm 
              group={editingGroup} 
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
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-muted-foreground">{group.description}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`${platformConfig[group.platform].color} text-white`}>
                    {platformConfig[group.platform].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    {group.memberCount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={group.isActive}
                    onCheckedChange={() => handleToggleActive(group.id)}
                  />
                </TableCell>
                <TableCell>
                  <a 
                    href={group.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingGroup(group);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(group.id)}
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

interface GroupFormProps {
  group: SocialGroup | null;
  onSave: (group: SocialGroup) => void;
  onCancel: () => void;
}

function GroupForm({ group, onSave, onCancel }: GroupFormProps) {
  const [formData, setFormData] = useState<Partial<SocialGroup>>(group || {
    name: "",
    platform: "whatsapp",
    url: "",
    memberCount: 0,
    isActive: true,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: group?.id || "",
    } as SocialGroup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Group Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Daily Vape Giveaway"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform *</Label>
        <Select 
          value={formData.platform} 
          onValueChange={(value: "whatsapp" | "telegram" | "facebook") => 
            setFormData({ ...formData, platform: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Group URL *</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memberCount">Member Count</Label>
        <Input
          id="memberCount"
          type="number"
          min="0"
          value={formData.memberCount}
          onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the group"
        />
      </div>

      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
