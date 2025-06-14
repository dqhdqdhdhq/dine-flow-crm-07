
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
} from 'lucide-react';
import { InventoryItem } from '@/types';

interface InventoryOverviewProps {
  inventoryItems: InventoryItem[];
  searchQuery: string;
  onCategorySelect: (category: string) => void;
  onItemSelect: (itemId: string) => void;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  inventoryItems,
  searchQuery,
  onCategorySelect,
  onItemSelect
}) => {
  const lowStockItems = inventoryItems.filter(item => 
    (item.currentStock ?? item.quantityOnHand ?? 0) < (item.lowStockThreshold ?? item.reorderPoint ?? 0)
  );

  const stats = [
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.length.toString(),
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      action: lowStockItems.length > 0 ? () => onCategorySelect('Low Stock') : undefined
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
      value: inventoryItems.length.toString(),
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

  const categoryData = inventoryItems.reduce((acc, item) => {
    const categoryName = item.category || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        count: 0,
        lowStock: 0,
        icon: (() => {
          const lowerCaseCategory = categoryName.toLowerCase();
          if (lowerCaseCategory.includes('produce')) return Apple;
          if (lowerCaseCategory.includes('pantry')) return Package;
          if (lowerCaseCategory.includes('beverage')) return Wine;
          return Utensils;
        })(),
        color: (() => {
          const lowerCaseCategory = categoryName.toLowerCase();
          if (lowerCaseCategory.includes('produce')) return 'bg-green-100 text-green-700';
          if (lowerCaseCategory.includes('pantry')) return 'bg-orange-100 text-orange-700';
          if (lowerCaseCategory.includes('beverage')) return 'bg-purple-100 text-purple-700';
          return 'bg-gray-100 text-gray-700';
        })(),
      };
    }
    acc[categoryName].count++;
    if ((item.currentStock ?? item.quantityOnHand ?? 0) < (item.lowStockThreshold ?? item.reorderPoint ?? 0)) {
      acc[categoryName].lowStock++;
    }
    return acc;
  }, {} as Record<string, { name: string; count: number; lowStock: number; icon: React.ElementType; color: string; }>);
  
  const categories = Object.values(categoryData);

  const recentActivity = inventoryItems
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map(item => ({
      id: item.id,
      action: 'Item Updated',
      item: item.name,
      time: 'Recently',
      type: lowStockItems.some(lowItem => lowItem.id === item.id) ? 'alert' : 'info'
    }));

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
