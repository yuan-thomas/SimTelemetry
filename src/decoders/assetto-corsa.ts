import { Frame, TelemetryDecoder } from '../types';

// Packet types for Assetto Corsa Competizione
export enum ACCPacketType {
  PHYSICS = 1,   // SPageFilePhysics - Real-time telemetry
  GRAPHICS = 2,  // SPageFileGraphic - Session/UI data  
  STATIC = 3,    // SPageFileStatic - Static configuration
}

// Game status enumeration
export enum ACStatus {
  AC_OFF = 0,
  AC_REPLAY = 1,
  AC_LIVE = 2,
  AC_PAUSE = 3
}

// Session type enumeration
export enum ACSessionType {
  AC_UNKNOWN = -1,
  AC_PRACTICE = 0,
  AC_QUALIFY = 1,
  AC_RACE = 2,
  AC_HOTLAP = 3,
  AC_TIME_ATTACK = 4,
  AC_DRIFT = 5,
  AC_DRAG = 6,
  AC_HOTSTINT = 7,
  AC_HOTLAPSUPERPOLE = 8
}

// Flag type enumeration
export enum ACFlagType {
  AC_NO_FLAG = 0,
  AC_BLUE_FLAG = 1,
  AC_YELLOW_FLAG = 2,
  AC_BLACK_FLAG = 3,
  AC_WHITE_FLAG = 4,
  AC_CHECKERED_FLAG = 5,
  AC_PENALTY_FLAG = 6
}

// Base frame interface for ACC data
export interface ACCBaseFrame extends Frame {
  packet_type: number;
  t: number; // timestamp
}

// Physics frame interface - real-time telemetry data
export interface ACCPhysicsFrame extends ACCBaseFrame {
  packet_type: ACCPacketType.PHYSICS;
  packetId: number;
  
  // Vehicle dynamics
  gas: number;           // Throttle input (0-1)
  brake: number;         // Brake input (0-1)
  fuel: number;          // Current fuel amount
  gear: number;          // Current gear
  rpms: number;          // Engine RPM
  steerAngle: number;    // Steering angle
  speedKmh: number;      // Speed in km/h
  
  // Physics vectors [3] - velocity
  velocityX: number;     // Velocity X component
  velocityY: number;     // Velocity Y component
  velocityZ: number;     // Velocity Z component
  
  // Physics vectors [3] - acceleration G-forces
  accGX: number;         // G-force X component
  accGY: number;         // G-force Y component
  accGZ: number;         // G-force Z component
  
  // Wheel data [4] - order: FL, FR, RL, RR
  wheelSlipFL: number;
  wheelSlipFR: number;
  wheelSlipRL: number;
  wheelSlipRR: number;
  
  wheelLoadFL: number;
  wheelLoadFR: number;
  wheelLoadRL: number;
  wheelLoadRR: number;
  
  wheelsPressureFL: number;
  wheelsPressureFR: number;
  wheelsPressureRL: number;
  wheelsPressureRR: number;
  
  wheelAngularSpeedFL: number;
  wheelAngularSpeedFR: number;
  wheelAngularSpeedRL: number;
  wheelAngularSpeedRR: number;
  
  tyreWearFL: number;
  tyreWearFR: number;
  tyreWearRL: number;
  tyreWearRR: number;
  
  tyreDirtyLevelFL: number;
  tyreDirtyLevelFR: number;
  tyreDirtyLevelRL: number;
  tyreDirtyLevelRR: number;
  
  tyreCoreTemperatureFL: number;
  tyreCoreTemperatureFR: number;
  tyreCoreTemperatureRL: number;
  tyreCoreTemperatureRR: number;
  
  // Camber in radians [4]
  camberRADFL: number;
  camberRADFR: number;
  camberRADRL: number;
  camberRADRR: number;
  
  // Suspension travel [4]
  suspensionTravelFL: number;
  suspensionTravelFR: number;
  suspensionTravelRL: number;
  suspensionTravelRR: number;
  
  // Electronics
  drs: number;           // DRS activation
  tc: number;            // Traction control
  
  // Car orientation
  heading: number;       // Car heading/yaw
  pitch: number;         // Car pitch
  roll: number;          // Car roll
  cgHeight: number;      // Center of gravity height
  
  // Car damage [5]
  carDamageFront: number;
  carDamageRear: number;
  carDamageLeft: number;
  carDamageRight: number;
  carDamageCenter: number;
  
  numberOfTyresOut: number;
  pitLimiterOn: number;
  abs: number;           // ABS activation
  
  // Additional physics data
  kersCharge: number;
  kersInput: number;
  autoShifterOn: number;
  
  // Ride height [2] - front, rear
  rideHeightFront: number;
  rideHeightRear: number;
  
  turboBoost: number;
  ballast: number;
  airDensity: number;
  airTemp: number;
  roadTemp: number;
  
  // Local angular velocity [3]
  localAngularVelX: number;
  localAngularVelY: number;
  localAngularVelZ: number;
  
  finalFF: number;       // Final force feedback
  performanceMeter: number;
  
  // Engine and ERS
  engineBrake: number;
  ersRecoveryLevel: number;
  ersPowerLevel: number;
  ersHeatCharging: number;
  ersIsCharging: number;
  kersCurrentKJ: number;
  
  // DRS details
  drsAvailable: number;
  drsEnabled: number;
  
  // Brake temperatures [4]
  brakeTempFL: number;
  brakeTempFR: number;
  brakeTempRL: number;
  brakeTempRR: number;
  
  clutch: number;
  
  // Tyre surface temperatures [4] - Inner, Middle, Outer
  tyreTempIFL: number;
  tyreTempIFR: number;
  tyreTempIRL: number;
  tyreTempIRR: number;
  
  tyreTempMFL: number;
  tyreTempMFR: number;
  tyreTempMRL: number;
  tyreTempMRR: number;
  
  tyreTempOFL: number;
  tyreTempOFR: number;
  tyreTempORL: number;
  tyreTempORR: number;
  
  isAIControlled: number;
  
