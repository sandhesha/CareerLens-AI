import React, { useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

interface NotificationProps {
  type?: "success" | "error" | "info" | "warning" | string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type = "success",
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: FiCheckCircle,
      title: "Success",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-800",
      iconClass: "text-emerald-600",
    },
    error: {
      icon: FiXCircle,
      title: "Error",
      className:
        "border-red-200 bg-red-50 text-red-800",
      iconClass: "text-red-600",
    },
    info: {
      icon: FiInfo,
      title: "Information",
      className:
        "border-blue-200 bg-blue-50 text-blue-800",
      iconClass: "text-blue-600",
    },
    warning: {
      icon: FiAlertTriangle,
      title: "Warning",
      className:
        "border-amber-200 bg-amber-50 text-amber-800",
      iconClass: "text-amber-600",
    },
  };

  // Safely fall back to "success" if an unknown type is received
  const current =
    config[type as keyof typeof config] ?? config.success;

  const Icon = current.icon;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-40px)] max-w-md">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur ${current.className}`}
      >
        <Icon
          className={`mt-0.5 h-6 w-6 shrink-0 ${current.iconClass}`}
        />

        <div className="flex-1">
          <p className="font-semibold">
            {current.title}
          </p>

          <p className="mt-1 text-sm">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;