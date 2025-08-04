import { Frame } from '../types';

// Forza Motorsport UDP telemetry decoder
// Based on the format string: "=iIfffffffffffffffffffffffffffiiiiffffffffffffffffffffiiiiifffffffffffffffffHBBBBBBbbbffffi"

export interface ForzaTelemetryFrame extends Frame {
  // Basic race info
  IsRaceOn: number;
  TimestampMS: number;
  t: number; // Required timestamp field from Frame interface
  
  // Engine data
  EngineMaxRpm: number;
  EngineIdleRpm: number;
  CurrentEngineRpm: number;
  
  // Motion data - In the car's local space, X = right, Y = up, Z = forward
  AccelerationX: number;
  AccelerationY: number;
  AccelerationZ: number;
  VelocityX: number;
  VelocityY: number;
  VelocityZ: number;
  
  // In the car's local space, X = pitch, Y = yaw, Z = roll
  AngularVelocityX: number;
  AngularVelocityY: number;
  AngularVelocityZ: number;
  
  // Car orientation
  Yaw: number;
  Pitch: number;
  Roll: number;
  
  // Suspension travel normalized: 0.0f = max stretch, 1.0 = max compression
  NormalizedSuspensionTravelFrontLeft: number;
  NormalizedSuspensionTravelFrontRight: number;
  NormalizedSuspensionTravelRearLeft: number;
  NormalizedSuspensionTravelRearRight: number;
  
  // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip.
  TireSlipRatioFrontLeft: number;
  TireSlipRatioFrontRight: number;
  TireSlipRatioRearLeft: number;
  TireSlipRatioRearRight: number;
  
  // Wheels rotation speed radians/sec
  WheelRotationSpeedFrontLeft: number;
  WheelRotationSpeedFrontRight: number;
  WheelRotationSpeedRearLeft: number;
  WheelRotationSpeedRearRight: number;
  
  // = 1 when wheel is on rumble strip, = 0 when off
  WheelOnRumbleStripFrontLeft: number;
  WheelOnRumbleStripFrontRight: number;
  WheelOnRumbleStripRearLeft: number;
  WheelOnRumbleStripRearRight: number;
  
  // = from 0 to 1, where 1 is the deepest puddle
  WheelInPuddleDepthFrontLeft: number;
  WheelInPuddleDepthFrontRight: number;
  WheelInPuddleDepthRearLeft: number;
  WheelInPuddleDepthRearRight: number;
  
  // Non-dimensional surface rumble values passed to controller force feedback
  SurfaceRumbleFrontLeft: number;
  SurfaceRumbleFrontRight: number;
  SurfaceRumbleRearLeft: number;
  SurfaceRumbleRearRight: number;
  
  // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip.
  TireSlipAngleFrontLeft: number;
  TireSlipAngleFrontRight: number;
  TireSlipAngleRearLeft: number;
  TireSlipAngleRearRight: number;
  
  // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip.
  TireCombinedSlipFrontLeft: number;
  TireCombinedSlipFrontRight: number;
  TireCombinedSlipRearLeft: number;
  TireCombinedSlipRearRight: number;
  
  // Actual suspension travel in meters
  SuspensionTravelMetersFrontLeft: number;
  SuspensionTravelMetersFrontRight: number;
  SuspensionTravelMetersRearLeft: number;
  SuspensionTravelMetersRearRight: number;
  
  // Car info
  CarOrdinal: number;
  CarClass: number;
  CarPerformanceIndex: number;
  DrivetrainType: number;
  NumCylinders: number;
  
  // Position in world space
  PositionX: number;
  PositionY: number;
  PositionZ: number;
  
  // Performance data
  Speed: number;
  Power: number;
  Torque: number;
  
  // Tire temperatures
  TireTempFrontLeft: number;
  TireTempFrontRight: number;
  TireTempRearLeft: number;
  TireTempRearRight: number;
  
  // Boost and fuel
  Boost: number;
  Fuel: number;
  DistanceTraveled: number;
  
