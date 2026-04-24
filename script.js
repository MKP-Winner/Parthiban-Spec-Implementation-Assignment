class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isWall = false;
        this.visited = false;
        this.previous = null;
    }
}

class Pathfinder {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.queue = [];
        this.visitedOrder = [];
    }

    initializeGrid() {
        this.grid = [];
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push(new Node(r, c));
            }
            this.grid.push(row);
        }
    }

    getNeighbors(node) {
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        let neighbors = [];

        for (let [dr, dc] of dirs) {
            let r = node.row + dr;
            let c = node.col + dc;

            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                neighbors.push(this.grid[r][c]);
            }
        }
        return neighbors;
    }

    run(start, end) {
        this.queue = [];
        this.visitedOrder = [];

        start.visited = true;
        this.queue.push(start);

        while (this.queue.length > 0) {
            let current = this.queue.shift();
            this.visitedOrder.push(current);

            if (current === end) return;

            for (let neighbor of this.getNeighbors(current)) {
                if (!neighbor.visited && !neighbor.isWall) {
                    neighbor.visited = true;
                    neighbor.previous = current;
                    this.queue.push(neighbor);
                }
            }
        }
    }

    buildPath(end) {
        let path = [];
        let curr = end;

        while (curr) {
            path.unshift(curr);
            curr = curr.previous;
        }
        return path;
    }
}

let pathfinder;
let startNode, endNode;

function createGrid() {
    let rows = +document.getElementById("rows").value;
    let cols = +document.getElementById("cols").value;

    pathfinder = new Pathfinder(rows, cols);
    pathfinder.initializeGrid();

    let table = document.getElementById("grid");
    table.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        let tr = document.createElement("tr");

        for (let c = 0; c < cols; c++) {
            let td = document.createElement("td");

            td.dataset.row = r;
            td.dataset.col = c;

            td.addEventListener("click", () => handleClick(td));

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    setStartEnd();
}

function setStartEnd() {
    let sx = +document.getElementById("startX").value;
    let sy = +document.getElementById("startY").value;
    let ex = +document.getElementById("endX").value;
    let ey = +document.getElementById("endY").value;

    startNode = pathfinder.grid[sx][sy];
    endNode = pathfinder.grid[ex][ey];

    getCell(sx, sy).classList.add("start");
    getCell(ex, ey).classList.add("end");
}

function handleClick(cell) {
    let r = cell.dataset.row;
    let c = cell.dataset.col;

    let node = pathfinder.grid[r][c];

    // Toggle wall on/off
    node.isWall = !node.isWall;
    cell.classList.toggle("wall");
}

async function runBFS() {
    pathfinder.run(startNode, endNode);

    for (let node of pathfinder.visitedOrder) {
        let cell = getCell(node.row, node.col);

        if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
            cell.classList.add("visited");
            await sleep(20);
        }
    }

    let path = pathfinder.buildPath(endNode);

    for (let node of path) {
        let cell = getCell(node.row, node.col);

        if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
            cell.classList.add("path");
            await sleep(40);
        }
    }
}

function getCell(r, c) {
    return document.querySelector(`[data-row='${r}'][data-col='${c}']`);
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
