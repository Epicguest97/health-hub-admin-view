import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  LayoutDashboard, 
  CreditCard, 
  UserCog, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  CalendarClock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: "/" 
    },
    { 
      name: "Patients", 
      icon: <Users className="h-5 w-5" />, 
      path: "/patients" 
    },
    { 
      name: "Register Patient", 
      icon: <UserPlus className="h-5 w-5" />, 
      path: "/register-patient" 
    },
    { 
      name: "Appointments", 
      icon: <CalendarClock className="h-5 w-5" />, 
      path: "/appointments/schedule" 
    },
    { 
      name: "Staff", 
      icon: <UserCog className="h-5 w-5" />, 
      path: "/staff" 
    },
    { 
      name: "Register Staff", 
      icon: <UserCog className="h-5 w-5" />, 
      path: "/register-staff" 
    },
    { 
      name: "Billing", 
      icon: <CreditCard className="h-5 w-5" />, 
      path: "/billing" 
    },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="font-bold text-2xl text-primary">CareNet</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <div className={cn(collapsed ? "mr-0" : "mr-3")}>{item.icon}</div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
