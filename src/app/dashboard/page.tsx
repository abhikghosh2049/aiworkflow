import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <FilePlus2 className="mx-auto h-12 w-12 text-gray-400" />
          <CardTitle className="mt-4 text-2xl font-bold">
            Create a New Workflow
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Start by creating a new workflow to automate your tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/new-workflow">New Workflow</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
