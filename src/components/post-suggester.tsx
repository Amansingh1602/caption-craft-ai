'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { suggestPostAction } from '@/lib/actions';
import { PromptCard } from './prompt-card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  category: z.string().min(3, { message: 'Category must be at least 3 characters long.' }),
  preferences: z.string().min(10, { message: 'Preferences must be at least 10 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface PostSuggesterProps {
    onGenerate: (query: string) => void;
    selectedQuery?: string;
}

export function PostSuggester({ onGenerate, selectedQuery }: PostSuggesterProps) {
  const [generatedPrompt, setGeneratedPrompt] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      preferences: '',
    },
  });

  React.useEffect(() => {
    if (selectedQuery) {
      form.setValue('category', selectedQuery);
      form.setValue('preferences', '');
      if(form.formState.isSubmitSuccessful) {
        // Don't clear prompts if we just submitted this form
      } else {
        setGeneratedPrompt(null);
      }
    }
  }, [selectedQuery, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedPrompt(null);
    onGenerate(data.category);

    const result = await suggestPostAction(data);

    if (result.success && result.data) {
      setGeneratedPrompt(result.data);
    } else {
      toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
      });
    }
    
    setIsLoading(false);
  };
  
  const removePrompt = () => {
    setGeneratedPrompt(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 sticky top-24">
            <CardHeader>
                <CardTitle>Suggest a Post</CardTitle>
                <CardDescription>
                    Stuck for ideas? Let the AI suggest a post prompt for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Tech, Travel, Food" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="preferences"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Preferences</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the tone, length, and style you prefer.&#10;e.g., A short, witty post about a new gadget."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Suggest Post
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
                        <h3 className="mt-4 text-xl font-semibold">Generating suggestion...</h3>
                        <p className="mt-2 text-sm text-muted-foreground">The AI is thinking of a great post idea. Please wait.</p>
                    </div>
                )}

                {!isLoading && !generatedPrompt && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <Sparkles className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Your post idea will appear here</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Fill out the form to get started!</p>
                    </div>
                )}
                
                {generatedPrompt && (
                    <PromptCard promptText={generatedPrompt} onClose={removePrompt}/>
                )}
            </div>
        </div>
    </div>
  );
}
