
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
import { generateInsightsFromSummary, type GenerateInsightsFromSummaryOutput } from '@/ai/flows/generate-insights-from-summary';
import { Loader2, FileText, Lightbulb, BarChart2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts"
import { ChartContainer } from '@/components/ui/chart';


const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .max(100, 'Title must be less than 100 characters.'),
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
  const { user } = useUser();
  const firestore = useFirestore();

  const [summary, setSummary] = React.useState<string | null>(null);
  const [insights, setInsights] = React.useState<GenerateInsightsFromSummaryOutput['insights'] | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      document: undefined,
    },
  });
  const fileRef = form.register('document');

    const chartData = React.useMemo(() => {
        if (!insights) return [];
        return insights.map((insight, index) => ({
        name: `Insight ${index + 1}`,
        relevance: insight.relevanceScore,
        content: insight.insight
        }));
    }, [insights]);

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
    if (!file || !user) return;

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

      // Step 3: Save to Firestore
      const summariesRef = collection(firestore, 'users', user.uid, 'summaries');
      const now = new Date().toISOString();
      const newSummaryDoc = await addDocumentNonBlocking(summariesRef, {
        userId: user.uid,
        title: data.title,
        content: summaryResult.summary,
        createdAt: now,
        modifiedAt: now,
      });

      if (newSummaryDoc) {
        const insightsRef = collection(newSummaryDoc, 'insights');
        for (const insight of insightsResult.insights) {
            await addDocumentNonBlocking(insightsRef, {
                content: insight.insight,
                relevanceScore: insight.relevanceScore,
                summaryId: newSummaryDoc.id,
            });
        }
      }

      toast({
        title: 'Workflow Complete',
        description:
          'Summary and insights have been generated and saved to your history.',
      });

      // Reset form
      form.reset();

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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Q3 Financial Report"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your workflow a title to easily identify it later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isProcessing || !user}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isProcessing ? 'Processing...' : 'Generate'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isProcessing || summary || insights) && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Results</CardTitle>
            <CardDescription>
              Review the generated summary and insights below. Results are automatically saved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {isProcessing && !summary && (
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <h3>Generating Summary...</h3>
                </div>
            )}
            {summary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3>Summary</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
              </div>
            )}
            {summary && <Separator />}
             {isProcessing && summary && !insights && (
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <h3>Generating Insights...</h3>
                </div>
            )}
            {insights && (
                <>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3>Key Insights</h3>
                    </div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                        {insights.map((insight, index) => (
                            <li key={index}>
                                {insight.insight} (Relevance: {insight.relevanceScore})
                            </li>
                        ))}
                    </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        <h3>Insight Relevance</h3>
                    </div>
                    {chartData.length > 0 ? (
                        <ChartContainer config={{
                            relevance: {
                                label: "Relevance",
                                color: "hsl(var(--primary))",
                            },
                        }} className="h-64 w-full">
                          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="name"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                            />
                            <YAxis dataKey="relevance" domain={[0, 10]} />
                            <Tooltip
                              cursor={false}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                       <p className="font-bold">{`${data.name}: ${data.relevance}`}</p>
                                       <p className="text-sm text-muted-foreground max-w-xs">{data.content}</p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="relevance" fill="var(--color-relevance)" radius={4} />
                          </BarChart>
                        </ChartContainer>
                      ) : (
                         <div className="flex h-64 items-center justify-center border-dashed border-2 rounded-md">
                            <p className="text-muted-foreground">No insight data to display.</p>
                         </div>
                      )}
                </div>
                </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
