import { useEffect, useRef, useState } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<[number, number][]>([[5, 5]]);
  const foodRef = useRef<[number, number]>([10, 10]);
  const velocityRef = useRef<Direction>("RIGHT");

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("highScore")) || 0
  );
  const [direction, setDirection] = useState<Direction>("RIGHT");

  const cellSize = 20;
  const canvasSize = { width: 400, height: 400 };

  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const draw = () => {
      if (!ctx) return;

      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw food
      const [fx, fy] = foodRef.current;
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(fx * cellSize, fy * cellSize, cellSize, cellSize);

      // Draw snake
      ctx.fillStyle = "#10b981";
      for (const [x, y] of snakeRef.current) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    };

    const update = () => {
      const snake = [...snakeRef.current];
      const head = [...snake[0]];

      switch (velocityRef.current) {
        case "UP":
          head[1] -= 1;
          break;
        case "DOWN":
          head[1] += 1;
          break;
        case "LEFT":
          head[0] -= 1;
          break;
        case "RIGHT":
          head[0] += 1;
          break;
      }

      // Wall or self collision
      if (
        head[0] < 0 ||
        head[1] < 0 ||
        head[0] * cellSize >= canvasSize.width ||
        head[1] * cellSize >= canvasSize.height ||
        snake.some(([x, y]) => x === head[0] && y === head[1])
      ) {
        setRunning(false);
        return;
      }

      snake.unshift(head as [number, number]);

      const [fx, fy] = foodRef.current;

      // Eat food
      if (head[0] === fx && head[1] === fy) {
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("highScore", String(newScore));
          }
          return newScore;
        });

        foodRef.current = [
          Math.floor(Math.random() * (canvasSize.width / cellSize)),
          Math.floor(Math.random() * (canvasSize.height / cellSize)),
        ];
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      draw();
    };

    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [running, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const newDir = map[e.key];
      const currentDir = velocityRef.current;

      if (
        newDir &&
        !(
          (currentDir === "UP" && newDir === "DOWN") ||
          (currentDir === "DOWN" && newDir === "UP") ||
          (currentDir === "LEFT" && newDir === "RIGHT") ||
          (currentDir === "RIGHT" && newDir === "LEFT")
        )
      ) {
        velocityRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStart = () => {
    setScore(0);
    snakeRef.current = [[5, 5]];
    foodRef.current = [10, 10];
    velocityRef.current = "RIGHT";
    setDirection("RIGHT");
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border-2 border-green-600"
      />
      <div className="text-sm text-gray-700">
        Score: {score} | High Score: {highScore}
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleStart}
        >
          {running ? "Restart" : "Start Game"}
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
