'use server';

/**
 * @fileOverview Generates key insights from a document summary using AI.
 *
 * - generateInsightsFromSummary - A function that generates insights from a given summary.
 * - GenerateInsightsFromSummaryInput - The input type for the generateInsightsFromSummary function.
 * - GenerateInsightsFromSummaryOutput - The return type for the generateInsightsFromSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsFromSummaryInputSchema = z.object({
  summary: z
    .string()
    .describe('The summary of the document from which to generate insights.'),
});
export type GenerateInsightsFromSummaryInput = z.infer<
  typeof GenerateInsightsFromSummaryInputSchema
>;

const GenerateInsightsFromSummaryOutputSchema = z.object({
  insights: z
    .string()
    .describe('The key insights generated from the document summary.'),
});
export type GenerateInsightsFromSummaryOutput = z.infer<
  typeof GenerateInsightsFromSummaryOutputSchema
>;

export async function generateInsightsFromSummary(
  input: GenerateInsightsFromSummaryInput
): Promise<GenerateInsightsFromSummaryOutput> {
  return generateInsightsFromSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsFromSummaryPrompt',
  input: {schema: GenerateInsightsFromSummaryInputSchema},
  output: {schema: GenerateInsightsFromSummaryOutputSchema},
  prompt: `You are an expert AI assistant specializing in generating key insights from document summaries.

  Given the following summary, identify the most important and actionable insights.

  Summary: {{{summary}}}

  Insights:`,
});

const generateInsightsFromSummaryFlow = ai.defineFlow(
  {
    name: 'generateInsightsFromSummaryFlow',
    inputSchema: GenerateInsightsFromSummaryInputSchema,
    outputSchema: GenerateInsightsFromSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
