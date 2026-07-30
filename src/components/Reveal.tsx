'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  x = 0,
  y = 0,
  scale = 1,
  once = true,
  mode = 'inView',
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
  once?: boolean;
  mode?: 'inView' | 'mount';
  className?: string;
}) {
  const initial = { opacity: 0, x, y, scale };
  const target = { opacity: 1, x: 0, y: 0, scale: 1 };
  const transition = { duration, delay };

  if (mode === 'mount') {
    return (
      <motion.div initial={initial} animate={target} transition={transition} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div initial={initial} whileInView={target} viewport={{ once }} transition={transition} className={className}>
      {children}
    </motion.div>
  );
}
