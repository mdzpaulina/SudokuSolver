import React, { useRef, useEffect } from "react";
import "./grid.css";


export default function Grid({
  board,            
  editable = false,
  onChange,         
}) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, 81);
  }, []);

  const moveFocus = (idx, dr = 0, dc = 0) => {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    let next = r * 9 + c + dr * 9 + dc;
    next = Math.max(0, Math.min(80, next));
    refs.current[next]?.focus();
  };

  return (
    <div className="sudoku" role="grid">
      {Array.from({ length: 81 }).map((_, idx) => {
        const r = Math.floor(idx / 9);
        const c = idx % 9;
        const thickR = r % 3 === 0 ? ` r${r}` : "";
        const thickC = c % 3 === 0 ? ` c${c}` : "";

        return (
          <div key={idx} className={`cell${thickR}${thickC}`}>
            {editable ? (
              <input
                ref={(el) => (refs.current[idx] = el)}
                inputMode="numeric"
                maxLength={1}
                value={board[r][c] ? String(board[r][c]) : ""}
                onChange={(e) => {
                    const v = e.target.value.replace(/[^1-9]/g, "");
                    console.log("grid change", r, c, v); 
                    onChange?.(r, c, v);
                    if (v.length === 1) moveFocus(idx, 0, 1);
                }}
                onKeyDown={(e) => {
                  const map = {
                    ArrowUp: [-1, 0],
                    ArrowDown: [1, 0],
                    ArrowLeft: [0, -1],
                    ArrowRight: [0, 1],
                  };
                  if (map[e.key]) {
                    e.preventDefault();
                    const [dr, dc] = map[e.key];
                    moveFocus(idx, dr, dc);
                  }
                  if (e.key === "Backspace" && !board[r][c]) moveFocus(idx, 0, -1);
                }}
                aria-label={`row ${r + 1} col ${c + 1}`}
              />
            ) : (
              <div>{board[r][c] || ""}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
