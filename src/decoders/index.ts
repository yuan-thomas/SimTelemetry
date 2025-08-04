import { Frame } from '../types';

export interface TelemetryDecoder {
  decode(buffer: ArrayBuffer): Frame | null;
  getPacketTypeName?(packetType: number): string;
  getSupportedPacketTypes?(): { type: number; name: string }[];
  getAcceptedPacketSizes?(): number[];
}

export interface DecoderInfo {
  id: string;
  name: string;
  description: string;
  loader: () => Promise<TelemetryDecoder>;
}

// Registry of available decoders
export const AVAILABLE_DECODERS: Record<string, DecoderInfo> = {
  'forza-motorsport': {
    id: 'forza-motorsport',
    name: 'Forza Motorsport',
    description: 'Forza Motorsport series UDP telemetry decoder',
    loader: async () => {
      const module = await import('./forza-motorsport');
      return module.forzaDecoder;
    }
  },
  'forza-horizon': {
    id: 'forza-horizon',
    name: 'Forza Horizon 4/5',
    description: 'Forza Horizon 4/5 series UDP telemetry decoder',
    loader: async () => {
      const module = await import('./forza-horizon');
      return module.forzaDecoder;
    }
  },
  'assetto-corsa': {
    id: 'assetto-corsa',
    name: 'Assetto Corsa Series',
    description: 'Assetto Corsa EVO UDP telemetry decoder (Coming Soon)',
    loader: async () => {
      const module = await import('./assetto-corsa');
      return module.accDecoder;
    }
  },
  'f1-2024': {
    id: 'f1-2024',
    name: 'F1 2024',
    description: 'F1 2024 UDP telemetry decoder with full packet type support',
    loader: async () => {
      const module = await import('./f1-2024');
      return module.f1Decoder;
    }
  },
  'f1-2025': {
    id: 'f1-2025',
    name: 'F1 2025',
    description: 'F1 2025 UDP telemetry decoder with full packet type support including new Lap Positions packet',
    loader: async () => {
      const module = await import('./f1-2025');
      return module.f1_25_Decoder;
    }
  }
};

// Decoder manager class
export class DecoderManager {
  private decoders: Map<string, TelemetryDecoder> = new Map();
  private currentDecoder: TelemetryDecoder | null = null;
  private currentDecoderId: string | null = null;

  async loadDecoder(decoderId: string): Promise<TelemetryDecoder> {
    // Return cached decoder if already loaded
    if (this.decoders.has(decoderId)) {
      const decoder = this.decoders.get(decoderId)!;
      this.currentDecoder = decoder;
      this.currentDecoderId = decoderId;
      return decoder;
    }

    // Load decoder
    const decoderInfo = AVAILABLE_DECODERS[decoderId];
    if (!decoderInfo) {
      throw new Error(`Unknown decoder: ${decoderId}`);
    }

    try {
      const decoder = await decoderInfo.loader();
      this.decoders.set(decoderId, decoder);
      this.currentDecoder = decoder;
      this.currentDecoderId = decoderId;
      console.log(`Loaded decoder: ${decoderInfo.name}`);
      return decoder;
    } catch (error) {
      console.error(`Failed to load decoder ${decoderId}:`, error);
      throw error;
    }
  }

  getCurrentDecoder(): TelemetryDecoder | null {
    return this.currentDecoder;
  }

  getCurrentDecoderId(): string | null {
    return this.currentDecoderId;
  }

  decode(buffer: ArrayBuffer): Frame | null {
    if (!this.currentDecoder) {
      console.warn('No decoder loaded');
      return null;
    }
    
    return this.currentDecoder.decode(buffer);
  }

  getAvailableDecoders(): DecoderInfo[] {
    return Object.values(AVAILABLE_DECODERS);
  }
}

export const decoderManager = new DecoderManager();