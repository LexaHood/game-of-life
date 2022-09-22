import { useCallback, useRef, useState } from 'react';
import './App.css';
import produce from 'immer';

const numCols = 190;
const numRows = 80;
const sizeCell = 6;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
  [1, 0],
  [-1, 0]
];

function clear() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
}

function generateArr() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => Math.random() > 0.6 ? 1 : 0));
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return clear();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  // https://habr.com/ru/post/529950/
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            // if (gridCopy[i][j+1] === 1) {
            //   neighbors += 1;
            // }
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              // проверка границ
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    
    // runSimulation;
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className='App'>
      <div className='btn'>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          // onClick={() => setGrid(generateArr())}
          onClick={() => setGrid(generateArr())}
        >Generate</button>
        <button
          onClick={() => setGrid(clear())}
        >Clear</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, ${sizeCell + 2}px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, j) =>
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: sizeCell,
                height: sizeCell,
                backgroundColor: grid[i][j] ? 'pink' : undefined,
                border: 'solid 1px #c8c8c8'
              }} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
