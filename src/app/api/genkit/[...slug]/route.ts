'use server';

import { genkitNextHandler } from '@genkit-ai/next';
import '@/ai/flows/generate-caption-prompts';

export const {GET, POST} = genkitNextHandler();
