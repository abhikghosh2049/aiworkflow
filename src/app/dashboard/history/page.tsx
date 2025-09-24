import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow History</CardTitle>
        <CardDescription>
          This is where you can see your past workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>A table of past workflow runs will be here.</p>
      </CardContent>
    </Card>
  );
}
