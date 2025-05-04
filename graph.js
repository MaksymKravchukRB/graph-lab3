const { createCanvas } = require("canvas");
const fs = require("fs");
const seedrandom = require("seedrandom");

// Constants
const size = 700;
const points = 11;
const radius = 250;
const nodeRadius = 20;
const centerX = size / 2;
const centerY = size / 2;
const rng = seedrandom("4411");
const k = 0.725;

// Setup canvas
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// Fill background
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, size, size);

// Compute node positions
const nodePositions = [];
for (let i = 0; i < points; i++) {
  const angle = ((2 * Math.PI) / points) * i;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  nodePositions.push({ x, y });
}

// Create adjacency matrix
const matrix = [];
for (let i = 0; i < points; i++) {
  matrix[i] = [];
  for (let j = 0; j < points; j++) {
    const raw = rng() * 2.0;
    const scaled = raw * k;
    matrix[i][j] = scaled > 1.0 ? 1.0 : 0.0;
  }
}

// Draw arrows
function drawArrow(from, to, color = "black") {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);
  const distance = Math.hypot(dx, dy);

  const startX = from.x + nodeRadius * Math.cos(angle);
  const startY = from.y + nodeRadius * Math.sin(angle);
  const endX = to.x - nodeRadius * Math.cos(angle);
  const endY = to.y - nodeRadius * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw arrowhead
  const headlen = 10;
  const arrowAngle = Math.PI / 7;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle - arrowAngle),
    endY - headlen * Math.sin(angle - arrowAngle)
  );
  ctx.lineTo(
    endX - headlen * Math.cos(angle + arrowAngle),
    endY - headlen * Math.sin(angle + arrowAngle)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Draw edges
for (let i = 0; i < points; i++) {
  for (let j = 0; j < points; j++) {
    if (matrix[i][j] === 1.0) {
      drawArrow(nodePositions[i], nodePositions[j]);
    }
  }
}

// Draw nodes
ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

for (let i = 0; i < points; i++) {
  const { x, y } = nodePositions[i];

  ctx.beginPath();
  ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#eeeeee";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.fillText(i.toString(), x, y);
}

// Save image
fs.writeFileSync("directed_graph.png", canvas.toBuffer("image/png"));
console.log("Directed graph saved as directed_graph.png");

// Print matrix
console.log("\nAdjacency Matrix (after k = 0.725 scaling & thresholding):\n");
matrix.forEach((row) => console.log(row.map((n) => n.toFixed(1)).join(" ")));
