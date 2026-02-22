"use client";

import { useState, useEffect, useRef } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  isClosing?: boolean;
}

interface NotificationManagerProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationIdRef = useRef(0);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = `notification-${notificationIdRef.current++}`;
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);

    // 自动移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 3000);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isClosing: true }
          : notification
      )
    );
    
    // 等待动画完成后移除
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 300);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 提供通知方法给全局使用
  useEffect(() => {
    // @ts-expect-error
    window.addNotification = addNotification;
    // @ts-expect-error
    window.removeNotification = removeNotification;
    // @ts-expect-error
    window.clearAllNotifications = clearAllNotifications;

    return () => {
      // @ts-expect-error
      delete window.addNotification;
      // @ts-expect-error
      delete window.removeNotification;
      // @ts-expect-error
      delete window.clearAllNotifications;
    };
  }, [addNotification]);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
              notification.isClosing
                ? 'translate-x-full opacity-0'
                : 'translate-x-0 opacity-100 animate-slide-in-right'
            } ${
              notification.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 shadow-green-100"
                : notification.type === "error"
                ? "bg-red-50 border-l-4 border-red-500 shadow-red-100"
                : notification.type === "warning"
                ? "bg-yellow-50 border-l-4 border-yellow-500 shadow-yellow-100"
                : "bg-blue-50 border-l-4 border-blue-500 shadow-blue-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <span className="mr-3 text-xl flex-shrink-0">
                  {notification.type === "success" && "✅"}
                  {notification.type === "error" && "❌"}
                  {notification.type === "warning" && "⚠️"}
                  {notification.type === "info" && "ℹ️"}
                </span>
                <p className={`font-medium ${
                  notification.type === "success"
                    ? "text-green-800"
                    : notification.type === "error"
                    ? "text-red-800"
                    : notification.type === "warning"
                    ? "text-yellow-800"
                    : "text-blue-800"
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2 flex-shrink-0"
                aria-label="关闭通知"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// 工具函数
export const notify = {
  success: (message: string, duration?: number) => {
    // @ts-expect-error
    return window.addNotification?.({ type: "success", message, duration });
  },
  error: (message: string, duration?: number) => {
    // @ts-expect-error
    return window.addNotification?.({ type: "error", message, duration });
  },
  warning: (message: string, duration?: number) => {
    // @ts-expect-error
    return window.addNotification?.({ type: "warning", message, duration });
  },
  info: (message: string, duration?: number) => {
    // @ts-expect-error
    return window.addNotification?.({ type: "info", message, duration });
  },
};
