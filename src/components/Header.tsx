
import React from 'react';
import { BriefcaseBusiness, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  newJobsCount: number;
}

const Header: React.FC<HeaderProps> = ({ newJobsCount }) => {
  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">TechJobTracker</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {newJobsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {newJobsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
