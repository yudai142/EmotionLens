'use client';

/**
 * EmotionAlertBanner コンポーネント
 * 閾値を超えた感情アラートを DaisyUI alert スタイルで表示する
 */

import { motion, AnimatePresence } from 'framer-motion';
import { EmotionAlert } from '../../lib/types';
import { EMOTION_CONFIG } from '../../constants/emotions';

interface EmotionAlertBannerProps {
  alert: EmotionAlert | null;
}

const ALERT_CLASSES: Partial<Record<string, string>> = {
  ANGRY: 'alert alert-error',
  STRESSED: 'alert alert-error',
  ANXIOUS: 'alert alert-warning',
  HIDING: 'alert alert-warning',
  HAPPY: 'alert alert-success',
  NEUTRAL: 'alert',
};

export function EmotionAlertBanner({ alert }: EmotionAlertBannerProps) {
  if (!alert) return null;

  const config = EMOTION_CONFIG[alert.label];
  const alertClass = ALERT_CLASSES[alert.label] ?? 'alert alert-warning';

  return (
    <AnimatePresence>
      <motion.div
        key={alert.timestamp}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={alertClass}
        role="alert"
      >
        <span className="font-semibold">{config.displayName}</span>
        <span className="text-sm opacity-80">
          スコア: {Math.round(alert.score * 100)}%
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
