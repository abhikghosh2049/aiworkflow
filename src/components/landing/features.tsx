import {
  Bot,
  FileText,
  Lightbulb,
  LayoutDashboard,
  History,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Bot />,
    title: "Autonomous Workflow",
    description: "Fully autonomous AI workflow from data input to insight generation, powered by OpenAI.",
  },
  {
    icon: <FileText />,
    title: "AI-Powered Summarization",
    description: "Generate concise, accurate summaries of your documents in seconds.",
  },
  {
    icon: <Lightbulb />,
    title: "Insight Generation",
    description: "Extract key insights and actionable intelligence from your content with advanced AI reasoning.",
  },
  {
    icon: <LayoutDashboard />,
    title: "User-Friendly Dashboard",
    description: "Interact with your summaries and insights through a secure, intuitive dashboard.",
  },
  {
    icon: <History />,
    title: "Summarization History",
    description: "Access, modify, or delete your past summarizations in your personal library.",
  },
  {
    icon: <ShieldCheck />,
    title: "Secure Authentication",
    description: "Protect your sensitive data with robust user authentication and privacy controls.",
  },
];

export function Features() {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8 bg-muted/30 rounded-lg">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Key{" "}
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Features
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="bg-card hover:bg-muted/50 transition-colors shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  {icon}
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="pt-2">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
