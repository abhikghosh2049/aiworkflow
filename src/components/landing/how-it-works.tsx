import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Cpu, Eye } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "1",
      icon: <UploadCloud className="w-8 h-8" />,
      title: "Upload Your Document",
      description: "Securely upload your document in various formats. Our system is ready to handle your data with care.",
    },
    {
      step: "2",
      icon: <Cpu className="w-8 h-8" />,
      title: "AI Processing",
      description: "Our autonomous AI gets to work, summarizing the content and identifying key patterns and insights.",
    },
    {
      step: "3",
      icon: <Eye className="w-8 h-8" />,
      title: "View & Utilize",
      description: "Access the generated summary and actionable insights in your dashboard. Share, save, or delve deeper.",
    },
  ];

  return (
    <section id="how-it-works" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        How It{" "}
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Works
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-16 text-xl text-muted-foreground">
        Transform your documents into insights in just three simple steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map(({ step, icon, title, description }) => (
          <Card key={step} className="relative flex flex-col items-center p-6 text-center shadow-lg transition-transform transform hover:-translate-y-2">
            <div className="absolute -top-6 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              {step}
            </div>
            <div className="mt-8 mb-4 text-accent">{icon}</div>
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
