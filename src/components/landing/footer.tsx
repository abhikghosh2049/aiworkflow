import { Bot, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Bot className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} AI Workflow Hub. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
