import { CodeBlock } from "@/components/code-block";

export default function TestPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-6 text-2xl font-bold">Syntax Highlighting Test</h1>
      <p className="mb-6 text-muted-foreground">
        This page renders a Java snippet with shiki &quot;git diff&quot;
        notation ({`// [!code ++]`} / {`// [!code --]`} / {`// [!code highlight]`}
        ).
      </p>
      <CodeBlock lang="java">
        {`
public class BuggyProgram {
  public static double bar(int x, int y) {
    if (x != 0) // [!code ++]
      return (y * 1.0 / x);
    else
      return (x * 1.0 / y);
  }

  public static void main(String[] args) { // [!code --]
  public static void main(String[] arg) {   // [!code ++]
    int a = 0;
    int b = Integer.parseInt("123");        // [!code ++]
    // int b = parseInt("123");             // [!code --]

    if (a != 0) // [!code ++]
      System.out.println(bar(b, a));
    else
      System.out.println("Division by zero avoided"); // [!code ++]

    String arg = args[0];
    int c = Integer.parseInt(arg); // [!code ++]
    // int c = parseInt(arg);      // [!code --]

    if (c != 0) // [!code ++]
      System.out.println(bar(a, c));
    else
      System.out.println("Division by zero avoided"); // [!code ++]

    c = b;
    if (c != 0) // [!code ++]
      System.out.println(bar(a, c));
    else
      System.out.println("Division by zero avoided"); // [!code ++]
  }
}
            `}
      </CodeBlock>
    </main>
  );
}