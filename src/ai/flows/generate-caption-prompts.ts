'use server';

/**
 * @fileOverview A caption prompt generator AI agent.
 *
 * - generateCaptionPrompts - A function that handles the caption prompt generation process.
 * - GenerateCaptionPromptsInput - The input type for the generateCaptionPrompts function.
 * - GenerateCaptionPromptsOutput - The return type for the generateCaptionPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionPromptsInputSchema = z.object({
  topic: z.string().describe('The topic or theme for which to generate caption prompts.'),
  tone: z.string().optional().describe('The desired tone of the caption prompts (e.g., funny, serious, inspirational).'),
  length: z.string().optional().describe('The desired length of the caption prompts (e.g., short, medium, long).'),
  style: z.string().optional().describe('The desired style of the caption prompts (e.g., poetic, informative, engaging).'),
  platform: z.string().optional().describe('The social media platform for which the caption prompts are intended (e.g., Instagram, Twitter, Facebook).'),
  numPrompts: z.number().optional().default(3).describe('The number of caption prompts to generate.'),
});
export type GenerateCaptionPromptsInput = z.infer<typeof GenerateCaptionPromptsInputSchema>;

const GenerateCaptionPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of generated caption prompts.'),
});
export type GenerateCaptionPromptsOutput = z.infer<typeof GenerateCaptionPromptsOutputSchema>;

export async function generateCaptionPrompts(input: GenerateCaptionPromptsInput): Promise<GenerateCaptionPromptsOutput> {
  return generateCaptionPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPromptsPrompt',
  input: {schema: GenerateCaptionPromptsInputSchema},
  output: {schema: GenerateCaptionPromptsOutputSchema},
  prompt: `You are a social media expert. Generate {{numPrompts}} creative and engaging caption prompts for the following topic or theme:

Topic: {{{topic}}}

{{#if tone}}Tone: {{{tone}}}{{/if}}
{{#if length}}Length: {{{length}}}{{/if}}
{{#if style}}Style: {{{style}}}{{/if}}
{{#if platform}}Platform: {{{platform}}}{{/if}}

Format the response as a JSON object with a "prompts" key containing an array of strings. Each string should be a caption prompt.
`,
});

const generateCaptionPromptsFlow = ai.defineFlow(
  {
    name: 'generateCaptionPromptsFlow',
    inputSchema: GenerateCaptionPromptsInputSchema,
    outputSchema: GenerateCaptionPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
