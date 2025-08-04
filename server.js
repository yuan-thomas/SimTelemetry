// server.js - Production server serving React app and WebSocket telemetry
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dgram from 'dgram';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8080;
const UDP_PORT = process.env.UDP_PORT || 20127;
const UDP_HOST = process.env.UDP_HOST || '0.0.0.0';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');

// Simple HTTP server for static files
const server = http.createServer((req, res) => {
  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists, if not serve index.html (for SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distPath, 'index.html');
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500);
      res.end(`Error loading ${filePath}: ${error.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// UDP-to-WebSocket forwarder for telemetry data
class UDPWebSocketForwarder {
  constructor(udpPort, udpHost) {
    this.udpPort = udpPort;
    this.udpHost = udpHost;
    this.udpSocket = null;
    this.wsServer = null;
    this.clients = new Set();
  }

  init(httpServer) {
    this.setupUDPListener();
    this.setupWebSocketServer(httpServer);
    console.log(`📡 UDP listener: ${this.udpHost}:${this.udpPort}`);
    console.log(`🔌 WebSocket endpoint: /telemetry`);
  }

  setupUDPListener() {
    this.udpSocket = dgram.createSocket('udp4');

    this.udpSocket.on('listening', () => {
      const address = this.udpSocket.address();
      console.log(`📡 UDP server ready: ${address.address}:${address.port}`);
    });

    this.udpSocket.on('message', (msg, rinfo) => {
      if (this.clients.size > 0) {
        this.broadcastToClients(msg);
      }
    });

    this.udpSocket.on('error', (err) => {
      console.error('UDP socket error:', err);
    });

    this.udpSocket.bind(this.udpPort, this.udpHost);
  }

  setupWebSocketServer(server) {
    this.wsServer = new WebSocketServer({ 
      server,
      path: "/telemetry",
      perMessageDeflate: false 
    });

    this.wsServer.on('connection', (ws, req) => {
      console.log(`🔌 Client connected: ${req.socket.remoteAddress}`);
      this.clients.add(ws);

      ws.on('message', (msg) => {
        // Forward WebSocket messages to other connected clients
        this.broadcastToClients(msg, ws);
      });

      ws.on('close', () => {
        console.log('🔌 Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        this.clients.delete(ws);
      });

      // Keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);

      ws.on('close', () => clearInterval(pingInterval));
    });

    this.wsServer.on('error', (err) => {
      console.error('WebSocket server error:', err);
    });
  }

  broadcastToClients(data, excludeClient = null) {
    const closedClients = [];

    for (const client of this.clients) {
      if (client !== excludeClient && client.readyState === client.OPEN) {
        try {
          client.send(data);
        } catch (err) {
          console.error('Error sending to client:', err);
          closedClients.push(client);
        }
      } else if (client !== excludeClient) {
        closedClients.push(client);
      }
    }

    closedClients.forEach(client => this.clients.delete(client));
  }

  close() {
    if (this.udpSocket) this.udpSocket.close();
    if (this.wsServer) this.wsServer.close();
    console.log('📡 Telemetry forwarder stopped');
  }
}

// Initialize telemetry forwarder and start server
const forwarder = new UDPWebSocketForwarder(UDP_PORT, UDP_HOST);
forwarder.init(server);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server: http://0.0.0.0:${PORT}`);
  console.log(`📁 Static files: ${distPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  forwarder.close();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  forwarder.close();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});