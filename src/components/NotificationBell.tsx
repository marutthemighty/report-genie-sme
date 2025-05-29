
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const NotificationBell = () => {
  const [notifications] = useState([
    {
      id: '1',
      message: 'Amazon report generated successfully',
      timestamp: '2 minutes ago',
      unread: true
    },
    {
      id: '2',
      message: 'Shopify integration connected',
      timestamp: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      message: 'Weekly report scheduled',
      timestamp: '3 hours ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 border shadow-lg" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium">Notifications</h4>
        </div>
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="p-3 flex flex-col items-start cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              {notification.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
              <p className="text-sm flex-1">{notification.message}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">{notification.timestamp}</span>
          </DropdownMenuItem>
        ))}
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
