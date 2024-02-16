const express = require("express");
const middleware = require("./middleware");
const routes = require("./routes");

const app = express();
const port = 3002;

// Use middleware from middleware.js
app.use(middleware);

// Use routes from routes.js
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



from flask import Flask, Response
from flask_rtspstream import RTSPStream

app = Flask(__name__)

@app.route('/stream')
def stream():
    stream_url = 'your_rtsp_stream_url_here'
    return Response(RTSPStream(stream_url), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)And a basic example of what your React component might look like:import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
    const [streamUrl, setStreamUrl] = useState('');

    useEffect(() => {
        fetch('/stream') // Assuming Flask server is running on the same host
            .then(response => response.text())
            .then(data => setStreamUrl(data));
    }, []);

    return (
        <div>
            {streamUrl && <ReactPlayer url={streamUrl} controls={true} />}
        </div>
    );
}

export default VideoPlayer;This is a basic setup, and you
