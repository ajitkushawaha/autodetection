const Stream = require('node-rtsp-stream');

let stream = null;
let currentRtspStreamUrl = "";

const startRtspStream = (newRtspStreamUrl, res) => {
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

        res.header('content-type', 'video/webm');
        res.status(200).json({ url: 'ws://192.168.1.12:3030' });
        currentRtspStreamUrl = newRtspStreamUrl;
    }
};

module.exports = {
    startRtspStream
};

