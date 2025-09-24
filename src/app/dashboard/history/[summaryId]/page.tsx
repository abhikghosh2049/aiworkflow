
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Lightbulb,
  Loader2,
  Trash2,
  Edit,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { doc, collection } from 'firebase/firestore';
import {
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SummaryDetailPage() {
  const { summaryId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const summaryRef = useMemoFirebase(() => {
    if (!user || !summaryId) return null;
    return doc(
      firestore,
      'users',
      user.uid,
      'summaries',
      summaryId as string
    );
  }, [firestore, user, summaryId]);

  const insightsRef = useMemoFirebase(() => {
    if (!user || !summaryId) return null;
    return collection(
      firestore,
      'users',
      user.uid,
      'summaries',
      summaryId as string,
      'insights'
    );
  }, [firestore, user, summaryId]);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useDoc(summaryRef);
  const {
    data: insights,
    isLoading: areInsightsLoading,
    error: insightsError,
  } = useCollection(insightsRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (summary) {
      form.reset({
        title: summary.title,
        content: summary.content,
      });
    }
  }, [summary, form]);

  const handleDelete = () => {
    if (summaryRef) {
      deleteDocumentNonBlocking(summaryRef);
      toast({
        title: 'Summary Deleted',
        description: 'The summary has been successfully deleted.',
      });
      // Note: Navigation would happen here, but router is not available.
      // In a full app, you would redirect the user.
      window.location.href = '/dashboard/history';
    }
  };

  const handleUpdate = (data: FormValues) => {
    if (summaryRef) {
      updateDocumentNonBlocking(summaryRef, {
        ...data,
        modifiedAt: new Date().toISOString(),
      });
      toast({
        title: 'Summary Updated',
        description: 'The summary has been successfully updated.',
      });
      setIsEditDialogOpen(false);
    }
  };

  if (isSummaryLoading || areInsightsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (summaryError || insightsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            There was an error loading the data. It's possible you don't have
            permission to view this.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {summaryError?.message || insightsError?.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested summary could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{summary.title}</CardTitle>
            <CardDescription>
              Created on:{' '}
              {new Date(summary.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Summary</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Summary</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleUpdate)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="h-48" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                       <DialogClose asChild>
                         <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Summary</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the summary and its associated insights.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            <h3>Summary</h3>
          </div>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {summary.content}
          </p>
        </div>
        
        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3>Key Insights</h3>
          </div>
          {areInsightsLoading ? (
            <p>Loading insights...</p>
          ) : insights && insights.length > 0 ? (
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: insights[0].content.replace(/\n/g, '<br />'),
              }}
            />
          ) : (
            <p className="text-muted-foreground">No insights found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
