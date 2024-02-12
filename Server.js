
const express = require("express");
const Stream = require("node-rtsp-stream");
const cors = require("cors");

const app = express();
const port = 3002;
const streams = {}; // Object to store WebSocket streams by stream ID

app.use(
  cors({
    origin: "http://192.168.1.17:3000",
    // credentials: true,
  })
);

// Endpoint to handle requests for streaming
app.get("/stream", (req, res) => {
  const { rtsp, streamId } = req.query;

  // Validate if RTSP URL and stream ID are provided
  if (!rtsp || !streamId) {
    return res.status(400).json({ error: "RTSP URL and stream ID are required." });
  }

  // If stream doesn't exist or RTSP URL has changed, create a new stream
  if (!streams[streamId] || streams[streamId].streamUrl !== rtsp) {
    // Stop existing stream if it's running
    if (streams[streamId]) {
      streams[streamId].stop();
    }

    // Create a new stream with the provided RTSP URL
    streams[streamId] = new Stream({
      name: `Camera Stream ${streamId}`,
      streamUrl: rtsp,
      wsPort: 3030 + parseInt(streamId), // Use a different WebSocket port for each stream
      ffmpegOptions: {
        '-stats': '', // an option with no necessary value uses a blank string
        '-r': 30, // options with required values specify the value after the key
      },
    });
  }

  // Send WebSocket URL as response
  res.json({ url: `ws://127.0.0.1:${3030 + parseInt(streamId)}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
