import dgram from 'dgram';
import { WebSocketServer } from 'ws';

class UDPWebSocketForwarder {
  constructor(options = {}) {
    this.udpPort = options.udpPort || 20127;
    this.udpHost = options.udpHost || '0.0.0.0';
    this.wsPort = options.wsPort || 8765;

    this.udpSocket = null;
    this.wsServer = null;
    this.clients = new Set();

    this.init();
  }

  init() {
    this.setupUDPListener();
    this.setupWebSocketServer();

    console.log(`UDP-to-WebSocket forwarder started:`);
    console.log(`  UDP listening on ${this.udpHost}:${this.udpPort}`);
    console.log(`  WebSocket server on port ${this.wsPort}`);
  }

  setupUDPListener() {
    this.udpSocket = dgram.createSocket('udp4');

    this.udpSocket.on('listening', () => {
      const address = this.udpSocket.address();
      console.log(`UDP server listening on ${address.address}:${address.port}`);
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

  setupWebSocketServer() {
    this.wsServer = new WebSocketServer({ 
      port: this.wsPort,
      perMessageDeflate: false 
    });

    this.wsServer.on('connection', (ws, req) => {
      console.log(`WebSocket client connected from ${req.socket.remoteAddress}`);
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('WebSocket client error:', err);
        this.clients.delete(ws);
      });

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

  broadcastToClients(data) {
    const closedClients = [];

    for (const client of this.clients) {
      if (client.readyState === client.OPEN) {
        try {
          client.send(data);
        } catch (err) {
          console.error('Error sending to client:', err);
          closedClients.push(client);
        }
      } else {
        closedClients.push(client);
      }
    }

    closedClients.forEach(client => this.clients.delete(client));
  }

  close() {
    if (this.udpSocket) {
      this.udpSocket.close();
    }
    if (this.wsServer) {
      this.wsServer.close();
    }
    console.log('UDP-to-WebSocket forwarder stopped');
  }
}

const forwarder = new UDPWebSocketForwarder({
  udpPort: process.env.UDP_PORT || 20127,
  udpHost: process.env.UDP_HOST || '0.0.0.0',
  wsPort: process.env.WS_PORT || 8765
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  forwarder.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  forwarder.close();
  process.exit(0);
});
