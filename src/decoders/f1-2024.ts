import { Frame } from '../types';

// F1 2024 UDP telemetry decoder
// Based on F1 2024 game telemetry specification v27.2x
// Supports all packet types defined in the specification

// Packet type enumeration
export enum F1PacketType {
  MOTION = 0,
  SESSION = 1,
  LAP_DATA = 2,
  EVENT = 3,
  PARTICIPANTS = 4,
  CAR_SETUPS = 5,
  CAR_TELEMETRY = 6,
  CAR_STATUS = 7,
  FINAL_CLASSIFICATION = 8,
  LOBBY_INFO = 9,
  CAR_DAMAGE = 10,
  SESSION_HISTORY = 11,
  TYRE_SETS = 12,
  MOTION_EX = 13,
  TIME_TRIAL = 14
}

// Packet header structure (common to all packets)
interface PacketHeader {
  packetFormat: number;          // 2024
  gameYear: number;             // Game year - 24
  gameMajorVersion: number;     // Game major version - "1"
  gameMinorVersion: number;     // Game minor version - "07"
  packetVersion: number;        // Version of this packet type
  packetId: number;             // Identifier for the packet type
  sessionUID: bigint;           // Unique identifier for the session
  sessionTime: number;          // Session timestamp
  frameIdentifier: number;      // Identifier for the frame the data was retrieved on
  overallFrameIdentifier: number; // Overall identifier for the frame
  playerCarIndex: number;       // Index of player's car in the array
  secondaryPlayerCarIndex: number; // Index of secondary player's car
}

// Motion packet data
export interface F1MotionFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Motion data (player car) - CarMotionData structure
  worldPositionX: number;
  worldPositionY: number;
  worldPositionZ: number;
  worldVelocityX: number;
  worldVelocityY: number;
  worldVelocityZ: number;
  worldForwardDirX: number;
  worldForwardDirY: number;
  worldForwardDirZ: number;
  worldRightDirX: number;
  worldRightDirY: number;
  worldRightDirZ: number;
  gForceLateral: number;
  gForceLongitudinal: number;
  gForceVertical: number;
  yaw: number;
  pitch: number;
  roll: number;
}

// Car telemetry packet data
export interface F1TelemetryFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Car telemetry data (player car)
  speed: number;
  throttle: number;
  steer: number;
  brake: number;
  clutch: number;
  gear: number;
  engineRPM: number;
  drs: number;
  revLightsPercent: number;
  revLightsBitValue: number;

  // Brake temperature
  brakesTemperatureRL: number;
  brakesTemperatureRR: number;
  brakesTemperatureFL: number;
  brakesTemperatureFR: number;

  // Tyre surface temperature
  tyresSurfaceTemperatureRL: number;
  tyresSurfaceTemperatureRR: number;
  tyresSurfaceTemperatureFL: number;
  tyresSurfaceTemperatureFR: number;

  // Tyre inner temperature
  tyresInnerTemperatureRL: number;
  tyresInnerTemperatureRR: number;
  tyresInnerTemperatureFL: number;
  tyresInnerTemperatureFR: number;

  // Engine temperature
  engineTemperature: number;

  // Tyre pressure
  tyresPressureRL: number;
  tyresPressureRR: number;
  tyresPressureFL: number;
  tyresPressureFR: number;

  // Surface type
  surfaceTypeRL: number;
  surfaceTypeRR: number;
  surfaceTypeFL: number;
  surfaceTypeFR: number;
}

// Lap data packet
export interface F1LapDataFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Lap data (player car)
  lastLapTimeInMS: number;
  currentLapTimeInMS: number;
  sector1TimeInMS: number;
  sector1TimeMinutes: number;
  sector2TimeInMS: number;
  sector2TimeMinutes: number;
  deltaToCarInFrontInMS: number;
  deltaToRaceLeaderInMS: number;
  lapDistance: number;
  totalDistance: number;
  safetyCarDelta: number;
  carPosition: number;
  currentLapNum: number;
  pitStatus: number;
  numPitStops: number;
  sector: number;
  currentLapInvalid: number;
  penalties: number;
  totalWarnings: number;
  cornerCuttingWarnings: number;
  numUnservedDriveThroughPens: number;
  numUnservedStopGoPens: number;
  gridPosition: number;
  driverStatus: number;
  resultStatus: number;
  pitLaneTimerActive: number;
  pitLaneTimeInLaneInMS: number;
  pitStopTimerInMS: number;
  pitStopShouldServePen: number;
  speedTrapFastestSpeed: number;
  speedTrapFastestLap: number;
}

// Car status packet
export interface F1CarStatusFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Car status data (player car)
  tractionControl: number;
  antiLockBrakes: number;
  fuelMix: number;
  frontBrakeBias: number;
  pitLimiterStatus: number;
  fuelInTank: number;
  fuelCapacity: number;
  fuelRemainingLaps: number;
  maxRPM: number;
  idleRPM: number;
  maxGears: number;
  drsAllowed: number;
  drsActivationDistance: number;

  // Tyre wear
  actualTyreCompound: number;
  visualTyreCompound: number;
  tyresAgeLaps: number;
  vehicleFiaFlags: number;
  enginePowerICE: number;
  enginePowerMGUK: number;
  ersStoreEnergy: number;
  ersDeployMode: number;
  ersHarvestedThisLapMGUK: number;
  ersHarvestedThisLapMGUH: number;
  ersDeployedThisLap: number;
  networkPaused: number;
}

// Session packet
export interface F1SessionFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Session data
  weather: number;
  trackTemperature: number;
  airTemperature: number;
  totalLaps: number;
  trackLength: number;
  sessionType: number;
  trackId: number;
  formula: number;
  sessionTimeLeft: number;
  sessionDuration: number;
  pitSpeedLimit: number;
  gamePaused: number;
  isSpectating: number;
  spectatorCarIndex: number;
  sliProNativeSupport: number;
  numMarshalZones: number;
  marshalZones: MarshalZone[];
  safetyCarStatus: number;
  networkGame: number;
  numWeatherForecastSamples: number;
  weatherForecastSamples: WeatherForecastSample[];
  forecastAccuracy: number;
  aiDifficulty: number;
  seasonLinkIdentifier: number;
  weekendLinkIdentifier: number;
  sessionLinkIdentifier: number;
  pitStopWindowIdealLap: number;
  pitStopWindowLatestLap: number;
  pitStopRejoinPosition: number;
  steeringAssist: number;
  brakingAssist: number;
  gearboxAssist: number;
  pitAssist: number;
  pitReleaseAssist: number;
  ERSAssist: number;
  DRSAssist: number;
  dynamicRacingLine: number;
  dynamicRacingLineType: number;
  gameMode: number;
  ruleSet: number;
  timeOfDay: number;
  sessionLength: number;
  speedUnitsLeadPlayer: number;
  temperatureUnitsLeadPlayer: number;
  speedUnitsSecondaryPlayer: number;
  temperatureUnitsSecondaryPlayer: number;
  numSafetyCarPeriods: number;
  numVirtualSafetyCarPeriods: number;
  numRedFlagPeriods: number;
  equalCarPerformance: number;
  recoveryMode: number;
  flashbackLimit: number;
  surfaceType: number;
  lowFuelMode: number;
  raceStarts: number;
  tyreTemperature: number;
  pitLaneTyreSim: number;
  carDamage: number;
  carDamageRate: number;
  collisions: number;
  collisionsOffForFirstLapOnly: number;
  mpUnsafePitRelease: number;
  mpOffForGriefing: number;
  cornerCuttingStringency: number;
  parcFermeRules: number;
  pitStopExperience: number;
  safetyCar: number;
  safetyCarExperience: number;
  formationLap: number;
  formationLapExperience: number;
  redFlags: number;
  affectsLicenceLevelSolo: number;
  affectsLicenceLevelMP: number;
  numSessionsInWeekend: number;
  weekendStructure: number[];
  sector2LapDistanceStart: number;
  sector3LapDistanceStart: number;
}

interface MarshalZone {
  zoneStart: number;
  zoneFlag: number;
}

interface WeatherForecastSample {
  sessionType: number;
  timeOffset: number;
  weather: number;
  trackTemperature: number;
  trackTemperatureChange: number;
  airTemperature: number;
  airTemperatureChange: number;
  rainPercentage: number;
}

