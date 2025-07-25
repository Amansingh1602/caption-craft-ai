import { genkitNextHandler } from '@genkit-ai/next/server';
import '@/ai/flows/generate-caption-prompts';

export const { GET, POST } = genkitNextHandler();
