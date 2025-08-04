/**
 * Information panel component that displays real-time telemetry values and playback controls.
 * Handles XLSX export/import functionality and provides pause/resume controls for data streaming.
 * Shows key telemetry metrics as configured in the info_bar section of config.json.
 */
import React, { useRef, useEffect } from 'react';
import { useTelemetry } from './telemetry';
import { convertToXLSX, parseXLSXToFrames, downloadXLSX, generateTimestampedFilename, validateXLSXContent, convertCSVToFrames } from './utils';
import { useGameConfig } from './hooks/useGameConfig';
import { decoderManager, AVAILABLE_DECODERS } from './decoders';
import { useConfig } from './SettingContext';

export const InfoPanel: React.FC = () => {
  const { 
    getLatestFrame, 
    isPaused, 
    togglePause, 
    getFullBuffer, 
    getBuffersByPacketType,
    replaceBuffer,
    clearAll
  } = useTelemetry();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config: cfg } = useGameConfig();
  const { selectedDecoder } = useConfig();

  // Keyboard shortcuts for control buttons
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle direct keys without modifiers
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      
      // Don't handle if focus is on an input element
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'p':
          togglePause();
          event.preventDefault();
          break;
        case 's':
          handleSave();
          event.preventDefault();
          break;
        case 'l':
          handleLoad();
          event.preventDefault();
          break;
        case 'r':
          handleReset();
          event.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePause]);

  /**
   * Get the appropriate telemetry frame for a specific info bar item based on its packet type.
   * Returns the latest frame of the specified packet type, or null if no data is available.
   */
  const getFrameForItem = (item: any) => {
    return getLatestFrame(item.packet_type);
  };

  /**
   * Handle telemetry data export to XLSX format.
   * Validates data availability and triggers download of timestamped file.
   * Each packet type gets its own worksheet tab.
   */
  const handleSave = () => {
    const buffersByPacketType = getBuffersByPacketType();
    if (buffersByPacketType.size === 0) {
      alert('No data to save');
      return;
    }

    // Check if any packet type has data
    let hasData = false;
    for (const [_, buffer] of buffersByPacketType) {
      if (buffer.length > 0) {
        hasData = true;
        break;
      }
    }

    if (!hasData) {
      alert('No data to save');
      return;
    }

    const currentDecoder = decoderManager.getCurrentDecoder();
    const xlsxContent = convertToXLSX(buffersByPacketType, currentDecoder || undefined);
    
    // Get game name from selected decoder
    const gameName = AVAILABLE_DECODERS[selectedDecoder]?.name || selectedDecoder;
    const filename = generateTimestampedFilename(gameName);
    downloadXLSX(xlsxContent, filename);
  };

  /**
   * Trigger file selection dialog for XLSX/CSV import.
   */
  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle comprehensive reset of all telemetry data.
   * Clears buffer, queue, and forces all charts to reset.
   */
  const handleReset = () => {
    if (confirm('Are you sure you want to clear all telemetry data? This cannot be undone.')) {
      clearAll();
    }
  };

  /**
   * Handle XLSX/CSV file import and validation.
   * Parses file content and replaces the current telemetry buffer.
   * Supports both XLSX (preferred) and CSV (legacy) formats.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx') {
      // Handle XLSX files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Validate XLSX structure before processing
          const validation = validateXLSXContent(arrayBuffer);
          if (!validation.isValid) {
            alert(`Error loading file: ${validation.error}`);
            return;
          }

          const framesByPacketType = parseXLSXToFrames(arrayBuffer);
          
          // Convert to flat array for replaceBuffer
          const allFrames: any[] = [];
          for (const [_, frames] of framesByPacketType) {
            allFrames.push(...frames);
          }
          
          replaceBuffer(allFrames);
          alert(`Loaded ${allFrames.length} frames from ${framesByPacketType.size} packet type(s)`);
        } catch (error) {
          alert('Error loading XLSX file: ' + error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === 'csv') {
      // Handle legacy CSV files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const frames = convertCSVToFrames(csvText, 1); // Default to packet type 1
          replaceBuffer(frames);
          alert(`Loaded ${frames.length} frames from CSV file (packet type 1)`);
        } catch (error) {
          alert('Error loading CSV file: ' + error);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file format. Please select an XLSX or CSV file.');
      return;
    }
    
    // Reset file input to allow re-importing the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Format telemetry values for display in the information panel.
   * Applies appropriate precision for numeric values and handles missing data.
   */
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(2); // Two decimal places for numeric values
    }
    return String(value || 'N/A'); // Fallback for missing or non-numeric values
  };

  return (
    <div className="info-panel">
      <div className="info-content">
        <div className="info-items">
          {cfg?.info_bar?.map((item, index) => {
            const frame = getFrameForItem(item);
            return (
              <div key={index} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value">
                  {frame ? formatValue(frame[item.field]) : 'N/A'}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="info-controls">
          <button 
            className={`control-button ${isPaused ? 'paused' : ''}`}
            onClick={togglePause}
            title="Keyboard shortcut: P"
          >
            {isPaused ? '▶️ Resume (P)' : '⏸️ Pause (P)'}
          </button>
          
          <button 
            className="control-button"
            onClick={handleSave}
            title="Keyboard shortcut: S"
          >
            💾 Save (S)
          </button>
          
          <button 
            className="control-button"
            onClick={handleLoad}
            title="Keyboard shortcut: L"
          >
            📁 Load (L)
          </button>
          
          <button 
            className="control-button reset-button"
            onClick={handleReset}
            title="Keyboard shortcut: R"
          >
            🗑️ Reset (R)
          </button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};