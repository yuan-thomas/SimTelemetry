/**
 * React hook for managing game-specific configuration loading.
 * Automatically loads the appropriate config when the selected decoder changes.
 */
import { useState, useEffect } from 'react';
import { ConfigFile } from '../types';
import { loadConfigForDecoder, configManager } from '../config/configLoader';
import { useConfig } from '../SettingContext';

export interface UseGameConfigResult {
  config: ConfigFile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that provides game-specific configuration based on the selected decoder.
 * Automatically reloads when the decoder selection changes.
 */
export function useGameConfig(): UseGameConfigResult {
  const { selectedDecoder } = useConfig();
  const [config, setConfig] = useState<ConfigFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load config for the selected decoder
        const newConfig = await loadConfigForDecoder(selectedDecoder);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setConfig(newConfig);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`Failed to load config for decoder ${selectedDecoder}:`, err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error loading config');
          setIsLoading(false);
        }
      }
    };

    loadConfig();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [selectedDecoder]);

  return {
    config,
    isLoading,
    error
  };
}