// Event packet
export interface F1EventFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Event data
  eventStringCode: string; // 4 character event code
  eventDetails: any; // Union of different event detail structures
}

// Participants packet
export interface F1ParticipantsFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Participants data
  numActiveCars: number;
  // Player participant data
  aiControlled: number;
  driverId: number;
  networkId: number;
  teamId: number;
  myTeam: number;
  raceNumber: number;
  nationality: number;
  name: string;
  yourTelemetry: number;
  showOnlineNames: number;
  techLevel: number;
  platform: number;
}

// Car setups packet
export interface F1CarSetupsFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Car setup data (player car)
  frontWing: number;
  rearWing: number;
  onThrottle: number;
  offThrottle: number;
  frontCamber: number;
  rearCamber: number;
  frontToe: number;
  rearToe: number;
  frontSuspension: number;
  rearSuspension: number;
  frontAntiRollBar: number;
  rearAntiRollBar: number;
  frontSuspensionHeight: number;
  rearSuspensionHeight: number;
  brakePressure: number;
  brakeBias: number;
  rearLeftTyrePressure: number;
  rearRightTyrePressure: number;
  frontLeftTyrePressure: number;
  frontRightTyrePressure: number;
  ballast: number;
  fuelLoad: number;
}

// Final classification packet
export interface F1FinalClassificationFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Final classification data
  numCars: number;
  // Player classification data
  position: number;
  numLaps: number;
  gridPosition: number;
  points: number;
  numPitStops: number;
  resultStatus: number;
  bestLapTimeInMS: number;
  totalRaceTime: number;
  penaltiesTime: number;
  numPenalties: number;
  numTyreStints: number;
  tyreStintsActual: number[];
  tyreStintsVisual: number[];
  tyreStintsEndLaps: number[];
}

// Lobby info packet
export interface F1LobbyInfoFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Lobby info data
  numPlayers: number;
  // Player lobby data
  aiControlled: number;
  teamId: number;
  nationality: number;
  platform: number;
  name: string;
  carNumber: number;
  readyStatus: number;
}

// Car damage packet
export interface F1CarDamageFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Car damage data (player car)
  tyresWear: number[];
  tyresDamage: number[];
  brakesDamage: number[];
  frontLeftWingDamage: number;
  frontRightWingDamage: number;
  rearWingDamage: number;
  floorDamage: number;
  diffuserDamage: number;
  sidepodDamage: number;
  drsFault: number;
  ersFault: number;
  gearBoxDamage: number;
  engineDamage: number;
  engineMGUHWear: number;
  engineESWear: number;
  engineCEWear: number;
  engineICEWear: number;
  engineMGUKWear: number;
  engineTCWear: number;
  engineBlown: number;
  engineSeized: number;
}

// Session history packet
export interface F1SessionHistoryFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Session history data
  carIdx: number;
  numLaps: number;
  numTyreStints: number;
  bestLapTimeLapNum: number;
  bestSector1LapNum: number;
  bestSector2LapNum: number;
  bestSector3LapNum: number;
  // Lap history data
  lapHistoryData: LapHistoryData[];
  // Tyre stint data
  tyreStintsHistoryData: TyreStintHistoryData[];
}

interface LapHistoryData {
  lapTimeInMS: number;
  sector1TimeMSPart: number;
  sector1TimeMinutesPart: number;
  sector2TimeMSPart: number;
  sector2TimeMinutesPart: number;
  sector3TimeMSPart: number;
  sector3TimeMinutesPart: number;
  lapValidBitFlags: number;
}

interface TyreStintHistoryData {
  endLap: number;
  tyreActualCompound: number;
  tyreVisualCompound: number;
}

// Tyre sets packet
export interface F1TyreSetsFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Tyre sets data
  carIdx: number;
  tyreSetData: TyreSetData[];
  fittedIdx: number;
}

interface TyreSetData {
  actualTyreCompound: number;
  visualTyreCompound: number;
  wear: number;
  available: number;
  recommendedSession: number;
  lifeSpan: number;
  usableLife: number;
  lapDeltaTime: number;
  fitted: number;
}

// Motion ex packet (extended motion data)
export interface F1MotionExFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Extended motion data (player car only)
  suspensionPositionRL: number;
  suspensionPositionRR: number;
  suspensionPositionFL: number;
  suspensionPositionFR: number;
  suspensionVelocityRL: number;
  suspensionVelocityRR: number;
  suspensionVelocityFL: number;
  suspensionVelocityFR: number;
  suspensionAccelerationRL: number;
  suspensionAccelerationRR: number;
  suspensionAccelerationFL: number;
  suspensionAccelerationFR: number;
  wheelSpeedRL: number;
  wheelSpeedRR: number;
  wheelSpeedFL: number;
  wheelSpeedFR: number;
  wheelSlipRatioRL: number;
  wheelSlipRatioRR: number;
  wheelSlipRatioFL: number;
  wheelSlipRatioFR: number;
  wheelSlipAngleRL: number;
  wheelSlipAngleRR: number;
  wheelSlipAngleFL: number;
  wheelSlipAngleFR: number;
  wheelLatForceRL: number;
  wheelLatForceRR: number;
  wheelLatForceFL: number;
  wheelLatForceFR: number;
  wheelLongForceRL: number;
  wheelLongForceRR: number;
  wheelLongForceFL: number;
  wheelLongForceFR: number;
  heightOfCOGAboveGround: number;
  localVelocityX: number;
  localVelocityY: number;
  localVelocityZ: number;
  angularVelocityX: number;
  angularVelocityY: number;
  angularVelocityZ: number;
  angularAccelerationX: number;
  angularAccelerationY: number;
  angularAccelerationZ: number;
  frontWheelsAngle: number;
  wheelVertForceRL: number;
  wheelVertForceRR: number;
  wheelVertForceFL: number;
  wheelVertForceFR: number;
  frontAeroHeight: number;
  rearAeroHeight: number;
  frontRollAngle: number;
  rearRollAngle: number;
  chassisYaw: number;
}

// Time trial packet
export interface F1TimeTrialFrame extends Frame {
  // Header fields
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: number;
  sessionUID: string;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;

  // Time trial data
  carIdx: number;
  teamId: number;
  lapTimeInMS: number;
  sector1TimeInMS: number;
  sector2TimeInMS: number;
  sector3TimeInMS: number;
  tractionControl: number;
  gearboxAssist: number;
  antiLockBrakes: number;
  equalCarPerformance: number;
  customSetup: number;
  valid: number;
}

class F1Decoder {
  decode(buffer: ArrayBuffer): Frame | null {
    if (buffer.byteLength < 29) {
      console.warn('F1 decoder: Buffer too small for packet header');
      return null;
    }

    const view = new DataView(buffer);
    let offset = 0;

    try {
      // Read packet header
      const header = this.readPacketHeader(view, offset);
      offset += 29;

      // Route to appropriate packet decoder based on packet ID
      switch (header.packetId) {
        case F1PacketType.MOTION:
          return this.decodeMotionPacket(view, offset, header);
        case F1PacketType.SESSION:
          return this.decodeSessionPacket(view, offset, header);
        case F1PacketType.LAP_DATA:
          return this.decodeLapDataPacket(view, offset, header);
        case F1PacketType.EVENT:
          return this.decodeEventPacket(view, offset, header);
        case F1PacketType.PARTICIPANTS:
          return this.decodeParticipantsPacket(view, offset, header);
        case F1PacketType.CAR_SETUPS:
          return this.decodeCarSetupsPacket(view, offset, header);
        case F1PacketType.CAR_TELEMETRY:
          return this.decodeTelemetryPacket(view, offset, header);
        case F1PacketType.CAR_STATUS:
          return this.decodeCarStatusPacket(view, offset, header);
        case F1PacketType.FINAL_CLASSIFICATION:
          return this.decodeFinalClassificationPacket(view, offset, header);
        case F1PacketType.LOBBY_INFO:
          return this.decodeLobbyInfoPacket(view, offset, header);
        case F1PacketType.CAR_DAMAGE:
          return this.decodeCarDamagePacket(view, offset, header);
        case F1PacketType.SESSION_HISTORY:
          return this.decodeSessionHistoryPacket(view, offset, header);
        case F1PacketType.TYRE_SETS:
          return this.decodeTyreSetsPacket(view, offset, header);
        case F1PacketType.MOTION_EX:
          return this.decodeMotionExPacket(view, offset, header);
        case F1PacketType.TIME_TRIAL:
          return this.decodeTimeTrialPacket(view, offset, header);
        default:
          // For unknown packet types, return a basic frame
          return this.createBasicFrame(header);
      }
    } catch (error) {
      console.error('F1 decoder error:', error);
      return null;
    }
  }

