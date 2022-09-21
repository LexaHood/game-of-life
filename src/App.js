import { useCallback, useRef, useState } from 'react';
import './App.css';
import produce from 'immer';

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  // https://habr.com/ru/post/529950/
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //simulate
    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
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
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? 'pink' : undefined,
                border: 'solid 1px black'
              }} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