  // Tyre contact points [4][3] - FL, FR, RL, RR x XYZ
  tyreContactPointFLX: number;
  tyreContactPointFLY: number;
  tyreContactPointFLZ: number;
  tyreContactPointFRX: number;
  tyreContactPointFRY: number;
  tyreContactPointFRZ: number;
  tyreContactPointRLX: number;
  tyreContactPointRLY: number;
  tyreContactPointRLZ: number;
  tyreContactPointRRX: number;
  tyreContactPointRRY: number;
  tyreContactPointRRZ: number;
  
  // Tyre contact normals [4][3]
  tyreContactNormalFLX: number;
  tyreContactNormalFLY: number;
  tyreContactNormalFLZ: number;
  tyreContactNormalFRX: number;
  tyreContactNormalFRY: number;
  tyreContactNormalFRZ: number;
  tyreContactNormalRLX: number;
  tyreContactNormalRLY: number;
  tyreContactNormalRLZ: number;
  tyreContactNormalRRX: number;
  tyreContactNormalRRY: number;
  tyreContactNormalRRZ: number;
  
  // Tyre contact headings [4][3]
  tyreContactHeadingFLX: number;
  tyreContactHeadingFLY: number;
  tyreContactHeadingFLZ: number;
  tyreContactHeadingFRX: number;
  tyreContactHeadingFRY: number;
  tyreContactHeadingFRZ: number;
  tyreContactHeadingRLX: number;
  tyreContactHeadingRLY: number;
  tyreContactHeadingRLZ: number;
  tyreContactHeadingRRX: number;
  tyreContactHeadingRRY: number;
  tyreContactHeadingRRZ: number;
  
  brakeBias: number;
  
  // Local velocity [3]
  localVelocityX: number;
  localVelocityY: number;
  localVelocityZ: number;
  
  // P2P (Push to Pass)
  P2PActivations: number;
  P2PStatus: number;
  
  currentMaxRpm: number;
  
  // Tyre forces [4] - MZ, FX, FY
  mzFL: number;
  mzFR: number;
  mzRL: number;
  mzRR: number;
  
  fxFL: number;
  fxFR: number;
  fxRL: number;
  fxRR: number;
  
  fyFL: number;
  fyFR: number;
  fyRL: number;
  fyRR: number;
  
  // Slip ratios and angles [4]
  slipRatioFL: number;
  slipRatioFR: number;
  slipRatioRL: number;
  slipRatioRR: number;
  
  slipAngleFL: number;
  slipAngleFR: number;
  slipAngleRL: number;
  slipAngleRR: number;
  
  // TC and ABS in action
  tcinAction: number;
  absInAction: number;
  
  // Suspension damage [4]
  suspensionDamageFL: number;
  suspensionDamageFR: number;
  suspensionDamageRL: number;
  suspensionDamageRR: number;
  
  // Tyre temps (seems to be duplicate, but keeping for completeness) [4]
  tyreTempFL: number;
  tyreTempFR: number;
  tyreTempRL: number;
  tyreTempRR: number;
  
  // Derived fields (calculated from frame-to-frame differences)
  suspensionVelocityFL?: number;
  suspensionVelocityFR?: number;
  suspensionVelocityRL?: number;
  suspensionVelocityRR?: number;
  
  tyreTempVelocityFL?: number;
  tyreTempVelocityFR?: number;
  tyreTempVelocityRL?: number;
  tyreTempVelocityRR?: number;
  
  shifting?: number;      // 1 when gear changes, 0 otherwise
  rpmVelocity?: number;  // Rate of RPM change
  fuelConsumptionRate?: number; // Rate of fuel consumption
  
  totalWheelSlip?: number;      // Combined wheel slip magnitude
  averageTyreTemp?: number;     // Average tyre core temperature
  averageBrakeTemp?: number;    // Average brake temperature
  sessionID?: number;           // Session identifier for data grouping
}

// Graphics frame interface - session and UI data
export interface ACCGraphicsFrame extends ACCBaseFrame {
  packet_type: ACCPacketType.GRAPHICS;
  packetId: number;
  
  // Session info
  status: ACStatus;
  session: ACSessionType;
  
  // Text fields (wide char strings)
  currentTime: string;   // Current lap time display string
  lastTime: string;      // Last lap time display string
  bestTime: string;      // Best lap time display string
  split: string;         // Split time string
  
  completedLaps: number;
  position: number;
  
  // Timing (integer values in milliseconds)
  iCurrentTime: number;  // Current lap time in milliseconds
  iLastTime: number;     // Last lap time in milliseconds
  iBestTime: number;     // Best lap time in milliseconds
  sessionTimeLeft: number;
  distanceTraveled: number;
  
  // Track position
  isInPit: number;
  currentSectorIndex: number;
  lastSectorTime: number;
  numberOfLaps: number;
  tyreCompound: string;  // Tyre compound string
  replayTimeMultiplier: number;
  normalizedCarPosition: number; // Position on track (0-1)
  
  // Race info
  activeCars: number;
  
  // Car coordinates [60][3] - X, Y, Z for each car
  carCoordinates: number[]; // Flattened array of 180 numbers (60 cars * 3 coordinates)
  
  // Car IDs [60]
  carIDs: number[];
  
  playerCarID: number;
  penaltyTime: number;
  flag: ACFlagType;
  penalty: number;       // PenaltyShortcut enum value
  idealLineOn: number;
  isInPitLane: number;
  
  // Weather and surface
  surfaceGrip: number;
  mandatoryPitDone: number;
  windSpeed: number;
  windDirection: number;
  
  // UI state
  isSetupMenuVisible: number;
  
  // Display indices
  mainDisplayIndex: number;
  secondaryDisplayIndex: number;
  
  // Car settings
  TC: number;            // Traction Control setting
  TCCut: number;         // TC Cut setting
  EngineMap: number;     // Engine map setting
  ABS: number;           // ABS setting
  fuelXLap: number;      // Fuel per lap
  rainLights: number;
  flashingLights: number;
  lightsStage: number;
  exhaustTemperature: number;
  wiperLV: number;       // Wiper level
  
  // Driver stint timing
  DriverStintTotalTimeLeft: number;
  DriverStintTimeLeft: number;
  
  rainTyres: number;
}