  private readPacketHeader(view: DataView, offset: number): PacketHeader {
    return {
      packetFormat: view.getUint16(offset, true),
      gameYear: view.getUint8(offset + 2),
      gameMajorVersion: view.getUint8(offset + 3),
      gameMinorVersion: view.getUint8(offset + 4),
      packetVersion: view.getUint8(offset + 5),
      packetId: view.getUint8(offset + 6),
      sessionUID: view.getBigUint64(offset + 7, true),
      sessionTime: view.getFloat32(offset + 15, true),
      frameIdentifier: view.getUint32(offset + 19, true),
      overallFrameIdentifier: view.getUint32(offset + 23, true),
      playerCarIndex: view.getUint8(offset + 27),
      secondaryPlayerCarIndex: view.getUint8(offset + 28)
    };
  }

  private decodeMotionPacket(view: DataView, startOffset: number, header: PacketHeader): F1MotionFrame | null {
    // Motion packet structure per F1 24 v27.2x spec:
    // - PacketHeader (29 bytes) 
    // - CarMotionData[22] (60 bytes each = 1320 bytes)
    // - Total packet size: 1349 bytes
    
    const playerCarOffset = startOffset + (header.playerCarIndex * 60); // Each car motion data is 60 bytes
    let offset = playerCarOffset;

    if (offset + 60 > view.byteLength) {
      console.warn('F1 decoder: Motion packet too small for CarMotionData');
      return null;
    }

    const worldPositionX = view.getFloat32(offset, true); offset += 4;
    const worldPositionY = view.getFloat32(offset, true); offset += 4;
    const worldPositionZ = view.getFloat32(offset, true); offset += 4;
    const worldVelocityX = view.getFloat32(offset, true); offset += 4;
    const worldVelocityY = view.getFloat32(offset, true); offset += 4;
    const worldVelocityZ = view.getFloat32(offset, true); offset += 4;
    const worldForwardDirX = view.getInt16(offset, true) / 32767; offset += 2;
    const worldForwardDirY = view.getInt16(offset, true) / 32767; offset += 2;
    const worldForwardDirZ = view.getInt16(offset, true) / 32767; offset += 2;
    const worldRightDirX = view.getInt16(offset, true) / 32767; offset += 2;
    const worldRightDirY = view.getInt16(offset, true) / 32767; offset += 2;
    const worldRightDirZ = view.getInt16(offset, true) / 32767; offset += 2;
    const gForceLateral = view.getFloat32(offset, true); offset += 4;
    const gForceLongitudinal = view.getFloat32(offset, true); offset += 4;
    const gForceVertical = view.getFloat32(offset, true); offset += 4;
    const yaw = view.getFloat32(offset, true); offset += 4;
    const pitch = view.getFloat32(offset, true); offset += 4;
    const roll = view.getFloat32(offset, true);

    const frame: F1MotionFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.MOTION,
      worldPositionX,
      worldPositionY,
      worldPositionZ,
      worldVelocityX,
      worldVelocityY,
      worldVelocityZ,
      worldForwardDirX,
      worldForwardDirY,
      worldForwardDirZ,
      worldRightDirX,
      worldRightDirY,
      worldRightDirZ,
      gForceLateral,
      gForceLongitudinal,
      gForceVertical,
      yaw,
      pitch,
      roll
    };

