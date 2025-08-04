// telemetry.tsx – global context
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useConfig } from './SettingContext';
import { decoderManager } from './decoders';
import { Frame, TelemetryContextType } from './types';
import { useGameConfig } from './hooks/useGameConfig';

// Create telemetry context with default values
export const TelemetryCtx = createContext<TelemetryContextType>({ 
  getSlice: () => [], 
  getQueued: () => [],
  getLatestFrame: () => null,
  isPaused: false,
  togglePause: () => {},
  getFullBuffer: () => [],
  getBuffersByPacketType: () => new Map(),
  replaceBuffer: () => {},
  resetSignal: 0,
  clearAll: () => {},
  hasPacketErrors: false
});

// Custom hook for accessing telemetry context
export const useTelemetry = () => useContext(TelemetryCtx)!;

/**
 * Telemetry provider component that manages the complete telemetry data lifecycle.
 * Handles WebSocket connections, binary/JSON decoding, buffer management, and data distribution.
 */
export const TelemetryProvider: React.FC<{ 
  children: React.ReactNode;
}> = ({ children }) => {
  const { getMaxRetention, selectedDecoder } = useConfig();
  const { config } = useGameConfig();
  const timeField = config?.global_settings?.time_field || 'CurrentRaceTime';
  
  // Data storage references - now organized by packet type
  const buffers = useRef<Map<number, Frame[]>>(new Map()); // Long-term data buffers by packet type
  const queues = useRef<Map<number, Frame[]>>(new Map()); // Real-time update queues by packet type
  const trimCounters = useRef<Map<number, number>>(new Map()); // Buffer trimming counters by packet type
  
  // Holding buffers for pause state - data collected while paused
  const holdingBuffers = useRef<Map<number, Frame[]>>(new Map()); // Data collected while paused
  const holdingTrimCounters = useRef<Map<number, number>>(new Map()); // Trim counters for holding buffers
  
  // Component state
  const [isDecoderReady, setIsDecoderReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  
  // Packet size validation state
  const [hasPacketErrors, setHasPacketErrors] = useState(false);
  const packetSizeErrors = useRef<{timestamp: number, size: number}[]>([]); // Track errors in last second
  
  /**
   * Validate packet size against accepted sizes for current decoder
   */
  const validatePacketSize = (buffer: ArrayBuffer): boolean => {
    const decoder = decoderManager.getCurrentDecoder();
    if (!decoder || !decoder.getAcceptedPacketSizes) {
      return true; // No validation available, assume valid
    }
    
    const acceptedSizes = decoder.getAcceptedPacketSizes();
    const actualSize = buffer.byteLength;
    const isValid = acceptedSizes.includes(actualSize);
    
    if (!isValid) {
      // Track invalid packet
      const now = Date.now();
      packetSizeErrors.current.push({ timestamp: now, size: actualSize });
      
      // Clean up errors older than 1 second
      packetSizeErrors.current = packetSizeErrors.current.filter(
        error => now - error.timestamp < 1000
      );
      
      // Update error state if we have errors in the last second
      const hasErrors = packetSizeErrors.current.length > 0;
      setHasPacketErrors(hasErrors);
      
      console.warn(`Invalid packet size for ${selectedDecoder}: Expected ${acceptedSizes.join(', ')} bytes, got ${actualSize} bytes`);
    }
    
    return isValid;
  };
  
  /**
   * Clean up old packet size errors periodically
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      packetSizeErrors.current = packetSizeErrors.current.filter(
        error => now - error.timestamp < 1000
      );
      
      const hasErrors = packetSizeErrors.current.length > 0;
      setHasPacketErrors(hasErrors);
    }, 100); // Check every 100ms
    
    return () => clearInterval(interval);
  }, []);
  /**
   * Initialize the selected telemetry decoder when the decoder type changes.
   * Decoders handle conversion of binary telemetry data to structured frames.
   */
  useEffect(() => {
    const loadDecoder = async () => {
      try {
        setIsDecoderReady(false);
        await decoderManager.loadDecoder(selectedDecoder);
        setIsDecoderReady(true);
        console.log(`Decoder ${selectedDecoder} loaded successfully`);
      } catch (error) {
        console.error(`Failed to load decoder ${selectedDecoder}:`, error);
        setIsDecoderReady(false);
      }
    };
    
    loadDecoder();
  }, [selectedDecoder]);

  /**
   * Establish WebSocket connection and handle incoming telemetry data.
   * Supports both binary (decoded) and JSON (fallback) data formats.
   * Manages automatic buffer trimming and pause/resume functionality.
   */
  useEffect(() => {
    if (!isDecoderReady || !config) {
      console.log('Waiting for decoder and config to be ready...');
      return;
    }

    // Dynamic WebSocket URL: use configured URL for dev, auto-detect for production
    const configuredUrl = import.meta.env.VITE_WS_URL;
    const wsUrl = configuredUrl || (() => {
      // Production: build URL based on current page's protocol and hostname (same port)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/telemetry`;
    })();
    
    console.log(`WebSocket connecting to: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer'; // Set to receive binary data
    
    ws.onmessage = async (ev) => {
      try {
        let frame: Frame | null = null;
        
        if (ev.data instanceof ArrayBuffer) {
          // Validate packet size before decoding
          validatePacketSize(ev.data);
          // Binary data - use decoder
          frame = decoderManager.decode(ev.data);
        } else {
          // Fallback: JSON data (for backward compatibility)
          const text = typeof ev.data === 'string' ? ev.data : await ev.data.text();
          frame = JSON.parse(text);
        }
        
        if (!frame) {
          return; // Skip invalid frames (e.g., when race is not on)
        }
        
        const packetType = frame.packet_type;
        
        if (isPaused) {
          // When paused, route data to holding buffers
          // Ensure holding buffers exist for this packet type
          if (!holdingBuffers.current.has(packetType)) {
            holdingBuffers.current.set(packetType, []);
          }
          if (!holdingTrimCounters.current.has(packetType)) {
            holdingTrimCounters.current.set(packetType, 0);
          }
          
          // Add to holding buffer
          holdingBuffers.current.get(packetType)!.push(frame);
          
          // Handle trimming for holding buffer
          const currentHoldingTrimCounter = holdingTrimCounters.current.get(packetType)! + 1;
          holdingTrimCounters.current.set(packetType, currentHoldingTrimCounter);
          
          const holdingBuffer = holdingBuffers.current.get(packetType)!;
          if (currentHoldingTrimCounter >= 100 && holdingBuffer.length > 1) {
            holdingTrimCounters.current.set(packetType, 0);
            
            // Only apply time-based retention if buffer has 100+ records
            if (holdingBuffer.length >= 100) {
              const maxRetentionSeconds = getMaxRetention();
              const currentTime = frame[timeField as keyof Frame] as number;
              const cutoffTime = currentTime - maxRetentionSeconds;
              
              // Find the earliest frame to keep based on time retention
              let keepIndex = 0;
              for (let i = 0; i < holdingBuffer.length; i++) {
                const frameTime = holdingBuffer[i][timeField as keyof Frame] as number;
                if (frameTime >= cutoffTime) {
                  keepIndex = i;
                  break;
                }
              }
              
              // Remove outdated frames from holding buffer
              if (keepIndex > 0) {
                holdingBuffer.splice(0, keepIndex);
              }
            }
          }
        } else {
          // When not paused, route data to main buffers as before
          // Ensure main buffers exist for this packet type
          if (!buffers.current.has(packetType)) {
            buffers.current.set(packetType, []);
          }
          if (!queues.current.has(packetType)) {
            queues.current.set(packetType, []);
          }
          if (!trimCounters.current.has(packetType)) {
            trimCounters.current.set(packetType, 0);
          }
          
          // Add to main buffer and queue for real-time updates
          buffers.current.get(packetType)!.push(frame);
          queues.current.get(packetType)!.push(frame);
          
          // Handle trimming for main buffer
          const currentTrimCounter = trimCounters.current.get(packetType)! + 1;
          trimCounters.current.set(packetType, currentTrimCounter);
          
          const packetBuffer = buffers.current.get(packetType)!;
          if (currentTrimCounter >= 100 && packetBuffer.length > 1) {
            trimCounters.current.set(packetType, 0);
            
            // Only apply time-based retention if buffer has 100+ records
            if (packetBuffer.length >= 100) {
              const maxRetentionSeconds = getMaxRetention();
              const currentTime = frame[timeField as keyof Frame] as number;
              const cutoffTime = currentTime - maxRetentionSeconds;
              
              // Find the earliest frame to keep based on time retention
              let keepIndex = 0;
              for (let i = 0; i < packetBuffer.length; i++) {
                const frameTime = packetBuffer[i][timeField as keyof Frame] as number;
                if (frameTime >= cutoffTime) {
                  keepIndex = i;
                  break;
                }
              }
              
              // Remove outdated frames from main buffer
              if (keepIndex > 0) {
                packetBuffer.splice(0, keepIndex);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing telemetry message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    return () => {
      console.log('Closing WebSocket connection');
      ws.close();
    };
  }, [isDecoderReady, config, getMaxRetention, timeField, isPaused]);

  /**
   * Get a time-based slice of telemetry data from the buffer for a specific packet type.
   * Returns frames within the specified time window from the most recent frame.
   */
  const getSlice = (sec: number, packetType: number) => {
    const packetBuffer = buffers.current.get(packetType);
    if (!packetBuffer || packetBuffer.length === 0) return [];
    
    const now = packetBuffer[packetBuffer.length - 1]?.[timeField as keyof Frame] as number ?? 0;
    const effectiveRetention = Math.min(sec, getMaxRetention());
    return packetBuffer.filter(frame => {
      const frameTime = frame[timeField as keyof Frame] as number;
      return now - frameTime <= effectiveRetention;
    });
  };

  /**
   * Retrieve and clear the queue of new frames for chart updates for a specific packet type.
   * This is called by the dashboard animation loop to distribute new data.
   */
  const getQueued = (packetType: number) => {
    const packetQueue = queues.current.get(packetType);
    if (!packetQueue) return [];
    
    const queuedFrames = [...packetQueue];
    queues.current.set(packetType, []); // Clear queue after consumption
    return queuedFrames;
  };

  /**
   * Get the most recent telemetry frame for a specific packet type, or null if no data is available.
   * If no packet type specified, returns the most recent frame from any packet type.
   */
  const getLatestFrame = (packetType?: number) => {
    if (packetType !== undefined) {
      const packetBuffer = buffers.current.get(packetType);
      return packetBuffer && packetBuffer.length > 0 ? packetBuffer[packetBuffer.length - 1] : null;
    }
    
    // Find most recent frame across all packet types
    let latestFrame: Frame | null = null;
    let latestTime = -1;
    
    for (const [_, buffer] of buffers.current) {
      if (buffer.length > 0) {
        const frame = buffer[buffer.length - 1];
        const frameTime = frame[timeField as keyof Frame] as number;
        if (frameTime > latestTime) {
          latestTime = frameTime;
          latestFrame = frame;
        }
      }
    }
    
    return latestFrame;
  };

  /**
   * Toggle pause state for real-time data streaming.
   * When pausing: Start routing data to holding buffers.
   * When resuming: Merge holding buffers into main buffers, apply retention cleanup, and reset charts.
   */
  const togglePause = () => {
    setIsPaused(prev => {
      const newPaused = !prev;
      
      if (!newPaused) {
        // Resuming: Merge holding buffers into main buffers
        for (const [packetType, holdingBuffer] of holdingBuffers.current) {
          if (holdingBuffer.length === 0) continue;
          
          // Ensure main buffers exist for this packet type
          if (!buffers.current.has(packetType)) {
            buffers.current.set(packetType, []);
          }
          if (!queues.current.has(packetType)) {
            queues.current.set(packetType, []);
          }
          if (!trimCounters.current.has(packetType)) {
            trimCounters.current.set(packetType, 0);
          }
          
          // Merge holding buffer into main buffer and sort by timestamp
          const mainBuffer = buffers.current.get(packetType)!;
          mainBuffer.push(...holdingBuffer);
          
          // Sort the merged buffer by timestamp to maintain temporal order
          mainBuffer.sort((a, b) => {
            const timeA = a[timeField as keyof Frame] as number;
            const timeB = b[timeField as keyof Frame] as number;
            return timeA - timeB;
          });
          
          // Apply retention cleanup after merge (only if buffer has 100+ records)
          if (mainBuffer.length >= 100) {
            const maxRetentionSeconds = getMaxRetention();
            if (mainBuffer.length > 0) {
              const latestFrame = mainBuffer[mainBuffer.length - 1];
              const currentTime = latestFrame[timeField as keyof Frame] as number;
              const cutoffTime = currentTime - maxRetentionSeconds;
              
              // Find the earliest frame to keep based on time retention
              let keepIndex = 0;
              for (let i = 0; i < mainBuffer.length; i++) {
                const frameTime = mainBuffer[i][timeField as keyof Frame] as number;
                if (frameTime >= cutoffTime) {
                  keepIndex = i;
                  break;
                }
              }
              
              // Remove outdated frames to free memory
              if (keepIndex > 0) {
                mainBuffer.splice(0, keepIndex);
              }
            }
          }
        }
        
        // Clear all holding buffers after merge
        holdingBuffers.current.clear();
        holdingTrimCounters.current.clear();
        
        // Trigger chart reset to repopulate from merged buffer
        setResetSignal(prevSignal => prevSignal + 1);
      }
      
      return newPaused;
    });
  };

  /**
   * Get a complete copy of the telemetry buffer for export operations.
   * If packet type specified, returns only that packet type's data.
   * If no packet type specified, returns all data from all packet types.
   */
  const getFullBuffer = (packetType?: number) => {
    if (packetType !== undefined) {
      const packetBuffer = buffers.current.get(packetType);
      return packetBuffer ? [...packetBuffer] : [];
    }
    
    // Return all frames from all packet types, sorted by time
    const allFrames: Frame[] = [];
    for (const [_, buffer] of buffers.current) {
      allFrames.push(...buffer);
    }
    
    return allFrames.sort((a, b) => {
      const timeA = a[timeField as keyof Frame] as number;
      const timeB = b[timeField as keyof Frame] as number;
      return timeA - timeB;
    });
  };

  /**
   * Get all buffers organized by packet type.
   * Returns a Map with packet type as key and array of frames as value.
   */
  const getBuffersByPacketType = () => {
    const result = new Map<number, Frame[]>();
    for (const [packetType, buffer] of buffers.current) {
      result.set(packetType, [...buffer]);
    }
    return result;
  };

  /**
   * Replace the entire telemetry buffer with new data (used for file loading).
   * Clears the real-time queue and signals charts to reset.
   * If packet type specified, only replaces that packet type's data.
   * If no packet type specified, organizes frames by their packet_type field.
   */
  const replaceBuffer = (frames: Frame[], packetType?: number) => {
    if (packetType !== undefined) {
      // Replace specific packet type
      buffers.current.set(packetType, [...frames]);
      queues.current.set(packetType, []); // Clear real-time queue for this packet type
    } else {
      // Clear all buffers and organize frames by packet type
      buffers.current.clear();
      queues.current.clear();
      trimCounters.current.clear();
      
      // Group frames by packet type
      for (const frame of frames) {
        const pt = frame.packet_type;
        if (!buffers.current.has(pt)) {
          buffers.current.set(pt, []);
          queues.current.set(pt, []);
          trimCounters.current.set(pt, 0);
        }
        buffers.current.get(pt)!.push(frame);
      }
    }
    
    setResetSignal(prev => prev + 1); // Signal all charts to reset
  };

  /**
   * Clear all telemetry data (buffers, queues, and holding buffers) and reset all charts.
   * Provides a comprehensive reset functionality for the entire application.
   */
  const clearAll = () => {
    buffers.current.clear(); // Clear all main buffers
    queues.current.clear(); // Clear all queues
    trimCounters.current.clear(); // Reset all trim counters
    holdingBuffers.current.clear(); // Clear all holding buffers
    holdingTrimCounters.current.clear(); // Reset holding trim counters
    setResetSignal(prev => prev + 1); // Signal all charts to reset
  };

  return (
    <TelemetryCtx.Provider value={{ 
      getSlice, 
      getQueued, 
      getLatestFrame, 
      isPaused, 
      togglePause, 
      getFullBuffer, 
      getBuffersByPacketType,
      replaceBuffer,
      resetSignal,
      clearAll,
      hasPacketErrors
    }}>
      {children}
    </TelemetryCtx.Provider>
  );
};
