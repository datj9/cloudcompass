import type { Certification, CertCloud } from "./types";
export type { Certification, CertDomain, CertCloud, CertLevel, QuizQuestion, QuizResult, CertProgress } from "./types";

// Certification imports — uncomment as content files are created
// import { awsSaaC03 } from "./aws-saa-c03";
// TODO: Add imports for each certification content file as they are created

export const certifications: Certification[] = [
  // Will be populated as cert content files are created
];

export const certMap: Record<string, Certification> = Object.fromEntries(
  certifications.map((c) => [c.id, c])
);

export function getCert(id: string): Certification | undefined {
  return certMap[id];
}

export function getAllCerts(): Certification[] {
  return certifications;
}

export function getCertsByCloud(cloud: CertCloud): Certification[] {
  return certifications.filter((c) => c.cloud === cloud);
}

export function getDomain(certId: string, domainId: string) {
  const cert = getCert(certId);
  if (!cert) return undefined;
  return cert.domains.find((d) => d.id === domainId);
}
