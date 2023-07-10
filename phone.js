const WebSocket = require("ws");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const wss = new WebSocket.Server({ port: 3000 });
const path = "/dev/cu.usbmodem14101";

// start server
wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  // read serial input
  const serial = new SerialPort({ path, baudRate: 115200 });
  const parser = new ReadlineParser();
  serial.pipe(parser);

  parser.on("data", (line) => {
    console.log(`Serial Data recieved: ${line}`);
    ws.send(line);
  });
});
