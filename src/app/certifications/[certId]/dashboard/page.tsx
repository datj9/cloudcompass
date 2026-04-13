import { getCert, getAllCerts } from "@/lib/certifications";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}): Promise<Metadata> {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) return {};
  return { title: `Dashboard — ${cert.code}` };
}

export function generateStaticParams() {
  return getAllCerts().map((c) => ({ certId: c.id }));
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();
  return (
    <DashboardClient
      certId={certId}
      certCode={cert.code}
      certTitle={cert.title}
      certCloud={cert.cloud}
      domains={cert.domains}
    />
  );
}