// Static frame interface - configuration data
export interface ACCStaticFrame extends ACCBaseFrame {
  packet_type: ACCPacketType.STATIC;
  
  // Version strings
  smVersion: string;
  acVersion: string;
  
  // Session config
  numberOfSessions: number;
  numCars: number;
  
  // Text fields (wide char strings)
  carModel: string;
  track: string;
  playerName: string;
  playerSurname: string;
  playerNick: string;
  
  sectorCount: number;
  
  // Car specs
  maxTorque: number;
  maxPower: number;
  maxRpm: number;
  maxFuel: number;
  
  // Suspension specs [4] - FL, FR, RL, RR
  suspensionMaxTravelFL: number;
  suspensionMaxTravelFR: number;
  suspensionMaxTravelRL: number;
  suspensionMaxTravelRR: number;
  
  // Tyre specs [4] - FL, FR, RL, RR
  tyreRadiusFL: number;
  tyreRadiusFR: number;
  tyreRadiusRL: number;
  tyreRadiusRR: number;
  
  maxTurboBoost: number;
  
  // Deprecated fields
  deprecated_1: number;
  deprecated_2: number;
  
  penaltiesEnabled: number;
  
  // Aid settings
  aidFuelRate: number;
  aidTireRate: number;
  aidMechanicalDamage: number;
  aidAllowTyreBlankets: number;
  aidStability: number;
  aidAutoClutch: number;
  aidAutoBlip: number;
  
  // Car capabilities
  hasDRS: number;
  hasERS: number;
  hasKERS: number;
  kersMaxJ: number;
  engineBrakeSettingsCount: number;
  ersPowerControllerCount: number;
  
  // Track info
  trackSPlineLength: number;
  trackConfiguration: string;
  ersMaxJ: number;
  
  // Race format
  isTimedRace: number;
  hasExtraLap: number;
  
  // Car appearance
  carSkin: string;
  
  // Grid settings
  reversedGridPositions: number;
  PitWindowStart: number;
  PitWindowEnd: number;
  
  isOnline: number;
}

// Union type for all ACC frame types
export type ACCFrame = ACCPhysicsFrame | ACCGraphicsFrame | ACCStaticFrame;

class ACCDecoder implements TelemetryDecoder {
  private previousPhysicsFrame: ACCPhysicsFrame | null = null;
  
  decode(buffer: ArrayBuffer): Frame | null {
    if (!buffer || buffer.byteLength === 0) {
      return null;
    }

    const view = new DataView(buffer);
    
    // First byte is packet type (added by PowerShell script)
    if (buffer.byteLength < 1) {
      return null;
    }
    
    const packetType = view.getUint8(0);
    
    // Skip the packet type byte for actual data parsing
    const dataBuffer = buffer.slice(1);
    const dataView = new DataView(dataBuffer);
    
    switch (packetType) {
      case ACCPacketType.PHYSICS:
        return this.decodePhysics(dataView);
      case ACCPacketType.GRAPHICS:
        return this.decodeGraphics(dataView);
      case ACCPacketType.STATIC:
        return this.decodeStatic(dataView);
      default:
        console.warn(`Unknown ACC packet type: ${packetType}`);
        return null;
    }
  }

