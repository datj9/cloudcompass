import type { Certification, CertCloud } from "./types";
export type { Certification, CertDomain, CertCloud, CertLevel, QuizQuestion, QuizResult, CertProgress } from "./types";

import { awsSaaC03 } from "./aws-saa-c03";
import { awsDvaC02 } from "./aws-dva-c02";
import { awsSoaC02 } from "./aws-soa-c02";
import { awsSapC02 } from "./aws-sap-c02";
import { awsDopC02 } from "./aws-dop-c02";
import { gcpAce } from "./gcp-ace";
import { gcpPca } from "./gcp-pca";
import { gcpPcd } from "./gcp-pcd";
import { azureAz104 } from "./azure-az104";
import { azureAz204 } from "./azure-az204";
import { azureAz305 } from "./azure-az305";
import { azureAz400 } from "./azure-az400";

export const certifications: Certification[] = [
  awsSaaC03, awsDvaC02, awsSoaC02, awsSapC02, awsDopC02,
  gcpAce, gcpPca, gcpPcd,
  azureAz104, azureAz204, azureAz305, azureAz400,
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
