'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { TextMorph } from '@/components/ui/text-morph';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  text: string;
  loadingText: string;
  buttonVariant?:
    | 'default'
    | 'destructive'
    | 'constructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  loadingVariant?:
    | 'default'
    | 'destructive'
    | 'constructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  className?: string;
}

export function SubmitButton({
  text,
  loadingText,
  buttonVariant,
  loadingVariant,
  className,
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        disabled={pending}
        variant={pending ? loadingVariant : buttonVariant}
        className={twMerge(
          pending && 'outline-dashed outline-2 outline-muted-foreground',
          'flex w-fit items-center gap-2 text-sm font-bold md:text-base',
          className,
        )}
      >
        {pending && (
          <Loader
            size={25}
            strokeWidth={2.5}
            className="animate-spin [animation-duration:3s]"
          />
        )}
        <TextMorph>{pending ? `${loadingText}` : `${text}`}</TextMorph>
      </Button>
    </>
  );
}
