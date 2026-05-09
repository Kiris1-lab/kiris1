import { Container } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto max-w-md py-32 text-center">
        <p className="text-caption text-accent uppercase">404</p>
        <h1 className="text-display-md mt-3">Page not found.</h1>
        <p className="text-body-md text-text-secondary mt-3">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
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
