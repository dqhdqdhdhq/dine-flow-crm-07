
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  Store, 
  DollarSign,
  CalendarDays
} from 'lucide-react';
import {
  Sidebar as SidebarBase,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';

// Mock admin state for demonstration
const isAdmin = true;

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    title: 'Customers',
    icon: Users,
    path: '/customers'
  },
  {
    title: 'Reservations',
    icon: Calendar,
    path: '/reservations'
  },
  {
    title: 'Events',
    icon: CalendarDays,
    path: '/events'
  },
  {
    title: 'Notes',
    icon: FileText,
    path: '/notes'
  },
  {
    title: 'Guest Experience',
    icon: MessageSquare,
    path: '/feedback-hub'
  },
  {
    title: 'Vendors',
    icon: Store,
    path: '/vendors'
  },
  {
    title: 'Reports',
    icon: BarChart2,
    path: '/reports'
  },
];

// Admin-only navigation items
const adminNavigationItems = [
  {
    title: 'Financial Hub',
    icon: DollarSign,
    path: '/financial-hub'
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarBase>
      <SidebarHeader className="flex items-center pl-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
            <span className="text-white font-semibold">DF</span>
          </div>
          <span className="font-semibold text-lg">DineFlow</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigationItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarBase>
  );
};

export default Sidebar;
