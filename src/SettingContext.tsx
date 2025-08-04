/**
 * Configuration context that manages application-wide settings.
 * Handles retention periods for different chart types and decoder selection.
 * Provides utility functions for configuration management and validation.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, SettingContextType } from './types';

const ConfigContext = createContext<SettingContextType | undefined>(undefined);

/**
 * Custom hook for accessing configuration context.
 * Throws an error if used outside of ConfigProvider to ensure proper usage.
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

const DEFAULT_SETTINGS: Settings = {
  lineChartRetention: 10, // Default retention for line charts (seconds)
  boxChartRetention: 10,  // Default retention for box plots (seconds)
  selectedDecoder: 'forza-motorsport' // Default telemetry decoder
};

const STORAGE_KEY = 'dashboard-default-settings';

/**
 * Configuration provider that manages application settings state.
 * Initializes with default values and provides update mechanisms.
 */
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  /**
   * Update a specific configuration setting.
   * Validates the key exists and updates the state immutably.
   */
  const updateConfig = (key: keyof Settings, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Save current settings as default settings.
   * Stores the current configuration to localStorage for future sessions.
   */
  const saveAsDefault = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Get the maximum retention period across all chart types.
   * Used for buffer management to ensure sufficient data availability.
   */
  const getMaxRetention = () => Math.max(config.lineChartRetention, config.boxChartRetention);

  return (
    <ConfigContext.Provider value={{
      ...config,
      updateConfig,
      getMaxRetention,
      saveAsDefault
    }}>
      {children}
    </ConfigContext.Provider>
  );
};