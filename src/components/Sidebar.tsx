
import { useState, useCallback } from 'react';
import { BarChart3, FileText, Settings, Plus, Home, Database, Bell, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';

interface SidebarProps {
  onCreateReport?: () => void;
}

const Sidebar = ({ onCreateReport }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/reports') return 'reports';
    if (path === '/settings') return 'settings';
    if (path === '/integrations') return 'integrations';
    if (path === '/notifications') return 'notifications';
    if (path === '/help') return 'help';
    return 'dashboard';
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'create', label: 'Create Report', icon: Plus, action: 'create' },
    { id: 'integrations', label: 'Integrations', icon: Database, path: '/integrations' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help' },
  ];

  const handleCreateReport = useCallback(() => {
    console.log('Create Report clicked from Sidebar');
    if (onCreateReport) {
      console.log('Calling onCreateReport callback');
      onCreateReport();
    } else {
      console.log('No onCreateReport callback, navigating to dashboard');
      // If no callback provided, navigate to dashboard and trigger creation there
      navigate('/', { state: { openCreateModal: true } });
    }
  }, [onCreateReport, navigate]);

  const handleItemClick = (item: typeof menuItems[0]) => {
    console.log('Menu item clicked:', item.id);
    
    if (item.action === 'create') {
      handleCreateReport();
      return;
    }
    
    setActiveItem(item.id);
    
    if (item.path) {
      navigate(item.path);
    }
  };

  const getDisplayName = () => {
    if (!user?.email) return 'User';
    return user.user_metadata?.first_name && user.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user.email.split('@')[0];
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">ReportAI</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Analytics Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeItem === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <UserDropdown />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{getDisplayName()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
