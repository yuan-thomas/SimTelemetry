// ws-hub.js
import http from 'http';
import { WebSocketServer } from 'ws';

const PORT = 8765;
const PATH = '/telemetry';

const httpServer = http.createServer();
const wss = new WebSocketServer({ server: httpServer, path: PATH });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log("✅ WebSocket client connected");

  ws.on('message', (msg) => {
    // Assume msg is already valid JSON from UDP translator
    for (const client of clients) {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(msg);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log("❌ WebSocket client disconnected");
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WebSocket hub ready at ws://0.0.0.0:${PORT}${PATH}`);
});
