import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState([]);
  const [next, setNext] = useState(1);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("not_started"); // not_started, started, cleared, game_over

  const [numberOfPoints, setNumberOfPoints] = useState(5);
  const [auto, setAuto] = useState(false);

  const randomPoints = () => {
    let arr = [];
    for (let i = 1; i <= numberOfPoints; i++) {
      arr.push({
        id: i,
        x: Math.random() * 90,
        y: Math.random() * 90,
        removing: false,
        countdown: 3,
      });
    }
    setPoints(arr);
    setNext(1);
    setTime(0);
    setStatus("started");
    setAuto(false);
  };
  const handleClick = (id) => {
    if (status !== "started") return;

    if (id === next) {
      setPoints((prev) =>
        prev.map((point) =>
          point.id === id ? { ...point, removing: true } : point,
        ),
      );
      setNext((prev) => prev + 1);
    } else {
      setStatus("game_over");
    }
  };
  // time
  useEffect(() => {
    if (status !== "started") return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [status]);
  // check win
  useEffect(() => {
    if (points.length === 0 && status === "started") {
      setStatus("cleared");
    }
  }, [points, status]);
  // auo play
  useEffect(() => {
    if (!auto || status !== "started") return;

    const interval = setInterval(() => {
      setPoints((prev) =>
        prev.map((p) => (p.id === next ? { ...p, removing: true } : p)),
      );
      setNext((n) => n + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [auto, next, status]);
  // countdown
  useEffect(() => {
    if (status !== "started") return;

    const interval = setInterval(() => {
      setPoints((prev) =>
        prev
          .map((p) => {
            if (!p.removing) return p;

            return {
              ...p,
              countdown: p.countdown - 0.1,
            };
          })
          .filter((p) => p.countdown > 0),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="app">
      <h1>LET'S PLAY</h1>
      <h2>Time: {time.toFixed(1)}s </h2>
      <input
        type="number"
        name=""
        id=""
        min={1}
        value={numberOfPoints}
        onChange={(e) => setNumberOfPoints(parseInt(e.target.value))}
        disabled={status === "started"}
      />
      {status === "not_started" && (
        <button onClick={randomPoints}>Start</button>
      )}
      {status !== "not_started" && (
        <button onClick={randomPoints}>Restart</button>
      )}
      {status === "started" && (
        <button onClick={() => setAuto(!auto)}>
          {auto ? "Stop play" : "Auto play"} Auto play
        </button>
      )}
      {status === "cleared" && <h2>ALL CLEARED</h2>}
      {status === "game_over" && <h2>GAME OVER</h2>}

      <div className="board">
        {points.map((point) => (
          <div
            key={point.id}
            className="circle"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: point.removing ? point.countdown / 3 : 1,
            }}
            onClick={() => handleClick(point.id)}
          >
            <div>
              <div>{point.id}</div>

              {point.removing && <div>{point.countdown.toFixed(1)}s </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
