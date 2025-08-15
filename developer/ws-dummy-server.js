import http from 'http';
import { WebSocketServer } from 'ws';

const PORT = 8765;

// HTTP server just to attach WS
const server = http.createServer();

const wss = new WebSocketServer({ server, path: '/telemetry' });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log("✅ Client connected");

  ws.on('close', () => {
    clients.delete(ws);
    console.log("❌ Client disconnected");
  });
});

// Fake telemetry data broadcast every 100ms
setInterval(() => {
  const frame = {
    // = 1 when race is on. = 0 when in menus/race stopped …
    IsRaceOn: 1,

    // Can overflow to 0 eventually
    TimestampMS: Date.now() / 1000,

    EngineMaxRpm: 8000,
    EngineIdleRpm: 1000,
    CurrentEngineRpm: Math.random()*7000+1000,

    // In the car's local space, X = right, Y = up, Z = forward
    AccelerationX: (Math.random()-1)*20,
    AccelerationY: (Math.random()-1)*20,
    AccelerationZ: (Math.random()-1)*20,

    // In the car's local space, X = right, Y = up, Z = forward
    VelocityX: Math.random()*300,
    VelocityY: Math.random()*300,
    VelocityZ: Math.random()*300,

    // In the car's local space, X = pitch, Y = yaw, Z = roll
    AngularVelocityX: (Math.random()-1)*20,
    AngularVelocityY: (Math.random()-1)*20,
    AngularVelocityZ: (Math.random()-1)*20,

    Yaw: (Math.random()-1)*20,
    Pitch: (Math.random()-1)*20,
    Roll: (Math.random()-1)*20,

    // Suspension travel normalized: 0.0f = max stretch, 1.0 = max compression
    NormalizedSuspensionTravelFrontLeft: Math.random(),
    NormalizedSuspensionTravelFrontRight: Math.random(),
    NormalizedSuspensionTravelRearLeft: Math.random(),
    NormalizedSuspensionTravelRearRight: Math.random(),

    // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip.
    TireSlipRatioFrontLeft: Math.random()*2,
    TireSlipRatioFrontRight: Math.random()*2,
    TireSlipRatioRearLeft: Math.random()*2,
    TireSlipRatioRearRight: Math.random()*2,

    // Wheels rotation speed radians/sec. 
    WheelRotationSpeedFrontLeft: Math.random(),
    WheelRotationSpeedFrontRight: Math.random(),
    WheelRotationSpeedRearLeft: Math.random(),
    WheelRotationSpeedRearRight: Math.random(),

    // = 1 when wheel is on rumble strip, = 0 when off.
    WheelOnRumbleStripFrontLeft: Math.round(Math.random()),
    WheelOnRumbleStripFrontRight: Math.round(Math.random()),
    WheelOnRumbleStripRearLeft: Math.round(Math.random()),
    WheelOnRumbleStripRearRight: Math.round(Math.random()),

    // = from 0 to 1, where 1 is the deepest puddle
    WheelInPuddleDepthFrontLeft: Math.round(Math.random()),
    WheelInPuddleDepthFrontRight: Math.round(Math.random()),
    WheelInPuddleDepthRearLeft: Math.round(Math.random()),
    WheelInPuddleDepthRearRight: Math.round(Math.random()),

    // Non-dimensional surface rumble values passed to controller force feedback
    SurfaceRumbleFrontLeft: Math.random(),
    SurfaceRumbleFrontRight: Math.random(),
    SurfaceRumbleRearLeft: Math.random(),
    SurfaceRumbleRearRight: Math.random(),

    // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip.
    TireSlipAngleFrontLeft: Math.random()*2,
    TireSlipAngleFrontRight: Math.random()*2,
    TireSlipAngleRearLeft: Math.random()*2,
    TireSlipAngleRearRight: Math.random()*2,

    // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip.
    TireCombinedSlipFrontLeft: Math.random()*2,
    TireCombinedSlipFrontRight: Math.random()*2,
    TireCombinedSlipRearLeft: Math.random()*2,
    TireCombinedSlipRearRight: Math.random()*2,
    
    // Actual suspension travel in meters
    SuspensionTravelMetersFrontLeft: Math.random()*2,
    SuspensionTravelMetersFrontRight: Math.random()*2,
    SuspensionTravelMetersRearLeft: Math.random()*2,
    SuspensionTravelMetersRearRight: Math.random()*2,

    // Unique ID of the car make/model
    CarOrdinal: 2000,

    // Between 0 (D -- worst cars) and 7 (X class -- best cars) inclusive         
    CarClass: 7,

    // Between 100 (worst car) and 999 (best car) inclusive
    CarPerformanceIndex: 799,

    // 0 = FWD, 1 = RWD, 2 = AWD
    DrivetrainType: 0,

    // Number of cylinders in the engine
    NumCylinders: 8,

    PositionX: 0,
    PositionY: 1,
    PositionZ: 2,

    Speed: Math.random() * 300,
    Power: Math.random() * 400000,
    Torque: Math.random() * 400,




    TireTempFrontLeft: 90+Math.random()*20,
    TireTempFrontRight: 90+Math.random()*20,
    TireTempRearLeft: 90+Math.random()*20,
    TireTempRearRight: 90+Math.random()*20,

    Boost: 0,
    Fuel: 100,
    DistanceTraveled: 200,

    BestLap: 100,
    LastLap: 100,
    CurrentLap: Date.now() / 1000,
    CurrentRaceTime: Date.now() / 1000,
    LapNumber: 1,
    RacePosition: 2,

    Accel: Math.random()*256,
    Brake: Math.random()*256,
    Clutch: 0,
    HandBrake: 0,
    Gear: Math.floor(Math.random() * 6) + 1,
    Steer: (Math.random() - 0.5) * 256,

    NormalizedDrivingLine: Math.random(),
    NormalizedAIBrakeDifference: Math.random(),

    
    TireWearFrontLeft: Math.random(),
    TireWearFrontRight: Math.random(),
    TireWearRearLeft: Math.random(),
    TireWearRearRight: Math.random(),

    // ID for track
    TrackOrdinal: 389,

    RaceID: 365,
    Shifting: 0, 
    NormalizedSuspensionVelocityFrontLeft: Math.random(), 
    NormalizedSuspensionVelocityFrontRight: Math.random(), 
    NormalizedSuspensionVelocityRearLeft: Math.random(), 
    NormalizedSuspensionVelocityRearRight: Math.random()   

  };

  const msg = new Blob([JSON.stringify(frame)], { type: 'application/json' });
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  }
}, 16);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WebSocket server listening at ws://0.0.0.0:${PORT}/telemetry`);
  });
