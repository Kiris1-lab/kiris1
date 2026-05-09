import { TopNav } from "@/components/top-nav";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main id="main" className="max-w-app mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}
