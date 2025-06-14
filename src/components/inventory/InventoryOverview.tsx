
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Clock,
  Wine,
  Apple,
  Utensils,
  ShoppingCart
} from 'lucide-react';

interface InventoryOverviewProps {
  searchQuery: string;
  onCategorySelect: (category: string) => void;
  onItemSelect: (itemId: string) => void;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  searchQuery,
  onCategorySelect,
  onItemSelect
}) => {
  const stats = [
    {
      title: 'Low Stock Alerts',
      value: '3',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      action: () => onCategorySelect('Low Stock')
    },
    {
      title: 'Pending Orders',
      value: '5',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      action: () => onCategorySelect('Pending Orders')
    },
    {
      title: 'Total Items',
      value: '247',
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Month Usage',
      value: '↓12%',
      icon: TrendingDown,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  const categories = [
    {
      name: 'Beverages',
      icon: Wine,
      count: 45,
      color: 'bg-purple-100 text-purple-700',
      lowStock: 2
    },
    {
      name: 'Fresh Produce',
      icon: Apple,
      count: 78,
      color: 'bg-green-100 text-green-700',
      lowStock: 1
    },
    {
      name: 'Pantry',
      icon: Package,
      count: 89,
      color: 'bg-orange-100 text-orange-700',
      lowStock: 0
    },
    {
      name: 'Kitchen Supplies',
      icon: Utensils,
      count: 35,
      color: 'bg-gray-100 text-gray-700',
      lowStock: 0
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Low Stock Alert',
      item: 'Truffle Oil',
      time: '2 hours ago',
      type: 'alert'
    },
    {
      id: '2',
      action: 'Order Received',
      item: 'Cabernet Sauvignon (8/12 bottles)',
      time: '4 hours ago',
      type: 'success'
    },
    {
      id: '3',
      action: 'New Order Placed',
      item: 'Parmigiano Reggiano',
      time: '1 day ago',
      type: 'info'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-md transition-all duration-200 ${stat.action ? 'hover:scale-105' : ''}`}
              onClick={stat.action}
            >
              <CardContent className="flex items-center p-6">
                <div className={`p-3 rounded-xl ${stat.bgColor} mr-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => onCategorySelect(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${category.color} mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-2">{category.count} items</p>
                  {category.lowStock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {category.lowStock} low stock
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onItemSelect(activity.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryOverview;
