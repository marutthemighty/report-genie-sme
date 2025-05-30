
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Check, Trash2, Filter, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';

const Notifications = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Report Generated Successfully',
      message: 'Your Q2 Shopify Sales Performance report has been generated and is ready for review. The report shows a 15% increase in revenue compared to Q1, with mobile traffic being the primary driver of growth.',
      type: 'success',
      timestamp: '2 minutes ago',
      read: false,
      fullContent: 'Your Q2 Shopify Sales Performance report has been generated successfully. Key findings include:\n\n• 15% revenue increase compared to Q1\n• Mobile traffic up 45%\n• Top-performing product: Wireless Headphones\n• Conversion rate improved to 3.8%\n• Recommended actions: Optimize mobile checkout flow and increase inventory for top products.'
    },
    {
      id: '2',
      title: 'Integration Connected',
      message: 'Shopify integration has been successfully connected to your account. You can now sync your store data automatically.',
      type: 'info',
      timestamp: '1 hour ago',
      read: false,
      fullContent: 'Your Shopify integration has been successfully connected. You now have access to:\n\n• Real-time sales data\n• Product performance metrics\n• Customer analytics\n• Inventory tracking\n• Automated report generation\n\nData synchronization will occur every 15 minutes.'
    },
    {
      id: '3',
      title: 'Weekly Report Scheduled',
      message: 'Your weekly analytics report has been scheduled for every Monday at 9:00 AM.',
      type: 'info',
      timestamp: '3 hours ago',
      read: true,
      fullContent: 'Weekly report automation has been set up successfully. You will receive comprehensive analytics reports every Monday at 9:00 AM covering:\n\n• Sales performance\n• Traffic analytics\n• Conversion rates\n• Top products\n• Customer insights\n\nYou can modify this schedule in Settings > Notifications.'
    },
    {
      id: '4',
      title: 'Data Sync Warning',
      message: 'Unable to sync data from Google Analytics. Please check your API key.',
      type: 'warning',
      timestamp: '1 day ago',
      read: true,
      fullContent: 'There was an issue syncing data from your Google Analytics account. This may be due to:\n\n• Expired API credentials\n• Changed account permissions\n• API rate limits\n• Network connectivity issues\n\nPlease go to Integrations > Google Analytics to refresh your connection and API key.'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    if (filter !== 'all') return notif.type === filter;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (selectedNotification) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedNotification(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notifications
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedNotification.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{selectedNotification.timestamp}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getTypeColor(selectedNotification.type)}>
                    {selectedNotification.type}
                  </Badge>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                    {selectedNotification.fullContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <CreateReportModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {filter === 'all' 
                      ? "We'll notify you when something important happens."
                      : `No ${filter} notifications found.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read ? 'border-blue-200 bg-blue-50/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <CreateReportModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Notifications;
