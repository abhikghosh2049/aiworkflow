import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewWorkflowPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Workflow</CardTitle>
        <CardDescription>
          This is where you will create new workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to create a new workflow will be here.</p>
      </CardContent>
    </Card>
  );
}
