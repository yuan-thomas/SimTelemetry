import { Frame } from '../types';

// F1 2025 UDP telemetry decoder
// Based on F1 2025 game telemetry specification
// Supports all packet types defined in the specification

// Packet type enumeration
export enum F1_25_PacketType {
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
  TIME_TRIAL = 14,
  LAP_POSITIONS = 15
}

// Packet header structure (common to all packets)
interface PacketHeader {
  packetFormat: number;          // 2025
  gameYear: number;             // Game year - 25
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
export interface F1_25_MotionFrame extends Frame {
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
export interface F1_25_TelemetryFrame extends Frame {
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
export interface F1_25_LapDataFrame extends Frame {
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
export interface F1_25_CarStatusFrame extends Frame {
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

  // Tyre compound (F1 25 now supports C6 compound - value 22)
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
export interface F1_25_SessionFrame extends Frame {
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
  safetyCarStatus: number;
  networkGame: number;
  numWeatherForecastSamples: number;
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
}

// Event packet
export interface F1_25_EventFrame extends Frame {
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

// Participants packet - F1 25 has reduced participant name length from 48 to 32
export interface F1_25_ParticipantsFrame extends Frame {
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
  name: string; // Now 32 characters max (was 48 in F1 24)
  yourTelemetry: number;
  showOnlineNames: number;
  platform: number;
  // F1 25 additions
  numColours: number;
  liveryColours: { r: number; g: number; b: number; }[]; // Array of 4 RGB colors
}

// Car setups packet
export interface F1_25_CarSetupsFrame extends Frame {
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
  brakeBalance: number;
  rearLeftTyrePressure: number;
  rearRightTyrePressure: number;
  frontLeftTyrePressure: number;
  frontRightTyrePressure: number;
  ballast: number;
  fuelLoad: number;
}

// Final classification packet - F1 25 adds result reason field
export interface F1_25_FinalClassificationFrame extends Frame {
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
  // F1 25 addition
  resultReason: number; // Detailed result reason (0-10)
}

// Lobby info packet
export interface F1_25_LobbyInfoFrame extends Frame {
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
  name: string; // Now 32 characters max (was 48 in F1 24)
  carNumber: number;
  readyStatus: number;
}

// Car damage packet - F1 25 adds tyre blisters
export interface F1_25_CarDamageFrame extends Frame {
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
  // F1 25 addition
  tyreBlisters: number[]; // Array of 4 tyre blister values (percentage)
}

// Session history packet
export interface F1_25_SessionHistoryFrame extends Frame {
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
  // Lap history data arrays
  lapTimeInMS: number[];
  sector1TimeInMS: number[];
  sector2TimeInMS: number[];
  sector3TimeInMS: number[];
  lapValidBitFlags: number[];
  // Tyre stint data arrays
  endLap: number[];
  tyreActualCompound: number[];
  tyreVisualCompound: number[];
}

// Tyre sets packet
export interface F1_25_TyreSetsFrame extends Frame {
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
  tyreSetData: any[]; // Array of tyre set data
}

// Motion ex packet (extended motion data) - F1 25 adds chassis pitch and wheel camber
export interface F1_25_MotionExFrame extends Frame {
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

  // Extended motion data (player car)
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
  // F1 25 additions
  chassisPitch: number; // Chassis pitch angle relative to direction of motion
  wheelCamberRL: number;
  wheelCamberRR: number;
  wheelCamberFL: number;
  wheelCamberFR: number;
  wheelCamberGainRL: number;
  wheelCamberGainRR: number;
  wheelCamberGainFL: number;
  wheelCamberGainFR: number;
}

// Time trial packet
export interface F1_25_TimeTrialFrame extends Frame {
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

// NEW: Lap positions packet (F1 25 only)
export interface F1_25_LapPositionsFrame extends Frame {
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

