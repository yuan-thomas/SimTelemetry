/**
 * Main dashboard component that orchestrates the telemetry visualization interface.
 * Manages tab navigation, chart rendering, and real-time data distribution to all charts.
 * Uses a central animation loop to efficiently drain the telemetry queue and update all charts.
 */
import React, { useEffect, useState } from "react";
import { Chart } from "./Chart";
import { useTelemetry } from "./telemetry";
import { SettingPanel } from "./SettingPanel";
import { InfoPanel } from "./InfoPanel";
import { useConfig } from "./SettingContext";
import { Frame } from "./types";
import { useGameConfig } from "./hooks/useGameConfig";

export const Dashboard: React.FC = () => {
  const tel = useTelemetry();
  const configCtx = useConfig();
  const { config: cfg, isLoading: configLoading, error: configError } = useGameConfig();

  // Tab navigation state - defaults to first available tab
  const [tab, setTab] = useState<string>('');
  // Frame distribution state for real-time chart updates organized by packet type
  const [frameTick, setFrameTick] = useState<Map<number, Frame[]>>(new Map());

  // Keyboard shortcuts for tabs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle direct keys without modifiers
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      
      // Don't handle if focus is on an input element
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

      const key = event.key.toLowerCase();
      
      // Handle tab shortcuts
      if (cfg && cfg.tabs) {
        for (const tabConfig of cfg.tabs) {
          if (tabConfig.shortcut && key === tabConfig.shortcut.toLowerCase()) {
            setTab(tabConfig.id);
            event.preventDefault();
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cfg]);

  // Update tab when config loads
  useEffect(() => {
    if (cfg && cfg.tabs.length > 0 && !tab) {
      setTab(cfg.tabs[0].id);
    }
  }, [cfg, tab]);

  // Find currently active tab configuration
  const currentTab = cfg?.tabs.find(t => t.id === tab);

  /**
   * Central animation loop that efficiently drains the telemetry queue.
   * Runs on every animation frame to provide smooth real-time updates.
   * Distributes new frames to charts based on their packet type requirements.
   */
  useEffect(() => {
    let animationFrameId: number;
    
    const animationLoop = () => {
      // Collect all unique packet types used by current tab's charts
      const packetTypes = new Set(currentTab?.charts.map(chart => chart.packet_type) || []);
      const newFramesByType = new Map<number, Frame[]>();
      
      // Drain queues for each packet type
      for (const packetType of packetTypes) {
        const newFrames = tel.getQueued(packetType);
        if (newFrames.length > 0) {
          newFramesByType.set(packetType, newFrames);
        }
      }
      
      // Update state if we have new frames
      if (newFramesByType.size > 0) {
        setFrameTick(newFramesByType);
      }
      
      animationFrameId = requestAnimationFrame(animationLoop);
    };
    
    animationFrameId = requestAnimationFrame(animationLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [tel, currentTab]);

  // Show loading or error states
  if (configLoading) {
    return (
      <div className="flex flex-col h-full">
        <SettingPanel hasPacketErrors={tel.hasPacketErrors} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading configuration...</div>
        </div>
      </div>
    );
  }

  if (configError || !cfg) {
    return (
      <div className="flex flex-col h-full">
        <SettingPanel hasPacketErrors={tel.hasPacketErrors} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-red-500">
            Error loading configuration: {configError || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Configuration panel for retention settings and decoder selection */}
      <SettingPanel hasPacketErrors={tel.hasPacketErrors} />
      
      {/* Information panel with telemetry values and playback controls */}
      <InfoPanel />
      
      {/* Tab navigation bar for switching between chart groups */}
      <div className="tab-bar">
        {cfg.tabs.map(tabConfig => {
          const shortcut = tabConfig.shortcut?.toUpperCase() || '';
          
          return (
            <button
              key={tabConfig.id}
              className={`tab-button ${tabConfig.id === tab ? "active" : ""}`}
              onClick={() => setTab(tabConfig.id)}
              title={shortcut ? `Keyboard shortcut: ${shortcut}` : undefined}
            >
              {tabConfig.label}{shortcut ? ` (${shortcut})` : ''}
            </button>
          );
        })}
      </div>

      {/* Chart rendering area - displays all charts for the active tab */}
      <div className="chart-container">
        {currentTab?.charts.map(chartCfg => (
          <Chart 
            key={chartCfg.id} 
            cfg={chartCfg} 
            newFrames={frameTick.get(chartCfg.packet_type) || []} 
          />
        ))}
      </div>
    </div>
  );
};
