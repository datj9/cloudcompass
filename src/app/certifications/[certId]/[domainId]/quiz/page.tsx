import { getCert, getAllCerts, getDomain } from "@/lib/certifications";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QuizPageClient } from "./QuizPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string; domainId: string }>;
}): Promise<Metadata> {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  const domain = cert ? getDomain(certId, domainId) : undefined;
  if (!cert || !domain) return {};
  return { title: `Quiz: ${domain.title} — ${cert.code}` };
}

export function generateStaticParams() {
  const params: { certId: string; domainId: string }[] = [];
  for (const cert of getAllCerts()) {
    for (const domain of cert.domains) {
      params.push({ certId: cert.id, domainId: domain.id });
    }
  }
  return params;
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ certId: string; domainId: string }>;
}) {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();
  const domain = getDomain(certId, domainId);
  if (!domain) notFound();
  return (
    <QuizPageClient
      certId={certId}
      domainId={domainId}
      certCode={cert.code}
      domainTitle={domain.title}
      questions={domain.quiz}
    />
  );
}
