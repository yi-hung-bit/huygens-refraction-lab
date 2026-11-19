import {
  LabPreset,
  MediumPreset,
  ProofStep,
  QuizQuestion,
  SimulationParams,
  StageGuide,
} from '../types/optics';

export const YOUTUBE_VIDEO_ID = 'sDBAFWhPUZ4';
export const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=sDBAFWhPUZ4';

export const DEFAULT_PARAMS: SimulationParams = {
  theta1Deg: 40,
  n1: 1.0,
  n2: 1.5,
  speed: 1.0,
};

export const MEDIUM_PRESETS: MediumPreset[] = [
  { id: 'air', n: 1.0, labelZh: '空氣', labelEn: 'Air' },
  { id: 'water', n: 1.33, labelZh: '水', labelEn: 'Water' },
  { id: 'glass', n: 1.5, labelZh: '玻璃', labelEn: 'Glass' },
  { id: 'diamond', n: 2.42, labelZh: '鑽石', labelEn: 'Diamond' },
];

export const STAGE_GUIDES: StageGuide[] = [
  {
    stage: 1,
    shortLabelZh: '階段 1 · 波前入射',
    shortLabelEn: 'Stage 1 · Incident',
    titleZh: '平面波前以角度 θ₁ 抵達介質交界面',
    titleEn: 'Plane wavefront reaches the interface at angle θ₁',
    descriptionZh:
      '光波前 AB 垂直於行進方向（光線），在介質 1 中以波速 v₁ = c / n₁ 前進。在時間 t = 0 時，波前左側端點 A 率先觸及兩種介質的交界面。',
    descriptionEn:
      'The plane wavefront AB is perpendicular to the incident rays and travels in Medium 1 at v₁ = c / n₁. At t = 0, edge A touches the optical boundary first.',
    formulaText: 'v₁ = c / n₁',
  },
  {
    stage: 2,
    shortLabelZh: '階段 2 · 次波激發',
    shortLabelEn: 'Stage 2 · Wavelets',
    titleZh: '端點 A 發出半球形次波，端點 B 繼續前進',
    titleEn: 'Point A emits a secondary wavelet while B advances',
    descriptionZh:
      '依據惠更斯原理，交界面上的 A 點成為新波源，在介質 2 中以波速 v₂ = c / n₂ 向外擴散出半徑 r = v₂Δt 的次波圓；同一時間 Δt 內，波前另一端 B 在介質 1 中前進距離 BC = v₁Δt 抵達 C 點。',
    descriptionEn:
      'By Huygens’ principle, point A acts as a secondary source expanding into Medium 2 with radius AD = v₂Δt during Δt, while edge B advances BC = v₁Δt in Medium 1 to reach point C.',
    formulaText: 'BC = v₁Δt  ·  AD = v₂Δt',
  },
  {
    stage: 3,
    shortLabelZh: '階段 3 · 包絡線成形',
    shortLabelEn: 'Stage 3 · Envelope',
    titleZh: '所有次波圓的公切線形成折射後的新波前',
    titleEn: 'Common tangent to all wavelets forms the refracted wavefront',
    descriptionZh:
      '交界面 AC 區間內每個受激發的質點都依序發出次波圓，且半徑隨時間線性縮小至 C 點（半徑為 0）。將所有次波圓的公切線 CD 連成包絡線，即為進入介質 2 的新平面波前，光線則沿垂直於 CD 的方向偏折。',
    descriptionEn:
      'Every intermediate point along AC emits a wavelet whose radius scales linearly down to zero at C. Their common tangent envelope CD defines the new refracted wavefront, bending the ray perpendicular to CD.',
    formulaText: 'CD ⊥ AD  (∠ADC = 90°)',
  },
  {
    stage: 4,
    shortLabelZh: '階段 4 · 幾何推導',
    shortLabelEn: 'Stage 4 · Snell Proof',
    titleZh: '由共用斜邊 AC 的兩直角三角形導出司乃耳定律',
    titleEn: 'Two right triangles sharing hypotenuse AC yield Snell’s law',
    descriptionZh:
      '在直角三角形 △ABC 中，sin θ₁ = v₁Δt / AC；在直角三角形 △ADC 中，sin θ₂ = v₂Δt / AC。將兩式相除消去共有斜邊 AC 與時間 Δt，即可證得 sin θ₁ / sin θ₂ = v₁ / v₂ = n₂ / n₁。',
    descriptionEn:
      'In right triangle △ABC, sin θ₁ = v₁Δt / AC; in △ADC, sin θ₂ = v₂Δt / AC. Dividing eliminates AC and Δt, proving sin θ₁ / sin θ₂ = v₁ / v₂ = n₂ / n₁.',
    formulaText: 'n₁ sin θ₁ = n₂ sin θ₂',
  },
];

