export type ChargeKind = "base" | "sequential";

export type PortState = "ahead" | "sealed" | "behind";

export interface PropellantSpec {
  name: string;
  /** Impetus / force constant f = R T_expl, J/kg. */
  impetus: number;
  /** Ratio of specific heats of product gas. */
  gamma: number;
  /** Noble-Abel covolume α, m³/kg. */
  covolume: number;
  /** Solid grain density, kg/m³. */
  density: number;
  /** Adiabatic flame temperature, K. */
  flameTemp: number;
  /** Vieille exponent n in r = β (P/1 MPa)^n. */
  burnExp: number;
  /** Vieille coefficient β, m/s at 1 MPa. */
  burnBeta: number;
  /** Half-web (flake half-thickness), m. */
  web: number;
}

export interface Charge {
  id: string;
  kind: ChargeKind;
  label: string;
  /** Port station measured from start of travel (case mouth), m. */
  position: number;
  /** Propellant mass, kg. */
  mass: number;
  propellant: PropellantSpec;
  /** Geometric volume of the cartridge / side chamber, m³. */
  chamberVolume: number;
  /** Connecting port area, m². */
  portArea: number;
  /**
   * Ignite when the projectile base reaches position + triggerOffset.
   * Negative = electrical pre-fire (risk of blow-by).
   */
  triggerOffset: number;
  /** Drawing angle of the side tube, deg from the barrel axis. Visual only. */
  angle: number;
  /** Alternate above/below the bore. Visual only. */
  side: 1 | -1;
  enabled: boolean;
}

export interface GunConfig {
  name: string;
  /** Bore (groove) diameter, m. */
  boreDiameter: number;
  /** Travel from case mouth to muzzle, m. */
  barrelLength: number;
  /** Geometric chamber volume behind the seated bullet, m³. */
  chamberVolume: number;
  projectileMass: number;
  /** Bullet length used for port sealing, m. */
  projectileLength: number;
  /** Pressure that must be reached before the bullet starts, Pa. */
  startPressure: number;
  /** Extra resistive pressure at the origin (engraving), Pa. */
  engravingPressure: number;
  /** Length constant of engraving decay, m. */
  engravingDecay: number;
  /** Constant equivalent resistive pressure after engraving, Pa. */
  frictionPressure: number;
  /** Convective heat-transfer coefficient, W/(m² K). */
  heatTransfer: number;
  wallTemp: number;
  ambientPressure: number;
  /** Barrel wall thickness for hoop-stress estimate, m. */
  wallThickness: number;
  charges: Charge[];
}

export interface ChargeSample {
  z: number;
  ignited: boolean;
  port: PortState;
  pSide: number;
  isolated: boolean;
}

export interface Sample {
  t: number;
  x: number;
  v: number;
  a: number;
  /** Space-mean bore pressure (Noble-Abel), Pa. */
  p: number;
  pBreech: number;
  pBase: number;
  temperature: number;
  mGas: number;
  eTherm: number;
  keProj: number;
  keGas: number;
  heatLoss: number;
  frictionWork: number;
  blowbyEnergy: number;
  released: number;
  charges: ChargeSample[];
}

export type SimEventKind =
  | "primer"
  | "shot-start"
  | "ignite"
  | "burnout"
  | "peak-pressure"
  | "muzzle"
  | "blow-by";

export interface SimEvent {
  t: number;
  x: number;
  kind: SimEventKind;
  chargeId?: string;
  note: string;
}

export type SimStatus = "exited" | "stuck" | "max-time";

export interface EnergyBreakdown {
  chemical: number;
  unburned: number;
  projectile: number;
  gasKinetic: number;
  thermal: number;
  heat: number;
  friction: number;
  blowby: number;
  primer: number;
}

export interface SimSummary {
  muzzleVelocity: number;
  muzzleEnergy: number;
  peakPressure: number;
  peakPressureTravel: number;
  peakPressureTime: number;
  timeToMuzzle: number;
  burnComplete: boolean;
  unburnedFraction: number;
  efficiency: number;
  piezometric: number;
  hoopStress: number;
  saamiRatio: number;
  energy: EnergyBreakdown;
  sidePeakPressure: number;
  blowbyMass: number;
}

export interface SimWarning {
  id: string;
  level: "info" | "warn" | "danger";
  title: string;
  body: string;
}

export interface SimResult {
  status: SimStatus;
  samples: Sample[];
  events: SimEvent[];
  summary: SimSummary;
  warnings: SimWarning[];
  steps: number;
  dt: number;
  closedBombPressure: number;
}
