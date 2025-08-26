// Solve a 9x9 Sudoku.
// * @param {number[][]} board - 9x9 matrix, 0 means empty.
//* @returns {number[][] | null} A new solved matrix, or null if invalid/unsolvable.

export function solveSudoku(board) {
  // Deep-copy so we never mutate React state
  const grid = clone(board);

  // Create trackers: rows[9][10], cols[9][10], boxes[9][10]
  const rows = makeBoolMatrix(9, 10);
  const cols = makeBoolMatrix(9, 10);
  const boxes = makeBoolMatrix(9, 10);

  //  Initialize trackers from the starting grid and validate
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (v === 0) continue;
      if (!isDigit(v)) return null; // invalid symbol
      const b = boxId(r, c);
      if (rows[r][v] || cols[c][v] || boxes[b][v]) {
        // duplicate already present in row/col/box
        return null;
      }
      rows[r][v] = cols[c][v] = boxes[b][v] = true;
    }
  }

  // Backtracking search
  const ok = search(grid, rows, cols, boxes);
  return ok ? grid : null;
}

// Backtracking with first-empty-cell method. 
function search(grid, rows, cols, boxes) {
  const cell = findNextEmpty(grid);
  if (!cell) return true; // solved
  const [r, c] = cell;
  const b = boxId(r, c);

  for (let v = 1; v <= 9; v++) {
    if (!rows[r][v] && !cols[c][v] && !boxes[b][v]) {
      // place
      grid[r][c] = v;
      rows[r][v] = cols[c][v] = boxes[b][v] = true;

      // explore
      if (search(grid, rows, cols, boxes)) return true;

      // undo 
      grid[r][c] = 0;
      rows[r][v] = cols[c][v] = boxes[b][v] = false;
    }
  }
  return false; // no valid digit found
}

// Find first empty cell scanning row-major; returns [r,c] or null. 
function findNextEmpty(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

// 3x3 box id (0..8) for cell (r,c).
function boxId(r, c) {
  return ((r / 3) | 0) * 3 + ((c / 3) | 0);
}

// Deep copy a 9x9 matrix of numbers.
function clone(mat) {
  if (!Array.isArray(mat) || mat.length !== 9) throw new Error("Expected 9x9 matrix");
  return mat.map((row) => {
    if (!Array.isArray(row) || row.length !== 9) throw new Error("Expected 9x9 matrix");
    return row.map((v) => (isDigit(v) || v === 0 ? v : 0));
  });
}

// Create an R x C boolean matrix initialized to false. 
function makeBoolMatrix(R, C) {
  return Array.from({ length: R }, () => Array(C).fill(false));
}

// Valid digit 1..9 
function isDigit(v) {
  return Number.isInteger(v) && v >= 1 && v <= 9;
}
