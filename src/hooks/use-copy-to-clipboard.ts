'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copy = useCallback((text: string, successMessage: string = 'Copied to clipboard!') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast({
        description: successMessage,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: 'destructive',
            title: 'Copy Failed',
            description: 'Could not copy text to clipboard.',
        });
    });
  }, [toast]);

  return [isCopied, copy] as const;
}
