import { notFound } from "next/navigation";
import { getModule } from "@/lib/mock-store";
import { getSession } from "@/lib/session";
import { EditorShell } from "@/components/editor-shell";

export const metadata = { title: "Editor" };

export default async function ModuleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mod = getModule(id);
  if (!mod) notFound();
  const session = getSession();
  return <EditorShell module={mod} tier={session.tenant.tier} />;
}
