'use server';
/**
 * @fileOverview Suggests post prompts based on user-defined categories and preferences.
 *
 * - suggestPostPrompts - A function that suggests post prompts.
 * - SuggestPostPromptsInput - The input type for the suggestPostPrompts function.
 * - SuggestPostPromptsOutput - The return type for the suggestPostPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestPostPromptsInputSchema = z.object({
  category: z.string().describe('The category of the post prompt.'),
  preferences: z.string().describe('The user preferences for the post prompt, such as tone, length, and style.'),
});
export type SuggestPostPromptsInput = z.infer<typeof SuggestPostPromptsInputSchema>;

const SuggestPostPromptsOutputSchema = z.object({
  prompt: z.string().describe('The suggested post prompt.'),
});
export type SuggestPostPromptsOutput = z.infer<typeof SuggestPostPromptsOutputSchema>;

export async function suggestPostPrompts(input: SuggestPostPromptsInput): Promise<SuggestPostPromptsOutput> {
  return suggestPostPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostPromptsPrompt',
  input: {schema: SuggestPostPromptsInputSchema},
  output: {schema: SuggestPostPromptsOutputSchema},
  prompt: `Suggest a post prompt based on the following category and preferences:\n\nCategory: {{{category}}}\nPreferences: {{{preferences}}}`,
});

const suggestPostPromptsFlow = ai.defineFlow(
  {
    name: 'suggestPostPromptsFlow',
    inputSchema: SuggestPostPromptsInputSchema,
    outputSchema: SuggestPostPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
