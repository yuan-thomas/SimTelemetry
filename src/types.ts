/**
 * Shared type definitions for the telemetry dashboard application.
 * Centralizes all interface and type definitions to avoid duplication.
 */

/** Represents a single telemetry data frame with numeric/string values and required timestamp */
export interface Frame { 
  [k: string]: number | string; 
  t: number;
  packet_type: number; // Packet type identifier for multi-game support
}

/** Configuration for a single trace (data series) within a chart */
export interface TraceCfg {
  field: string;
  name: string;
  color: string;
  yaxis?: string;
  show_box?: boolean;
  scaling_factor?: number;
  mode?: string;
  custom_function?: boolean;
}

/** Configuration for a complete chart including all its traces and styling */
export interface ChartCfg {
  id: string;
  packet_type: number; // Packet type this chart should display
  x_field: string;
  title: string;
  traces: TraceCfg[];
  yaxis1_range?: [number, number];
  yaxis2_range?: [number, number];
  height?: number;
  hovermode?: string;
  legend_position?: string;
  legend?: any;
}

/** Configuration for a dashboard tab containing multiple charts */
export interface TabConfig {
  id: string;
  label: string;
  shortcut?: string;
  charts: ChartCfg[];
}

/** Global settings that apply across the entire dashboard */
export interface GlobalSettings {
  time_field: string;
}

/** Top-level configuration file structure loaded from config.json */
export interface ConfigFile {
  global_settings: GlobalSettings;
  tabs: TabConfig[];
  info_bar?: InfoBarItem[];
}

/** Configuration for items displayed in the information panel */
export interface InfoBarItem {
  label: string;
  field: string;
  packet_type: number;
}

/** Settings managed by the configuration context */
export interface Settings {
  lineChartRetention: number;
  boxChartRetention: number;
  selectedDecoder: string;
}

/** Extended settings context interface including utility functions */
export interface SettingContextType extends Settings {
  updateConfig: (key: keyof Settings, value: number | string) => void;
  getMaxRetention: () => number;
  saveAsDefault: () => boolean;
}

/** Telemetry context interface providing data access and control functions */
export interface TelemetryContextType {
  getSlice: (sec: number, packetType: number) => Frame[];
  getQueued: (packetType: number) => Frame[];
  getLatestFrame: (packetType?: number) => Frame | null;
  isPaused: boolean;
  togglePause: () => void;
  getFullBuffer: (packetType?: number) => Frame[];
  getBuffersByPacketType: () => Map<number, Frame[]>;
  replaceBuffer: (frames: Frame[], packetType?: number) => void;
  resetSignal: number;
  clearAll: () => void;
  hasPacketErrors: boolean;
}