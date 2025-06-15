
import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  postfix?: string;
  locale?: string;
  fractionDigits?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  postfix = '',
  locale = 'en-US',
  fractionDigits = 2,
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const formatted = latest.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    return `${prefix}${formatted}${postfix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.0, 0.7, 0.2, 1.0],
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedCounter;