  // Lap positions data
  numLaps: number;
  lapStart: number;
  positionData: number[][]; // [lap][vehicle] position matrix
}

class F1_25_Decoder {
  decode(buffer: ArrayBuffer): Frame | null {
    if (buffer.byteLength < 29) {
      console.warn('F1 25 decoder: Buffer too small for packet header');
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
        case F1_25_PacketType.MOTION:
          return this.decodeMotionPacket(view, offset, header);
        case F1_25_PacketType.SESSION:
          return this.decodeSessionPacket(view, offset, header);
        case F1_25_PacketType.LAP_DATA:
          return this.decodeLapDataPacket(view, offset, header);
        case F1_25_PacketType.EVENT:
          return this.decodeEventPacket(view, offset, header);
        case F1_25_PacketType.PARTICIPANTS:
          return this.decodeParticipantsPacket(view, offset, header);
        case F1_25_PacketType.CAR_SETUPS:
          return this.decodeCarSetupsPacket(view, offset, header);
        case F1_25_PacketType.CAR_TELEMETRY:
          return this.decodeTelemetryPacket(view, offset, header);
        case F1_25_PacketType.CAR_STATUS:
          return this.decodeCarStatusPacket(view, offset, header);
        case F1_25_PacketType.FINAL_CLASSIFICATION:
          return this.decodeFinalClassificationPacket(view, offset, header);
        case F1_25_PacketType.LOBBY_INFO:
          return this.decodeLobbyInfoPacket(view, offset, header);
        case F1_25_PacketType.CAR_DAMAGE:
          return this.decodeCarDamagePacket(view, offset, header);
        case F1_25_PacketType.SESSION_HISTORY:
          return this.decodeSessionHistoryPacket(view, offset, header);
        case F1_25_PacketType.TYRE_SETS:
          return this.decodeTyreSetsPacket(view, offset, header);
        case F1_25_PacketType.MOTION_EX:
          return this.decodeMotionExPacket(view, offset, header);
        case F1_25_PacketType.TIME_TRIAL:
          return this.decodeTimeTrialPacket(view, offset, header);
        case F1_25_PacketType.LAP_POSITIONS:
          return this.decodeLapPositionsPacket(view, offset, header);
        default:
          // For unknown packet types, return a basic frame
          return this.createBasicFrame(header);
      }
    } catch (error) {
      console.error('F1 25 decoder error:', error);
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

  private decodeMotionPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_MotionFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 60);
    let offset = playerCarOffset;

    if (offset + 60 > view.byteLength) {
      console.warn('F1 25 decoder: Motion packet too small for CarMotionData');
      return null;
    }

    const frame: F1_25_MotionFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.MOTION,

      // Motion data
      worldPositionX: view.getFloat32(offset, true), 
      worldPositionY: view.getFloat32(offset += 4, true), 
      worldPositionZ: view.getFloat32(offset += 4, true), 
      worldVelocityX: view.getFloat32(offset += 4, true), 
      worldVelocityY: view.getFloat32(offset += 4, true), 
      worldVelocityZ: view.getFloat32(offset += 4, true), 
      worldForwardDirX: view.getInt16(offset += 4, true) / 32767, 
      worldForwardDirY: view.getInt16(offset += 2, true) / 32767, 
      worldForwardDirZ: view.getInt16(offset += 2, true) / 32767, 
      worldRightDirX: view.getInt16(offset += 2, true) / 32767, 
      worldRightDirY: view.getInt16(offset += 2, true) / 32767, 
      worldRightDirZ: view.getInt16(offset += 2, true) / 32767, 
      gForceLateral: view.getFloat32(offset += 2, true), 
      gForceLongitudinal: view.getFloat32(offset += 4, true), 
      gForceVertical: view.getFloat32(offset += 4, true), 
      yaw: view.getFloat32(offset += 4, true), 
      pitch: view.getFloat32(offset += 4, true), 
      roll: view.getFloat32(offset += 4, true)
    };

    return frame;
  }

  private decodeTelemetryPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_TelemetryFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 60);
    let offset = playerCarOffset;

    if (offset + 60 > view.byteLength) {
      console.warn('F1 25 decoder: Telemetry packet too small');
      return null;
    }

    const frame: F1_25_TelemetryFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.CAR_TELEMETRY,

