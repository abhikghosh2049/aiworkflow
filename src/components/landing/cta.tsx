import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export function Cta() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <Card className="bg-primary text-primary-foreground text-center p-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            Ready to Revolutionize Your Workflow?
          </CardTitle>
          <CardDescription className="text-lg text-primary-foreground/80 mt-2">
            Join now and start transforming your documents into actionable intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90" size="lg">
            <Link href="/login">Start Your Free Trial</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
