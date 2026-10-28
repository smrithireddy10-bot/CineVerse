import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} className="toast-icon" />,
  error: <AlertCircle size={18} className="toast-icon" />,
  info: <Info size={18} className="toast-icon" />,
};

const Toast = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          {ICONS[t.type] || ICONS.info}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
