import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Sign in" };

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <SignInPageInner searchParams={searchParams} />;
}

async function SignInPageInner({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="bg-surface-base flex min-h-screen flex-col items-center justify-center p-6">
      <div className="bg-surface-raised border-border w-full max-w-sm space-y-6 rounded-lg border p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-accent" aria-hidden />
          <h1 className="text-heading-md">Kiris admin</h1>
        </div>
        <p className="text-body-sm text-text-secondary">
          Internal operator console. Google Workspace SSO + hardware-key MFA required. No password
          fallback.
        </p>
        {params.error ? (
          <p
            role="alert"
            className="border-danger bg-danger-soft text-body-sm text-danger rounded-md border p-3"
          >
            {errorMessage(params.error)}
          </p>
        ) : null}
        <Link
          href="/api/auth/google"
          className="bg-accent text-text-on-accent hover:bg-accent-hover text-body-md inline-flex h-10 w-full items-center justify-center rounded-md font-medium shadow-sm"
        >
          Sign in with Google
        </Link>
      </div>
    </div>
  );
}

function errorMessage(code: string): string {
  switch (code) {
    case "domain":
      return "Sign-in is restricted to Kiris Workspace accounts.";
    case "not_allowlisted":
      return "Your account is not on the admin allowlist. Contact ops if you should have access.";
    case "mfa_required":
      return "Hardware-key MFA must be verified before sign-in completes.";
    case "oauth_failed":
      return "Sign-in failed. Try again or contact ops if the problem persists.";
    case "state_mismatch":
      return "Sign-in flow was interrupted. Please try again from this page.";
    default:
      return "Sign-in failed. Please try again.";
  }
}