export const LAB_PRESETS: LabPreset[] = [
  {
    id: 'air-to-glass',
    titleZh: '空氣 → 玻璃（向法線偏折）',
    titleEn: 'Air → Glass (Bend Toward Normal)',
    summaryZh: '進入光密介質時波速變慢 (v₂ < v₁)，次波圓半徑較小，包絡線使光線向法線偏折。',
    summaryEn: 'Entering a denser medium slows wavelets (v₂ < v₁), tilting the tangent envelope toward the normal.',
    params: { theta1Deg: 45, n1: 1.0, n2: 1.5, speed: 1.0 },
    stage: 4,
  },
  {
    id: 'glass-to-air',
    titleZh: '玻璃 → 空氣（遠離法線偏折）',
    titleEn: 'Glass → Air (Bend Away From Normal)',
    summaryZh: '進入光疏介質時波速變快 (v₂ > v₁)，次波圓擴張更快，折射角 θ₂ 大於入射角 θ₁。',
    summaryEn: 'Entering a rarer medium speeds up wavelets (v₂ > v₁), resulting in a larger refracted angle θ₂ > θ₁.',
    params: { theta1Deg: 28, n1: 1.5, n2: 1.0, speed: 1.0 },
    stage: 3,
  },
  {
    id: 'critical-angle',
    titleZh: '臨界角邊界（θ₁ ≈ 41.8°）',
    titleEn: 'Critical Angle Boundary (θ₁ ≈ 41.8°)',
    summaryZh: '玻璃射向空氣當 θ₁ 逼近 41.8° 時，次波半徑 v₂Δt 幾乎等於斜邊 AC，折射波前接近垂直交界面。',
    summaryEn: 'Near 41.8° from glass to air, wavelet radius v₂Δt approaches hypotenuse AC, grazing the interface.',
    params: { theta1Deg: 41, n1: 1.5, n2: 1.0, speed: 0.9 },
    stage: 4,
  },
  {
    id: 'total-internal-reflection',
    titleZh: '全反射現象（θ₁ > θc）',
    titleEn: 'Total Internal Reflection (θ₁ > θc)',
    summaryZh: '當 v₂Δt > AC 時，C 點完全落在 A 點次波圓內部，幾何上無法在介質 2 做出公切線，僅存反射波前。',
    summaryEn: 'When v₂Δt > AC, point C lies inside A’s wavelet so no real tangent exists in Medium 2; wave energy reflects.',
    params: { theta1Deg: 55, n1: 1.5, n2: 1.0, speed: 1.0 },
    stage: 3,
  },
  {
    id: 'matched-index',
    titleZh: '等折射率介質（n₁ = n₂）',
    titleEn: 'Index-Matched Media (n₁ = n₂)',
    summaryZh: '兩側波速相等 (v₁ = v₂)，次波半徑等於 BC，包絡線維持與原波前完全平行而不偏折。',
    summaryEn: 'Equal speeds (v₁ = v₂) keep AD = BC, so the tangent envelope continues straight without bending.',
    params: { theta1Deg: 38, n1: 1.33, n2: 1.33, speed: 1.0 },
    stage: 2,
  },
];

