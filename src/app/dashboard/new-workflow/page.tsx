'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateInsightsFromSummary } from '@/ai/flows/generate-insights-from-summary';
import { Loader2, FileText, Lightbulb } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  document: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'A document is required.')
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      `Max file size is 5MB.`
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewWorkflowPage() {
  const { toast } = useToast();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [insights, setInsights] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: undefined,
    },
  });
  const fileRef = form.register('document');

  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: FormValues) => {
    const file = data.document[0];
    if (!file) return;

    setIsProcessing(true);
    setSummary(null);
    setInsights(null);

    try {
      const documentDataUri = await readFileAsDataURI(file);

      // Step 1: Summarize Document
      const summaryResult = await summarizeDocument({ documentDataUri });
      setSummary(summaryResult.summary);
      toast({
        title: 'Summary Generated',
        description: 'The document summary has been successfully created.',
      });

      // Step 2: Generate Insights from Summary
      const insightsResult = await generateInsightsFromSummary({
        summary: summaryResult.summary,
      });
      setInsights(insightsResult.insights);
      toast({
        title: 'Insights Generated',
        description:
          'Key insights have been successfully extracted from the summary.',
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not process the document. ${errorMessage}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Workflow</CardTitle>
          <CardDescription>
            Upload a document to generate a summary and extract key insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Upload a document"
                        {...fileRef}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a document file (e.g., PDF, TXT, DOCX). Max 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isProcessing ? 'Processing...' : 'Generate'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(summary || insights) && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Results</CardTitle>
            <CardDescription>
              Review the generated summary and insights below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {summary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3>Summary</h3>
                </div>
                <p className="text-muted-foreground">{summary}</p>
              </div>
            )}
            {summary && insights && <Separator />}
            {insights && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3>Key Insights</h3>
                </div>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
