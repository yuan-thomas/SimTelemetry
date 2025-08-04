import React, { useEffect, useRef, useState } from "react";
import Plotly from 'plotly.js-dist-min';
import { useTelemetry } from "./telemetry";
import { useConfig } from "./SettingContext";
import { ChartCfg, Frame } from "./types";
import {
  createInitialTraceData,
  createChartLayout,
  createBoxPlotTraces,
  safeExtendTraces,
  updateXAxisRange,
  processFrameData,
  validateFrameData,
  clearTraceData
} from "./utils";

/**
 * Real-time chart component that displays telemetry data using Plotly.js.
 * Supports both line charts for time-series data and box plots for statistical summaries.
 * Handles automatic data population from buffer and real-time updates from incoming frames.
 */
export const Chart: React.FC<{
  cfg: ChartCfg;
  newFrames: Frame[];
}> = ({ cfg, newFrames }) => {
  // Chart DOM references and telemetry data access
  const plotRef = useRef<any>();
  const boxRef = useRef<any>();
  const telemetry = useTelemetry();
  const configCtx = useConfig();

  // State management for chart resets and updates
  const prevResetSignalRef = useRef(telemetry.resetSignal);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [needsRepopulation, setNeedsRepopulation] = useState(false);

  // Box plot state tracking
  const boxTraceIndicesRef = useRef<number[]>([]);
  const hasBoxBeenInitializedRef = useRef(false);

  // Chart range and timing references
  const xRangeRef = useRef<[number, number]>([0, configCtx.lineChartRetention]);
  const boxYLengthsRef = useRef<number[]>([]);
  const lastBoxUpdateRef = useRef<number>(0);

  /**
   * Initialize the chart with line traces and set up box plots if needed.
   * This effect runs once on component mount to create the base chart structure.
   */
  useEffect(() => {
    const initialData = createInitialTraceData(cfg.traces);
    const layout = createChartLayout(cfg);

    Plotly.newPlot(plotRef.current, initialData, layout, {
      displayModeBar: false,
      staticPlot: true // Required for real-time updates to work properly
    }).then(() => {
      // Initialize box plot traces if any traces require statistical summaries
      const boxTraces = cfg.traces.filter(trace => trace.show_box);
      if (!boxTraces.length || hasBoxBeenInitializedRef.current) return;

      const boxPlotData = createBoxPlotTraces(cfg.traces);
      const baseIndex = plotRef.current.data.length;

      Plotly.addTraces(plotRef.current, boxPlotData).then(() => {
        // Store box plot trace indices for future updates
        boxTraceIndicesRef.current = boxPlotData.map((_, i) => baseIndex + i);
        hasBoxBeenInitializedRef.current = true;
      });
    });
  }, []);

  /**
   * Ensure initial population happens for newly mounted charts, even when paused.
   * This fixes the issue where switching tabs while paused shows empty charts.
   */
  useEffect(() => {
    // Delay to ensure chart is fully initialized
    const timer = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle chart reset when telemetry buffer is replaced or when unpausing.
   * Clears all trace data to trigger repopulation from the current buffer state.
   */
  useEffect(() => {
    if (telemetry.resetSignal !== prevResetSignalRef.current) {
      prevResetSignalRef.current = telemetry.resetSignal;
      
      // Ensure plot is properly initialized before attempting reset
      // Also check that box plots are fully initialized if they're expected
      const hasBoxTraces = cfg.traces.some(trace => trace.show_box);
      const boxInitComplete = !hasBoxTraces || hasBoxBeenInitializedRef.current;
      
      if (plotRef.current?.data && Array.isArray(plotRef.current.data) && plotRef.current.data.length > 0 && boxInitComplete) {
        try {
          const { lineUpdates, boxUpdates, lineIndices, allIndices } = clearTraceData(
            cfg.traces.length,
            boxTraceIndicesRef.current
          );
          
          const updates = boxTraceIndicesRef.current.length > 0 
            ? [...lineUpdates, ...boxUpdates] 
            : lineUpdates;
          const indices = boxTraceIndicesRef.current.length > 0 
            ? allIndices 
            : lineIndices;

          // Validate that updates and indices are properly formed
          if (updates && Array.isArray(updates) && updates.length > 0 && 
              indices && Array.isArray(indices) && indices.length > 0 &&
              updates.length === indices.length) {
            

            const reshapedUpdates = {
              x: updates.map(u => u.x),
              y: updates.map(u => u.y)
            };

            Plotly.restyle(plotRef.current, reshapedUpdates, indices).then(() => {
              setNeedsRepopulation(true);
              setForceUpdate(prev => prev + 1);
            }).catch((error) => {
              console.error('Plotly restyle failed during chart reset:', error);
              // Force update anyway to trigger chart repopulation
              setNeedsRepopulation(true);
              setForceUpdate(prev => prev + 1);
            });
          } else {
            console.warn('Invalid updates or indices for restyle, forcing update instead');
            setNeedsRepopulation(true);
            setForceUpdate(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error during chart reset preparation:', error);
          // Force update to trigger chart repopulation even if reset fails
          setNeedsRepopulation(true);
          setForceUpdate(prev => prev + 1);
        }
      } else {
        console.warn('Chart not properly initialized for reset, forcing update');
        setNeedsRepopulation(true);
        setForceUpdate(prev => prev + 1);
      }
    }
  }, [telemetry.resetSignal]);

  /**
   * Handle telemetry data updates for line chart traces.
   * Populates empty traces from buffer and appends new real-time frames.
   * After reset (e.g., resume from pause), force repopulation from buffer.
   */
  useEffect(() => {
    // If we need repopulation after reset, force it for all traces
    if (needsRepopulation) {
      cfg.traces.forEach((trace, idx) => {
        if (trace.custom_function) return;
        
        try {
          const slice = telemetry.getSlice(configCtx.lineChartRetention, cfg.packet_type);
          const { xVals: preX, yVals: preY } = processFrameData(slice, trace, cfg.x_field);

          if (preX.length && preY.length && validateFrameData(preX, preY)) {
            const success = safeExtendTraces(plotRef.current, { x: [preX], y: [preY] }, [idx]);
            
            if (success) {
              // Update chart range based on populated data
              const latestX = preX[preX.length - 1];
              xRangeRef.current = updateXAxisRange(plotRef.current, latestX, configCtx.lineChartRetention);
            }
          }
        } catch (error) {
          console.error(`Error repopulating trace ${trace.name} after reset:`, error);
        }
      });
      setNeedsRepopulation(false); // Clear the flag after repopulation
      return; // Skip normal processing when repopulating
    }

    // Normal processing: populate empty traces and append new frames
    cfg.traces.forEach((trace, idx) => {
      if (trace.custom_function) return;

      const traceData = plotRef.current?.data?.[idx];
      const isTraceEmpty = !traceData || !traceData.x || traceData.x.length === 0;

      // Populate empty traces from telemetry buffer
      if (isTraceEmpty) {
        try {
          const slice = telemetry.getSlice(configCtx.lineChartRetention, cfg.packet_type);
          const { xVals: preX, yVals: preY } = processFrameData(slice, trace, cfg.x_field);

          if (preX.length && preY.length && validateFrameData(preX, preY)) {
            const success = safeExtendTraces(plotRef.current, { x: [preX], y: [preY] }, [idx]);
            
            if (success) {
              // Update chart range based on populated data
              const latestX = preX[preX.length - 1];
              xRangeRef.current = updateXAxisRange(plotRef.current, latestX, configCtx.lineChartRetention);
            }
          }
        } catch (error) {
          console.error(`Error populating trace ${trace.name}:`, error);
        }
      }

      // Append new real-time frames to existing traces
      if (newFrames.length) {
        const { xVals, yVals } = processFrameData(newFrames, trace, cfg.x_field);

        if (validateFrameData(xVals, yVals)) {
          const success = safeExtendTraces(
            plotRef.current, 
            { x: [xVals], y: [yVals] }, 
            [idx], 
            configCtx.lineChartRetention * 100
          );

          if (success) {
            const latestX = xVals[xVals.length - 1];
            if (latestX !== undefined && plotRef.current.data[idx]?.x?.length > 1) {
              xRangeRef.current = updateXAxisRange(plotRef.current, latestX, configCtx.lineChartRetention);
            }
          }
        }
      }
    });
  }, [newFrames, forceUpdate, needsRepopulation]);

  /**
   * Update box plot statistical summaries at 1-second intervals.
   * Box plots show distribution statistics for the configured retention period.
   */
  useEffect(() => {
    if (!hasBoxBeenInitializedRef.current) return;

    const boxTraces = cfg.traces.filter(trace => trace.show_box);
    if (!boxTraces.length) return;

    const now = Date.now();
    const shouldUpdate = now - lastBoxUpdateRef.current >= 1000;
    
    if (!shouldUpdate) return;

    boxTraces.forEach((trace, i) => {
      const traceIndex = boxTraceIndicesRef.current[i];
      if (traceIndex === undefined) return;

      const slice = telemetry.getSlice(configCtx.boxChartRetention, cfg.packet_type);
      if (!slice.length) return;

      // Generate statistical data for box plot visualization
      const yData = slice.map(frame => (frame[trace.field] as number) / (trace.scaling_factor || 1));
      const xData = Array(yData.length).fill(i * 0.5 + 0.6); // Position boxes horizontally
      
      boxYLengthsRef.current[i] = yData.length;

      Plotly.restyle(plotRef.current, {
        x: [xData],
        y: [yData]
      }, [traceIndex]);
    });

    lastBoxUpdateRef.current = now;
  }, [newFrames, forceUpdate]);

  return (
    <div>
      <div ref={plotRef} />
      {cfg.traces.some(t => t.show_box) && <div ref={boxRef} />}
    </div>
  );
};