export const PROOF_STEPS: ProofStep[] = [
  {
    step: 1,
    titleZh: '幾何對應：入射角等於波前夾角',
    titleEn: 'Angle Identity: Incident Angle Equals Wavefront Tilt',
    explanationZh:
      '入射光線與法線夾角為 θ₁。由於波前 AB 恆垂直於入射光線，且法線恆垂直於交界面 AC，因此波前 AB 與交界面 AC 的夾角 ∠BAC 亦等於 θ₁。',
    explanationEn:
      'Incident rays meet the normal at θ₁. Since wavefront AB ⊥ ray and normal ⊥ interface AC, the angle ∠BAC between wavefront and boundary equals θ₁.',
    equation: '∠BAC = θ₁   ⇒   sin θ₁ = BC / AC',
    highlightGroup: 'incident',
  },
  {
    step: 2,
    titleZh: '等時運動：兩側波前走的距離',
    titleEn: 'Equal Time Interval Δt Across Both Media',
    explanationZh:
      '設波前右側端點 B 走過 BC 抵達 C 點所需時間為 Δt，則 BC = v₁Δt。在這完全相同的 Δt 內，A 點激發的次波在介質 2 中半徑成長為 AD = v₂Δt。',
    explanationEn:
      'Let Δt be the time for edge B to travel BC = v₁Δt to the boundary. In that same interval Δt, the wavelet from A expands to radius AD = v₂Δt.',
    equation: 'BC = v₁Δt   ,   AD = v₂Δt',
    highlightGroup: 'wavelet',
  },
  {
    step: 3,
    titleZh: '包絡切線：建立第二個直角三角形',
    titleEn: 'Tangent Envelope Forms Second Right Triangle',
    explanationZh:
      '新波前 CD 是過 C 點對 A 點次波圓所作的切線，由圓切線性質可知半徑 AD 必垂直於切線 CD（∠ADC = 90°），且折射波前與交界面夾角 ∠ACD = θ₂。',
    explanationEn:
      'The refracted wavefront CD is tangent to A’s wavelet at D, so radius AD ⊥ CD (∠ADC = 90°) and boundary tilt ∠ACD equals refracted angle θ₂.',
    equation: '∠ADC = 90°   ⇒   sin θ₂ = AD / AC',
    highlightGroup: 'tangent',
  },
  {
    step: 4,
    titleZh: '消去共有斜邊 AC，完成司乃耳定律',
    titleEn: 'Eliminate Shared Hypotenuse AC to Obtain Snell’s Law',
    explanationZh:
      '將兩直角三角形的正弦關係相除，共有斜邊 AC 與時間 Δt 同時消去；再代入絕對折射率定義 n = c / v，即推得高中物理核心公式 n₁ sin θ₁ = n₂ sin θ₂。',
    explanationEn:
      'Dividing the two sine ratios cancels both AC and Δt. Substituting v = c / n immediately yields Snell’s law of refraction: n₁ sin θ₁ = n₂ sin θ₂.',
    equation: 'sin θ₁ / sin θ₂ = v₁ / v₂ = n₂ / n₁   ⇒   n₁ sin θ₁ = n₂ sin θ₂',
    highlightGroup: 'snell',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-speed-ratio',
    promptZh:
      '當平面光波從空氣（n₁ = 1.00）斜向射入玻璃（n₂ = 1.50）時，依據惠更斯原理，為何光線會向法線偏折？',
    promptEn:
      'When a plane wave enters glass (n₂ = 1.50) from air (n₁ = 1.00) obliquely, why does the ray bend toward the normal according to Huygens’ principle?',
    optionsZh: [
      '因為玻璃中的次波波速 v₂ 較慢，相同時間 Δt 內次波半徑 AD < BC，使公切線波前向交界面傾倒',
      '因為光的頻率在進入玻璃後變小，導致波前波長被拉長',
      '因為交界面上的點 C 比點 A 更早激發次波圓',
      '因為玻璃會吸引光子沿法線方向加速前進',
    ],
    optionsEn: [
      'Secondary wavelets propagate slower in glass (v₂ < v₁), so AD < BC in Δt and the tangent envelope tilts closer to the interface',
      'The frequency of light decreases inside glass, stretching the wavelength',
      'Point C along the boundary emits a secondary wavelet earlier than point A',
      'Glass accelerates photons directly along the normal vector',
    ],
    correctIndex: 0,
    explanationZh:
      '光進入折射率較大的介質時波速變慢 (v₂ = c/n₂ < v₁)。在 Δt 時間內，介質 2 中的次波半徑 AD = v₂Δt 小於介質 1 的前進距離 BC = v₁Δt，使得公切線 CD 與介面的夾角 θ₂ 小於 θ₁，光線因此向法線偏折。',
    explanationEn:
      'In higher-index glass, wavelets travel slower (v₂ < v₁), making AD = v₂Δt shorter than BC = v₁Δt. Consequently the common tangent CD makes a smaller angle θ₂ with the boundary, bending the ray toward the normal.',
    demoParams: { theta1Deg: 45, n1: 1.0, n2: 1.5, speed: 1.0 },
  },
  {
    id: 'q2-frequency-wavelength',
    promptZh:
      '在折射過程中，比較介質 1 與介質 2 內的波前物理量，下列敘述何者正確？',
    promptEn:
      'Comparing wave properties across Medium 1 and Medium 2 during refraction, which statement is true?',
    optionsZh: [
      '波速 v 改變、波長 λ 改變，但波源激發頻率 f 維持不變',
      '波速 v 不變、頻率 f 改變，因此波長 λ 跟著改變',
      '波速 v 與頻率 f 同時依比例改變，但波長 λ 維持不變',
      '三者（v、λ、f）在跨越交界面時皆維持不變',
    ],
    optionsEn: [
      'Wave speed v and wavelength λ both change, while frequency f remains invariant across the boundary',
      'Wave speed v stays constant while frequency f changes, altering wavelength λ',
      'Both v and f scale together so wavelength λ stays unchanged',
      'All three quantities (v, λ, f) remain constant across the boundary',
    ],
    correctIndex: 0,
    explanationZh:
      '交界面上的次波源受入射波前週期性驅動，因此每秒通過介面的波前數（頻率 f）必須連續相等。由 v = fλ 可知，當波速 v = c/n 改變時，波長 λ 必定與波速成正比改變（λ₁ / λ₂ = v₁ / v₂ = n₂ / n₁）。',
    explanationEn:
      'Boundary oscillators are driven at the incident wave frequency, so f must remain continuous across the interface. Since v = fλ, any change in speed v = c/n scales wavelength proportionally (λ₁ / λ₂ = n₂ / n₁).',
    demoParams: { theta1Deg: 40, n1: 1.0, n2: 1.5, speed: 1.0 },
  },
  {
    id: 'q3-tir-geometry',
    promptZh:
      '當光從玻璃（n₁ = 1.50）射向空氣（n₂ = 1.00）且入射角 θ₁ 超過臨界角 θc 時，惠更斯次波幾何圖形會出現什麼特徵？',
    promptEn:
      'When light travels from glass (n₁ = 1.50) toward air (n₂ = 1.00) with θ₁ > θc, what happens geometrically to the Huygens wavelet from A?',
    optionsZh: [
      'A 點在空氣中的次波半徑 v₂Δt 大於斜邊距離 AC，使 C 點落入圓內而無法做出實公切線',
      'A 點不會發出任何次波圓，交界面完全停止振動',
      '折射角 θ₂ 會變成負值並沿著原光路倒退',
      '玻璃中的入射波速突然降為零',
    ],
    optionsEn: [
      'The wavelet radius v₂Δt in air exceeds boundary segment AC, placing C inside the circle so no real tangent line exists',
      'Point A stops emitting any wavelets completely',
      'Refracted angle θ₂ reverses sign along the incoming ray',
      'Incident wave speed in glass drops to zero',
    ],
    correctIndex: 0,
    explanationZh:
      '因為 sin θ₁ > n₂/n₁ = v₁/v₂，所以 v₂Δt > (v₁Δt)/sin θ₁ = AC。C 點位於以 A 為圓心、v₂Δt 為半徑的圓內部，幾何上無法從圓內一點對圓作切線，因此在介質 2 中無法形成折射平面波前，能量全部經介質 1 的反射次波圓返回（全反射）。',
    explanationEn:
      'Since sin θ₁ > n₂/n₁ = v₁/v₂, we get v₂Δt > AC. Point C lies strictly inside the circle of radius v₂Δt centered at A, so no real tangent can be drawn from C to the wavelet in Medium 2—resulting in total internal reflection.',
    demoParams: { theta1Deg: 55, n1: 1.5, n2: 1.0, speed: 1.0 },
  },
  {
    id: 'q4-normal-incidence',
    promptZh:
      '若光波垂直入射（θ₁ = 0°）進入不同折射率介質，惠更斯原理預測會發生什麼現象？',
    promptEn:
      'If a plane wavefront hits the boundary at normal incidence (θ₁ = 0°), what does Huygens’ principle predict?',
    optionsZh: [
      '波前各點同時抵達交界面並同步發出半徑相同的次波圓，公切線仍平行交界面而不偏折，但波長與波速改變',
      '由於 θ₁ = 0°，無法發生折射且波速也不會改變',
      '光線會隨機向左右兩側偏折 45°',
      '必然發生全反射現象',
    ],
    optionsEn: [
      'All points along the wavefront hit simultaneously with equal wavelet radii; the tangent stays parallel (θ₂ = 0°) while speed and wavelength change',
      'Neither direction nor wave speed changes at θ₁ = 0°',
      'Light splits symmetrically at 45° to the left and right',
      'Total internal reflection always occurs at normal incidence',
    ],
    correctIndex: 0,
    explanationZh:
      '垂直入射時波前平行於交界面，整條波前同時激發半徑皆為 v₂Δt 的次波圓，故公切線依然平行交界面（θ₂ = 0°），光線不偏折；但進入新介質後波速 v₂ = c/n₂ 與波長 λ₂ 仍會隨折射率改變。',
    explanationEn:
      'At normal incidence, every point on the interface emits a wavelet simultaneously with identical radius v₂Δt. Their tangent remains parallel to the boundary (θ₂ = 0°), though speed v₂ = c/n₂ and wavelength still scale with n₂.',
    demoParams: { theta1Deg: 5, n1: 1.0, n2: 1.5, speed: 1.0 },
  },
];
