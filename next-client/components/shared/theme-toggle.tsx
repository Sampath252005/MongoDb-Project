'use client';

import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

interface ThemeToggleProps {
  className?: string;
  type?: 'icon' | 'button';
}

export function ThemeToggle({ className, type = 'button' }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>
        {type === 'button' ? (
          <Button
            variant='ghost'
            className={cn('w-full justify-between items-center', className)}
            aria-label='Theme'
          >
            <span>Theme</span>
            <Sun className='h-4 w-4' />
          </Button>
        ) : (
          <Button
            variant='ghost'
            size='icon'
            className={cn('h-9 w-9', className)}
            aria-label='Theme'
          >
            <Sun className='h-4 w-4' />
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      {type === 'button' ? (
        <Button
          variant='ghost'
          className={cn('w-full justify-between items-center', className)}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label='Theme'
        >
          <span>Theme</span>
          {resolvedTheme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
        </Button>
      ) : (
        <Button
          variant='ghost'
          size='icon'
          className={cn('h-9 w-9', className)}
          aria-label='Toggle theme'
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
        </Button>
      )}
    </>
  );
}
