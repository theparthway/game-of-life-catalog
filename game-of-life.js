const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
let grid = createGrid();

function createGrid() {
  return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#151A1B'; // Background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        ctx.fillStyle = '#5CFFD5'; // Cell color
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function updateGrid() {
  const nextGrid = createGrid();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = getLiveNeighbors(row, col);

      if (grid[row][col] === 1) {
        if (neighbors === 2 || neighbors === 3) {
          nextGrid[row][col] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[row][col] = 1;
        }
      }
    }
  }

  grid = nextGrid;
  drawGrid();
}

function getLiveNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const x = row + i;
      const y = col + j;
      if (x >= 0 && x < rows && y >= 0 && y < cols) {
        count += grid[x][y];
      }
    }
  }
  return count;
}

function presetDesign() {
  const startRow = Math.floor(rows / 2); // Adjusted to position "Catalog" in the upper half
  const startCol = Math.floor(cols / 3); // Adjusted for left alignment
  
  const letters = {
    C: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ],
    A: [
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1]
    ],
    T: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    A2: [
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1]
    ],
    L: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ],
    O: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    G: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 1]
    ]
  };
  
  // Function to draw a letter at a specific position
  function drawLetter(letter, row, col) {
    for (let r = 0; r < letter.length; r++) {
      for (let c = 0; c < letter[r].length; c++) {
        grid[row + r][col + c] = letter[r][c];
      }
    }
  }
  
  // Draw the letters "Catalog"
  drawLetter(letters.C, startRow, startCol);
  drawLetter(letters.A, startRow, startCol + 4);
  drawLetter(letters.T, startRow, startCol + 8);
  drawLetter(letters.A2, startRow, startCol + 12);
  drawLetter(letters.L, startRow, startCol + 16);
  drawLetter(letters.O, startRow, startCol + 20);
  drawLetter(letters.G, startRow, startCol + 24);
}


function addCluster(x, y) {
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    // Generate a random 5x5 cluster
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          grid[newRow][newCol] = Math.random() > 0.5 ? 1 : 0; // Randomly set cell state
        }
      }
    }
  }
}

canvas.addEventListener('click', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  addCluster(x, y);
  drawGrid();
});

presetDesign();
drawGrid();
setInterval(updateGrid, 500);
