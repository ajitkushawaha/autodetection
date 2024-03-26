// controllers/streamController.js

const Stream = require('node-rtsp-stream');

let stream = null;
let currentRtspStreamUrl = "";

exports.startStream = (req, res) => {
  const newRtspStreamUrl = req.query.rtsp;
  // Create the WebSocket stream only if it doesn't exist or the RTSP URL has changed
  if (!stream || currentRtspStreamUrl !== newRtspStreamUrl) {
    if (stream || newRtspStreamUrl === 'stop') {
      stream.stop();
    }

    stream = new Stream({
      name: 'Camera Stream',
      streamUrl: newRtspStreamUrl,
      wsPort: 3030,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30
      }
    });

    currentRtspStreamUrl = newRtspStreamUrl;
  }
  res.header('content-type', 'video/webm');
  res.status(200).json({ url: 'ws://192.168.1.12:3030' });
};


// video queality

const Stream = require('node-rtsp-stream');

let stream = null;
let currentRtspStreamUrl = "";

exports.startStream = (req, res) => {
  const newRtspStreamUrl = req.query.rtsp;
  // Create the WebSocket stream only if it doesn't exist or the RTSP URL has changed
  if (!stream || currentRtspStreamUrl !== newRtspStreamUrl) {
    if (stream || newRtspStreamUrl === 'stop') {
      stream.stop();
    }

    stream = new Stream({
      name: 'Camera Stream',
      streamUrl: newRtspStreamUrl,
      wsPort: 3030,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30, // Adjust the frame rate as needed
        '-vf': 'scale=1280x720', // Adjust the resolution as needed
        '-c:v': 'libx264', // Use H.264 codec
        '-b:v': '2M' // Adjust the bitrate as needed
      }
    });

    currentRtspStreamUrl = newRtspStreamUrl;
  }
  res.header('content-type', 'video/webm');
  res.status(200).json({ url: 'ws://192.168.1.12:3030' });
};

// multiple streame


const Stream = require('node-rtsp-stream');

const MAX_STREAMS = 5; // Maximum number of streams to support
let streams = {}; // Object to hold multiple streams
let currentRtspStreamUrls = {}; // Object to hold current RTSP stream URLs for each stream

exports.startStream = (req, res) => {
  if (Object.keys(streams).length >= MAX_STREAMS) {
    res.status(400).json({ error: `Maximum number of streams (${MAX_STREAMS}) reached.` });
    return;
  }

  const streamName = req.query.name;
  const newRtspStreamUrl = req.query.rtsp;

  // Create a new stream or update an existing one
  if (!streams[streamName] || currentRtspStreamUrls[streamName] !== newRtspStreamUrl) {
    // Stop the existing stream if it exists
    if (streams[streamName]) {
      streams[streamName].stop();
    }

    // Create a new stream
    streams[streamName] = new Stream({
      name: streamName,
      streamUrl: newRtspStreamUrl,
      wsPort: 3030,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30, // Adjust the frame rate as needed
        '-vf': 'scale=1280x720', // Adjust the resolution as needed
        '-c:v': 'libx264', // Use H.264 codec
        '-b:v': '2M' // Adjust the bitrate as needed
      }
    });

    // Update the current RTSP stream URL
    currentRtspStreamUrls[streamName] = newRtspStreamUrl;
  }

  // Respond with the WebSocket URL for the client to connect to
  res.header('content-type', 'video/webm');
  res.status(200).json({ url: `ws://192.168.1.12:3030/${streamName}` });
};

exports.stopStream = (req, res) => {
  const streamName = req.query.name;

  // Check if the stream exists
  if (streams[streamName]) {
    streams[streamName].stop();
    delete streams[streamName];
    delete currentRtspStreamUrls[streamName];
    res.status(200).json({ message: `Stream ${streamName} stopped.` });
  } else {
    res.status(404).json({ error: `Stream ${streamName} not found.` });
  }
};
