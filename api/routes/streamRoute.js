import React, { useEffect, useRef, useState } from "react";
import "../../Assets/Styles/cameraComponent.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CameraComponent = ({
  deviceName,
  startRTSPFeed,
  stopRTSPFeed,
  streamDataUrl,
  closeMultiStreams,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [lines, setLines] = useState([]);
  const [lineColor, setLineColor] = useState("green");
  const regex = /^\/dashboard\/features\/(anpr|otd)\/[0-9]/;
  const location = useLocation();

  console.log(location);
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    setPathName(location.pathname);

    return () => {
      closeMultiStreams();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("2D context not found");
      return;
    }

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all lines
    lines.forEach((line, index) => {
      context.strokeStyle = line.color;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(line.startX, line.startY);
      context.lineTo(line.endX, line.endY);
      context.stroke();
    });

    // Draw the current line
    if (currentLine) {
      context.strokeStyle = lineColor;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(currentLine.startX, currentLine.startY);
      context.lineTo(currentLine.endX, currentLine.endY);
      context.stroke();
    }
  }, [lines, currentLine, lineColor]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCurrentLine({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
      color: lineColor,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCurrentLine((prevLine) => ({
      ...prevLine,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
    }));
  };

  const handleMouseUp = () => {
    if (currentLine) {
      setLines((prevLines) => [...prevLines, currentLine]);
      setCurrentLine(null);
      setLineColor((prevColor) => (prevColor === "green" ? "yellow" : "green"));
    }
    setIsDrawing(false);
  };

  function boundingBoxApi() {
    if (lines.length === 0) {
      console.error("No lines to submit");
      return;
    }

    const linesData = lines.map((line) => ({
      startX: line.startX,
      startY: line.startY,
      endX: line.endX,
      endY: line.endY,
      color: line.color,
    }));

    axios
      .post(`http://192.168.1.47:7780/webhook/in`, {
        url: streamDataUrl,
        lines: linesData,
      })
      .then((response) => {
        console.log("response", response);
        // SuccessAlert(response.data.message);
      })
      .catch((error) => {
        console.log("error", error);
        // ErrorAlert(error.response.data.error);
      });
  }

  return (
    <div className="configStream ">
      <h1>{deviceName}</h1>
      {regex.test(pathName) ? (
        <div className="canvas-container1">
          <canvas
            className="canvas"
            id="video-canvas"
            width="800"
            height="600"
            style={{ zIndex: 1 }}
          ></canvas>
          <canvas
            id="video"
            className="canvas"
            width="800"
            height="600"
            style={{ zIndex: 2 }}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          ></canvas>
        </div>
      ) : (
        <canvas id="video-canvas"></canvas>
      )}
      <div style={{ paddingLeft: "1rem" }}>
        <button className="configStream__btn" onClick={startRTSPFeed}>
          Start Stream
        </button>
        <button
          className="configStream__btn"
          onClick={() => stopRTSPFeed("stop")}
        >
          Stop Stream
        </button>
        {regex.test(pathName) ? (
          <button
            className="configStream__btn"
            onClick={boundingBoxApi}
          >
            Submit
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CameraComponent;
.SubmitSchdulerbtn:active {
  background: var(--color-mode-text);
  color: var(--active-color);
  box-shadow: 2px 2px .5rem rgba(0, 0, 0.5);

}
