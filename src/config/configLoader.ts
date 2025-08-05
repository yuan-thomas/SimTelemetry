/**
 * Dynamic configuration loader for game-specific dashboard configs.
 * Loads appropriate configuration based on the selected telemetry decoder.
 */
import { ConfigFile } from '../types';

// Available game configurations
const GAME_CONFIGS = {
  'forza-motorsport': () => fetch('/config/games/forza-motorsport.json').then(r => r.json()),
  'forza-horizon': () => fetch('/config/games/forza-horizon.json').then(r => r.json()),
  'assetto-corsa': () => fetch('/config/games/assetto-corsa.json').then(r => r.json()),
  'f1-2024': () => fetch('/config/games/f1-2024.json').then(r => r.json()),
  'f1-2025': () => fetch('/config/games/f1-2025.json').then(r => r.json()),
} as const;

export type GameId = keyof typeof GAME_CONFIGS;

/**
 * Configuration manager class that handles loading and caching of game-specific configs.
 */
class ConfigManager {
  private configCache: Map<GameId, ConfigFile> = new Map();
  private currentConfig: ConfigFile | null = null;
  private currentGameId: GameId | null = null;

  /**
   * Load configuration for the specified game.
   * Uses caching to avoid re-loading the same config multiple times.
   */
  async loadConfig(gameId: GameId): Promise<ConfigFile> {
    // Return cached config if already loaded
    if (this.configCache.has(gameId)) {
      const config = this.configCache.get(gameId)!;
      this.currentConfig = config;
      this.currentGameId = gameId;
      return config;
    }

    // Load config dynamically
    const configLoader = GAME_CONFIGS[gameId];
    if (!configLoader) {
      throw new Error(`Unknown game configuration: ${gameId}`);
    }

    try {
      const config = await configLoader() as ConfigFile;
      
      // Cache the loaded config
      this.configCache.set(gameId, config);
      this.currentConfig = config;
      this.currentGameId = gameId;
      
      console.log(`Loaded configuration for ${gameId}`);
      return config;
    } catch (error) {
      throw new Error(`Failed to load configuration for ${gameId}: ${error}`);
    }
  }

  /**
   * Get the currently loaded configuration.
   * Returns null if no config has been loaded yet.
   */
  getCurrentConfig(): ConfigFile | null {
    return this.currentConfig;
  }

  /**
   * Get the currently loaded game ID.
   * Returns null if no config has been loaded yet.
   */
  getCurrentGameId(): GameId | null {
    return this.currentGameId;
  }

  /**
   * Check if a configuration is currently loaded.
   */
  isConfigLoaded(): boolean {
    return this.currentConfig !== null;
  }

  /**
   * Clear the configuration cache.
   * Useful for development or if configs need to be reloaded.
   */
  clearCache(): void {
    this.configCache.clear();
    this.currentConfig = null;
    this.currentGameId = null;
  }
}

// Export singleton instance
export const configManager = new ConfigManager();

/**
 * Map decoder IDs to game configuration IDs.
 * This allows the decoder selection to drive config loading.
 */
export const DECODER_TO_GAME_MAP: Record<string, GameId> = {
  'forza-motorsport': 'forza-motorsport',
  'forza-horizon': 'forza-horizon',
  'assetto-corsa': 'assetto-corsa',
  'f1-2024': 'f1-2024',
  'f1-2025': 'f1-2025',
};

/**
 * Load configuration for the specified decoder.
 * Maps decoder ID to game configuration ID and loads the appropriate config.
 */
export async function loadConfigForDecoder(decoderId: string): Promise<ConfigFile> {
  const gameId = DECODER_TO_GAME_MAP[decoderId];
  if (!gameId) {
    throw new Error(`No configuration available for decoder: ${decoderId}`);
  }
  
  return configManager.loadConfig(gameId);
}