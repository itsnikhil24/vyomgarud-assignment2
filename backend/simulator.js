const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const UDP_HOST = '127.0.0.1';
const UDP_PORT = 14560;

let t = 0;
const lat0 = 37.7749;
const lon0 = -122.4194;

function makeTelemetry() {
  t += 0.4;
  const lat = lat0 + 0.005 * Math.cos(t / 6) + (Math.random() - 0.5) * 0.0001;
  const lon = lon0 + 0.005 * Math.sin(t / 6) + (Math.random() - 0.5) * 0.0001;
  const alt = 20 + 10 * Math.sin(t / 5) + (Math.random() - 0.5) * 0.2;
  const speed = 6 + 3 * Math.abs(Math.sin(t / 4)) + (Math.random() - 0.5) * 0.2;
  const battery = Math.max(0, 100 - (t / 18));

  return {
    source: 'node-sim',
    ts: Date.now(),
    telemetry: {
      lat: +lat.toFixed(6),
      lon: +lon.toFixed(6),
      alt: +alt.toFixed(2),
      speed: +speed.toFixed(2),
      battery: +battery.toFixed(1),
      heading: +((t * 20) % 360).toFixed(1)
    }
  };
}

console.log(`Simulator sending UDP to ${UDP_HOST}:${UDP_PORT}`);
setInterval(() => {
  const msg = JSON.stringify(makeTelemetry());
  socket.send(Buffer.from(msg), UDP_PORT, UDP_HOST, (err) => {
    if (err) console.error('UDP send error', err);
  });
}, 400);
