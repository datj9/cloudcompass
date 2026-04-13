import type { Certification, CertCloud } from "./types";
export type { Certification, CertDomain, CertCloud, CertLevel, QuizQuestion, QuizResult, CertProgress } from "./types";

import { awsSaaC03 } from "./aws-saa-c03";

export const certifications: Certification[] = [
  awsSaaC03,
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
