import { createHighlighter, makeSingletonHighlighter } from "shiki";

const getHighlighter = makeSingletonHighlighter(createHighlighter);

export const highlightCode = async ({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) => {
  const highlighter = await getHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [lang],
  });

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });
};