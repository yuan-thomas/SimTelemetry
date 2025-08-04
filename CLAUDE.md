# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based real-time telemetry dashboard for racing games with multi-game support. The application displays live telemetry data through configurable charts organized in tabs. Originally designed for Forza Motorsport, it now supports multiple packet types to enable expansion to other racing games.

## Architecture

- **Frontend**: React + TypeScript + Vite development environment
- **Visualization**: Plotly.js for real-time line charts and box plots
- **Real-time Data**: WebSocket connection for live telemetry streaming
- **Configuration**: JSON-based chart and dashboard configuration (game-specific configs in `src/config/games/`)
- **Multi-game Support**: Packet type system allowing different telemetry formats
- **Backend**: Node.js WebSocket servers for telemetry data relay

### Key Components

- `telemetry.tsx`: Global context that manages WebSocket connection and telemetry data buffering by packet type
- `Dashboard.tsx`: Main dashboard component with tabbed interface and central animation loop
- `Chart.tsx`: Individual chart component handling Plotly.js integration with real-time updates
- `src/config/games/`: Game-specific configuration files (e.g., `forza-motorsport.json`)
- `src/decoders/`: Packet decoders for different telemetry formats

### Data Flow

1. Telemetry data flows through WebSocket (`VITE_WS_URL`)
2. Decoder assigns packet type (hardcoded as 1 for Forza Motorsport)
3. `TelemetryProvider` routes incoming frames to main buffers (when active) or holding buffers (when paused)
4. Dashboard's animation loop drains queued frames per packet type and propagates to charts
5. Charts receive data for their specific packet type only
6. Box plots provide statistical summaries updated every second

### Pause/Resume Behavior

- **When Paused**: Incoming telemetry data is routed to holding buffers (separate from main buffers)
- **When Resumed**: Holding buffers are merged into main buffers, retention cleanup is applied, and charts reset to display updated data
- **Holding Buffers**: Follow same retention rules as main buffers to prevent memory issues during long pauses
- **Tab Switching**: Works correctly in both paused and active states

## Commands

### Development
```bash
npm run dev          # Start development server on port 5173
```

### Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### WebSocket Servers
```bash
node ws-hub.js       # Start WebSocket relay server on port 8765
node server.js       # Start main server on port 8080
```

## Configuration

Charts are configured declaratively in game-specific config files (e.g., `src/config/games/forza-motorsport.json`):
- `global_settings.time_field`: Primary time field for all charts
- `tabs[]`: Array of tab configurations with charts
- `charts[]`: Individual chart configurations with packet type specification
- `traces[]`: Individual data series with field mapping, colors, and scaling

Each chart supports:
- `packet_type`: Which packet type this chart displays (required)
- `x_field`: Time field for X-axis
- `title`: Chart title
- `traces[]`: Array of data series for this chart

Each trace supports:
- `field`: Source data field name
- `scaling_factor`: Optional data scaling (e.g., divide by 1000)
- `show_box`: Enable box plot statistical summary
- `yaxis`: Target axis ("y" or "y2" for dual-axis charts)

## Multi-Game Support

The application supports multiple racing games through a packet type system:

### Packet Types
- **Packet Type 1**: Forza Motorsport telemetry format
- Future packet types can be added for other games (F1, Assetto Corsa, etc.)

### Adding New Games
1. Create decoder in `src/decoders/` following the `TelemetryDecoder` interface
2. Add game configuration in `src/config/games/`
3. Register decoder in `src/decoders/index.ts`
4. Charts automatically organize data by packet type

### Data Export/Import
- **XLSX Format**: Primary format with packet types as worksheet tabs
- **CSV Format**: Legacy support for backward compatibility
- Each packet type exports to its own worksheet tab in Excel files

## Environment Variables

- `VITE_WS_URL`: WebSocket endpoint for telemetry data (configured in vite.config.ts)
- `VITE_REALTIME_SEC`: Real-time data window in seconds

## File Formats

- **XLSX**: Primary export/import format supporting multiple packet types as tabs
- **CSV**: Legacy format support for backward compatibility (single packet type)