  private decodePhysics(view: DataView): ACCPhysicsFrame | null {
    try {
      let offset = 0;
      
      const packetId = view.getInt32(offset, true); offset += 4;
      
      // Vehicle dynamics
      const gas = view.getFloat32(offset, true); offset += 4;
      const brake = view.getFloat32(offset, true); offset += 4;
      const fuel = view.getFloat32(offset, true); offset += 4;
      const gear = view.getInt32(offset, true); offset += 4;
      const rpms = view.getInt32(offset, true); offset += 4;
      const steerAngle = view.getFloat32(offset, true); offset += 4;
      const speedKmh = view.getFloat32(offset, true); offset += 4;
      
      // Velocity vector [3]
      const velocityX = view.getFloat32(offset, true); offset += 4;
      const velocityY = view.getFloat32(offset, true); offset += 4;
      const velocityZ = view.getFloat32(offset, true); offset += 4;
      
      // G-force vector [3]
      const accGX = view.getFloat32(offset, true); offset += 4;
      const accGY = view.getFloat32(offset, true); offset += 4;
      const accGZ = view.getFloat32(offset, true); offset += 4;
      
      // Wheel slip [4] - FL, FR, RL, RR
      const wheelSlipFL = view.getFloat32(offset, true); offset += 4;
      const wheelSlipFR = view.getFloat32(offset, true); offset += 4;
      const wheelSlipRL = view.getFloat32(offset, true); offset += 4;
      const wheelSlipRR = view.getFloat32(offset, true); offset += 4;
      
      // Wheel load [4] - FL, FR, RL, RR
      const wheelLoadFL = view.getFloat32(offset, true); offset += 4;
      const wheelLoadFR = view.getFloat32(offset, true); offset += 4;
      const wheelLoadRL = view.getFloat32(offset, true); offset += 4;
      const wheelLoadRR = view.getFloat32(offset, true); offset += 4;
      
      // Wheel pressures [4] - FL, FR, RL, RR
      const wheelsPressureFL = view.getFloat32(offset, true); offset += 4;
      const wheelsPressureFR = view.getFloat32(offset, true); offset += 4;
      const wheelsPressureRL = view.getFloat32(offset, true); offset += 4;
      const wheelsPressureRR = view.getFloat32(offset, true); offset += 4;
      
      // Wheel angular speed [4] - FL, FR, RL, RR
      const wheelAngularSpeedFL = view.getFloat32(offset, true); offset += 4;
      const wheelAngularSpeedFR = view.getFloat32(offset, true); offset += 4;
      const wheelAngularSpeedRL = view.getFloat32(offset, true); offset += 4;
      const wheelAngularSpeedRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre wear [4] - FL, FR, RL, RR
      const tyreWearFL = view.getFloat32(offset, true); offset += 4;
      const tyreWearFR = view.getFloat32(offset, true); offset += 4;
      const tyreWearRL = view.getFloat32(offset, true); offset += 4;
      const tyreWearRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre dirty level [4] - FL, FR, RL, RR
      const tyreDirtyLevelFL = view.getFloat32(offset, true); offset += 4;
      const tyreDirtyLevelFR = view.getFloat32(offset, true); offset += 4;
      const tyreDirtyLevelRL = view.getFloat32(offset, true); offset += 4;
      const tyreDirtyLevelRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre core temperature [4] - FL, FR, RL, RR
      const tyreCoreTemperatureFL = view.getFloat32(offset, true); offset += 4;
      const tyreCoreTemperatureFR = view.getFloat32(offset, true); offset += 4;
      const tyreCoreTemperatureRL = view.getFloat32(offset, true); offset += 4;
      const tyreCoreTemperatureRR = view.getFloat32(offset, true); offset += 4;
      
      // Camber in radians [4] - FL, FR, RL, RR
      const camberRADFL = view.getFloat32(offset, true); offset += 4;
      const camberRADFR = view.getFloat32(offset, true); offset += 4;
      const camberRADRL = view.getFloat32(offset, true); offset += 4;
      const camberRADRR = view.getFloat32(offset, true); offset += 4;
      
      // Suspension travel [4] - FL, FR, RL, RR
      const suspensionTravelFL = view.getFloat32(offset, true); offset += 4;
      const suspensionTravelFR = view.getFloat32(offset, true); offset += 4;
      const suspensionTravelRL = view.getFloat32(offset, true); offset += 4;
      const suspensionTravelRR = view.getFloat32(offset, true); offset += 4;
      
      // Electronics
      const drs = view.getFloat32(offset, true); offset += 4;
      const tc = view.getFloat32(offset, true); offset += 4;
      
      // Car orientation
      const heading = view.getFloat32(offset, true); offset += 4;
      const pitch = view.getFloat32(offset, true); offset += 4;
      const roll = view.getFloat32(offset, true); offset += 4;
      const cgHeight = view.getFloat32(offset, true); offset += 4;
      
      // Car damage [5]
      const carDamageFront = view.getFloat32(offset, true); offset += 4;
      const carDamageRear = view.getFloat32(offset, true); offset += 4;
      const carDamageLeft = view.getFloat32(offset, true); offset += 4;
      const carDamageRight = view.getFloat32(offset, true); offset += 4;
      const carDamageCenter = view.getFloat32(offset, true); offset += 4;
      
      const numberOfTyresOut = view.getInt32(offset, true); offset += 4;
      const pitLimiterOn = view.getInt32(offset, true); offset += 4;
      const abs = view.getFloat32(offset, true); offset += 4;
      
      // KERS/ERS
      const kersCharge = view.getFloat32(offset, true); offset += 4;
      const kersInput = view.getFloat32(offset, true); offset += 4;
      const autoShifterOn = view.getInt32(offset, true); offset += 4;
      
      // Ride height [2] - front, rear
      const rideHeightFront = view.getFloat32(offset, true); offset += 4;
      const rideHeightRear = view.getFloat32(offset, true); offset += 4;
      
      // Additional physics
      const turboBoost = view.getFloat32(offset, true); offset += 4;
      const ballast = view.getFloat32(offset, true); offset += 4;
      const airDensity = view.getFloat32(offset, true); offset += 4;
      const airTemp = view.getFloat32(offset, true); offset += 4;
      const roadTemp = view.getFloat32(offset, true); offset += 4;
      
      // Local angular velocity [3]
      const localAngularVelX = view.getFloat32(offset, true); offset += 4;
      const localAngularVelY = view.getFloat32(offset, true); offset += 4;
      const localAngularVelZ = view.getFloat32(offset, true); offset += 4;
      
      const finalFF = view.getFloat32(offset, true); offset += 4;
      const performanceMeter = view.getFloat32(offset, true); offset += 4;
      
      // Engine and ERS details
      const engineBrake = view.getInt32(offset, true); offset += 4;
      const ersRecoveryLevel = view.getInt32(offset, true); offset += 4;
      const ersPowerLevel = view.getInt32(offset, true); offset += 4;
      const ersHeatCharging = view.getInt32(offset, true); offset += 4;
      const ersIsCharging = view.getInt32(offset, true); offset += 4;
      const kersCurrentKJ = view.getFloat32(offset, true); offset += 4;
      
      // DRS details
      const drsAvailable = view.getInt32(offset, true); offset += 4;
      const drsEnabled = view.getInt32(offset, true); offset += 4;
      
      // Brake temperatures [4] - FL, FR, RL, RR
      const brakeTempFL = view.getFloat32(offset, true); offset += 4;
      const brakeTempFR = view.getFloat32(offset, true); offset += 4;
      const brakeTempRL = view.getFloat32(offset, true); offset += 4;
      const brakeTempRR = view.getFloat32(offset, true); offset += 4;
      
      const clutch = view.getFloat32(offset, true); offset += 4;
      
      // Tyre surface temperatures [4] - Inner, Middle, Outer
      const tyreTempIFL = view.getFloat32(offset, true); offset += 4;
      const tyreTempIFR = view.getFloat32(offset, true); offset += 4;
      const tyreTempIRL = view.getFloat32(offset, true); offset += 4;
      const tyreTempIRR = view.getFloat32(offset, true); offset += 4;
      
      const tyreTempMFL = view.getFloat32(offset, true); offset += 4;
      const tyreTempMFR = view.getFloat32(offset, true); offset += 4;
      const tyreTempMRL = view.getFloat32(offset, true); offset += 4;
      const tyreTempMRR = view.getFloat32(offset, true); offset += 4;
      
      const tyreTempOFL = view.getFloat32(offset, true); offset += 4;
      const tyreTempOFR = view.getFloat32(offset, true); offset += 4;
      const tyreTempORL = view.getFloat32(offset, true); offset += 4;
      const tyreTempORR = view.getFloat32(offset, true); offset += 4;
      
      const isAIControlled = view.getInt32(offset, true); offset += 4;
      
      // Tyre contact points [4][3] - FL, FR, RL, RR x XYZ
      const tyreContactPointFLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointFLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointFLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointFRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointFRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointFRZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactPointRRZ = view.getFloat32(offset, true); offset += 4;
      
      // Tyre contact normals [4][3]
      const tyreContactNormalFLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalFLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalFLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalFRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalFRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalFRZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactNormalRRZ = view.getFloat32(offset, true); offset += 4;
      
      // Tyre contact headings [4][3]
      const tyreContactHeadingFLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingFLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingFLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingFRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingFRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingFRZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRLX = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRLY = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRLZ = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRRX = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRRY = view.getFloat32(offset, true); offset += 4;
      const tyreContactHeadingRRZ = view.getFloat32(offset, true); offset += 4;
      
      const brakeBias = view.getFloat32(offset, true); offset += 4;
      
      // Local velocity [3]
      const localVelocityX = view.getFloat32(offset, true); offset += 4;
      const localVelocityY = view.getFloat32(offset, true); offset += 4;
      const localVelocityZ = view.getFloat32(offset, true); offset += 4;
      
      // P2P (Push to Pass)
      const P2PActivations = view.getInt32(offset, true); offset += 4;
      const P2PStatus = view.getInt32(offset, true); offset += 4;
      
      const currentMaxRpm = view.getInt32(offset, true); offset += 4;
      
      // Tyre forces [4] - MZ
      const mzFL = view.getFloat32(offset, true); offset += 4;
      const mzFR = view.getFloat32(offset, true); offset += 4;
      const mzRL = view.getFloat32(offset, true); offset += 4;
      const mzRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre forces [4] - FX
      const fxFL = view.getFloat32(offset, true); offset += 4;
      const fxFR = view.getFloat32(offset, true); offset += 4;
      const fxRL = view.getFloat32(offset, true); offset += 4;
      const fxRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre forces [4] - FY
      const fyFL = view.getFloat32(offset, true); offset += 4;
      const fyFR = view.getFloat32(offset, true); offset += 4;
      const fyRL = view.getFloat32(offset, true); offset += 4;
      const fyRR = view.getFloat32(offset, true); offset += 4;
      
      // Slip ratios [4]
      const slipRatioFL = view.getFloat32(offset, true); offset += 4;
      const slipRatioFR = view.getFloat32(offset, true); offset += 4;
      const slipRatioRL = view.getFloat32(offset, true); offset += 4;
      const slipRatioRR = view.getFloat32(offset, true); offset += 4;
      
      // Slip angles [4]
      const slipAngleFL = view.getFloat32(offset, true); offset += 4;
      const slipAngleFR = view.getFloat32(offset, true); offset += 4;
      const slipAngleRL = view.getFloat32(offset, true); offset += 4;
      const slipAngleRR = view.getFloat32(offset, true); offset += 4;
      
      // TC and ABS in action
      const tcinAction = view.getInt32(offset, true); offset += 4;
      const absInAction = view.getInt32(offset, true); offset += 4;
      
      // Suspension damage [4]
      const suspensionDamageFL = view.getFloat32(offset, true); offset += 4;
      const suspensionDamageFR = view.getFloat32(offset, true); offset += 4;
      const suspensionDamageRL = view.getFloat32(offset, true); offset += 4;
      const suspensionDamageRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre temperatures (final) [4]
      const tyreTempFL = view.getFloat32(offset, true); offset += 4;
      const tyreTempFR = view.getFloat32(offset, true); offset += 4;
      const tyreTempRL = view.getFloat32(offset, true); offset += 4;
      const tyreTempRR = view.getFloat32(offset, true); offset += 4;
      
      const frame: ACCPhysicsFrame = {
        packet_type: ACCPacketType.PHYSICS,
        t: Date.now() / 1000,
        packetId,
        
        // Vehicle dynamics
        gas, brake, fuel, gear, rpms, steerAngle, speedKmh,
        
        // Physics vectors
        velocityX, velocityY, velocityZ,
        accGX, accGY, accGZ,
        
        // Wheel data - FL, FR, RL, RR
        wheelSlipFL, wheelSlipFR, wheelSlipRL, wheelSlipRR,
        wheelLoadFL, wheelLoadFR, wheelLoadRL, wheelLoadRR,
        wheelsPressureFL, wheelsPressureFR, wheelsPressureRL, wheelsPressureRR,
        wheelAngularSpeedFL, wheelAngularSpeedFR, wheelAngularSpeedRL, wheelAngularSpeedRR,
        
        // Tyre data
        tyreWearFL, tyreWearFR, tyreWearRL, tyreWearRR,
        tyreDirtyLevelFL, tyreDirtyLevelFR, tyreDirtyLevelRL, tyreDirtyLevelRR,
        tyreCoreTemperatureFL, tyreCoreTemperatureFR, tyreCoreTemperatureRL, tyreCoreTemperatureRR,
        
        // Camber
        camberRADFL, camberRADFR, camberRADRL, camberRADRR,
        
        // Suspension
        suspensionTravelFL, suspensionTravelFR, suspensionTravelRL, suspensionTravelRR,
        
        // Electronics
        drs, tc, abs,
        
        // Car orientation
        heading, pitch, roll, cgHeight,
        
        // Car damage
        carDamageFront, carDamageRear, carDamageLeft, carDamageRight, carDamageCenter,
        
        // Additional fields
        numberOfTyresOut, pitLimiterOn,
        kersCharge, kersInput, autoShifterOn,
        rideHeightFront, rideHeightRear,
        turboBoost, ballast, airDensity, airTemp, roadTemp,
        localAngularVelX, localAngularVelY, localAngularVelZ,
        finalFF, performanceMeter,
        engineBrake, ersRecoveryLevel, ersPowerLevel, ersHeatCharging, ersIsCharging, kersCurrentKJ,
        drsAvailable, drsEnabled,
        brakeTempFL, brakeTempFR, brakeTempRL, brakeTempRR,
        clutch,
        tyreTempIFL, tyreTempIFR, tyreTempIRL, tyreTempIRR,
        tyreTempMFL, tyreTempMFR, tyreTempMRL, tyreTempMRR,
        tyreTempOFL, tyreTempOFR, tyreTempORL, tyreTempORR,
        isAIControlled,
        tyreContactPointFLX, tyreContactPointFLY, tyreContactPointFLZ,
        tyreContactPointFRX, tyreContactPointFRY, tyreContactPointFRZ,
        tyreContactPointRLX, tyreContactPointRLY, tyreContactPointRLZ,
        tyreContactPointRRX, tyreContactPointRRY, tyreContactPointRRZ,
        tyreContactNormalFLX, tyreContactNormalFLY, tyreContactNormalFLZ,
        tyreContactNormalFRX, tyreContactNormalFRY, tyreContactNormalFRZ,
        tyreContactNormalRLX, tyreContactNormalRLY, tyreContactNormalRLZ,
        tyreContactNormalRRX, tyreContactNormalRRY, tyreContactNormalRRZ,
        tyreContactHeadingFLX, tyreContactHeadingFLY, tyreContactHeadingFLZ,
        tyreContactHeadingFRX, tyreContactHeadingFRY, tyreContactHeadingFRZ,
        tyreContactHeadingRLX, tyreContactHeadingRLY, tyreContactHeadingRLZ,
        tyreContactHeadingRRX, tyreContactHeadingRRY, tyreContactHeadingRRZ,
        brakeBias,
        localVelocityX, localVelocityY, localVelocityZ,
        P2PActivations, P2PStatus,
        currentMaxRpm,
        mzFL, mzFR, mzRL, mzRR,
        fxFL, fxFR, fxRL, fxRR,
        fyFL, fyFR, fyRL, fyRR,
        slipRatioFL, slipRatioFR, slipRatioRL, slipRatioRR,
        slipAngleFL, slipAngleFR, slipAngleRL, slipAngleRR,
        tcinAction, absInAction,
        suspensionDamageFL, suspensionDamageFR, suspensionDamageRL, suspensionDamageRR,
        tyreTempFL, tyreTempFR, tyreTempRL, tyreTempRR
      };
      
      // Calculate derived fields if needed
      this.calculateDerivedFields(frame);
      
      // Store current frame as previous for next calculation
      this.previousPhysicsFrame = frame;
      
      return frame;
      
    } catch (error) {
      console.error('Error decoding ACC physics data:', error);
      return null;
    }
  }

