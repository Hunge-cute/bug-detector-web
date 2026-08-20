import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SanitizedCode } from "./sanitized-code";

export function TabSanitized({ code }: { code: string }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sanitized</CardTitle>
        <CardDescription>
          Sanitized code with fixes applied to detected bugs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SanitizedCode code={code} />
      </CardContent>
    </Card>
  );
}