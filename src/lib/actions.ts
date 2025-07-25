'use server';

import { generateCaptionPrompts, GenerateCaptionPromptsInput, GenerateCaptionPromptsOutput } from '@/ai/flows/generate-caption-prompts';

export async function generateCaptionsAction(input: GenerateCaptionPromptsInput) {
    try {
        const result:GenerateCaptionPromptsOutput = await generateCaptionPrompts(input);
        return { success: true, data: result.prompts };
    } catch (error) {
        console.error('Error in generateCaptionsAction:', error);
        return { success: false, error: 'Failed to generate captions. Please try again.' };
    }
}
