'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCaptionsAction } from '@/lib/actions';
import { PromptCard } from './prompt-card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  tone: z.string().optional(),
  length: z.string().optional(),
  style: z.string().optional(),
  platform: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CaptionGeneratorProps {
    onGenerate: (query: string) => void;
    selectedQuery?: string;
}

export function CaptionGenerator({ onGenerate, selectedQuery }: CaptionGeneratorProps) {
  const [generatedPrompts, setGeneratedPrompts] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      tone: 'engaging',
      length: 'short',
      style: 'creative',
      platform: 'instagram',
    },
  });

  React.useEffect(() => {
    if (selectedQuery) {
      form.setValue('topic', selectedQuery);
      setGeneratedPrompts([]);
    }
  }, [selectedQuery, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedPrompts([]);
    onGenerate(data.topic);

    const result = await generateCaptionsAction({ ...data, numPrompts: 5 });

    if (result.success && result.data) {
      setGeneratedPrompts(result.data);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
        });
    }

    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 sticky top-24">
            <CardHeader>
                <CardTitle>Customize Prompt</CardTitle>
                <CardDescription>
                    Tailor the AI to generate the perfect caption prompts for your needs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Topic or Theme</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Summer vacation photos" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField control={form.control} name="tone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="funny">Funny</SelectItem>
                                        <SelectItem value="inspirational">Inspirational</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="engaging">Engaging</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="length" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a length" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                                        <SelectItem value="medium">Medium (3-4 sentences)</SelectItem>
                                        <SelectItem value="long">Long (5+ sentences)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="style" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Style</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="creative">Creative</SelectItem>
                                        <SelectItem value="informative">Informative</SelectItem>
                                        <SelectItem value="question">Question-based</SelectItem>
                                        <SelectItem value="storytelling">Storytelling</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate Prompts
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="lg:col-span-2">
            <div className="space-y-4">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Generating prompts...</h3>
                        <p className="mt-2 text-sm text-muted-foreground">The AI is crafting some ideas for you. Please wait.</p>
                    </div>
                )}

                {!isLoading && generatedPrompts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <Sparkles className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Your prompts will appear here</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Fill out the form to get started!</p>
                    </div>
                )}
                
                {generatedPrompts.length > 0 && (
                     <div className="grid grid-cols-1 gap-4">
                        {generatedPrompts.map((prompt, index) => (
                            <PromptCard key={index} promptText={prompt} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
