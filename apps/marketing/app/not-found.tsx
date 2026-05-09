import { Container } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto max-w-md py-32 text-center">
        <p className="text-caption uppercase text-accent">404</p>
        <h1 className="mt-3 text-display-md">Page not found.</h1>
        <p className="mt-3 text-body-md text-text-secondary">
          The page you're looking for has moved or doesn't exist.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <CtaLink href="/" variant="primary">
            Go home
          </CtaLink>
          <CtaLink href="/pricing" variant="secondary">
            See pricing
          </CtaLink>
        </div>
      </div>
    </Container>
  );
}
