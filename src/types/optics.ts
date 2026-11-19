export type Language = 'zh' | 'en';

export type SimulationStage = 1 | 2 | 3 | 4;

export interface SimulationParams {
  theta1Deg: number; // Incident angle in degrees (5..80)
  n1: number; // Refractive index of Medium 1 (1.00..2.42)
  n2: number; // Refractive index of Medium 2 (1.00..2.42)
  speed: number; // Animation playback multiplier (0.25..2.0)
}

export interface VisualLayers {
  showWavefronts: boolean;
  showWavelets: boolean;
  showRays: boolean;
  showGeometry: boolean;
}

export interface MediumPreset {
  id: string;
  n: number;
  labelZh: string;
  labelEn: string;
}

export interface LabPreset {
  id: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  params: SimulationParams;
  stage: SimulationStage;
}

export interface StageGuide {
  stage: SimulationStage;
  shortLabelZh: string;
  shortLabelEn: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  formulaText: string;
}

export interface ProofStep {
  step: number;
  titleZh: string;
  titleEn: string;
  explanationZh: string;
  explanationEn: string;
  equation: string;
  highlightGroup: 'incident' | 'wavelet' | 'tangent' | 'snell';
}

export interface QuizQuestion {
  id: string;
  promptZh: string;
  promptEn: string;
  optionsZh: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationZh: string;
  explanationEn: string;
  demoParams: SimulationParams;
}

export interface OpticsMetrics {
  theta1Rad: number;
  sinTheta1: number;
  sinTheta2: number;
  isTotalInternalReflection: boolean;
  theta2Deg: number | null;
  theta2Rad: number | null;
  criticalAngleDeg: number | null;
  v1Ratio: number; // v1 / c = 1 / n1
  v2Ratio: number; // v2 / c = 1 / n2
  wavelengthRatio: number; // lambda1 / lambda2 = n2 / n1
}

export function computeOpticsMetrics(params: SimulationParams): OpticsMetrics {
  const theta1Rad = (params.theta1Deg * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);
  const sinTheta2 = (params.n1 / params.n2) * sinTheta1;
  const isTotalInternalReflection = sinTheta2 >= 0.999999;

  const theta2Rad = isTotalInternalReflection ? null : Math.asin(sinTheta2);
  const theta2Deg = theta2Rad !== null ? (theta2Rad * 180) / Math.PI : null;
  const criticalAngleDeg =
    params.n1 > params.n2 ? (Math.asin(params.n2 / params.n1) * 180) / Math.PI : null;

  return {
    theta1Rad,
    sinTheta1,
    sinTheta2,
    isTotalInternalReflection,
    theta2Deg,
    theta2Rad,
    criticalAngleDeg,
    v1Ratio: 1 / params.n1,
    v2Ratio: 1 / params.n2,
    wavelengthRatio: params.n2 / params.n1,
  };
}
