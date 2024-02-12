Client.js

import React, { useEffect, useState } from "react";
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
      const newStreams = streamUrls.map(url => ({
        url,
        player: new JSMpeg.Player(url, { canvas: document.createElement("canvas") })
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
        {streams.map((stream, index) => (
          <div className="camera-card" key={index}>
            <div>
              {/* Render the canvas for each stream */}
              {stream.player.getCanvas()}
            </div>
            <div className="camera-info">
              <p>Camera {index + 1}</p>
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
