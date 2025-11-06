export interface BirthBlueprint {
  fullName: string;
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  chineseZodiac: string;
  chineseZodiacElement: string;
}

export interface Interpretation {
  summary: string;
  fullInterpretation: string;
}

export interface SynchronicityLog {
  id: string;
  date: string;
  description: string;
  interpretation?: Interpretation;
}

export interface DreamLog {
  id: string;
  date: string;
  description: string;
  interpretation?: Interpretation;
}
