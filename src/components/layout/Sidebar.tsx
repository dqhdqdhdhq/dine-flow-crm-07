
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  FileText,
  BarChart,
  Settings,
  Home,
  MessageSquare,
  PanelLeft,
  PanelRight,
  FileCog
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 my-1 rounded-lg text-sm font-medium transition-colors hover:text-foreground",
        active 
          ? "bg-accent text-foreground" 
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-popover text-popover-foreground text-sm opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // If we're on mobile, we always want the sidebar collapsed
  const isCollapsed = isMobile || collapsed;
  
  return (
    <div 
      className={cn(
        "h-screen flex-col border-r bg-background sticky top-0 left-0 transition-all duration-300 flex",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="p-3 flex justify-between items-center border-b">
        <div className="flex items-center overflow-hidden">
          <img 
            src="/lovable-uploads/72d56d1c-5559-4703-95fa-c4865c955355.png" 
            alt="Restaurant Software" 
            className={cn(
              "h-8 transition-all duration-300",
              isCollapsed ? "mx-auto" : "mr-2"
            )}
          />
          {!isCollapsed && (
            <span className="font-bold whitespace-nowrap truncate">
              Restaurant Software
            </span>
          )}
        </div>
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground"
          >
            {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-4 overflow-y-auto">
        <div className="px-3 space-y-2">
          <SidebarItem
            icon={Home}
            label="Dashboard"
            to="/"
            active={location.pathname === '/'}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={Calendar}
            label="Reservations"
            to="/reservations"
            active={location.pathname.startsWith('/reservations')}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={Users}
            label="Customers"
            to="/customers"
            active={location.pathname.startsWith('/customers')}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={MessageSquare}
            label="Feedback"
            to="/feedback"
            active={location.pathname.startsWith('/feedback')}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={FileText}
            label="Notes"
            to="/notes"
            active={location.pathname.startsWith('/notes')}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={BarChart}
            label="Reports"
            to="/reports"
            active={location.pathname.startsWith('/reports')}
            collapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={FileCog}
            label="Events"
            to="/events"
            active={location.pathname.startsWith('/events')}
            collapsed={isCollapsed}
          />
        </div>
        
        <div className="px-3 mt-auto">
          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/settings"
            active={location.pathname.startsWith('/settings')}
            collapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

