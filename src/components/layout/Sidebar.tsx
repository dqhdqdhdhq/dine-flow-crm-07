
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare, BarChart2, Settings } from 'lucide-react';
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
    title: 'Notes',
    icon: FileText,
    path: '/notes'
  },
  {
    title: 'Feedback',
    icon: MessageSquare,
    path: '/feedback'
  },
  {
    title: 'Reports',
    icon: BarChart2,
    path: '/reports'
  },
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
                  <SidebarMenuButton asChild active={location.pathname === item.path}>
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
