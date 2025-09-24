
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const summariesRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'summaries');
  }, [firestore, user]);

  const { data: summaries, isLoading } = useCollection(summariesRef);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow History</CardTitle>
        <CardDescription>
          Here you can see, edit, and delete your past summarizations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {!isLoading && summaries && summaries.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map((summary) => (
                <TableRow key={summary.id}>
                  <TableCell className="font-medium">{summary.title}</TableCell>
                  <TableCell>
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(summary.modifiedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/history/${summary.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && (!summaries || summaries.length === 0) && (
          <div className="text-center p-8 border-dashed border-2 rounded-md">
            <p className="text-muted-foreground">
              You haven&apos;t created any workflows yet.
            </p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/dashboard/new-workflow">Create one now</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
