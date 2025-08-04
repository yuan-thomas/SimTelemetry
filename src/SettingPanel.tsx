/**
 * Settings panel component that provides configuration controls for the dashboard.
 * Allows users to adjust data retention periods and select telemetry decoders.
 * Features a collapsible interface to minimize screen space usage.
 */
import React, { useState, useEffect } from 'react';
import { useConfig } from './SettingContext';
import { AVAILABLE_DECODERS } from './decoders';

interface SettingPanelProps {
  hasPacketErrors?: boolean;
}

export const SettingPanel: React.FC<SettingPanelProps> = ({ hasPacketErrors = false }) => {
  // Panel expansion state for collapsible interface
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const { lineChartRetention, boxChartRetention, selectedDecoder, updateConfig, saveAsDefault } = useConfig();
  
  // Get the game name from the selected decoder
  const getGameName = () => {
    const decoder = AVAILABLE_DECODERS[selectedDecoder];
    return decoder ? decoder.name : selectedDecoder;
  };

  // Handle saving current settings as default
  const handleSaveAsDefault = () => {
    const success = saveAsDefault();
    setSaveMessage(success ? 'Settings saved as default!' : 'Failed to save settings');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Keyboard shortcuts for settings panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle direct keys without modifiers
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      
      // Don't handle if focus is on an input element
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

      const key = event.key.toLowerCase();
      
      if (key === 'g') {
        setIsExpanded(!isExpanded);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <div className="setting-panel">
      <button 
        className={`setting-toggle ${hasPacketErrors ? 'setting-toggle-error' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Toggle settings panel - Keyboard shortcut: G"
      >
        <span className="setting-toggle-left">
          ⚙️ Settings (G) {isExpanded ? '▲' : '▼'}
        </span>
        <span className={`setting-toggle-game ${hasPacketErrors ? 'setting-toggle-game-error' : ''}`}>
          {getGameName()}
        </span>
      </button>
      
      {isExpanded && (
        <div className="setting-content">
          <div className="setting-section">
            <h4>Data Retention Settings</h4>
            <div className="setting-row">
              <label>Line Charts (seconds):</label>
              <input
                type="number"
                value={lineChartRetention}
                onChange={(e) => updateConfig('lineChartRetention', Number(e.target.value))}
                min="1"
                max="300"
                title="How many seconds of data to show in line charts"
              />
            </div>
            <div className="setting-row">
              <label>Box Charts (seconds):</label>
              <input
                type="number"
                value={boxChartRetention}
                onChange={(e) => updateConfig('boxChartRetention', Number(e.target.value))}
                min="1"
                max="300"
                title="How many seconds of data to use for statistical summaries"
              />
            </div>
          </div>
          
          <div className="setting-section">
            <h4>Telemetry Decoder</h4>
            <div className="setting-row">
              <label>Game/Format:</label>
              <select
                value={selectedDecoder}
                onChange={(e) => updateConfig('selectedDecoder', e.target.value)}
                title="Select the telemetry format decoder for your racing game"
              >
                <option value="forza-motorsport">Forza Motorsport</option>
                <option value="forza-horizon">Forza Horizon 4/5</option>
                <option value="assetto-corsa">Assetto Corsa Series</option>
                <option value="f1-2024">F1 2024</option>
                <option value="f1-2025">F1 2025 (Testing)</option>
              </select>
            </div>
          </div>
          
          <div className="setting-section">
            <div className="setting-row">
              <button 
                className="save-default-button"
                onClick={handleSaveAsDefault}
                title="Save current settings as default for future sessions"
              >
                💾 Save as Default
              </button>
              {saveMessage && (
                <span className={`save-message ${saveMessage.includes('Failed') ? 'error' : 'success'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};