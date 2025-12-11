import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Store, 
  MapPin, 
  MessageSquare, 
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Stores", url: "/admin/stores", icon: Store },
  { title: "Cities", url: "/admin/cities", icon: MapPin },
  { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
  { title: "Ads", url: "/admin/ads", icon: Megaphone },
  { title: "Social Groups", url: "/admin/social-groups", icon: Users },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border min-h-screen transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-bold text-lg text-primary">VapeFinder Admin</h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                end={item.url === "/admin"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <NavLink to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" />
          {!collapsed && <span>Back to Site</span>}
        </NavLink>
      </div>
    </aside>
  );
}
