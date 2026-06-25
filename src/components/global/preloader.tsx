'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Preloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleComplete = () => {
      timer = setTimeout(() => setIsLoading(false), 600);
    };

    if (document.readyState === 'complete') {
      timer = setTimeout(() => setIsLoading(false), 600);
    } else {
      window.addEventListener('load', handleComplete);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/logo.png"
                alt="LoftCommunity"
                width={140}
                height={48}
                className="object-contain"
                priority
              />
            </motion.div>

            <div className="mt-10 h-[3px] w-52 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  );
}
