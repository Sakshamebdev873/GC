"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center gap-4 py-32 text-center">
      <p className="text-sm font-semibold text-accent">Error</p>
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-muted">
        We hit an unexpected error loading this page. You can try again, or
        head back to the homepage.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="ghost">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}