  // Lap data
  BestLap: number;
  LastLap: number;
  CurrentLap: number;
  CurrentRaceTime: number;
  LapNumber: number;
  RacePosition: number;
  
  // Input data
  Accel: number;
  Brake: number;
  Clutch: number;
  HandBrake: number;
  Gear: number;
  Steer: number;
  
  // AI data
  NormalizedDrivingLine: number;
  NormalizedAIBrakeDifference: number;
  
  // Tire wear
  TireWearFrontLeft: number;
  TireWearFrontRight: number;
  TireWearRearLeft: number;
  TireWearRearRight: number;
  
  // Track info
  TrackOrdinal: number;
  
  // Extended fields (computed)
  RaceID?: number;
  Shifting?: number;
  NormalizedSuspensionVelocityFrontLeft?: number;
  NormalizedSuspensionVelocityFrontRight?: number;
  NormalizedSuspensionVelocityRearLeft?: number;
  NormalizedSuspensionVelocityRearRight?: number;
}

class ForzaDecoder {
  private previousFrame: ForzaTelemetryFrame | null = null;
  
  // Struct format: "=iIfffffffffffffffffffffffffffiiiiffffffffffffffffffffiiiiifffffffffffffffffHBBBBBBbbbffffi"
  // i=4, I=4, f=4, H=2, B=1, b=1 bytes
  private readonly EXPECTED_SIZE = 331; // Size of the expected UDP packet
  
