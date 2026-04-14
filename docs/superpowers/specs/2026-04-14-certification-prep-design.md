# Certification Prep Feature — Design Spec

**Date:** 2026-04-14
**Status:** Draft

## Overview

Add a certification preparation feature to CloudCompass with linear study paths, multiple-choice quizzes, and a knowledge gap tracker dashboard for 12 cloud certifications across AWS, GCP, and Azure.

## Certifications Covered

### AWS (5)
- Solutions Architect Associate (SAA-C03) — 4 domains
- Developer Associate (DVA-C02) — 4 domains
- SysOps Administrator Associate (SOA-C02) — 6 domains
- Solutions Architect Professional (SAP-C02) — 4 domains
- DevOps Engineer Professional (DOP-C02) — 6 domains

### GCP (3)
- Associate Cloud Engineer — 5 domains
- Professional Cloud Architect — 6 domains
- Professional Cloud Developer — 5 domains

### Azure (4)
- Administrator Associate (AZ-104) — 5 domains
- Developer Associate (AZ-204) — 5 domains
- Solutions Architect Expert (AZ-305) — 4 domains
- DevOps Engineer Expert (AZ-400) — 5 domains

**Total: 12 certifications, ~59 domains, ~15-20 quiz questions per domain**

## Data Model

```typescript
interface Certification {
  id: string;                    // "aws-saa-c03"
  title: string;                 // "AWS Solutions Architect Associate"
  code: string;                  // "SAA-C03"
  cloud: "aws" | "gcp" | "azure";
  level: "Associate" | "Professional" | "Expert";
  description: string;
  examFormat: {
    questions: number;           // 65
    duration: string;            // "130 minutes"
    passingScore: string;        // "720/1000"
    cost: string;                // "$150 USD"
  };
  domains: CertDomain[];
}

interface CertDomain {
  id: string;                    // "domain-1"
  title: string;                 // "Design Secure Architectures"
  weight: string;                // "30%"
  order: number;
  summary: string;               // Exam-specific overview
  keyConceptsForExam: string[];  // "Know when to use SQS vs SNS"
  examTips: string[];            // "Watch for 'most cost-effective' keywords"
  relatedTopics: string[];       // Links to existing /learn topic IDs
  sections: TopicSection[];      // Reuse existing section type for content
  quiz: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];             // 4-5 choices
  correctIndex: number;
  explanation: string;           // Why the answer is correct
  domain: string;                // Back-reference for gap tracking
}

interface CertProgress {
  certId: string;
  completedDomains: string[];
  quizResults: Record<string, {
    score: number;
    total: number;
    lastAttempt: string;         // ISO date
    answers: Record<string, number>;
  }>;
  confidence: Record<string, number>; // domain ID → 1-5
}
```

## Routes & Pages

```
/certifications                          → Hub: all 12 certs grouped by cloud
/certifications/[certId]                 → Cert overview: exam info, domain list, progress
/certifications/[certId]/[domainId]      → Domain study: content, key concepts, exam tips
/certifications/[certId]/[domainId]/quiz → Quiz: multiple choice with instant feedback
/certifications/[certId]/dashboard       → Gap tracker: score heatmap, weak areas
```

### Hub (`/certifications`)
Card grid grouped by cloud (AWS/GCP/Azure). Each card shows cert title, level badge, domain count, overall progress percentage. Filter by cloud and level.

### Cert Overview (`/certifications/[certId]`)
Exam details card (questions, duration, passing score, cost). Linear domain list with completion checkmarks. Overall progress bar. "Continue studying" button jumps to next incomplete domain.

### Domain Study (`/certifications/[certId]/[domainId]`)
Exam-specific summary. "Key Concepts for the Exam" callout box. "Exam Tips" callout box. Content sections (reusing TopicSection). Links to related /learn topics. "Take Quiz" button at bottom. Prev/next domain navigation.

### Quiz (`/certifications/[certId]/[domainId]/quiz`)
One question at a time. Select answer → instant feedback (correct/wrong + explanation). Progress indicator (Q 3/15). Score summary at end with breakdown. "Retry missed questions" option.

### Dashboard (`/certifications/[certId]/dashboard`)
Domain score grid color-coded: red <60%, yellow 60-80%, green >80%. Confidence self-rating per domain (1-5 stars). "Weakest areas" section. Last attempt dates. Overall exam readiness percentage.

## File Structure

### Content Files
```
src/lib/certifications/
├── index.ts                    → Types, getCert(), getAllCerts()
├── aws-saa-c03.ts
├── aws-dva-c02.ts
├── aws-soa-c02.ts
├── aws-sap-c02.ts
├── aws-dop-c02.ts
├── gcp-ace.ts
├── gcp-pca.ts
├── gcp-pcd.ts
├── azure-az104.ts
├── azure-az204.ts
├── azure-az305.ts
└── azure-az400.ts
```

### Route Files
```
src/app/certifications/
├── page.tsx                            → Hub
├── [certId]/
│   ├── page.tsx                        → Cert overview
│   ├── dashboard/page.tsx              → Gap tracker
│   └── [domainId]/
│       ├── page.tsx                    → Domain study
│       └── quiz/page.tsx               → Quiz
```

### New Components
```
src/components/
├── QuizRunner.tsx              → Client: question display, answer, feedback, scoring
├── CertProgressBar.tsx         → Linear progress indicator
├── DomainScoreGrid.tsx         → Color-coded grid for dashboard
├── ConfidenceRating.tsx        → 1-5 star self-assessment
├── ExamInfoCard.tsx            → Exam format details card
└── DomainNav.tsx               → Prev/next domain navigation
```

### New Hook
```
src/hooks/useCertProgress.ts    → localStorage-based cert progress
```

## Navigation & Integration

- **Navbar:** Add "Certifications" link between "Learn" and "Compare"
- **Cross-linking:** Domain study pages link to related `/learn` topics via `relatedTopics` IDs
- **Home page:** New section showcasing the certification feature
- **Sitemap:** Extend `sitemap.ts` to include all certification routes
- **Progress isolation:** Separate localStorage key `cc_cert_progress` from existing `cc_progress`

## Technical Constraints

- Fully static site (`output: "export"`) — no API routes
- All quiz/progress components are `"use client"`
- All route pages use `generateStaticParams` for static generation
- ~144 new static pages (12 overviews + 12 dashboards + ~60 domain pages + ~60 quiz pages)
- Content versioned in TypeScript alongside code

## Content Approach

Hybrid model per domain:
1. **Exam-specific summary** — what this domain covers and why it matters for the exam
2. **Key Concepts for the Exam** — callout box with critical things to know
3. **Exam Tips** — callout box with test-taking strategies for this domain
4. **Content sections** — focused study material using existing TopicSection format
5. **Related topics** — links to existing `/learn` content for deep dives
6. **Quiz questions** — 15-20 multiple choice per domain with explanations
