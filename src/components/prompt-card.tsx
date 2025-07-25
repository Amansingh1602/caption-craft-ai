'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, X } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface PromptCardProps {
  promptText: string;
  onClose?: () => void;
}

export function PromptCard({ promptText, onClose }: PromptCardProps) {
  const [isCopied, copy] = useCopyToClipboard();

  return (
    <Card className="data-[state=new]:animate-in data-[state=new]:fade-in-0" data-state="new">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <p className="text-sm flex-1">{promptText}</p>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copy(promptText, 'Prompt copied!')}
            aria-label="Copy prompt"
            className="shrink-0"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close prompt"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