  private decodeGraphics(view: DataView): ACCGraphicsFrame | null {
    try {
      let offset = 0;
      
      const packetId = view.getInt32(offset, true); offset += 4;
      const status = view.getInt32(offset, true); offset += 4;
      const session = view.getInt32(offset, true); offset += 4;
      
      // Decode wide character strings - currentTime[15], lastTime[15], bestTime[15], split[15]
      const currentTime = this.decodeWideString(view, offset, 15); offset += 30; // 15 * 2 bytes
      const lastTime = this.decodeWideString(view, offset, 15); offset += 30;
      const bestTime = this.decodeWideString(view, offset, 15); offset += 30;
      const split = this.decodeWideString(view, offset, 15); offset += 30;
      
      const completedLaps = view.getInt32(offset, true); offset += 4;
      const position = view.getInt32(offset, true); offset += 4;
      const iCurrentTime = view.getInt32(offset, true); offset += 4;
      const iLastTime = view.getInt32(offset, true); offset += 4;
      const iBestTime = view.getInt32(offset, true); offset += 4;
      const sessionTimeLeft = view.getFloat32(offset, true); offset += 4;
      const distanceTraveled = view.getFloat32(offset, true); offset += 4;
      const isInPit = view.getInt32(offset, true); offset += 4;
      const currentSectorIndex = view.getInt32(offset, true); offset += 4;
      const lastSectorTime = view.getInt32(offset, true); offset += 4;
      const numberOfLaps = view.getInt32(offset, true); offset += 4;
      
      // Decode tyreCompound[33]
      const tyreCompound = this.decodeWideString(view, offset, 33); offset += 66; // 33 * 2 bytes
      
      const replayTimeMultiplier = view.getFloat32(offset, true); offset += 4;
      const normalizedCarPosition = view.getFloat32(offset, true); offset += 4;
      const activeCars = view.getInt32(offset, true); offset += 4;
      
      // Decode carCoordinates[60][3] - 60 cars * 3 coordinates * 4 bytes = 720 bytes
      const carCoordinates: number[] = [];
      for (let i = 0; i < 180; i++) { // 60 * 3
        carCoordinates.push(view.getFloat32(offset, true));
        offset += 4;
      }
      
      // Decode carID[60] - 60 cars * 4 bytes = 240 bytes
      const carIDs: number[] = [];
      for (let i = 0; i < 60; i++) {
        carIDs.push(view.getInt32(offset, true));
        offset += 4;
      }
      
      const playerCarID = view.getInt32(offset, true); offset += 4;
      const penaltyTime = view.getFloat32(offset, true); offset += 4;
      const flag = view.getInt32(offset, true); offset += 4;
      const penalty = view.getInt32(offset, true); offset += 4; // PenaltyShortcut enum
      const idealLineOn = view.getInt32(offset, true); offset += 4;
      const isInPitLane = view.getInt32(offset, true); offset += 4;
      
      // Weather and surface
      const surfaceGrip = view.getFloat32(offset, true); offset += 4;
      const mandatoryPitDone = view.getInt32(offset, true); offset += 4;
      const windSpeed = view.getFloat32(offset, true); offset += 4;
      const windDirection = view.getFloat32(offset, true); offset += 4;
      
      // UI state
      const isSetupMenuVisible = view.getInt32(offset, true); offset += 4;
      
      // Display indices
      const mainDisplayIndex = view.getInt32(offset, true); offset += 4;
      const secondaryDisplayIndex = view.getInt32(offset, true); offset += 4;
      
      // Car settings
      const TC = view.getInt32(offset, true); offset += 4;
      const TCCut = view.getInt32(offset, true); offset += 4;
      const EngineMap = view.getInt32(offset, true); offset += 4;
      const ABS = view.getInt32(offset, true); offset += 4;
      const fuelXLap = view.getInt32(offset, true); offset += 4;
      const rainLights = view.getInt32(offset, true); offset += 4;
      const flashingLights = view.getInt32(offset, true); offset += 4;
      const lightsStage = view.getInt32(offset, true); offset += 4;
      const exhaustTemperature = view.getFloat32(offset, true); offset += 4;
      const wiperLV = view.getInt32(offset, true); offset += 4;
      
      // Driver stint timing
      const DriverStintTotalTimeLeft = view.getInt32(offset, true); offset += 4;
      const DriverStintTimeLeft = view.getInt32(offset, true); offset += 4;
      const rainTyres = view.getInt32(offset, true); offset += 4;
      
      return {
        packet_type: ACCPacketType.GRAPHICS,
        t: Date.now() / 1000,
        packetId,
        status, session,
        currentTime, lastTime, bestTime, split,
        completedLaps, position,
        iCurrentTime, iLastTime, iBestTime,
        sessionTimeLeft, distanceTraveled,
        isInPit, currentSectorIndex, lastSectorTime, numberOfLaps,
        tyreCompound, replayTimeMultiplier, normalizedCarPosition,
        activeCars, carCoordinates, carIDs,
        playerCarID, penaltyTime, flag, penalty,
        idealLineOn, isInPitLane,
        surfaceGrip, mandatoryPitDone,
        windSpeed, windDirection,
        isSetupMenuVisible,
        mainDisplayIndex, secondaryDisplayIndex,
        TC, TCCut, EngineMap, ABS, fuelXLap,
        rainLights, flashingLights, lightsStage,
        exhaustTemperature, wiperLV,
        DriverStintTotalTimeLeft, DriverStintTimeLeft,
        rainTyres
      };
    } catch (error) {
      console.error('Error decoding ACC graphics data:', error);
      return null;
    }
  }

