import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-32 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to Home</Button>
        <Button href="/services" variant="ghost">
          View Services
        </Button>
      </div>
    </Container>
  );
}
