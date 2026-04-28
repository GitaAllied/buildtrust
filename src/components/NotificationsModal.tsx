import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trash2, Bell } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type?: string;
  [key: string]: any;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationsChange: (notifications: Notification[]) => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onNotificationsChange,
}: NotificationsModalProps) {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.unread) return;

    try {
      await apiClient.markNotificationAsRead(notification.id);
      const updated = notifications.map((n) =>
        n.id === notification.id ? { ...n, unread: false } : n
      );
      onNotificationsChange(updated);
      console.log(`✅ Notification ${notification.id} marked as read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (notification: Notification) => {
    try {
      setIsDeleting(true);
      await apiClient.deleteNotification(notification.id);
      const filtered = notifications.filter((n) => n.id !== notification.id);
      onNotificationsChange(filtered);
      console.log(`🗑️ Notification ${notification.id} deleted`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.unread);
      await Promise.all(
        unreadNotifications.map((notif) =>
          apiClient.markNotificationAsRead(notif.id).catch(() => null)
        )
      );
      const updated = notifications.map((n) => ({ ...n, unread: false }));
      onNotificationsChange(updated);
      console.log(`✅ All notifications marked as read`);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;

    try {
      setIsDeleting(true);
      await Promise.all(
        notifications.map((notif) =>
          apiClient.deleteNotification(notif.id).catch(() => null)
        )
      );
      onNotificationsChange([]);
      console.log(`🗑️ All notifications deleted`);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-[#226F75]" />
            <div>
              <h2 className="text-lg font-bold text-[#253E44]">All Notifications</h2>
              <p className="text-xs text-gray-500">
                {notifications.length} total • {notifications.filter((n) => n.unread).length} unread
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onMouseEnter={() => setHoveredId(notification.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer relative group ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 pt-1">
                      {notification.unread && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#253E44] truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <p className="text-xs text-gray-400">{notification.time}</p>
                            {notification.type && (
                              <Badge className="text-xs bg-[#226F75]/10 text-[#226F75]">
                                {notification.type.replace(/_/g, ' ')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete button on hover */}
                    {hoveredId === notification.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification);
                        }}
                        disabled={isDeleting}
                        className="flex-shrink-0 p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={!notifications.some((n) => n.unread)}
                  className="text-xs"
                >
                  Mark All as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete All
                </Button>
              </>
            )}
          </div>
          <Button
            onClick={onClose}
            className="text-xs bg-[#226F75] hover:bg-[#226F75]/90"
            size="sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