  private decodeStatic(view: DataView): ACCStaticFrame | null {
    try {
      let offset = 0;
      
      // Decode version strings
      const smVersion = this.decodeWideString(view, offset, 15); offset += 30; // 15 * 2 bytes
      const acVersion = this.decodeWideString(view, offset, 15); offset += 30;
      
      // Session config
      const numberOfSessions = view.getInt32(offset, true); offset += 4;
      const numCars = view.getInt32(offset, true); offset += 4;
      
      // Decode string fields
      const carModel = this.decodeWideString(view, offset, 33); offset += 66; // 33 * 2 bytes
      const track = this.decodeWideString(view, offset, 33); offset += 66;
      const playerName = this.decodeWideString(view, offset, 33); offset += 66;
      const playerSurname = this.decodeWideString(view, offset, 33); offset += 66;
      const playerNick = this.decodeWideString(view, offset, 33); offset += 66;
      
      const sectorCount = view.getInt32(offset, true); offset += 4;
      
      // Car specs
      const maxTorque = view.getFloat32(offset, true); offset += 4;
      const maxPower = view.getFloat32(offset, true); offset += 4;
      const maxRpm = view.getInt32(offset, true); offset += 4;
      const maxFuel = view.getFloat32(offset, true); offset += 4;
      
      // Suspension max travel [4] - FL, FR, RL, RR
      const suspensionMaxTravelFL = view.getFloat32(offset, true); offset += 4;
      const suspensionMaxTravelFR = view.getFloat32(offset, true); offset += 4;
      const suspensionMaxTravelRL = view.getFloat32(offset, true); offset += 4;
      const suspensionMaxTravelRR = view.getFloat32(offset, true); offset += 4;
      
      // Tyre radius [4] - FL, FR, RL, RR
      const tyreRadiusFL = view.getFloat32(offset, true); offset += 4;
      const tyreRadiusFR = view.getFloat32(offset, true); offset += 4;
      const tyreRadiusRL = view.getFloat32(offset, true); offset += 4;
      const tyreRadiusRR = view.getFloat32(offset, true); offset += 4;
      
      const maxTurboBoost = view.getFloat32(offset, true); offset += 4;
      
      // Deprecated fields
      const deprecated_1 = view.getFloat32(offset, true); offset += 4;
      const deprecated_2 = view.getFloat32(offset, true); offset += 4;
      
      const penaltiesEnabled = view.getInt32(offset, true); offset += 4;
      
      // Aid settings
      const aidFuelRate = view.getFloat32(offset, true); offset += 4;
      const aidTireRate = view.getFloat32(offset, true); offset += 4;
      const aidMechanicalDamage = view.getFloat32(offset, true); offset += 4;
      const aidAllowTyreBlankets = view.getInt32(offset, true); offset += 4;
      const aidStability = view.getFloat32(offset, true); offset += 4;
      const aidAutoClutch = view.getInt32(offset, true); offset += 4;
      const aidAutoBlip = view.getInt32(offset, true); offset += 4;
      
      // Car capabilities
      const hasDRS = view.getInt32(offset, true); offset += 4;
      const hasERS = view.getInt32(offset, true); offset += 4;
      const hasKERS = view.getInt32(offset, true); offset += 4;
      const kersMaxJ = view.getFloat32(offset, true); offset += 4;
      const engineBrakeSettingsCount = view.getInt32(offset, true); offset += 4;
      const ersPowerControllerCount = view.getInt32(offset, true); offset += 4;
      const trackSPlineLength = view.getFloat32(offset, true); offset += 4;
      
      const trackConfiguration = this.decodeWideString(view, offset, 33); offset += 66;
      
      const ersMaxJ = view.getFloat32(offset, true); offset += 4;
      
      // Race format
      const isTimedRace = view.getInt32(offset, true); offset += 4;
      const hasExtraLap = view.getInt32(offset, true); offset += 4;
      
      const carSkin = this.decodeWideString(view, offset, 33); offset += 66;
      
      // Grid settings
      const reversedGridPositions = view.getInt32(offset, true); offset += 4;
      const PitWindowStart = view.getInt32(offset, true); offset += 4;
      const PitWindowEnd = view.getInt32(offset, true); offset += 4;
      const isOnline = view.getInt32(offset, true); offset += 4;
      
      return {
        packet_type: ACCPacketType.STATIC,
        t: Date.now() / 1000,
        smVersion, acVersion,
        numberOfSessions, numCars,
        carModel, track, playerName, playerSurname, playerNick,
        sectorCount,
        maxTorque, maxPower, maxRpm, maxFuel,
        suspensionMaxTravelFL, suspensionMaxTravelFR, suspensionMaxTravelRL, suspensionMaxTravelRR,
        tyreRadiusFL, tyreRadiusFR, tyreRadiusRL, tyreRadiusRR,
        maxTurboBoost,
        deprecated_1, deprecated_2,
        penaltiesEnabled,
        aidFuelRate, aidTireRate, aidMechanicalDamage, aidAllowTyreBlankets,
        aidStability, aidAutoClutch, aidAutoBlip,
        hasDRS, hasERS, hasKERS, kersMaxJ,
        engineBrakeSettingsCount, ersPowerControllerCount,
        trackSPlineLength, trackConfiguration, ersMaxJ,
        isTimedRace, hasExtraLap,
        carSkin,
        reversedGridPositions, PitWindowStart, PitWindowEnd,
        isOnline
      };
    } catch (error) {
      console.error('Error decoding ACC static data:', error);
      return null;
    }
  }
  
