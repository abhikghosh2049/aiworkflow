import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export function Hero() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === "hero-abstract-ai"
  );

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Automate, Summarize,
            </span>{" "}
            and Discover
          </h1>{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Insights with AI
            </span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Unlock the power of your documents. Our autonomous AI workflow transforms raw data into concise summaries and actionable intelligence, effortlessly.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3 text-lg">Get Started</Button>
          <Button
            asChild
            variant="outline"
            className="w-full md:w-1/3 text-lg"
          >
            <Link href="#how-it-works">
              Learn More
            </Link>
          </Button>
        </div>
      </div>

      <div className="z-10">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={1280}
            height={800}
            data-ai-hint={heroImage.imageHint}
            className="rounded-lg shadow-2xl"
          />
        )}
      </div>
    </section>
  );
}
