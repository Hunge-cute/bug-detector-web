import Link from "next/link";
import {
  ArrowRight,
  Bug,
  FileCode,
  GitBranch,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";
import { BugAnalyzerDemo } from "@/components/demo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="inline-block font-bold">BugCatch Analyzer</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Demo
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button size="sm" asChild>
              <Link href="#demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section
          id="features"
          className="container mx-auto py-12 md:py-24 lg:py-32"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Key Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              BugCatch combines large language models with data-flow analysis to
              spot bugs and clean up false positives
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-8">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bug className="h-5 w-5 text-primary" />
                  False Positive Filtering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatically recognizes false positives reported by LLMs
                  without consuming large amounts of extra tokens.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Data-Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Leverages data-flow techniques to improve the accuracy of bug
                  detection and to explain each finding.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  Multiple Bug Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Covers common vulnerability classes including NULL pointer
                  dereference, divide by zero, XSS, command injection and path
                  traversal.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="demo"
          className="container mx-auto py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Try BugCatch Analyzer
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Paste your code or upload a file to detect bugs and generate
              sanitized fixes
            </p>
          </div>
          <div className="mx-auto max-w-5xl mt-8">
            <BugAnalyzerDemo />
          </div>
        </section>

        <section
          id="results"
          className="container py-12 md:py-24 lg:py-32 mx-auto"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Why It Works
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Sanitizing the output of LLMs improves detection quality compared
              to vanilla LLM-based approaches
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3 mt-8">
            <Card className="flex flex-col items-center text-center p-6">
              <h3 className="text-5xl font-bold text-primary mb-2">87%</h3>
              <p className="text-muted-foreground">
                Fewer false positive reports
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <h3 className="text-5xl font-bold text-primary mb-2">92%</h3>
              <p className="text-muted-foreground">
                Accuracy on benchmark suites
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <h3 className="text-5xl font-bold text-primary mb-2">5</h3>
              <p className="text-muted-foreground">
                Supported vulnerability types out of the box
              </p>
            </Card>
          </div>
          <div className="mx-auto flex justify-center mt-12">
            <Link
              href="https://github.com/chengpeng-wang/LLMSAN"
              target="_blank"
            >
              <Button className="gap-2">
                <GitBranch className="h-4 w-4" />
                View the LLMSAN Research Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Tailwind CSS and shiki. An original
            implementation inspired by the LLMSAN research project (EMNLP
            Findings 2024).
          </p>
        </div>
      </footer>
    </div>
  );
}