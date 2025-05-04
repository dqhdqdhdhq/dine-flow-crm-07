
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, LayoutGrid, List } from 'lucide-react';

type ViewType = 'list' | 'calendar' | 'floor-plan';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
      <Button
        size="sm"
        variant={currentView === 'list' ? 'default' : 'ghost'}
        className={`rounded-md ${
          currentView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        }`}
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
      <Button
        size="sm"
        variant={currentView === 'calendar' ? 'default' : 'ghost'}
        className={`rounded-md ${
          currentView === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        }`}
        onClick={() => onViewChange('calendar')}
      >
        <Calendar className="h-4 w-4 mr-1" />
        Calendar
      </Button>
      <Button
        size="sm"
        variant={currentView === 'floor-plan' ? 'default' : 'ghost'}
        className={`rounded-md ${
          currentView === 'floor-plan' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        }`}
        onClick={() => onViewChange('floor-plan')}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Floor Plan
      </Button>
    </div>
  );
};

export default ViewSelector;
