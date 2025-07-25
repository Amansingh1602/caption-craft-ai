'use server';

import {createNextHandler} from '@genkit-ai/next';
import '@/ai/flows/generate-caption-prompts';

export const {GET, POST} = createNextHandler();
