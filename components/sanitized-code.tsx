"use client";

import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { codeToHtml } from "shiki";
import { transformerNotationDiff } from "@shikijs/transformers";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function SanitizedCode({ code }: { code: string }) {
  const [html, setHtml] = useState("");
  const { isCopied, handleCopy } = useCopyToClipboard({ text: code });

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      const result = await codeToHtml(code, {
        lang: "java",
        theme: "github-light",
        transformers: [transformerNotationDiff()],
      });
      if (!cancelled) setHtml(result);
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (code.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <Wand2 className="h-12 w-12 mb-4" />
        <p>No sanitized code generated yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 gap-1.5"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {isCopied ? "Copied" : "Copy"}
      </Button>
      <div
        className="[&>pre]:overflow-x-auto [&>pre]:!bg-background [&>pre]:py-3 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}