import type { TopicSection } from "../content";

export type CertCloud = "aws" | "gcp" | "azure";
export type CertLevel = "Associate" | "Professional" | "Expert";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CertDomain {
  id: string;
  title: string;
  weight: string;
  order: number;
  summary: string;
  keyConceptsForExam: string[];
  examTips: string[];
  relatedTopics: { cloud: CertCloud; topicId: string; title: string }[];
  sections: TopicSection[];
  quiz: QuizQuestion[];
}

export interface Certification {
  id: string;
  title: string;
  code: string;
  cloud: CertCloud;
  level: CertLevel;
  description: string;
  examFormat: {
    questions: number;
    duration: string;
    passingScore: string;
    cost: string;
  };
  domains: CertDomain[];
}

export interface QuizResult {
  score: number;
  total: number;
  lastAttempt: string;
  answers: Record<string, number>;
}

export interface CertProgress {
  completedDomains: string[];
  quizResults: Record<string, QuizResult>;
  confidence: Record<string, number>;
}