      // Car telemetry data
      speed: view.getUint16(offset, true), 
      throttle: view.getFloat32(offset += 2, true), 
      steer: view.getFloat32(offset += 4, true), 
      brake: view.getFloat32(offset += 4, true), 
      clutch: view.getUint8(offset += 4), 
      gear: view.getInt8(offset += 1), 
      engineRPM: view.getUint16(offset += 1, true), 
      drs: view.getUint8(offset += 2), 
      revLightsPercent: view.getUint8(offset += 1), 
      revLightsBitValue: view.getUint16(offset += 1, true), 
      brakesTemperatureRL: view.getUint16(offset += 2, true), 
      brakesTemperatureRR: view.getUint16(offset += 2, true), 
      brakesTemperatureFL: view.getUint16(offset += 2, true), 
      brakesTemperatureFR: view.getUint16(offset += 2, true), 
      tyresSurfaceTemperatureRL: view.getUint8(offset += 2), 
      tyresSurfaceTemperatureRR: view.getUint8(offset += 1), 
      tyresSurfaceTemperatureFL: view.getUint8(offset += 1), 
      tyresSurfaceTemperatureFR: view.getUint8(offset += 1), 
      tyresInnerTemperatureRL: view.getUint8(offset += 1), 
      tyresInnerTemperatureRR: view.getUint8(offset += 1), 
      tyresInnerTemperatureFL: view.getUint8(offset += 1), 
      tyresInnerTemperatureFR: view.getUint8(offset += 1), 
      engineTemperature: view.getUint16(offset += 1, true), 
      tyresPressureRL: view.getFloat32(offset += 2, true), 
      tyresPressureRR: view.getFloat32(offset += 4, true), 
      tyresPressureFL: view.getFloat32(offset += 4, true), 
      tyresPressureFR: view.getFloat32(offset += 4, true), 
      surfaceTypeRL: view.getUint8(offset += 4), 
      surfaceTypeRR: view.getUint8(offset += 1), 
      surfaceTypeFL: view.getUint8(offset += 1), 
      surfaceTypeFR: view.getUint8(offset += 1)
    };

    return frame;
  }

  private decodeLapDataPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_LapDataFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 53);
    let offset = playerCarOffset;

    if (offset + 53 > view.byteLength) {
      console.warn('F1 25 decoder: Lap data packet too small');
      return null;
    }

    const frame: F1_25_LapDataFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.LAP_DATA,

      // Lap data
      lastLapTimeInMS: view.getUint32(offset, true), 
      currentLapTimeInMS: view.getUint32(offset += 4, true), 
      sector1TimeInMS: view.getUint16(offset += 4, true), 
      sector1TimeMinutes: view.getUint8(offset += 2), 
      sector2TimeInMS: view.getUint16(offset += 1, true), 
      sector2TimeMinutes: view.getUint8(offset += 2), 
      deltaToCarInFrontInMS: view.getUint16(offset += 1, true), 
      deltaToRaceLeaderInMS: view.getUint16(offset += 2, true), 
      lapDistance: view.getFloat32(offset += 2, true), 
      totalDistance: view.getFloat32(offset += 4, true), 
      safetyCarDelta: view.getFloat32(offset += 4, true), 
      carPosition: view.getUint8(offset += 4), 
      currentLapNum: view.getUint8(offset += 1), 
      pitStatus: view.getUint8(offset += 1), 
      numPitStops: view.getUint8(offset += 1), 
      sector: view.getUint8(offset += 1), 
      currentLapInvalid: view.getUint8(offset += 1), 
      penalties: view.getUint8(offset += 1), 
      totalWarnings: view.getUint8(offset += 1), 
      cornerCuttingWarnings: view.getUint8(offset += 1), 
      numUnservedDriveThroughPens: view.getUint8(offset += 1), 
      numUnservedStopGoPens: view.getUint8(offset += 1), 
      gridPosition: view.getUint8(offset += 1), 
      driverStatus: view.getUint8(offset += 1), 
      resultStatus: view.getUint8(offset += 1), 
      pitLaneTimerActive: view.getUint8(offset += 1), 
      pitLaneTimeInLaneInMS: view.getUint16(offset += 1, true), 
      pitStopTimerInMS: view.getUint16(offset += 2, true), 
      pitStopShouldServePen: view.getUint8(offset += 2), 
      speedTrapFastestSpeed: view.getFloat32(offset += 1, true), 
      speedTrapFastestLap: view.getUint8(offset += 4)
    };