    return frame;
  }

  private decodeTelemetryPacket(view: DataView, startOffset: number, header: PacketHeader): F1TelemetryFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 60); // Each car telemetry data is 60 bytes
    let offset = playerCarOffset;

    if (offset + 60 > view.byteLength) {
      console.warn('F1 decoder: Telemetry packet too small');
      return null;
    }

    const speed = view.getUint16(offset, true); offset += 2;
    const throttle = view.getFloat32(offset, true); offset += 4;
    const steer = view.getFloat32(offset, true); offset += 4;
    const brake = view.getFloat32(offset, true); offset += 4;
    const clutch = view.getUint8(offset); offset += 1;
    const gear = view.getInt8(offset); offset += 1;
    const engineRPM = view.getUint16(offset, true); offset += 2;
    const drs = view.getUint8(offset); offset += 1;
    const revLightsPercent = view.getUint8(offset); offset += 1;
    const revLightsBitValue = view.getUint16(offset, true); offset += 2;
    const brakesTemperatureRL = view.getUint16(offset, true); offset += 2;
    const brakesTemperatureRR = view.getUint16(offset, true); offset += 2;
    const brakesTemperatureFL = view.getUint16(offset, true); offset += 2;
    const brakesTemperatureFR = view.getUint16(offset, true); offset += 2;
    const tyresSurfaceTemperatureRL = view.getUint8(offset); offset += 1;
    const tyresSurfaceTemperatureRR = view.getUint8(offset); offset += 1;
    const tyresSurfaceTemperatureFL = view.getUint8(offset); offset += 1;
    const tyresSurfaceTemperatureFR = view.getUint8(offset); offset += 1;
    const tyresInnerTemperatureRL = view.getUint8(offset); offset += 1;
    const tyresInnerTemperatureRR = view.getUint8(offset); offset += 1;
    const tyresInnerTemperatureFL = view.getUint8(offset); offset += 1;
    const tyresInnerTemperatureFR = view.getUint8(offset); offset += 1;
    const engineTemperature = view.getUint16(offset, true); offset += 2;
    const tyresPressureRL = view.getFloat32(offset, true); offset += 4;
    const tyresPressureRR = view.getFloat32(offset, true); offset += 4;
    const tyresPressureFL = view.getFloat32(offset, true); offset += 4;
    const tyresPressureFR = view.getFloat32(offset, true); offset += 4;
    const surfaceTypeRL = view.getUint8(offset); offset += 1;
    const surfaceTypeRR = view.getUint8(offset); offset += 1;
    const surfaceTypeFL = view.getUint8(offset); offset += 1;
    const surfaceTypeFR = view.getUint8(offset);

    const frame: F1TelemetryFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.CAR_TELEMETRY,
      speed,
      throttle,
      steer,
      brake,
      clutch,
      gear,
      engineRPM,
      drs,
      revLightsPercent,
      revLightsBitValue,
      brakesTemperatureRL,
      brakesTemperatureRR,
      brakesTemperatureFL,
      brakesTemperatureFR,
      tyresSurfaceTemperatureRL,
      tyresSurfaceTemperatureRR,
      tyresSurfaceTemperatureFL,
      tyresSurfaceTemperatureFR,
      tyresInnerTemperatureRL,
      tyresInnerTemperatureRR,
      tyresInnerTemperatureFL,
      tyresInnerTemperatureFR,
      engineTemperature,
      tyresPressureRL,
      tyresPressureRR,
      tyresPressureFL,
      tyresPressureFR,
      surfaceTypeRL,
      surfaceTypeRR,
      surfaceTypeFL,
      surfaceTypeFR
    };

    return frame;
  }

  private decodeLapDataPacket(view: DataView, startOffset: number, header: PacketHeader): F1LapDataFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 53); // Each car lap data is 53 bytes
    let offset = playerCarOffset;

    if (offset + 53 > view.byteLength) {
      console.warn('F1 decoder: Lap data packet too small');
      return null;
    }

    const lastLapTimeInMS = view.getUint32(offset, true); offset += 4;
    const currentLapTimeInMS = view.getUint32(offset, true); offset += 4;
    const sector1TimeInMS = view.getUint16(offset, true); offset += 2;
    const sector1TimeMinutes = view.getUint8(offset); offset += 1;
    const sector2TimeInMS = view.getUint16(offset, true); offset += 2;
    const sector2TimeMinutes = view.getUint8(offset); offset += 1;
    const deltaToCarInFrontInMS = view.getUint16(offset, true); offset += 2;
    offset += 1; // Skip minute part
    const deltaToRaceLeaderInMS = view.getUint16(offset, true); offset += 2;
    offset += 1; // Skip minute part
    const lapDistance = view.getFloat32(offset, true); offset += 4;
    const totalDistance = view.getFloat32(offset, true); offset += 4;
    const safetyCarDelta = view.getFloat32(offset, true); offset += 4;
    const carPosition = view.getUint8(offset); offset += 1;
    const currentLapNum = view.getUint8(offset); offset += 1;
    const pitStatus = view.getUint8(offset); offset += 1;
    const numPitStops = view.getUint8(offset); offset += 1;
    const sector = view.getUint8(offset); offset += 1;
    const currentLapInvalid = view.getUint8(offset); offset += 1;
    const penalties = view.getUint8(offset); offset += 1;
    const totalWarnings = view.getUint8(offset); offset += 1;
    const cornerCuttingWarnings = view.getUint8(offset); offset += 1;
    const numUnservedDriveThroughPens = view.getUint8(offset); offset += 1;
    const numUnservedStopGoPens = view.getUint8(offset); offset += 1;
    const gridPosition = view.getUint8(offset); offset += 1;
    const driverStatus = view.getUint8(offset); offset += 1;
    const resultStatus = view.getUint8(offset); offset += 1;
    const pitLaneTimerActive = view.getUint8(offset); offset += 1;
    const pitLaneTimeInLaneInMS = view.getUint16(offset, true); offset += 2;
    const pitStopTimerInMS = view.getUint16(offset, true); offset += 2;
    const pitStopShouldServePen = view.getUint8(offset); offset += 1;
    const speedTrapFastestSpeed = view.getFloat32(offset, true); offset += 4;
    const speedTrapFastestLap = view.getUint8(offset);

    const frame: F1LapDataFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.LAP_DATA,
      lastLapTimeInMS,
      currentLapTimeInMS,
      sector1TimeInMS,
      sector1TimeMinutes,
      sector2TimeInMS,
      sector2TimeMinutes,
      deltaToCarInFrontInMS,
      deltaToRaceLeaderInMS,
      lapDistance,
      totalDistance,
      safetyCarDelta,
      carPosition,
      currentLapNum,
      pitStatus,
      numPitStops,
      sector,
      currentLapInvalid,
      penalties,
      totalWarnings,
      cornerCuttingWarnings,
      numUnservedDriveThroughPens,
      numUnservedStopGoPens,
      gridPosition,
      driverStatus,
      resultStatus,
      pitLaneTimerActive,
      pitLaneTimeInLaneInMS,
      pitStopTimerInMS,
      pitStopShouldServePen,
      speedTrapFastestSpeed,
      speedTrapFastestLap
    };

    return frame;
  }

  private decodeCarStatusPacket(view: DataView, startOffset: number, header: PacketHeader): F1CarStatusFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 47); // Each car status data is 47 bytes
    let offset = playerCarOffset;

    if (offset + 47 > view.byteLength) {
      console.warn('F1 decoder: Car status packet too small');
      return null;
    }

    const tractionControl = view.getUint8(offset); offset += 1;
    const antiLockBrakes = view.getUint8(offset); offset += 1;
    const fuelMix = view.getUint8(offset); offset += 1;
    const frontBrakeBias = view.getUint8(offset); offset += 1;
    const pitLimiterStatus = view.getUint8(offset); offset += 1;
    const fuelInTank = view.getFloat32(offset, true); offset += 4;
    const fuelCapacity = view.getFloat32(offset, true); offset += 4;
    const fuelRemainingLaps = view.getFloat32(offset, true); offset += 4;
    const maxRPM = view.getUint16(offset, true); offset += 2;
    const idleRPM = view.getUint16(offset, true); offset += 2;
    const maxGears = view.getUint8(offset); offset += 1;
    const drsAllowed = view.getUint8(offset); offset += 1;
    const drsActivationDistance = view.getUint16(offset, true); offset += 2;
    const actualTyreCompound = view.getUint8(offset); offset += 1;
    const visualTyreCompound = view.getUint8(offset); offset += 1;
    const tyresAgeLaps = view.getUint8(offset); offset += 1;
    const vehicleFiaFlags = view.getInt8(offset); offset += 1;
    const enginePowerICE = view.getFloat32(offset, true); offset += 4;
    const enginePowerMGUK = view.getFloat32(offset, true); offset += 4;
    const ersStoreEnergy = view.getFloat32(offset, true); offset += 4;
    const ersDeployMode = view.getUint8(offset); offset += 1;
    const ersHarvestedThisLapMGUK = view.getFloat32(offset, true); offset += 4;
    const ersHarvestedThisLapMGUH = view.getFloat32(offset, true); offset += 4;
    const ersDeployedThisLap = view.getFloat32(offset, true); offset += 4;
    const networkPaused = view.getUint8(offset);

    const frame: F1CarStatusFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.CAR_STATUS,
      tractionControl,
      antiLockBrakes,
      fuelMix,
      frontBrakeBias,
      pitLimiterStatus,
      fuelInTank,
      fuelCapacity,
      fuelRemainingLaps,
      maxRPM,
      idleRPM,
      maxGears,
      drsAllowed,
      drsActivationDistance,
      actualTyreCompound,
      visualTyreCompound,
      tyresAgeLaps,
      vehicleFiaFlags,
      enginePowerICE,
      enginePowerMGUK,
      ersStoreEnergy,
      ersDeployMode,
      ersHarvestedThisLapMGUK,
      ersHarvestedThisLapMGUH,
      ersDeployedThisLap,
      networkPaused
    };

    return frame;
  }

  private decodeSessionPacket(view: DataView, startOffset: number, header: PacketHeader): F1SessionFrame | null {
    let offset = startOffset;

    if (offset + 724 > view.byteLength) {
      console.warn('F1 decoder: Session packet too small');
      return null;
    }

    // Read basic session data
    const weather = view.getUint8(offset); offset += 1;
    const trackTemperature = view.getInt8(offset); offset += 1;
    const airTemperature = view.getInt8(offset); offset += 1;
    const totalLaps = view.getUint8(offset); offset += 1;
    const trackLength = view.getUint16(offset, true); offset += 2;
    const sessionType = view.getUint8(offset); offset += 1;
    const trackId = view.getInt8(offset); offset += 1;
    const formula = view.getUint8(offset); offset += 1;
    const sessionTimeLeft = view.getUint16(offset, true); offset += 2;
    const sessionDuration = view.getUint16(offset, true); offset += 2;
    const pitSpeedLimit = view.getUint8(offset); offset += 1;
    const gamePaused = view.getUint8(offset); offset += 1;
    const isSpectating = view.getUint8(offset); offset += 1;
    const spectatorCarIndex = view.getUint8(offset); offset += 1;
    const sliProNativeSupport = view.getUint8(offset); offset += 1;
    const numMarshalZones = view.getUint8(offset); offset += 1;
    
    // Read marshal zones (max 21)
    const marshalZones: MarshalZone[] = [];
    for (let i = 0; i < 21; i++) {
      marshalZones.push({
        zoneStart: view.getFloat32(offset, true),
        zoneFlag: view.getInt8(offset + 4)
      });
      offset += 5;
    }
    
    const safetyCarStatus = view.getUint8(offset); offset += 1;
    const networkGame = view.getUint8(offset); offset += 1;
    const numWeatherForecastSamples = view.getUint8(offset); offset += 1;
    
    // Read weather forecast samples (max 64)
    const weatherForecastSamples: WeatherForecastSample[] = [];
    for (let i = 0; i < 64; i++) {
      weatherForecastSamples.push({
        sessionType: view.getUint8(offset),
        timeOffset: view.getUint8(offset + 1),
        weather: view.getUint8(offset + 2),
        trackTemperature: view.getInt8(offset + 3),
        trackTemperatureChange: view.getInt8(offset + 4),
        airTemperature: view.getInt8(offset + 5),
        airTemperatureChange: view.getInt8(offset + 6),
        rainPercentage: view.getUint8(offset + 7)
      });
      offset += 8;
    }
    
    const forecastAccuracy = view.getUint8(offset); offset += 1;
    const aiDifficulty = view.getUint8(offset); offset += 1;
    const seasonLinkIdentifier = view.getUint32(offset, true); offset += 4;
    const weekendLinkIdentifier = view.getUint32(offset, true); offset += 4;
    const sessionLinkIdentifier = view.getUint32(offset, true); offset += 4;
    const pitStopWindowIdealLap = view.getUint8(offset); offset += 1;
    const pitStopWindowLatestLap = view.getUint8(offset); offset += 1;
    const pitStopRejoinPosition = view.getUint8(offset); offset += 1;
    const steeringAssist = view.getUint8(offset); offset += 1;
    const brakingAssist = view.getUint8(offset); offset += 1;
    const gearboxAssist = view.getUint8(offset); offset += 1;
    const pitAssist = view.getUint8(offset); offset += 1;
    const pitReleaseAssist = view.getUint8(offset); offset += 1;
    const ERSAssist = view.getUint8(offset); offset += 1;
    const DRSAssist = view.getUint8(offset); offset += 1;
    const dynamicRacingLine = view.getUint8(offset); offset += 1;
    const dynamicRacingLineType = view.getUint8(offset); offset += 1;
    const gameMode = view.getUint8(offset); offset += 1;
    const ruleSet = view.getUint8(offset); offset += 1;
    const timeOfDay = view.getUint32(offset, true); offset += 4;
    const sessionLength = view.getUint8(offset); offset += 1;
    const speedUnitsLeadPlayer = view.getUint8(offset); offset += 1;
    const temperatureUnitsLeadPlayer = view.getUint8(offset); offset += 1;
    const speedUnitsSecondaryPlayer = view.getUint8(offset); offset += 1;
    const temperatureUnitsSecondaryPlayer = view.getUint8(offset); offset += 1;
    const numSafetyCarPeriods = view.getUint8(offset); offset += 1;
    const numVirtualSafetyCarPeriods = view.getUint8(offset); offset += 1;
    const numRedFlagPeriods = view.getUint8(offset); offset += 1;
    const equalCarPerformance = view.getUint8(offset); offset += 1;
    const recoveryMode = view.getUint8(offset); offset += 1;
    const flashbackLimit = view.getUint8(offset); offset += 1;
    const surfaceType = view.getUint8(offset); offset += 1;
    const lowFuelMode = view.getUint8(offset); offset += 1;
    const raceStarts = view.getUint8(offset); offset += 1;
    const tyreTemperature = view.getUint8(offset); offset += 1;
    const pitLaneTyreSim = view.getUint8(offset); offset += 1;
    const carDamage = view.getUint8(offset); offset += 1;
    const carDamageRate = view.getUint8(offset); offset += 1;
    const collisions = view.getUint8(offset); offset += 1;
    const collisionsOffForFirstLapOnly = view.getUint8(offset); offset += 1;
    const mpUnsafePitRelease = view.getUint8(offset); offset += 1;
    const mpOffForGriefing = view.getUint8(offset); offset += 1;
    const cornerCuttingStringency = view.getUint8(offset); offset += 1;
    const parcFermeRules = view.getUint8(offset); offset += 1;
    const pitStopExperience = view.getUint8(offset); offset += 1;
    const safetyCar = view.getUint8(offset); offset += 1;
    const safetyCarExperience = view.getUint8(offset); offset += 1;
    const formationLap = view.getUint8(offset); offset += 1;
    const formationLapExperience = view.getUint8(offset); offset += 1;
    const redFlags = view.getUint8(offset); offset += 1;
    const affectsLicenceLevelSolo = view.getUint8(offset); offset += 1;
    const affectsLicenceLevelMP = view.getUint8(offset); offset += 1;
    const numSessionsInWeekend = view.getUint8(offset); offset += 1;
    
    // Read weekend structure (max 12 sessions)
    const weekendStructure: number[] = [];
    for (let i = 0; i < 12; i++) {
      weekendStructure.push(view.getUint8(offset + i));
    }
    offset += 12;
    
    const sector2LapDistanceStart = view.getFloat32(offset, true); offset += 4;
    const sector3LapDistanceStart = view.getFloat32(offset, true);

    const frame: F1SessionFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.SESSION,
      weather,
      trackTemperature,
      airTemperature,
      totalLaps,
      trackLength,
      sessionType,
      trackId,
      formula,
      sessionTimeLeft,
      sessionDuration,
      pitSpeedLimit,
      gamePaused,
      isSpectating,
      spectatorCarIndex,
      sliProNativeSupport,
      numMarshalZones,
      marshalZones,
      safetyCarStatus,
      networkGame,
      numWeatherForecastSamples,
      weatherForecastSamples,
      forecastAccuracy,
      aiDifficulty,
      seasonLinkIdentifier,
      weekendLinkIdentifier,
      sessionLinkIdentifier,
      pitStopWindowIdealLap,
      pitStopWindowLatestLap,
      pitStopRejoinPosition,
      steeringAssist,
      brakingAssist,
      gearboxAssist,
      pitAssist,
      pitReleaseAssist,
      ERSAssist,
      DRSAssist,
      dynamicRacingLine,
      dynamicRacingLineType,
      gameMode,
      ruleSet,
      timeOfDay,
      sessionLength,
      speedUnitsLeadPlayer,
      temperatureUnitsLeadPlayer,
      speedUnitsSecondaryPlayer,
      temperatureUnitsSecondaryPlayer,
      numSafetyCarPeriods,
      numVirtualSafetyCarPeriods,
      numRedFlagPeriods,
      equalCarPerformance,
      recoveryMode,
      flashbackLimit,
      surfaceType,
      lowFuelMode,
      raceStarts,
      tyreTemperature,
      pitLaneTyreSim,
      carDamage,
      carDamageRate,
      collisions,
      collisionsOffForFirstLapOnly,
      mpUnsafePitRelease,
      mpOffForGriefing,
      cornerCuttingStringency,
      parcFermeRules,
      pitStopExperience,
      safetyCar,
      safetyCarExperience,
      formationLap,
      formationLapExperience,
      redFlags,
      affectsLicenceLevelSolo,
      affectsLicenceLevelMP,
      numSessionsInWeekend,
      weekendStructure,
      sector2LapDistanceStart,
      sector3LapDistanceStart
    };

    return frame;
  }

  private headerToFrame(header: PacketHeader): any {
    return {
      t: Date.now(),
      packetFormat: header.packetFormat,
      gameYear: header.gameYear,
      gameMajorVersion: header.gameMajorVersion,
      gameMinorVersion: header.gameMinorVersion,
      packetVersion: header.packetVersion,
      packetId: header.packetId,
      sessionUID: header.sessionUID.toString(),
      sessionTime: header.sessionTime,
      frameIdentifier: header.frameIdentifier,
      overallFrameIdentifier: header.overallFrameIdentifier,
      playerCarIndex: header.playerCarIndex,
      secondaryPlayerCarIndex: header.secondaryPlayerCarIndex
    };
  }

  private decodeEventPacket(view: DataView, startOffset: number, header: PacketHeader): F1EventFrame | null {
    let offset = startOffset;
    
    if (offset + 7 > view.byteLength) {
      console.warn('F1 decoder: Event packet too small');
      return null;
    }

    // Read event string code (4 bytes)
    const eventBytes = new Uint8Array(view.buffer, view.byteOffset + offset, 4);
    const eventStringCode = String.fromCharCode(...eventBytes);
    offset += 4;

    const frame: F1EventFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.EVENT,
      eventStringCode,
      eventDetails: {} // Event details vary by event type
    };

    return frame;
  }

  private decodeParticipantsPacket(view: DataView, startOffset: number, header: PacketHeader): F1ParticipantsFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 decoder: Participants packet too small');
      return null;
    }

    const numActiveCars = view.getUint8(offset);
    offset += 1;

    // Each participant is 56 bytes, read player participant
    const playerOffset = offset + (header.playerCarIndex * 56);
    if (playerOffset + 56 > view.byteLength) {
      console.warn('F1 decoder: Participants packet too small for player data');
      return null;
    }

    let playerDataOffset = playerOffset;
    
    const aiControlled = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const driverId = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const networkId = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const teamId = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const myTeam = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const raceNumber = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const nationality = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const name = String.fromCharCode(...new Uint8Array(view.buffer, view.byteOffset + playerDataOffset, 48)).replace(/\0+$/, ''); playerDataOffset += 48;
    const yourTelemetry = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const showOnlineNames = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const techLevel = view.getUint16(playerDataOffset, true); playerDataOffset += 2;
    const platform = view.getUint8(playerDataOffset);

    const frame: F1ParticipantsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.PARTICIPANTS,
      numActiveCars,
      aiControlled,
      driverId,
      networkId,
      teamId,
      myTeam,
      raceNumber,
      nationality,
      name,
      yourTelemetry,
      showOnlineNames,
      techLevel,
      platform
    };

    return frame;
  }

  private decodeCarSetupsPacket(view: DataView, startOffset: number, header: PacketHeader): F1CarSetupsFrame | null {
    // Each car setup is 49 bytes
    const playerOffset = startOffset + (header.playerCarIndex * 49);
    if (playerOffset + 49 > view.byteLength) {
      console.warn('F1 decoder: Car setups packet too small');
      return null;
    }

    let offset = playerOffset;
    
    const frontWing = view.getUint8(offset); offset += 1;
    const rearWing = view.getUint8(offset); offset += 1;
    const onThrottle = view.getUint8(offset); offset += 1;
    const offThrottle = view.getUint8(offset); offset += 1;
    const frontCamber = view.getFloat32(offset, true); offset += 4;
    const rearCamber = view.getFloat32(offset, true); offset += 4;
    const frontToe = view.getFloat32(offset, true); offset += 4;
    const rearToe = view.getFloat32(offset, true); offset += 4;
    const frontSuspension = view.getUint8(offset); offset += 1;
    const rearSuspension = view.getUint8(offset); offset += 1;
    const frontAntiRollBar = view.getUint8(offset); offset += 1;
    const rearAntiRollBar = view.getUint8(offset); offset += 1;
    const frontSuspensionHeight = view.getUint8(offset); offset += 1;
    const rearSuspensionHeight = view.getUint8(offset); offset += 1;
    const brakePressure = view.getUint8(offset); offset += 1;
    const brakeBias = view.getUint8(offset); offset += 1;
    const rearLeftTyrePressure = view.getFloat32(offset, true); offset += 4;
    const rearRightTyrePressure = view.getFloat32(offset, true); offset += 4;
    const frontLeftTyrePressure = view.getFloat32(offset, true); offset += 4;
    const frontRightTyrePressure = view.getFloat32(offset, true); offset += 4;
    const ballast = view.getUint8(offset); offset += 1;
    const fuelLoad = view.getFloat32(offset, true);

    const frame: F1CarSetupsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.CAR_SETUPS,
      frontWing,
      rearWing,
      onThrottle,
      offThrottle,
      frontCamber,
      rearCamber,
      frontToe,
      rearToe,
      frontSuspension,
      rearSuspension,
      frontAntiRollBar,
      rearAntiRollBar,
      frontSuspensionHeight,
      rearSuspensionHeight,
      brakePressure,
      brakeBias,
      rearLeftTyrePressure,
      rearRightTyrePressure,
      frontLeftTyrePressure,
      frontRightTyrePressure,
      ballast,
      fuelLoad
    };

    return frame;
  }

  private decodeFinalClassificationPacket(view: DataView, startOffset: number, header: PacketHeader): F1FinalClassificationFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 decoder: Final classification packet too small');
      return null;
    }

    const numCars = view.getUint8(offset);
    offset += 1;

    // Each classification is 45 bytes
    const playerOffset = offset + (header.playerCarIndex * 45);
    if (playerOffset + 45 > view.byteLength) {
      console.warn('F1 decoder: Final classification packet too small for player data');
      return null;
    }

    let playerDataOffset = playerOffset;
    const tyreStintsActual: number[] = [];
    const tyreStintsVisual: number[] = [];
    const tyreStintsEndLaps: number[] = [];

    // Read basic classification data
    const position = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const numLaps = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const gridPosition = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const points = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const numPitStops = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const resultStatus = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const bestLapTimeInMS = view.getUint32(playerDataOffset, true); playerDataOffset += 4;
    const totalRaceTime = view.getFloat64(playerDataOffset, true); playerDataOffset += 8;
    const penaltiesTime = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const numPenalties = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const numTyreStints = view.getUint8(playerDataOffset); playerDataOffset += 1;

    // Read tyre stint data (8 stints max)
    for (let i = 0; i < 8; i++) {
      tyreStintsActual.push(view.getUint8(playerDataOffset + i));
    }
    playerDataOffset += 8;

    for (let i = 0; i < 8; i++) {
      tyreStintsVisual.push(view.getUint8(playerDataOffset + i));
    }
    playerDataOffset += 8;

    for (let i = 0; i < 8; i++) {
      tyreStintsEndLaps.push(view.getUint8(playerDataOffset + i));
    }

    const frame: F1FinalClassificationFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.FINAL_CLASSIFICATION,
      numCars,
      position,
      numLaps,
      gridPosition,
      points,
      numPitStops,
      resultStatus,
      bestLapTimeInMS,
      totalRaceTime,
      penaltiesTime,
      numPenalties,
      numTyreStints,
      tyreStintsActual,
      tyreStintsVisual,
      tyreStintsEndLaps
    };

    return frame;
  }

  private decodeLobbyInfoPacket(view: DataView, startOffset: number, header: PacketHeader): F1LobbyInfoFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 decoder: Lobby info packet too small');
      return null;
    }

    const numPlayers = view.getUint8(offset);
    offset += 1;

    // Each lobby player is 54 bytes, read player data
    const playerOffset = offset + (header.playerCarIndex * 54);
    if (playerOffset + 54 > view.byteLength) {
      console.warn('F1 decoder: Lobby info packet too small for player data');
      return null;
    }

    let playerDataOffset = playerOffset;
    
    const aiControlled = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const teamId = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const nationality = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const platform = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const name = String.fromCharCode(...new Uint8Array(view.buffer, view.byteOffset + playerDataOffset, 48)).replace(/\0+$/, ''); playerDataOffset += 48;
    const carNumber = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const readyStatus = view.getUint8(playerDataOffset);

    const frame: F1LobbyInfoFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.LOBBY_INFO,
      numPlayers,
      aiControlled,
      teamId,
      nationality,
      platform,
      name,
      carNumber,
      readyStatus
    };

    return frame;
  }

  private decodeCarDamagePacket(view: DataView, startOffset: number, header: PacketHeader): F1CarDamageFrame | null {
    // Each car damage is 42 bytes
    const playerOffset = startOffset + (header.playerCarIndex * 42);
    if (playerOffset + 42 > view.byteLength) {
      console.warn('F1 decoder: Car damage packet too small');
      return null;
    }

    let offset = playerOffset;
    const tyresWear: number[] = [];
    const tyresDamage: number[] = [];
    const brakesDamage: number[] = [];

    // Read tyre wear (4 tyres)
    for (let i = 0; i < 4; i++) {
      tyresWear.push(view.getFloat32(offset, true));
      offset += 4;
    }

    // Read tyre damage (4 tyres)
    for (let i = 0; i < 4; i++) {
      tyresDamage.push(view.getUint8(offset));
      offset += 1;
    }

    // Read brake damage (4 brakes)
    for (let i = 0; i < 4; i++) {
      brakesDamage.push(view.getUint8(offset));
      offset += 1;
    }

    const frontLeftWingDamage = view.getUint8(offset); offset += 1;
    const frontRightWingDamage = view.getUint8(offset); offset += 1;
    const rearWingDamage = view.getUint8(offset); offset += 1;
    const floorDamage = view.getUint8(offset); offset += 1;
    const diffuserDamage = view.getUint8(offset); offset += 1;
    const sidepodDamage = view.getUint8(offset); offset += 1;
    const drsFault = view.getUint8(offset); offset += 1;
    const ersFault = view.getUint8(offset); offset += 1;
    const gearBoxDamage = view.getUint8(offset); offset += 1;
    const engineDamage = view.getUint8(offset); offset += 1;
    const engineMGUHWear = view.getUint8(offset); offset += 1;
    const engineESWear = view.getUint8(offset); offset += 1;
    const engineCEWear = view.getUint8(offset); offset += 1;
    const engineICEWear = view.getUint8(offset); offset += 1;
    const engineMGUKWear = view.getUint8(offset); offset += 1;
    const engineTCWear = view.getUint8(offset); offset += 1;
    const engineBlown = view.getUint8(offset); offset += 1;
    const engineSeized = view.getUint8(offset);

    const frame: F1CarDamageFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.CAR_DAMAGE,
      tyresWear,
      tyresDamage,
      brakesDamage,
      frontLeftWingDamage,
      frontRightWingDamage,
      rearWingDamage,
      floorDamage,
      diffuserDamage,
      sidepodDamage,
      drsFault,
      ersFault,
      gearBoxDamage,
      engineDamage,
      engineMGUHWear,
      engineESWear,
      engineCEWear,
      engineICEWear,
      engineMGUKWear,
      engineTCWear,
      engineBlown,
      engineSeized
    };

    return frame;
  }

  private decodeSessionHistoryPacket(view: DataView, startOffset: number, header: PacketHeader): F1SessionHistoryFrame | null {
    let offset = startOffset;
    
    if (offset + 1431 > view.byteLength) {
      console.warn('F1 decoder: Session history packet too small');
      return null;
    }

    const carIdx = view.getUint8(offset); offset += 1;
    const numLaps = view.getUint8(offset); offset += 1;
    const numTyreStints = view.getUint8(offset); offset += 1;
    const bestLapTimeLapNum = view.getUint8(offset); offset += 1;
    const bestSector1LapNum = view.getUint8(offset); offset += 1;
    const bestSector2LapNum = view.getUint8(offset); offset += 1;
    const bestSector3LapNum = view.getUint8(offset); offset += 1;

    // Read lap history data (100 laps max, 8 bytes each)
    const lapHistoryData: LapHistoryData[] = [];
    for (let i = 0; i < 100; i++) {
      lapHistoryData.push({
        lapTimeInMS: view.getUint32(offset, true),
        sector1TimeMSPart: view.getUint16(offset + 4, true),
        sector1TimeMinutesPart: view.getUint8(offset + 6),
        sector2TimeMSPart: view.getUint16(offset + 7, true),
        sector2TimeMinutesPart: view.getUint8(offset + 9),
        sector3TimeMSPart: view.getUint16(offset + 10, true),
        sector3TimeMinutesPart: view.getUint8(offset + 12),
        lapValidBitFlags: view.getUint8(offset + 13)
      });
      offset += 14;
    }

    // Read tyre stint data (8 stints max, 3 bytes each)
    const tyreStintsHistoryData: TyreStintHistoryData[] = [];
    for (let i = 0; i < 8; i++) {
      tyreStintsHistoryData.push({
        endLap: view.getUint8(offset),
        tyreActualCompound: view.getUint8(offset + 1),
        tyreVisualCompound: view.getUint8(offset + 2)
      });
      offset += 3;
    }

    const frame: F1SessionHistoryFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.SESSION_HISTORY,
      carIdx,
      numLaps,
      numTyreStints,
      bestLapTimeLapNum,
      bestSector1LapNum,
      bestSector2LapNum,
      bestSector3LapNum,
      lapHistoryData,
      tyreStintsHistoryData
    };

    return frame;
  }

  private decodeTyreSetsPacket(view: DataView, startOffset: number, header: PacketHeader): F1TyreSetsFrame | null {
    let offset = startOffset;
    
    if (offset + 202 > view.byteLength) {
      console.warn('F1 decoder: Tyre sets packet too small');
      return null;
    }

    const carIdx = view.getUint8(offset); offset += 1;

    // Read tyre set data (20 sets max, 10 bytes each)
    const tyreSetData: TyreSetData[] = [];
    for (let i = 0; i < 20; i++) {
      tyreSetData.push({
        actualTyreCompound: view.getUint8(offset),
        visualTyreCompound: view.getUint8(offset + 1),
        wear: view.getUint8(offset + 2),
        available: view.getUint8(offset + 3),
        recommendedSession: view.getUint8(offset + 4),
        lifeSpan: view.getUint8(offset + 5),
        usableLife: view.getUint8(offset + 6),
        lapDeltaTime: view.getInt16(offset + 7, true),
        fitted: view.getUint8(offset + 9)
      });
      offset += 10;
    }

    const fittedIdx = view.getUint8(offset);

    const frame: F1TyreSetsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.TYRE_SETS,
      carIdx,
      tyreSetData,
      fittedIdx
    };

    return frame;
  }

  private decodeMotionExPacket(view: DataView, startOffset: number, header: PacketHeader): F1MotionExFrame | null {
    // Motion Ex packet contains player car data only (208 bytes after header)
    let offset = startOffset;
    if (offset + 208 > view.byteLength) {
      console.warn('F1 decoder: Motion ex packet too small');
      return null;
    }
    
    const suspensionPositionRL = view.getFloat32(offset, true); offset += 4;
    const suspensionPositionRR = view.getFloat32(offset, true); offset += 4;
    const suspensionPositionFL = view.getFloat32(offset, true); offset += 4;
    const suspensionPositionFR = view.getFloat32(offset, true); offset += 4;
    const suspensionVelocityRL = view.getFloat32(offset, true); offset += 4;
    const suspensionVelocityRR = view.getFloat32(offset, true); offset += 4;
    const suspensionVelocityFL = view.getFloat32(offset, true); offset += 4;
    const suspensionVelocityFR = view.getFloat32(offset, true); offset += 4;
    const suspensionAccelerationRL = view.getFloat32(offset, true); offset += 4;
    const suspensionAccelerationRR = view.getFloat32(offset, true); offset += 4;
    const suspensionAccelerationFL = view.getFloat32(offset, true); offset += 4;
    const suspensionAccelerationFR = view.getFloat32(offset, true); offset += 4;
    const wheelSpeedRL = view.getFloat32(offset, true); offset += 4;
    const wheelSpeedRR = view.getFloat32(offset, true); offset += 4;
    const wheelSpeedFL = view.getFloat32(offset, true); offset += 4;
    const wheelSpeedFR = view.getFloat32(offset, true); offset += 4;
    const wheelSlipRatioRL = view.getFloat32(offset, true); offset += 4;
    const wheelSlipRatioRR = view.getFloat32(offset, true); offset += 4;
    const wheelSlipRatioFL = view.getFloat32(offset, true); offset += 4;
    const wheelSlipRatioFR = view.getFloat32(offset, true); offset += 4;
    const wheelSlipAngleRL = view.getFloat32(offset, true); offset += 4;
    const wheelSlipAngleRR = view.getFloat32(offset, true); offset += 4;
    const wheelSlipAngleFL = view.getFloat32(offset, true); offset += 4;
    const wheelSlipAngleFR = view.getFloat32(offset, true); offset += 4;
    const wheelLatForceRL = view.getFloat32(offset, true); offset += 4;
    const wheelLatForceRR = view.getFloat32(offset, true); offset += 4;
    const wheelLatForceFL = view.getFloat32(offset, true); offset += 4;
    const wheelLatForceFR = view.getFloat32(offset, true); offset += 4;
    const wheelLongForceRL = view.getFloat32(offset, true); offset += 4;
    const wheelLongForceRR = view.getFloat32(offset, true); offset += 4;
    const wheelLongForceFL = view.getFloat32(offset, true); offset += 4;
    const wheelLongForceFR = view.getFloat32(offset, true); offset += 4;
    const heightOfCOGAboveGround = view.getFloat32(offset, true); offset += 4;
    const localVelocityX = view.getFloat32(offset, true); offset += 4;
    const localVelocityY = view.getFloat32(offset, true); offset += 4;
    const localVelocityZ = view.getFloat32(offset, true); offset += 4;
    const angularVelocityX = view.getFloat32(offset, true); offset += 4;
    const angularVelocityY = view.getFloat32(offset, true); offset += 4;
    const angularVelocityZ = view.getFloat32(offset, true); offset += 4;
    const angularAccelerationX = view.getFloat32(offset, true); offset += 4;
    const angularAccelerationY = view.getFloat32(offset, true); offset += 4;
    const angularAccelerationZ = view.getFloat32(offset, true); offset += 4;
    const frontWheelsAngle = view.getFloat32(offset, true); offset += 4;
    const wheelVertForceRL = view.getFloat32(offset, true); offset += 4;
    const wheelVertForceRR = view.getFloat32(offset, true); offset += 4;
    const wheelVertForceFL = view.getFloat32(offset, true); offset += 4;
    const wheelVertForceFR = view.getFloat32(offset, true); offset += 4;
    const frontAeroHeight = view.getFloat32(offset, true); offset += 4;
    const rearAeroHeight = view.getFloat32(offset, true); offset += 4;
    const frontRollAngle = view.getFloat32(offset, true); offset += 4;
    const rearRollAngle = view.getFloat32(offset, true); offset += 4;
    const chassisYaw = view.getFloat32(offset, true);

    const frame: F1MotionExFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.MOTION_EX,
      suspensionPositionRL,
      suspensionPositionRR,
      suspensionPositionFL,
      suspensionPositionFR,
      suspensionVelocityRL,
      suspensionVelocityRR,
      suspensionVelocityFL,
      suspensionVelocityFR,
      suspensionAccelerationRL,
      suspensionAccelerationRR,
      suspensionAccelerationFL,
      suspensionAccelerationFR,
      wheelSpeedRL,
      wheelSpeedRR,
      wheelSpeedFL,
      wheelSpeedFR,
      wheelSlipRatioRL,
      wheelSlipRatioRR,
      wheelSlipRatioFL,
      wheelSlipRatioFR,
      wheelSlipAngleRL,
      wheelSlipAngleRR,
      wheelSlipAngleFL,
      wheelSlipAngleFR,
      wheelLatForceRL,
      wheelLatForceRR,
      wheelLatForceFL,
      wheelLatForceFR,
      wheelLongForceRL,
      wheelLongForceRR,
      wheelLongForceFL,
      wheelLongForceFR,
      heightOfCOGAboveGround,
      localVelocityX,
      localVelocityY,
      localVelocityZ,
      angularVelocityX,
      angularVelocityY,
      angularVelocityZ,
      angularAccelerationX,
      angularAccelerationY,
      angularAccelerationZ,
      frontWheelsAngle,
      wheelVertForceRL,
      wheelVertForceRR,
      wheelVertForceFL,
      wheelVertForceFR,
      frontAeroHeight,
      rearAeroHeight,
      frontRollAngle,
      rearRollAngle,
      chassisYaw
    };

    return frame;
  }

  private decodeTimeTrialPacket(view: DataView, startOffset: number, header: PacketHeader): F1TimeTrialFrame | null {
    let offset = startOffset;
    
    if (offset + 24 > view.byteLength) {
      console.warn('F1 decoder: Time trial packet too small');
      return null;
    }

    const carIdx = view.getUint8(offset); offset += 1;
    const teamId = view.getUint8(offset); offset += 1;
    const lapTimeInMS = view.getUint32(offset, true); offset += 4;
    const sector1TimeInMS = view.getUint32(offset, true); offset += 4;
    const sector2TimeInMS = view.getUint32(offset, true); offset += 4;
    const sector3TimeInMS = view.getUint32(offset, true); offset += 4;
    const tractionControl = view.getUint8(offset); offset += 1;
    const gearboxAssist = view.getUint8(offset); offset += 1;
    const antiLockBrakes = view.getUint8(offset); offset += 1;
    const equalCarPerformance = view.getUint8(offset); offset += 1;
    const customSetup = view.getUint8(offset); offset += 1;
    const valid = view.getUint8(offset);

    const frame: F1TimeTrialFrame = {
      ...this.headerToFrame(header),
      packet_type: F1PacketType.TIME_TRIAL,
      carIdx,
      teamId,
      lapTimeInMS,
      sector1TimeInMS,
      sector2TimeInMS,
      sector3TimeInMS,
      tractionControl,
      gearboxAssist,
      antiLockBrakes,
      equalCarPerformance,
      customSetup,
      valid
    };

    return frame;
  }

  private createBasicFrame(header: PacketHeader): Frame {
    return {
      ...this.headerToFrame(header),
      packet_type: header.packetId
    };
  }

  getPacketTypeName(packetType: number): string {
    switch (packetType) {
      case F1PacketType.MOTION: return 'Motion';
      case F1PacketType.SESSION: return 'Session';
      case F1PacketType.LAP_DATA: return 'Lap Data';
      case F1PacketType.EVENT: return 'Event';
      case F1PacketType.PARTICIPANTS: return 'Participants';
      case F1PacketType.CAR_SETUPS: return 'Car Setups';
      case F1PacketType.CAR_TELEMETRY: return 'Car Telemetry';
      case F1PacketType.CAR_STATUS: return 'Car Status';
      case F1PacketType.FINAL_CLASSIFICATION: return 'Final Classification';
      case F1PacketType.LOBBY_INFO: return 'Lobby Info';
      case F1PacketType.CAR_DAMAGE: return 'Car Damage';
      case F1PacketType.SESSION_HISTORY: return 'Session History';
      case F1PacketType.TYRE_SETS: return 'Tyre Sets';
      case F1PacketType.MOTION_EX: return 'Motion Ex';
      case F1PacketType.TIME_TRIAL: return 'Time Trial';
      default: return `Unknown_${packetType}`;
    }
  }

  getSupportedPacketTypes(): { type: number; name: string }[] {
    return [
      { type: F1PacketType.MOTION, name: 'Motion' },
      { type: F1PacketType.SESSION, name: 'Session' },
      { type: F1PacketType.LAP_DATA, name: 'Lap Data' },
      { type: F1PacketType.EVENT, name: 'Event' },
      { type: F1PacketType.PARTICIPANTS, name: 'Participants' },
      { type: F1PacketType.CAR_SETUPS, name: 'Car Setups' },
      { type: F1PacketType.CAR_TELEMETRY, name: 'Car Telemetry' },
      { type: F1PacketType.CAR_STATUS, name: 'Car Status' },
      { type: F1PacketType.FINAL_CLASSIFICATION, name: 'Final Classification' },
      { type: F1PacketType.LOBBY_INFO, name: 'Lobby Info' },
      { type: F1PacketType.CAR_DAMAGE, name: 'Car Damage' },
      { type: F1PacketType.SESSION_HISTORY, name: 'Session History' },
      { type: F1PacketType.TYRE_SETS, name: 'Tyre Sets' },
      { type: F1PacketType.MOTION_EX, name: 'Motion Ex' },
      { type: F1PacketType.TIME_TRIAL, name: 'Time Trial' }
    ];
  }

  getAcceptedPacketSizes(): number[] {
    return [
      1349, // Motion packet: Header (29) + CarMotionData[22] (60 each = 1320) = 1349
      753,  // Session packet: Header (29) + session data (724) = 753  
      1285, // Lap Data packet: Header (29) + LapData[22] (53 each = 1166) + extra fields (90) = 1285
      45,   // Event packet: Header (29) + EventDataDetails (16) = 45
      1350, // Participants packet: Header (29) + numActiveCars (1) + ParticipantData[22] (56 each = 1232) + padding (88) = 1350
      1133, // Car Setups packet: Header (29) + CarSetupData[22] (49 each = 1078) + nextFrontWingValue (4) + padding (22) = 1133
      1352, // Car Telemetry packet: Header (29) + CarTelemetryData[22] (60 each = 1320) + extra fields (3) = 1352
      1239, // Car Status packet: Header (29) + CarStatusData[22] (47 each = 1034) + padding (176) = 1239
      1020, // Final Classification packet: Header (29) + numCars (1) + FinalClassificationData[22] (45 each = 990) = 1020
      1306, // Lobby Info packet: Header (29) + numPlayers (1) + LobbyInfoData[22] (54 each = 1188) + padding (88) = 1306
      953,  // Car Damage packet: Header (29) + CarDamageData[22] (42 each = 924) = 953
      1460, // Session History packet: Header (29) + session history data (1431) = 1460
      231,  // Tyre Sets packet: Header (29) + carIdx (1) + TyreSetData[20] (10 each = 200) + fittedIdx (1) = 231
      237,  // Motion Ex packet: Header (29) + extended motion data (208) = 237
      101   // Time Trial packet: Header (29) + TimeTrialDataSet * 3 (24 each = 72) = 101
    ];
  }
}

export const f1Decoder = new F1Decoder();