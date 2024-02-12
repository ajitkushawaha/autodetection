const express = require("express");
const Stream = require("node-rtsp-stream");

const router = express.Router();
const streams = {};

// Endpoint to start a new stream
router.get("/stream", (req, res) => {
  const { rtsp, streamId } = req.query;

  // Check if RTSP URL and stream ID are provided
  if (!rtsp || !streamId) {
    return res.status(400).json({ error: "RTSP URL and stream ID are required." });
  }

  // Check if the stream with the given ID already exists or the RTSP URL has changed
  if (!streams[streamId] || streams[streamId].streamUrl !== rtsp) {
    // If the stream with the same ID already exists, stop it
    if (streams[streamId]) {
      streams[streamId].stop();
    }

    // Create a new RTSP stream
    streams[streamId] = new Stream({
      name: `Stream ${streamId}`,
      streamUrl: rtsp,
      wsPort: 3030 + parseInt(streamId),
      ffmpegOptions: {
        '-stats': '',
        '-r': 30,
      },
    });
  }

  // Respond with the WebSocket URL for the stream
  res.json({ url: `ws://127.0.0.1:${3030 + parseInt(streamId)}` });
});

// Endpoint to stop a stream
router.get("/stopStream/:streamId", (req, res) => {
  const { streamId } = req.params;

  // Check if the stream with the given ID exists
  if (streams[streamId]) {
    // Stop the stream and remove it from the streams object
    streams[streamId].stop();
    delete streams[streamId];
    return res.status(200).json({ message: `Stream ${streamId} stopped.` });
  }

  // If the stream doesn't exist, return a 404 error
  return res.status(404).json({ error: `Stream ${streamId} not found.` });
});

// Endpoint to fetch all active streams
router.get("/streams", (req, res) => {
  // Respond with an array of active stream URLs
  res.json({ streams: Object.keys(streams).map(streamId => streams[streamId].streamUrl) });
});

module.exports = router
