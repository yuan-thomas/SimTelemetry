/**
 * Utility functions for XLSX file operations.
 * Handles import/export of telemetry data in Excel format with packet type tabs.
 */

import * as XLSX from 'xlsx';
import { Frame } from '../types';
import { TelemetryDecoder } from '../decoders';

/**
 * Converts telemetry buffer data organized by packet types to XLSX format.
 * Each packet type gets its own worksheet tab with name format: <packet_type>_<packet_type_name>
 */
export const convertToXLSX = (buffersByPacketType: Map<number, Frame[]>, decoder?: TelemetryDecoder): ArrayBuffer => {
  const workbook = XLSX.utils.book_new();

  // Sort packet types numerically
  const sortedPacketTypes = Array.from(buffersByPacketType.keys()).sort((a, b) => a - b);

  for (const packetType of sortedPacketTypes) {
    const buffer = buffersByPacketType.get(packetType)!;
    if (buffer.length === 0) continue;

    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(buffer);
    
    // Get packet type name from decoder if available
    let packetTypeName = `Packet_${packetType}`;
    if (decoder && decoder.getPacketTypeName) {
      try {
        const name = decoder.getPacketTypeName(packetType);
        packetTypeName = `${packetType}_${name}`;
      } catch (error) {
        console.warn(`Failed to get packet type name for ${packetType}:`, error);
        packetTypeName = `${packetType}_Unknown`;
      }
    }
    
    // Add worksheet with formatted packet type name as tab name
    XLSX.utils.book_append_sheet(workbook, worksheet, packetTypeName);
  }

  // If no data, create an empty sheet
  if (workbook.SheetNames.length === 0) {
    const emptySheet = XLSX.utils.aoa_to_sheet([['No data available']]);
    XLSX.utils.book_append_sheet(workbook, emptySheet, 'Empty');
  }

  // Convert to ArrayBuffer
  return XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array' 
  });
};

/**
 * Parses XLSX file content into telemetry frame objects organized by packet type.
 * Each worksheet tab is treated as a different packet type.
 */
export const parseXLSXToFrames = (arrayBuffer: ArrayBuffer): Map<number, Frame[]> => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const framesByPacketType = new Map<number, Frame[]>();

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert worksheet to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    if (rawData.length === 0) continue;

    // Extract packet type from sheet name (supports both old and new formats)
    // New format: "0_Motion" -> 0, Old format: "Packet_1" -> 1
    let packetType = 1; // Default to packet type 1
    const newFormatMatch = sheetName.match(/^(\d+)_/);
    const oldFormatMatch = sheetName.match(/Packet_(\d+)/);
    
    if (newFormatMatch) {
      packetType = parseInt(newFormatMatch[1], 10);
    } else if (oldFormatMatch) {
      packetType = parseInt(oldFormatMatch[1], 10);
    }

    // Convert raw data to Frame objects
    const frames: Frame[] = rawData.map((row: any, index: number) => {
      const frame: Frame = {} as Frame;
      
      // Copy all properties from the row
      Object.keys(row).forEach(key => {
        const value = row[key];
        // Keep original data types from XLSX
        frame[key] = value;
      });

      // Ensure required fields exist
      if (!frame.t && typeof frame.t !== 'number') {
        // Try to find a timestamp field or use row index as fallback
        if (frame.TimestampMS && typeof frame.TimestampMS === 'number') {
          frame.t = frame.TimestampMS;
        } else if (frame.timestamp && typeof frame.timestamp === 'number') {
          frame.t = frame.timestamp;
        } else if (frame.CurrentRaceTime && typeof frame.CurrentRaceTime === 'number') {
          frame.t = frame.CurrentRaceTime;
        } else {
          // Fallback: use row index as timestamp
          frame.t = index;
          console.warn(`Sheet ${sheetName} row ${index + 1} missing timestamp field, using row index`);
        }
      }

      // Ensure packet_type field exists
      if (!frame.packet_type) {
        frame.packet_type = packetType;
      }

      return frame;
    });

    framesByPacketType.set(packetType, frames);
  }

  return framesByPacketType;
};

/**
 * Triggers an XLSX file download in the browser.
 * Creates a temporary download link and automatically clicks it.
 */
export const downloadXLSX = (xlsxData: ArrayBuffer, filename: string): void => {
  const blob = new Blob([xlsxData], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL to prevent memory leaks
  URL.revokeObjectURL(url);
};

/**
 * Generates a timestamped filename for telemetry data export.
 * Format: telemetry-gamename-yyyymmdd-hhmmss.xlsx
 */
export const generateTimestampedFilename = (gameName?: string): string => {
  const now = new Date();
  
  // Format date as yyyymmdd
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Format time as hhmmss
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}${minutes}${seconds}`;
  
  // Clean game name for filename (remove spaces, special chars, make lowercase)
  const cleanGameName = gameName 
    ? gameName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'unknown';
  
  return `telemetry-${cleanGameName}-${dateStr}-${timeStr}.xlsx`;
};

/**
 * Validates XLSX file content before processing.
 * Checks for basic structure and required elements.
 */
export const validateXLSXContent = (arrayBuffer: ArrayBuffer): { isValid: boolean; error?: string } => {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { isValid: false, error: 'XLSX file contains no worksheets' };
    }

    // Check if at least one sheet has data
    let hasData = false;
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      if (data.length > 0) {
        hasData = true;
        break;
      }
    }

    if (!hasData) {
      return { isValid: false, error: 'XLSX file contains no data' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Invalid XLSX file: ${error}` };
  }
};

/**
 * Legacy CSV support - converts single CSV data to XLSX format.
 * For backward compatibility with existing CSV files.
 */
export const convertCSVToFrames = (csvText: string, packetType: number = 1): Frame[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines
    .slice(1)
    .filter(line => line.trim()) // Skip empty lines
    .map((line, index) => {
      try {
        const values = line.split(',');
        const frame: Frame = {} as Frame;
        
        headers.forEach((header, headerIndex) => {
          const rawValue = values[headerIndex];
          if (rawValue !== undefined) {
            // Remove surrounding quotes if present
            const cleanValue = rawValue.replace(/^"|"$/g, '').trim();
            // Convert to number if it's numeric, otherwise keep as string
            frame[header] = isNaN(Number(cleanValue)) ? cleanValue : Number(cleanValue);
          } else {
            frame[header] = '';
          }
        });
        
        // Ensure the frame has a timestamp field 't' - required by Frame interface
        if (!frame.t && typeof frame.t !== 'number') {
          // Try to find a timestamp field or use row index as fallback
          if (frame.TimestampMS && typeof frame.TimestampMS === 'number') {
            frame.t = frame.TimestampMS;
          } else if (frame.timestamp && typeof frame.timestamp === 'number') {
            frame.t = frame.timestamp;
          } else {
            // Fallback: use row index as timestamp
            frame.t = index;
            console.warn(`CSV row ${index + 1} missing timestamp field, using row index`);
          }
        }

        // Add packet type
        frame.packet_type = packetType;
        
        return frame;
      } catch (error) {
        throw new Error(`Error parsing CSV row ${index + 1}: ${error}`);
      }
    });
};