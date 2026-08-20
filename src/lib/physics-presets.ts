export type FeelPreset = "editorial" | "premium" | "aggressive" | "heavy";

export type PhysicsParams = {
  dampingY: number;
  springX: number;
  dampingX: number;
  deltaGainY: number;
  deltaGainX: number;
  autoSpin: number;
  edgeBoost: number;
  dragImpulse: number;
  lookGain: number;
  inputSmooth: number;
};

export const PRESETS: Record<FeelPreset, PhysicsParams> = {
  editorial: {
    dampingY: 4.5,
    springX: 2.8,
    dampingX: 4.6,
    deltaGainY: 0.0042,
    deltaGainX: 0.0022,
    autoSpin: 0.05,
    edgeBoost: 1.8,
    dragImpulse: 0.014,
    lookGain: 0.1,
    inputSmooth: 0.28,
  },
  premium: {
    dampingY: 3.4,
    springX: 4.5,
    dampingX: 4.24,
    deltaGainY: 0.0074,
    deltaGainX: 0.0034,
    autoSpin: 0.062,
    edgeBoost: 3.2,
    dragImpulse: 0.02,
    lookGain: 0.14,
    inputSmooth: 0.4,
  },
  aggressive: {
    dampingY: 2.55,
    springX: 7.0,
    dampingX: 2.85,
    deltaGainY: 0.012,
    deltaGainX: 0.0052,
    autoSpin: 0.11,
    edgeBoost: 4.6,
    dragImpulse: 0.03,
    lookGain: 0.2,
    inputSmooth: 0.52,
  },
  heavy: {
    dampingY: 2.15,
    springX: 2.2,
    dampingX: 2.4,
    deltaGainY: 0.0056,
    deltaGainX: 0.0028,
    autoSpin: 0.038,
    edgeBoost: 2.1,
    dragImpulse: 0.024,
    lookGain: 0.12,
    inputSmooth: 0.2,
  },
};

export type PhysicsState = {
  orbitY: number;
  tiltX: number;
  velY: number;
  velX: number;
  smoothDx: number;
  smoothDy: number;
  lookX: number;
  lookY: number;
  edgeX: number;
  edgeY: number;
  lastMoveAt: number;
  dragging: boolean;
};