  private decodeWideString(view: DataView, offset: number, maxLength: number): string {
    // Decode UTF-16 wide character string
    try {
      const chars: number[] = [];
      for (let i = 0; i < maxLength; i++) {
        const char = view.getUint16(offset + i * 2, true);
        if (char === 0) break; // Null terminator
        chars.push(char);
      }
      return String.fromCharCode(...chars);
    } catch (error) {
      console.warn('Error decoding wide string:', error);
      return '';
    }
  }

  getPacketTypeName(packetType: number): string {
    switch (packetType) {
      case ACCPacketType.PHYSICS:
        return 'Physics';
      case ACCPacketType.GRAPHICS:
        return 'Graphics';
      case ACCPacketType.STATIC:
        return 'Static';
      default:
        return `Unknown (${packetType})`;
    }
  }

  getSupportedPacketTypes(): { type: number; name: string }[] {
    return [
      { type: ACCPacketType.PHYSICS, name: 'Physics' },
      { type: ACCPacketType.GRAPHICS, name: 'Graphics' },
      { type: ACCPacketType.STATIC, name: 'Static' },
    ];
  }

  getAcceptedPacketSizes(): number[] {
    // ACC shared memory sizes (from PowerShell script detection + 1 byte for packet type)
    return [
      4094, // Physics (4093 + 1)
      4094, // Graphics (4093 + 1)  
      4094, // Static (4093 + 1)
    ];
  }
  
