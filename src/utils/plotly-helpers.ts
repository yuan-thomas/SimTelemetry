/**
 * Utility functions for Plotly chart operations.
 * Encapsulates common Plotly.js operations to reduce code duplication
 * and provide consistent chart behavior across the application.
 */

import Plotly from 'plotly.js-dist-min';
import { ChartCfg, TraceCfg, Frame } from '../types';

/**
 * Creates the initial Plotly data structure for line chart traces.
 * Transforms trace configuration into Plotly-compatible data format.
 */
export const createInitialTraceData = (traces: TraceCfg[]): Partial<Plotly.PlotData>[] => {
  return traces.map(trace => ({
    x: [],
    y: [],
    name: trace.name,
    yaxis: trace.yaxis ?? "y",
    line: { color: trace.color },
    type: "scattergl",
    mode: trace.mode ?? "lines"
  }));
};

/**
 * Generates the complete layout configuration for a chart.
 * Handles dual-axis setup, legends, and box plot overlay axes.
 */
export const createChartLayout = (cfg: ChartCfg): Partial<Plotly.Layout> => {
  const layout: Partial<Plotly.Layout> = {
    height: cfg.height ?? 300,
    title: { text: cfg.title, x: 0, xanchor: "left" },
    showlegend: true,
    legend: cfg.legend ?? {
      orientation: "h",
      yanchor: "top",
      y: 1.1,
      xanchor: "right",
      x: 1,
      font: { size: 10 }
    },
    margin: { l: 25, r: 25, t: 25, b: 0 },
    // Secondary X-axis for box plots (always present for consistency)
    xaxis2: {
      overlaying: 'x',
      side: 'top',
      range: [0, 20],
      showticklabels: false,
      showgrid: false,
      zeroline: false
    }
  };

  // Add primary Y-axis range if specified
  if (cfg.yaxis1_range) {
    layout.yaxis = { range: cfg.yaxis1_range };
  }

  // Add secondary Y-axis if specified
  if (cfg.yaxis2_range) {
    layout.yaxis2 = {
      range: cfg.yaxis2_range,
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      zeroline: true
    };
  }

  return layout;
};

/**
 * Creates box plot trace data for statistical summaries.
 * Generates dummy traces that will be populated with actual data later.
 */
export const createBoxPlotTraces = (traces: TraceCfg[]): Partial<Plotly.PlotData>[] => {
  const boxTraces = traces.filter(trace => trace.show_box);
  
  return boxTraces.map(trace => ({
    x: [0], // Dummy data to maintain trace visibility and legend functionality
    y: [0],
    name: `${trace.name} (box)`,
    type: "box",
    xaxis: 'x2',
    marker: { color: trace.color },
    boxpoints: false,
    width: 0.3,
    line: { width: 1 },
    yaxis: trace.yaxis ?? "y",
    visible: true,
    showlegend: false
  }));
};

/**
 * Safely extends Plotly traces with new data points.
 * Handles error cases and provides consistent trace update behavior.
 */
export const safeExtendTraces = (
  plotRef: any,
  data: { x: number[][]; y: number[][] },
  traceIndices: number[],
  maxPoints?: number
): boolean => {
  if (!plotRef || !plotRef.data || !Array.isArray(plotRef.data)) {
    console.warn("Invalid plot reference for extendTraces");
    return false;
  }
  
  try {
    Plotly.extendTraces(plotRef, data, traceIndices, maxPoints);
    return true;
  } catch (error) {
    console.warn("extendTraces failed:", error);
    return false;
  }
};

/**
 * Updates the X-axis range for smooth scrolling time-series visualization.
 * Calculates appropriate min/max values based on current data and retention settings.
 */
export const updateXAxisRange = (
  plotRef: any,
  latestX: number,
  retention: number
): [number, number] => {
  const minX = Math.max(0, latestX - retention);
  const maxX = Math.max(retention, latestX);
  const newRange: [number, number] = [minX, maxX];

  if (!plotRef || !plotRef.layout) {
    console.warn("Invalid plot reference for relayout");
    return newRange;
  }

  try {
    Plotly.relayout(plotRef, { 'xaxis.range': newRange });
  } catch (error) {
    console.warn("relayout failed:", error);
  }

  return newRange;
};

/**
 * Processes frame data for a specific trace, applying scaling and field extraction.
 * Returns arrays of X and Y values ready for Plotly consumption.
 */
export const processFrameData = (
  frames: Frame[],
  trace: TraceCfg,
  xField: string
): { xVals: number[]; yVals: number[] } => {
  const xVals: number[] = [];
  const yVals: number[] = [];
  
  frames.forEach((frame, index) => {
    try {
      const xVal = frame[xField] as number;
      const yVal = (frame[trace.field] as number) / (trace.scaling_factor || 1);
      
      // Only include valid numeric values
      if (typeof xVal === 'number' && !isNaN(xVal) && 
          typeof yVal === 'number' && !isNaN(yVal)) {
        xVals.push(xVal);
        yVals.push(yVal);
      }
    } catch (error) {
      console.warn(`Error processing frame ${index} for trace ${trace.field}:`, error);
    }
  });
  
  return { xVals, yVals };
};

/**
 * Validates that frame data contains no undefined values.
 * Prevents chart errors from invalid telemetry data.
 */
export const validateFrameData = (
  xVals: number[],
  yVals: number[]
): boolean => {
  return !xVals.some(x => x === undefined) && !yVals.some(y => y === undefined);
};

/**
 * Clears all trace data for chart reset operations.
 * Generates empty data arrays for both line and box plot traces.
 */
export const clearTraceData = (
  lineTraceCount: number,
  boxTraceIndices: number[]
): { lineUpdates: object[]; boxUpdates: object[]; lineIndices: number[]; allIndices: number[] } => {
  // Ensure we have valid parameters
  const safeLineTraceCount = Math.max(0, lineTraceCount || 0);
  const safeBoxTraceIndices = Array.isArray(boxTraceIndices) ? boxTraceIndices : [];
  
  const lineUpdates = Array(safeLineTraceCount).fill(null).map(() => ({ x: [], y: [] }));
  const lineIndices = Array.from({ length: safeLineTraceCount }, (_, i) => i);
  const boxUpdates = safeBoxTraceIndices.map(() => ({ x: [0], y: [0] }));
  const allIndices = [...lineIndices, ...safeBoxTraceIndices];

  return { lineUpdates, boxUpdates, lineIndices, allIndices };
};