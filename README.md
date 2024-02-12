const express = require("express");
const Stream = require("node-rtsp-stream");
const cors = require("cors");

const app = express();
const port = 3002;
const streams = {}; // Object to store WebSocket streams by stream ID

app.use(express.json());
app.use(cors());

// Endpoint to start a new stream
app.get("/stream", (req, res) => {
  const { rtsp, streamId } = req.query;

  if (!rtsp || !streamId) {
    return res.status(400).json({ error: "RTSP URL and stream ID are required." });
  }

  if (!streams[streamId] || streams[streamId].streamUrl !== rtsp) {
    if (streams[streamId]) {
      streams[streamId].stop();
    }

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

  res.json({ url: `ws://127.0.0.1:${3030 + parseInt(streamId)}` });
});

// Endpoint to stop a stream
app.get("/stopStream/:streamId", (req, res) => {
  const { streamId } = req.params;
  if (streams[streamId]) {
    streams[streamId].stop();
    delete streams[streamId];
    return res.status(200).json({ message: `Stream ${streamId} stopped.` });
  }
  return res.status(404).json({ error: `Stream ${streamId} not found.` });
});

// Endpoint to fetch all active streams
app.get("/streams", (req, res) => {
  res.json({ streams: Object.keys(streams).map(streamId => streams[streamId].streamUrl) });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});






add multiple RTSP links in your React component, you can modify the initializeStreams function to fetch multiple RTSP URLs from your server and then initialize a JSMpeg player for each URL. Here's how you can modify the code to accommodate multiple RTSP links:import React, { useEffect, useState } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import axios from "axios";
import "../Assets/Styles/singlePage.css";

const SinglePage = () => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    // Initialize streams when component mounts
    initializeStreams();
  }, []);

  // Function to initialize streams
  const initializeStreams = async () => {
    try {
      // Fetch stream URLs from the server
      const response = await axios.get("http://127.0.0.1:3002/streams");
      const streamUrls = response.data.streams;
      
      // Create JSMpeg player for each stream URL
      const newStreams = streamUrls.map((url, index) => ({
        url,
        player: new JSMpeg.Player(url, { canvas: document.createElement("canvas") }),
        id: index // Assign an ID to each stream
      }));

      // Set the streams in the state
      setStreams(newStreams);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  // Function to start a specific RTSP feed
  const startRTSPFeed = async (url) => {
    try {
      await axios.get(`http://127.0.0.1:3002/stream?rtsp=${url}`);
    } catch (error) {
      console.error("Error starting RTSP feed:", error);
    }
  };

  // Function to stop a specific RTSP feed
  const stopRTSPFeed = async () => {
    try {
      await axios.get("http://127.0.0.1:3002/stream?rtsp=stop");
    } catch (error) {
      console.error("Error stopping RTSP feed:", error);
    }
  };

  return (
    <div>
      <div className="pageContaner">
        {/* Map over the streams and render each one */}
        {streams.map((stream) => (
          <div className="camera-card" key={stream.id}>
            <div>
              {/* Render the canvas for each stream */}
              {stream.player.getCanvas()}
            </div>
            <div className="camera-info">
              <p>Camera {stream.id + 1}</p>
              <button onClick={() => startRTSPFeed(stream.url)}>Start RTSP Feed</button>
              <button onClick={stopRTSPFeed}>Stop RTSP Feed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePage;
