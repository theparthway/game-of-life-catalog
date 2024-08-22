const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const prob = 0.5; // cluster density

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function calculateCellSize() {
  return Math.min(canvas.width, canvas.height) / 80;
}

function createGrid() {
  return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#151A1B'; // bg colour
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        ctx.fillStyle = '#5CFFD5'; // cell colour
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

      // each live cell with 1 or more than 3 neighbours dies
      // otherwise it stays alive
      if (grid[row][col] === 1) {
        if (neighbors === 2 || neighbors === 3) {
          nextGrid[row][col] = 1;
        }
      } else {
        // each dead cell with 3 neighbours comes alive
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
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);

  // horizontal line
  for (let r = -1; r < 2; r++) {
    for (let c = -12; c < 12; c++) {
      grid[midRow + r][midCol + c] = 1;
    }
  }

  // vertical line
  for (let r = -13; r < 0; r++) {
    for (let c = -2; c < 2; c++) {
      grid[midRow + r][midCol + c] = 1;
    }
  }

  const initialCoords = [
    [-2, -3], [-2, -4], [-2, -5],
    [-3, -3], [-3, -4], [-3, -5], [-3, -6],
    [-4, -3], [-4, -4], [-4, -5], [-4, -6], [-4, -7],
    [-5, -3], [-5, -4], [-5, -5], [-5, -6], [-5, -7], [-5, -8],
    [-6, -4], [-6, -5], [-6, -6], [-6, -7], [-6, -8], [-6, -9],
    [-7, -5], [-7, -6], [-7, -7], [-7, -8], [-7, -9], [-7, -10],
    [-8, -6], [-8, -7], [-8, -8], [-8, -9], [-8, -10], [-8, -11],
    [-9, -7], [-9, -8], [-9, -9], [-9, -10],
    [-10, -8], [-10, -9],

    [-2, 2], [-2, 3], [-2, 4],
    [-3, 2], [-3, 3], [-3, 4], [-3, 5],
    [-4, 2], [-4, 3], [-4, 4], [-4, 5], [-4, 6],
    [-5, 2], [-5, 3], [-5, 4], [-5, 5], [-5, 6], [-5, 7],
    [-6, 3], [-6, 4], [-6, 5], [-6, 6], [-6, 7], [-6, 8],
    [-7, 4], [-7, 5], [-7, 6], [-7, 7], [-7, 8], [-7, 9],
    [-8, 5], [-8, 6], [-8, 7], [-8, 8], [-8, 9], [-8, 10],
    [-9, 6], [-9, 7], [-9, 8], [-9, 9],
    [-10, 7], [-10, 8]
  ];

  initialCoords.forEach(element => {
    grid[midRow + element[0]][midCol + element[1]] = 1; // render using coords
  });
}

function addCluster(x, y) {
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    // generate a random 5x5 cluster
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          grid[newRow][newCol] = Math.random() < prob ? 1 : 0; // render cluster cells according to probability
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

function handleResize() {
  setCanvasSize();
  cellSize = calculateCellSize();
  rows = Math.floor(canvas.height / cellSize);
  cols = Math.floor(canvas.width / cellSize);
  grid = createGrid();
  presetDesign(); // for new grid
  drawGrid();
}

setCanvasSize();
let cellSize = calculateCellSize();
let rows = Math.floor(canvas.height / cellSize);
let cols = Math.floor(canvas.width / cellSize);
let grid = createGrid();

window.addEventListener('resize', handleResize);

presetDesign();
drawGrid();
setInterval(updateGrid, 100);