  decode(buffer: ArrayBuffer): ForzaTelemetryFrame | null {
    if (buffer.byteLength != this.EXPECTED_SIZE) {
      console.warn(`Forza decoder: Invalid buffer size. Expected ${this.EXPECTED_SIZE}, got ${buffer.byteLength}`);
      return null;
    }
    
    const view = new DataView(buffer);
    let offset = 0;
    
    try {
      // Basic race info
      const IsRaceOn = view.getInt32(offset, true); offset += 4;
      const TimestampMS = view.getUint32(offset, true); offset += 4;
      
      // Engine data
      const EngineMaxRpm = view.getFloat32(offset, true); offset += 4;
      const EngineIdleRpm = view.getFloat32(offset, true); offset += 4;
      const CurrentEngineRpm = view.getFloat32(offset, true); offset += 4;
      
      // Motion data
      const AccelerationX = view.getFloat32(offset, true); offset += 4;
      const AccelerationY = view.getFloat32(offset, true); offset += 4;
      const AccelerationZ = view.getFloat32(offset, true); offset += 4;
      const VelocityX = view.getFloat32(offset, true); offset += 4;
      const VelocityY = view.getFloat32(offset, true); offset += 4;
      const VelocityZ = view.getFloat32(offset, true); offset += 4;
      const AngularVelocityX = view.getFloat32(offset, true); offset += 4;
      const AngularVelocityY = view.getFloat32(offset, true); offset += 4;
      const AngularVelocityZ = view.getFloat32(offset, true); offset += 4;
      
      // Car orientation
      const Yaw = view.getFloat32(offset, true); offset += 4;
      const Pitch = view.getFloat32(offset, true); offset += 4;
      const Roll = view.getFloat32(offset, true); offset += 4;
      
      // Suspension travel
      const NormalizedSuspensionTravelFrontLeft = view.getFloat32(offset, true); offset += 4;
      const NormalizedSuspensionTravelFrontRight = view.getFloat32(offset, true); offset += 4;
      const NormalizedSuspensionTravelRearLeft = view.getFloat32(offset, true); offset += 4;
      const NormalizedSuspensionTravelRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Tire slip ratios
      const TireSlipRatioFrontLeft = view.getFloat32(offset, true); offset += 4;
      const TireSlipRatioFrontRight = view.getFloat32(offset, true); offset += 4;
      const TireSlipRatioRearLeft = view.getFloat32(offset, true); offset += 4;
      const TireSlipRatioRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Wheel rotation speeds
      const WheelRotationSpeedFrontLeft = view.getFloat32(offset, true); offset += 4;
      const WheelRotationSpeedFrontRight = view.getFloat32(offset, true); offset += 4;
      const WheelRotationSpeedRearLeft = view.getFloat32(offset, true); offset += 4;
      const WheelRotationSpeedRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Wheel on rumble strip
      const WheelOnRumbleStripFrontLeft = view.getInt32(offset, true); offset += 4;
      const WheelOnRumbleStripFrontRight = view.getInt32(offset, true); offset += 4;
      const WheelOnRumbleStripRearLeft = view.getInt32(offset, true); offset += 4;
      const WheelOnRumbleStripRearRight = view.getInt32(offset, true); offset += 4;
      
      // Wheel in puddle depth
      const WheelInPuddleDepthFrontLeft = view.getFloat32(offset, true); offset += 4;
      const WheelInPuddleDepthFrontRight = view.getFloat32(offset, true); offset += 4;
      const WheelInPuddleDepthRearLeft = view.getFloat32(offset, true); offset += 4;
      const WheelInPuddleDepthRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Surface rumble
      const SurfaceRumbleFrontLeft = view.getFloat32(offset, true); offset += 4;
      const SurfaceRumbleFrontRight = view.getFloat32(offset, true); offset += 4;
      const SurfaceRumbleRearLeft = view.getFloat32(offset, true); offset += 4;
      const SurfaceRumbleRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Tire slip angles
      const TireSlipAngleFrontLeft = view.getFloat32(offset, true); offset += 4;
      const TireSlipAngleFrontRight = view.getFloat32(offset, true); offset += 4;
      const TireSlipAngleRearLeft = view.getFloat32(offset, true); offset += 4;
      const TireSlipAngleRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Tire combined slip
      const TireCombinedSlipFrontLeft = view.getFloat32(offset, true); offset += 4;
      const TireCombinedSlipFrontRight = view.getFloat32(offset, true); offset += 4;
      const TireCombinedSlipRearLeft = view.getFloat32(offset, true); offset += 4;
      const TireCombinedSlipRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Suspension travel in meters
      const SuspensionTravelMetersFrontLeft = view.getFloat32(offset, true); offset += 4;
      const SuspensionTravelMetersFrontRight = view.getFloat32(offset, true); offset += 4;
      const SuspensionTravelMetersRearLeft = view.getFloat32(offset, true); offset += 4;
      const SuspensionTravelMetersRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Car info
      const CarOrdinal = view.getInt32(offset, true); offset += 4;
      const CarClass = view.getInt32(offset, true); offset += 4;
      const CarPerformanceIndex = view.getInt32(offset, true); offset += 4;
      const DrivetrainType = view.getInt32(offset, true); offset += 4;
      const NumCylinders = view.getInt32(offset, true); offset += 4;
      
      // Position
      const PositionX = view.getFloat32(offset, true); offset += 4;
      const PositionY = view.getFloat32(offset, true); offset += 4;
      const PositionZ = view.getFloat32(offset, true); offset += 4;
      
      // Performance
      const Speed = view.getFloat32(offset, true); offset += 4;
      const Power = view.getFloat32(offset, true); offset += 4;
      const Torque = view.getFloat32(offset, true); offset += 4;
      
      // Tire temperatures
      const TireTempFrontLeft = view.getFloat32(offset, true); offset += 4;
      const TireTempFrontRight = view.getFloat32(offset, true); offset += 4;
      const TireTempRearLeft = view.getFloat32(offset, true); offset += 4;
      const TireTempRearRight = view.getFloat32(offset, true); offset += 4;
      
      // Boost and fuel
      const Boost = view.getFloat32(offset, true); offset += 4;
      const Fuel = view.getFloat32(offset, true); offset += 4;
      const DistanceTraveled = view.getFloat32(offset, true); offset += 4;
      
      // Lap data
      const BestLap = view.getFloat32(offset, true); offset += 4;
      const LastLap = view.getFloat32(offset, true); offset += 4;
      const CurrentLap = view.getFloat32(offset, true); offset += 4;
      const CurrentRaceTime = view.getFloat32(offset, true); offset += 4;
      const LapNumber = view.getUint16(offset, true); offset += 2;
      const RacePosition = view.getUint8(offset); offset += 1;
      
      // Input data
      const Accel = view.getUint8(offset); offset += 1;
      const Brake = view.getUint8(offset); offset += 1;
      const Clutch = view.getUint8(offset); offset += 1;
      const HandBrake = view.getUint8(offset); offset += 1;
      const Gear = view.getUint8(offset); offset += 1;
      const Steer = view.getInt8(offset); offset += 1;
      
      // AI data
      const NormalizedDrivingLine = view.getInt8(offset); offset += 1;
      const NormalizedAIBrakeDifference = view.getInt8(offset); offset += 1;
      
      // Forza Motorsport extensions - start
      let TireWearFrontLeft;
      let TireWearFrontRight;
      let TireWearRearLeft;
      let TireWearRearRight;
      let TrackOrdinal;

      if (buffer.byteLength >= 331)
      {
        // Tire wear
        TireWearFrontLeft = view.getFloat32(offset, true); offset += 4;
        TireWearFrontRight = view.getFloat32(offset, true); offset += 4;
        TireWearRearLeft = view.getFloat32(offset, true); offset += 4;
        TireWearRearRight = view.getFloat32(offset, true); offset += 4;

        // Track info
        TrackOrdinal = view.getInt32(offset, true); offset += 4;
      }
      // Forza Motorsport extensions - end

      const frame: ForzaTelemetryFrame = {
        // Basic race info
        IsRaceOn,
        TimestampMS,
        
        // Engine data
        EngineMaxRpm,
        EngineIdleRpm,
        CurrentEngineRpm,
        
        // Motion data
        AccelerationX,
        AccelerationY,
        AccelerationZ,
        VelocityX,
        VelocityY,
        VelocityZ,
        AngularVelocityX,
        AngularVelocityY,
        AngularVelocityZ,
        
        // Car orientation
        Yaw,
        Pitch,
        Roll,
        
        // Suspension travel
        NormalizedSuspensionTravelFrontLeft,
        NormalizedSuspensionTravelFrontRight,
        NormalizedSuspensionTravelRearLeft,
        NormalizedSuspensionTravelRearRight,
        
        // Tire slip ratios
        TireSlipRatioFrontLeft,
        TireSlipRatioFrontRight,
        TireSlipRatioRearLeft,
        TireSlipRatioRearRight,
        
        // Wheel rotation speeds
        WheelRotationSpeedFrontLeft,
        WheelRotationSpeedFrontRight,
        WheelRotationSpeedRearLeft,
        WheelRotationSpeedRearRight,
        
        // Wheel on rumble strip
        WheelOnRumbleStripFrontLeft,
        WheelOnRumbleStripFrontRight,
        WheelOnRumbleStripRearLeft,
        WheelOnRumbleStripRearRight,
        
        // Wheel in puddle depth
        WheelInPuddleDepthFrontLeft,
        WheelInPuddleDepthFrontRight,
        WheelInPuddleDepthRearLeft,
        WheelInPuddleDepthRearRight,
        
        // Surface rumble
        SurfaceRumbleFrontLeft,
        SurfaceRumbleFrontRight,
        SurfaceRumbleRearLeft,
        SurfaceRumbleRearRight,
        
        // Tire slip angles
        TireSlipAngleFrontLeft,
        TireSlipAngleFrontRight,
        TireSlipAngleRearLeft,
        TireSlipAngleRearRight,
        
        // Tire combined slip
        TireCombinedSlipFrontLeft,
        TireCombinedSlipFrontRight,
        TireCombinedSlipRearLeft,
        TireCombinedSlipRearRight,
        
        // Suspension travel in meters
        SuspensionTravelMetersFrontLeft,
        SuspensionTravelMetersFrontRight,
        SuspensionTravelMetersRearLeft,
        SuspensionTravelMetersRearRight,
        
        // Car info
        CarOrdinal,
        CarClass,
        CarPerformanceIndex,
        DrivetrainType,
        NumCylinders,
        
        // Position
        PositionX,
        PositionY,
        PositionZ,
        
        // Performance
        Speed,
        Power,
        Torque,
        
        // Tire temperatures
        TireTempFrontLeft,
        TireTempFrontRight,
        TireTempRearLeft,
        TireTempRearRight,
        
        // Boost and fuel
        Boost,
        Fuel,
        DistanceTraveled,
        
        // Lap data
        BestLap,
        LastLap,
        CurrentLap,
        CurrentRaceTime,
        LapNumber,
        RacePosition,
        
        // Input data
        Accel,
        Brake,
        Clutch,
        HandBrake,
        Gear,
        Steer,
        
        // AI data
        NormalizedDrivingLine,
        NormalizedAIBrakeDifference,
        

        //Forza Motorsport Extension
        // Tire wear
        TireWearFrontLeft: TireWearFrontLeft ?? 0,
        TireWearFrontRight: TireWearFrontRight ?? 0,
        TireWearRearLeft: TireWearRearLeft ?? 0,
        TireWearRearRight: TireWearRearRight ?? 0,
        
        // Track info
        TrackOrdinal: TrackOrdinal ?? 0,
        
        // Add required fields for multi-packet support
        t: Date.now(),
        packet_type: 1 // Forza Motorsport packet type is always 1
      };
      
      // Only process data when race is on and not in race ramp up
      if (frame.IsRaceOn !== 1 || (frame.LapNumber == 0 && frame.CurrentLap == 0)) {
        return null;
      }
      
      // Calculate derived fields
      this.calculateDerivedFields(frame);
      
      this.previousFrame = frame;
      return frame;
      
    } catch (error) {
      console.error('Forza decoder error:', error);
      return null;
    }
  }
  
