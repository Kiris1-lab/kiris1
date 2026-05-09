import { notFound } from "next/navigation";
import { getModule } from "@/lib/data";
import { PreviewPlayer } from "@/components/preview-player";

export const metadata = { title: "Preview" };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mod = await getModule(id);
  if (!mod) notFound();
  return <PreviewPlayer module={mod} />;
}
