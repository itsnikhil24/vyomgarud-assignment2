const express = require('express');
const http = require('http');
const path = require('path');
const dgram = require('dgram');
const WebSocket = require('ws');
const cors = require('cors');

const APP_PORT =  4000;
const UDP_PORT = 14560;



const app = express();
app.use(cors());
app.use(express.json());


app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/health', (req, res) => res.json({ status: 'ok' }));



const server = http.createServer(app);


const wss = new WebSocket.Server({ server });


function broadcast(obj) {
    const json = JSON.stringify(obj);
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    }
}

// let selectedClient = null;

// wss.on('connection', (ws) => {
//     selectedClient = ws; // store the single client
// });

// function sendToOne(obj) {
//     if (selectedClient && selectedClient.readyState === WebSocket.OPEN) {
//         selectedClient.send(JSON.stringify(obj));
//     }
// }


wss.on('connection', (ws, req) => {
    console.log('WS client connected');
    ws.send(JSON.stringify({ type: 'status', msg: 'welcome', ts: Date.now() }));
    ws.on('close', () => console.log('WS client disconnected'));
});


const udpSocket = dgram.createSocket('udp4');

udpSocket.on('error', (err) => {
    console.error('UDP socket error:', err);
});

udpSocket.on('message', (msg, rinfo) => {
    try {
        const txt = msg.toString('utf8');

        const parsed = JSON.parse(txt);


        const tel = parsed.telemetry || parsed;

        const payload = {
            type: 'telemetry',
            receivedAt: Date.now(),
            source: parsed.source || 'udp',
            telemetry: {
                lat: Number(tel.lat ?? 0),
                lon: Number(tel.lon ?? 0),
                alt: Number(tel.alt ?? 0),
                speed: Number(tel.speed ?? 0),
                battery: Number(tel.battery ?? 0),
                heading: Number(tel.heading ?? 0),
                ts: tel.ts ?? Date.now()
            }

        };

        broadcast(payload);
    } catch (err) {
        console.warn('Failed to parse UDP message', err && err.message);
    }
});

udpSocket.bind(UDP_PORT, () => {
    console.log(`UDP listener bound on port ${UDP_PORT}`);
});

// Start HTTP + WS server
server.listen(APP_PORT, () => {
    console.log(`Backend server listening on http://localhost:${APP_PORT}`);
    console.log(`WebSocket endpoint: ws://localhost:${APP_PORT}`);
});
