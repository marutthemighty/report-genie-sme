
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleViewAll = () => {
    navigate('/notifications');
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    navigate('/notifications');
  };

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
        {notifications.slice(0, 3).map((notification) => (
          <DropdownMenuItem 
            key={notification.id} 
            className="p-3 flex flex-col items-start cursor-pointer"
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className="flex items-center gap-2 w-full">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
              <p className="text-sm flex-1">{notification.title}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </DropdownMenuItem>
        ))}
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