  private calculateDerivedFields(frame: ForzaTelemetryFrame) {
    // Calculate suspension velocities (similar to Python implementation)
    if (this.previousFrame) {
      const dt = (frame.CurrentRaceTime - this.previousFrame.CurrentRaceTime) || 0.016; // Default to ~60fps
      
      frame.NormalizedSuspensionVelocityFrontLeft = 
        (frame.NormalizedSuspensionTravelFrontLeft - this.previousFrame.NormalizedSuspensionTravelFrontLeft) / dt;
      frame.NormalizedSuspensionVelocityFrontRight = 
        (frame.NormalizedSuspensionTravelFrontRight - this.previousFrame.NormalizedSuspensionTravelFrontRight) / dt;
      frame.NormalizedSuspensionVelocityRearLeft = 
        (frame.NormalizedSuspensionTravelRearLeft - this.previousFrame.NormalizedSuspensionTravelRearLeft) / dt;
      frame.NormalizedSuspensionVelocityRearRight = 
        (frame.NormalizedSuspensionTravelRearRight - this.previousFrame.NormalizedSuspensionTravelRearRight) / dt;
      
      // Detect gear shifting
      frame.Shifting = (frame.Gear !== this.previousFrame.Gear) ? 1 : 0;
    } else {
      // First frame - initialize derived fields
      frame.NormalizedSuspensionVelocityFrontLeft = 0;
      frame.NormalizedSuspensionVelocityFrontRight = 0;
      frame.NormalizedSuspensionVelocityRearLeft = 0;
      frame.NormalizedSuspensionVelocityRearRight = 0;
      frame.Shifting = 0;
    }
    
    // Generate a simple race ID based on track and timestamp
    frame.RaceID = Math.floor(frame.TimestampMS / 1000000) * 1000 + frame.TrackOrdinal;
  }

  getPacketTypeName(packetType: number): string {
    return packetType === 1 ? 'Forza Motorsport' : `Unknown_${packetType}`;
  }

  getSupportedPacketTypes(): { type: number; name: string }[] {
    return [{ type: 1, name: 'Forza Motorsport' }];
  }

  getAcceptedPacketSizes(): number[] {
    return [this.EXPECTED_SIZE];
  }
}

export const forzaDecoder = new ForzaDecoder();