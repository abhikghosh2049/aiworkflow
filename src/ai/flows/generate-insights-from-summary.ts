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

const InsightSchema = z.object({
  insight: z.string().describe('A single, specific insight.'),
  relevanceScore: z
    .number()
    .min(1)
    .max(10)
    .describe(
      'A score from 1-10 indicating the relevance and importance of the insight.'
    ),
});

const GenerateInsightsFromSummaryOutputSchema = z.object({
  insights: z
    .array(InsightSchema)
    .describe('An array of key insights generated from the document summary.'),
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

  Given the following summary, identify and extract 3 to 5 of the most important and actionable insights. For each insight, provide a relevance score from 1 (least relevant) to 10 (most relevant).

  Summary: {{{summary}}}
  `,
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
