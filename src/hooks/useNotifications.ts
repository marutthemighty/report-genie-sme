
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  updated_at: string;
}

// Database response type (with string type instead of union)
interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform database response to match our interface
      const transformedData: Notification[] = (data || []).map((row: NotificationRow) => ({
        ...row,
        type: ['success', 'info', 'warning', 'error'].includes(row.type) 
          ? row.type as 'success' | 'info' | 'warning' | 'error'
          : 'info'
      }));
      
      setNotifications(transformedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('app_notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      
      toast({
        title: "All notifications marked as read",
        description: "All your notifications have been marked as read.",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('app_notifications')
        .insert([{
          ...notification,
          user_id: 'current-user-id' // This would be actual user ID in real app
        }])
        .select()
        .single();

      if (error) throw error;

      // Transform the response
      const transformedData: Notification = {
        ...data,
        type: ['success', 'info', 'warning', 'error'].includes(data.type) 
          ? data.type as 'success' | 'info' | 'warning' | 'error'
          : 'info'
      };

      setNotifications(prev => [transformedData, ...prev]);
      return transformedData;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refetch: fetchNotifications
  };
};