    return frame;
  }

  private decodeCarStatusPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_CarStatusFrame | null {
    const playerCarOffset = startOffset + (header.playerCarIndex * 47);
    let offset = playerCarOffset;

    if (offset + 47 > view.byteLength) {
      console.warn('F1 25 decoder: Car status packet too small');
      return null;
    }

    const frame: F1_25_CarStatusFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.CAR_STATUS,

      // Car status data
      tractionControl: view.getUint8(offset), 
      antiLockBrakes: view.getUint8(offset += 1), 
      fuelMix: view.getUint8(offset += 1), 
      frontBrakeBias: view.getUint8(offset += 1), 
      pitLimiterStatus: view.getUint8(offset += 1), 
      fuelInTank: view.getFloat32(offset += 1, true), 
      fuelCapacity: view.getFloat32(offset += 4, true), 
      fuelRemainingLaps: view.getFloat32(offset += 4, true), 
      maxRPM: view.getUint16(offset += 4, true), 
      idleRPM: view.getUint16(offset += 2, true), 
      maxGears: view.getUint8(offset += 2), 
      drsAllowed: view.getUint8(offset += 1), 
      drsActivationDistance: view.getUint16(offset += 1, true), 
      actualTyreCompound: view.getUint8(offset += 2), 
      visualTyreCompound: view.getUint8(offset += 1), 
      tyresAgeLaps: view.getUint8(offset += 1), 
      vehicleFiaFlags: view.getInt8(offset += 1), 
      enginePowerICE: view.getFloat32(offset += 1, true), 
      enginePowerMGUK: view.getFloat32(offset += 4, true), 
      ersStoreEnergy: view.getFloat32(offset += 4, true), 
      ersDeployMode: view.getUint8(offset += 4), 
      ersHarvestedThisLapMGUK: view.getFloat32(offset += 1, true), 
      ersHarvestedThisLapMGUH: view.getFloat32(offset += 4, true), 
      ersDeployedThisLap: view.getFloat32(offset += 4, true), 
      networkPaused: view.getUint8(offset += 4)
    };

    return frame;
  }

  private decodeSessionPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_SessionFrame | null {
    let offset = startOffset;

    if (offset + 644 > view.byteLength) {
      console.warn('F1 25 decoder: Session packet too small');
      return null;
    }

    const frame: F1_25_SessionFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.SESSION,

      // Session data
      weather: view.getUint8(offset), 
      trackTemperature: view.getInt8(offset += 1), 
      airTemperature: view.getInt8(offset += 1), 
      totalLaps: view.getUint8(offset += 1), 
      trackLength: view.getUint16(offset += 1, true), 
      sessionType: view.getUint8(offset += 2), 
      trackId: view.getInt8(offset += 1), 
      formula: view.getUint8(offset += 1), 
      sessionTimeLeft: view.getUint16(offset += 1, true), 
      sessionDuration: view.getUint16(offset += 2, true), 
      pitSpeedLimit: view.getUint8(offset += 2), 
      gamePaused: view.getUint8(offset += 1), 
      isSpectating: view.getUint8(offset += 1), 
      spectatorCarIndex: view.getUint8(offset += 1), 
      sliProNativeSupport: view.getUint8(offset += 1), 
      numMarshalZones: view.getUint8(offset += 1), 
      safetyCarStatus: view.getUint8(offset += 1), 
      networkGame: view.getUint8(offset += 1), 
      numWeatherForecastSamples: view.getUint8(offset += 1), 
      forecastAccuracy: view.getUint8(offset += 1), 
      aiDifficulty: view.getUint8(offset += 1), 
      seasonLinkIdentifier: view.getUint32(offset += 1, true), 
      weekendLinkIdentifier: view.getUint32(offset += 4, true), 
      sessionLinkIdentifier: view.getUint32(offset += 4, true), 
      pitStopWindowIdealLap: view.getUint8(offset += 4), 
      pitStopWindowLatestLap: view.getUint8(offset += 1), 
      pitStopRejoinPosition: view.getUint8(offset += 1), 
      steeringAssist: view.getUint8(offset += 1), 
      brakingAssist: view.getUint8(offset += 1), 
      gearboxAssist: view.getUint8(offset += 1), 
      pitAssist: view.getUint8(offset += 1), 
      pitReleaseAssist: view.getUint8(offset += 1), 
      ERSAssist: view.getUint8(offset += 1), 
      DRSAssist: view.getUint8(offset += 1), 
      dynamicRacingLine: view.getUint8(offset += 1), 
      dynamicRacingLineType: view.getUint8(offset += 1), 
      gameMode: view.getUint8(offset += 1), 
      ruleSet: view.getUint8(offset += 1), 
      timeOfDay: view.getUint32(offset += 1, true), 
      sessionLength: view.getUint8(offset += 4), 
      speedUnitsLeadPlayer: view.getUint8(offset += 1), 
      temperatureUnitsLeadPlayer: view.getUint8(offset += 1), 
      speedUnitsSecondaryPlayer: view.getUint8(offset += 1), 
      temperatureUnitsSecondaryPlayer: view.getUint8(offset += 1), 
      numSafetyCarPeriods: view.getUint8(offset += 1), 
      numVirtualSafetyCarPeriods: view.getUint8(offset += 1), 
      numRedFlagPeriods: view.getUint8(offset += 1)
    };

    return frame;
  }

  private decodeEventPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_EventFrame | null {
    let offset = startOffset;
    
    if (offset + 7 > view.byteLength) {
      console.warn('F1 25 decoder: Event packet too small');
      return null;
    }

    // Read event string code (4 bytes)
    const eventBytes = new Uint8Array(view.buffer, view.byteOffset + offset, 4);
    const eventStringCode = String.fromCharCode(...eventBytes);
    offset += 4;

    const frame: F1_25_EventFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.EVENT,
      eventStringCode,
      eventDetails: {} // Event details vary by event type
    };

    return frame;
  }

  private decodeParticipantsPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_ParticipantsFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 25 decoder: Participants packet too small');
      return null;
    }

    const numActiveCars = view.getUint8(offset);
    offset += 1;

    // Each participant is 58 bytes in F1 25 (changed from 56 in F1 24)
    const playerOffset = offset + (header.playerCarIndex * 58);
    if (playerOffset + 58 > view.byteLength) {
      console.warn('F1 25 decoder: Participants packet too small for player data');
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
    const name = String.fromCharCode(...new Uint8Array(view.buffer, view.byteOffset + playerDataOffset, 32)).replace(/\0+$/, ''); playerDataOffset += 32;
    const yourTelemetry = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const showOnlineNames = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const platform = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const numColours = view.getUint8(playerDataOffset); playerDataOffset += 1;
    
    // Read livery colours (4 RGB colors)
    const liveryColours = [];
    for (let i = 0; i < 4; i++) {
      liveryColours.push({
        r: view.getUint8(playerDataOffset),
        g: view.getUint8(playerDataOffset + 1),
        b: view.getUint8(playerDataOffset + 2)
      });
      playerDataOffset += 3;
    }

    const frame: F1_25_ParticipantsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.PARTICIPANTS,
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
      platform,
      numColours,
      liveryColours
    };

    return frame;
  }

  private decodeCarSetupsPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_CarSetupsFrame | null {
    // Each car setup is 49 bytes
    const playerOffset = startOffset + (header.playerCarIndex * 49);
    if (playerOffset + 49 > view.byteLength) {
      console.warn('F1 25 decoder: Car setups packet too small');
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
    const brakeBalance = view.getUint8(offset); offset += 1;
    const rearLeftTyrePressure = view.getFloat32(offset, true); offset += 4;
    const rearRightTyrePressure = view.getFloat32(offset, true); offset += 4;
    const frontLeftTyrePressure = view.getFloat32(offset, true); offset += 4;
    const frontRightTyrePressure = view.getFloat32(offset, true); offset += 4;
    const ballast = view.getUint8(offset); offset += 1;
    const fuelLoad = view.getFloat32(offset, true);

    const frame: F1_25_CarSetupsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.CAR_SETUPS,
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
      brakeBalance,
      rearLeftTyrePressure,
      rearRightTyrePressure,
      frontLeftTyrePressure,
      frontRightTyrePressure,
      ballast,
      fuelLoad
    };

    return frame;
  }

  private decodeFinalClassificationPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_FinalClassificationFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 25 decoder: Final classification packet too small');
      return null;
    }

    const numCars = view.getUint8(offset);
    offset += 1;

    // Each classification is 46 bytes in F1 25 (was 45 in F1 24)
    const playerOffset = offset + (header.playerCarIndex * 46);
    if (playerOffset + 46 > view.byteLength) {
      console.warn('F1 25 decoder: Final classification packet too small for player data');
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
    playerDataOffset += 8;

    // F1 25 addition: result reason
    const resultReason = view.getUint8(playerDataOffset);

    const frame: F1_25_FinalClassificationFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.FINAL_CLASSIFICATION,
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
      tyreStintsEndLaps,
      resultReason
    };

    return frame;
  }

  private decodeLobbyInfoPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_LobbyInfoFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 25 decoder: Lobby info packet too small');
      return null;
    }

    const numPlayers = view.getUint8(offset);
    offset += 1;

    // Each lobby player is 42 bytes in F1 25 (was 54 in F1 24)
    const playerOffset = offset + (header.playerCarIndex * 42);
    if (playerOffset + 42 > view.byteLength) {
      console.warn('F1 25 decoder: Lobby info packet too small for player data');
      return null;
    }

    let playerDataOffset = playerOffset;
    
    const aiControlled = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const teamId = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const nationality = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const platform = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const name = String.fromCharCode(...new Uint8Array(view.buffer, view.byteOffset + playerDataOffset, 32)).replace(/\0+$/, ''); playerDataOffset += 32;
    const carNumber = view.getUint8(playerDataOffset); playerDataOffset += 1;
    const readyStatus = view.getUint8(playerDataOffset);

    const frame: F1_25_LobbyInfoFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.LOBBY_INFO,
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

  private decodeCarDamagePacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_CarDamageFrame | null {
    // Each car damage is 46 bytes in F1 25 (was 42 in F1 24)
    const playerOffset = startOffset + (header.playerCarIndex * 46);
    if (playerOffset + 46 > view.byteLength) {
      console.warn('F1 25 decoder: Car damage packet too small');
      return null;
    }

    let offset = playerOffset;
    const tyresWear: number[] = [];
    const tyresDamage: number[] = [];
    const brakesDamage: number[] = [];
    const tyreBlisters: number[] = [];

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
    const engineSeized = view.getUint8(offset); offset += 1;

    // F1 25 addition: tyre blisters (4 tyres)
    for (let i = 0; i < 4; i++) {
      tyreBlisters.push(view.getUint8(offset));
      offset += 1;
    }

    const frame: F1_25_CarDamageFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.CAR_DAMAGE,
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
      engineSeized,
      tyreBlisters
    };

    return frame;
  }

  private decodeSessionHistoryPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_SessionHistoryFrame | null {
    let offset = startOffset;
    
    if (offset + 8 > view.byteLength) {
      console.warn('F1 25 decoder: Session history packet too small');
      return null;
    }

    const carIdx = view.getUint8(offset); offset += 1;
    const numLaps = view.getUint8(offset); offset += 1;
    const numTyreStints = view.getUint8(offset); offset += 1;
    const bestLapTimeLapNum = view.getUint8(offset); offset += 1;
    const bestSector1LapNum = view.getUint8(offset); offset += 1;
    const bestSector2LapNum = view.getUint8(offset); offset += 1;
    const bestSector3LapNum = view.getUint8(offset); offset += 1;

    const lapTimeInMS: number[] = [];
    const sector1TimeInMS: number[] = [];
    const sector2TimeInMS: number[] = [];
    const sector3TimeInMS: number[] = [];
    const lapValidBitFlags: number[] = [];
    const endLap: number[] = [];
    const tyreActualCompound: number[] = [];
    const tyreVisualCompound: number[] = [];

    // Read lap history data (100 laps max)
    for (let i = 0; i < 100; i++) {
      if (offset + 4 > view.byteLength) break;
      lapTimeInMS.push(view.getUint32(offset, true)); offset += 4;
    }

    for (let i = 0; i < 100; i++) {
      if (offset + 2 > view.byteLength) break;
      sector1TimeInMS.push(view.getUint16(offset, true)); offset += 2;
    }

    for (let i = 0; i < 100; i++) {
      if (offset + 2 > view.byteLength) break;
      sector2TimeInMS.push(view.getUint16(offset, true)); offset += 2;
    }

    for (let i = 0; i < 100; i++) {
      if (offset + 2 > view.byteLength) break;
      sector3TimeInMS.push(view.getUint16(offset, true)); offset += 2;
    }

    for (let i = 0; i < 100; i++) {
      if (offset + 1 > view.byteLength) break;
      lapValidBitFlags.push(view.getUint8(offset)); offset += 1;
    }

    // Read tyre stint data (8 stints max)
    for (let i = 0; i < 8; i++) {
      if (offset + 1 > view.byteLength) break;
      endLap.push(view.getUint8(offset)); offset += 1;
    }

    for (let i = 0; i < 8; i++) {
      if (offset + 1 > view.byteLength) break;
      tyreActualCompound.push(view.getUint8(offset)); offset += 1;
    }

    for (let i = 0; i < 8; i++) {
      if (offset + 1 > view.byteLength) break;
      tyreVisualCompound.push(view.getUint8(offset)); offset += 1;
    }

    const frame: F1_25_SessionHistoryFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.SESSION_HISTORY,
      carIdx,
      numLaps,
      numTyreStints,
      bestLapTimeLapNum,
      bestSector1LapNum,
      bestSector2LapNum,
      bestSector3LapNum,
      lapTimeInMS,
      sector1TimeInMS,
      sector2TimeInMS,
      sector3TimeInMS,
      lapValidBitFlags,
      endLap,
      tyreActualCompound,
      tyreVisualCompound
    };

    return frame;
  }

  private decodeTyreSetsPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_TyreSetsFrame | null {
    let offset = startOffset;
    
    if (offset + 1 > view.byteLength) {
      console.warn('F1 25 decoder: Tyre sets packet too small');
      return null;
    }

    const carIdx = view.getUint8(offset); offset += 1;

    const frame: F1_25_TyreSetsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.TYRE_SETS,
      carIdx,
      tyreSetData: [] // Simplified for now
    };

    return frame;
  }

  private decodeMotionExPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_MotionExFrame | null {
    // Each car extended motion data is 156 bytes in F1 25 (was 120 in F1 24)
    const playerOffset = startOffset + (header.playerCarIndex * 156);
    if (playerOffset + 156 > view.byteLength) {
      console.warn('F1 25 decoder: Motion ex packet too small');
      return null;
    }

    let offset = playerOffset;
    
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

    // F1 25 additions
    const chassisPitch = view.getFloat32(offset, true); offset += 4;
    const wheelCamberRL = view.getFloat32(offset, true); offset += 4;
    const wheelCamberRR = view.getFloat32(offset, true); offset += 4;
    const wheelCamberFL = view.getFloat32(offset, true); offset += 4;
    const wheelCamberFR = view.getFloat32(offset, true); offset += 4;
    const wheelCamberGainRL = view.getFloat32(offset, true); offset += 4;
    const wheelCamberGainRR = view.getFloat32(offset, true); offset += 4;
    const wheelCamberGainFL = view.getFloat32(offset, true); offset += 4;
    const wheelCamberGainFR = view.getFloat32(offset, true);

    const frame: F1_25_MotionExFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.MOTION_EX,
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
      chassisPitch,
      wheelCamberRL,
      wheelCamberRR,
      wheelCamberFL,
      wheelCamberFR,
      wheelCamberGainRL,
      wheelCamberGainRR,
      wheelCamberGainFL,
      wheelCamberGainFR
    };

    return frame;
  }

  private decodeTimeTrialPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_TimeTrialFrame | null {
    let offset = startOffset;
    
    if (offset + 24 > view.byteLength) {
      console.warn('F1 25 decoder: Time trial packet too small');
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

    const frame: F1_25_TimeTrialFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.TIME_TRIAL,
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

  private decodeLapPositionsPacket(view: DataView, startOffset: number, header: PacketHeader): F1_25_LapPositionsFrame | null {
    let offset = startOffset;
    
    if (offset + 2 > view.byteLength) {
      console.warn('F1 25 decoder: Lap positions packet too small');
      return null;
    }

    const numLaps = view.getUint8(offset); offset += 1;
    const lapStart = view.getUint8(offset); offset += 1;

    const positionData: number[][] = [];
    
    // Read position data for each lap and vehicle
    for (let lap = 0; lap < 50; lap++) { // max 50 laps
      const lapPositions: number[] = [];
      for (let vehicle = 0; vehicle < 22; vehicle++) { // max 22 vehicles
        if (offset + 1 > view.byteLength) break;
        lapPositions.push(view.getUint8(offset));
        offset += 1;
      }
      positionData.push(lapPositions);
      if (offset >= view.byteLength) break;
    }

    const frame: F1_25_LapPositionsFrame = {
      ...this.headerToFrame(header),
      packet_type: F1_25_PacketType.LAP_POSITIONS,
      numLaps,
      lapStart,
      positionData
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

  private createBasicFrame(header: PacketHeader): Frame {
    return {
      ...this.headerToFrame(header),
      packet_type: header.packetId
    };
  }

  getPacketTypeName(packetType: number): string {
    switch (packetType) {
      case F1_25_PacketType.MOTION: return 'Motion';
      case F1_25_PacketType.SESSION: return 'Session';
      case F1_25_PacketType.LAP_DATA: return 'Lap Data';
      case F1_25_PacketType.EVENT: return 'Event';
      case F1_25_PacketType.PARTICIPANTS: return 'Participants';
      case F1_25_PacketType.CAR_SETUPS: return 'Car Setups';
      case F1_25_PacketType.CAR_TELEMETRY: return 'Car Telemetry';
      case F1_25_PacketType.CAR_STATUS: return 'Car Status';
      case F1_25_PacketType.FINAL_CLASSIFICATION: return 'Final Classification';
      case F1_25_PacketType.LOBBY_INFO: return 'Lobby Info';
      case F1_25_PacketType.CAR_DAMAGE: return 'Car Damage';
      case F1_25_PacketType.SESSION_HISTORY: return 'Session History';
      case F1_25_PacketType.TYRE_SETS: return 'Tyre Sets';
      case F1_25_PacketType.MOTION_EX: return 'Motion Ex';
      case F1_25_PacketType.TIME_TRIAL: return 'Time Trial';
      case F1_25_PacketType.LAP_POSITIONS: return 'Lap Positions';
      default: return `Unknown_${packetType}`;
    }
  }

  getSupportedPacketTypes(): { type: number; name: string }[] {
    return [
      { type: F1_25_PacketType.MOTION, name: 'Motion' },
      { type: F1_25_PacketType.SESSION, name: 'Session' },
      { type: F1_25_PacketType.LAP_DATA, name: 'Lap Data' },
      { type: F1_25_PacketType.EVENT, name: 'Event' },
      { type: F1_25_PacketType.PARTICIPANTS, name: 'Participants' },
      { type: F1_25_PacketType.CAR_SETUPS, name: 'Car Setups' },
      { type: F1_25_PacketType.CAR_TELEMETRY, name: 'Car Telemetry' },
      { type: F1_25_PacketType.CAR_STATUS, name: 'Car Status' },
      { type: F1_25_PacketType.FINAL_CLASSIFICATION, name: 'Final Classification' },
      { type: F1_25_PacketType.LOBBY_INFO, name: 'Lobby Info' },
      { type: F1_25_PacketType.CAR_DAMAGE, name: 'Car Damage' },
      { type: F1_25_PacketType.SESSION_HISTORY, name: 'Session History' },
      { type: F1_25_PacketType.TYRE_SETS, name: 'Tyre Sets' },
      { type: F1_25_PacketType.MOTION_EX, name: 'Motion Ex' },
      { type: F1_25_PacketType.TIME_TRIAL, name: 'Time Trial' },
      { type: F1_25_PacketType.LAP_POSITIONS, name: 'Lap Positions' }
    ];
  }

  getAcceptedPacketSizes(): number[] {
    return [
      1349, // Motion packet: Header (29) + CarMotionData[22] (60 each = 1320) = 1349
      753,  // Session packet: Header (29) + session data (724) = 753  
      1285, // Lap Data packet: Header (29) + LapData[22] (53 each = 1166) + extra fields (90) = 1285
      45,   // Event packet: Header (29) + EventDataDetails (16) = 45
      1274, // Participants packet: Header (29) + numActiveCars (1) + ParticipantData[22] (48 each = 1056) + padding (188) = 1274 (reduced name field)
      1133, // Car Setups packet: Header (29) + CarSetupData[22] (49 each = 1078) + nextFrontWingValue (4) + padding (22) = 1133
      1352, // Car Telemetry packet: Header (29) + CarTelemetryData[22] (60 each = 1320) + extra fields (3) = 1352
      1239, // Car Status packet: Header (29) + CarStatusData[22] (47 each = 1034) + padding (176) = 1239
      1020, // Final Classification packet: Header (29) + numCars (1) + FinalClassificationData[22] (45 each = 990) = 1020
      1306, // Lobby Info packet: Header (29) + numPlayers (1) + LobbyInfoData[22] (54 each = 1188) + padding (88) = 1306
      953,  // Car Damage packet: Header (29) + CarDamageData[22] (42 each = 924) = 953
      1460, // Session History packet: Header (29) + session history data (1431) = 1460
      231,  // Tyre Sets packet: Header (29) + carIdx (1) + TyreSetData[20] (10 each = 200) + fittedIdx (1) = 231
      237,  // Motion Ex packet: Header (29) + extended motion data (208) = 237
      101,  // Time Trial packet: Header (29) + TimeTrialDataSet * 3 (24 each = 72) = 101
      573   // Lap Positions packet: Header (29) + LapPositionsData (544) = 573 (new in F1 25)
    ];
  }
}

export const f1_25_Decoder = new F1_25_Decoder();