  private calculateDerivedFields(frame: ACCPhysicsFrame) {
    // Calculate derived fields similar to Forza Motorsport implementation
    if (this.previousPhysicsFrame && this.previousPhysicsFrame.packet_type === ACCPacketType.PHYSICS) {
      // Calculate time delta - use timestamp if available, otherwise default to ~60fps
      const dt = Math.abs(frame.t - this.previousPhysicsFrame.t) || 0.016;
      
      // Calculate suspension velocities (change in travel over time)
      frame.suspensionVelocityFL = (frame.suspensionTravelFL - this.previousPhysicsFrame.suspensionTravelFL) / dt;
      frame.suspensionVelocityFR = (frame.suspensionTravelFR - this.previousPhysicsFrame.suspensionTravelFR) / dt;
      frame.suspensionVelocityRL = (frame.suspensionTravelRL - this.previousPhysicsFrame.suspensionTravelRL) / dt;
      frame.suspensionVelocityRR = (frame.suspensionTravelRR - this.previousPhysicsFrame.suspensionTravelRR) / dt;
      
      // Calculate tyre temperature velocities
      frame.tyreTempVelocityFL = (frame.tyreCoreTemperatureFL - this.previousPhysicsFrame.tyreCoreTemperatureFL) / dt;
      frame.tyreTempVelocityFR = (frame.tyreCoreTemperatureFR - this.previousPhysicsFrame.tyreCoreTemperatureFR) / dt;
      frame.tyreTempVelocityRL = (frame.tyreCoreTemperatureRL - this.previousPhysicsFrame.tyreCoreTemperatureRL) / dt;
      frame.tyreTempVelocityRR = (frame.tyreCoreTemperatureRR - this.previousPhysicsFrame.tyreCoreTemperatureRR) / dt;
      
      // Detect gear shifting
      frame.shifting = (frame.gear !== this.previousPhysicsFrame.gear) ? 1 : 0;
      
      // Calculate RPM change rate
      frame.rpmVelocity = (frame.rpms - this.previousPhysicsFrame.rpms) / dt;
      
      // Calculate fuel consumption rate
      frame.fuelConsumptionRate = (this.previousPhysicsFrame.fuel - frame.fuel) / dt;
      
    } else {
      // First frame or different packet type - initialize derived fields
      frame.suspensionVelocityFL = 0;
      frame.suspensionVelocityFR = 0;
      frame.suspensionVelocityRL = 0;
      frame.suspensionVelocityRR = 0;
      
      frame.tyreTempVelocityFL = 0;
      frame.tyreTempVelocityFR = 0;
      frame.tyreTempVelocityRL = 0;
      frame.tyreTempVelocityRR = 0;
      
      frame.shifting = 0;
      frame.rpmVelocity = 0;
      frame.fuelConsumptionRate = 0;
    }
    
    // Calculate additional derived metrics
    frame.totalWheelSlip = Math.sqrt(
      frame.wheelSlipFL * frame.wheelSlipFL +
      frame.wheelSlipFR * frame.wheelSlipFR +
      frame.wheelSlipRL * frame.wheelSlipRL +
      frame.wheelSlipRR * frame.wheelSlipRR
    );
    
    frame.averageTyreTemp = (
      frame.tyreCoreTemperatureFL +
      frame.tyreCoreTemperatureFR +
      frame.tyreCoreTemperatureRL +
      frame.tyreCoreTemperatureRR
    ) / 4;
    
    frame.averageBrakeTemp = (
      frame.brakeTempFL +
      frame.brakeTempFR +
      frame.brakeTempRL +
      frame.brakeTempRR
    ) / 4;
    
    // Generate a session ID based on timestamp (useful for data analysis)
    frame.sessionID = Math.floor(frame.t / 3600) * 3600; // Session changes every hour
  }
}

export const accDecoder = new ACCDecoder();