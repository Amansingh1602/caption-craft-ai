'use client';

import * as React from 'react';
import { History, Wand2 } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { CaptionGenerator } from '@/components/caption-generator';
import { Button } from '@/components/ui/button';

type HistoryItem = {
  id: string;
  type: 'caption';
  query: string;
};

export default function Home() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = React.useState<HistoryItem | null>(null);

  React.useEffect(() => {
    const storedHistory = localStorage.getItem('captionCraftHistory');
    if (storedHistory) {
      // Filter out any non-caption history items from previous versions
      const parsedHistory = JSON.parse(storedHistory).filter((item: any) => item.type === 'caption');
      setHistory(parsedHistory);
    }
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id'>) => {
    setHistory(prevHistory => {
      const newHistory = [{ ...item, id: new Date().toISOString() }, ...prevHistory].slice(0, 20); // Keep last 20
      localStorage.setItem('captionCraftHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedHistory(item);
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('captionCraftHistory');
    setSelectedHistory(null);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Wand2 className="size-6 text-primary" />
            <h1 className="text-lg font-headline font-semibold">CaptionCraft AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="size-4" />
                        <span>Recent</span>
                    </div>
                     {history.length > 0 && <Button variant="ghost" size="sm" onClick={clearHistory} className="h-auto p-1 text-xs">Clear</Button>}
                </SidebarGroupLabel>
                 <SidebarMenu>
                    {history.length > 0 ? (
                        history.map(item => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                            size="sm"
                            className="truncate"
                            onClick={() => handleHistorySelect(item)}
                            isActive={selectedHistory?.id === item.id}
                            >
                            {item.query}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))
                    ) : (
                        <p className="px-2 text-sm text-muted-foreground">No history yet.</p>
                    )}
                 </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">Caption Prompt Generator</h2>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            <CaptionGenerator
                onGenerate={query => addToHistory({ type: 'caption', query })}
                selectedQuery={selectedHistory?.query}
              />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
