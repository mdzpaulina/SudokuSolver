// src/App.jsx
import React, { useState } from "react";
import Grid from "./components/Grid.jsx";
import { solveSudoku } from "./lib/solver.js"; 
import "./app.css";

const empty9 = () => Array.from({ length: 9 }, () => Array(9).fill(0));

export default function App() {
  const [inputBoard, setInputBoard] = useState(empty9());
  const [solutionBoard, setSolutionBoard] = useState(empty9());
  const [status, setStatus] = useState("");

const handleChange = (r, c, valStr) => {
  let n = 0;
  if (/^[1-9]$/.test(valStr)) n = parseInt(valStr, 10);

  setInputBoard(prev => {
    const next = prev.map(row => row.slice());
    next[r][c] = n;
    return next;
  });
  setStatus("");
};

  const handleSolve = () => {
    try {
      const solved = solveSudoku(inputBoard); 
      if (!solved) {
        setStatus("Unsolvable or invalid puzzle (implement logic to detect).");
        setSolutionBoard(empty9());
        return;
      }
      setSolutionBoard(solved);
      setStatus("Solved!");
    } catch (e) {
      setStatus(e?.message || "Solver not implemented yet.");
      setSolutionBoard(empty9());
    }
  };

  const handleNew = () => {
    setInputBoard(empty9());
    setSolutionBoard(empty9());
    setStatus("");
  };

  return (
    <>
      <header className="nav">
        <button className="btn secondary" onClick={handleNew}>New sudoku</button>
        <div className="brand">Sudoku Solver</div>
      </header>

      <main className="container">
        <div className="boards">
          <section className="panel">
            <h2>Enter puzzle</h2>
            <Grid board={inputBoard} editable={true} onChange={handleChange} />
          </section>

          <section className="controls">
            <button className="btn" onClick={handleSolve}>Show solved sudoku</button>
            <div className={`status ${status === "Solved!" ? "ok" : status ? "err" : ""}`}>
              {status}
            </div>
          </section>

          <section className="panel">
            <h2>Solution</h2>
            <Grid board={solutionBoard} />
          </section>
        </div>
      </main>
    </>
  );
}
