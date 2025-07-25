'use server';

import { generateCaptionPrompts, GenerateCaptionPromptsInput } from '@/ai/flows/generate-caption-prompts';
import { suggestPostPrompts, SuggestPostPromptsInput } from '@/ai/flows/suggest-post-prompts';

export async function generateCaptionsAction(input: GenerateCaptionPromptsInput) {
    try {
        const result = await generateCaptionPrompts(input);
        return { success: true, data: result.prompts };
    } catch (error) {
        console.error('Error in generateCaptionsAction:', error);
        return { success: false, error: 'Failed to generate captions. Please try again.' };
    }
}

export async function suggestPostAction(input: SuggestPostPromptsInput) {
    try {
        const result = await suggestPostPrompts(input);
        return { success: true, data: result.prompt };
    } catch (error) {
        console.error('Error in suggestPostAction:', error);
        return { success: false, error: 'Failed to suggest post prompt. Please try again.' };
    }
}
