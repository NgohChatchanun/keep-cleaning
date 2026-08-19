const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const CELL_SIZE = 40;
const ERASER_SIZE = 20;
const messages = [
    "You are off to a great start!",
    "You are doing great!",
    "You are getting better!",
    "Stay at it!",
    "Keep going!",
    "You are getting better every time!",
    "You are nearly there",
    "You have got what it takes! Try just one more time!",
    "I m so proud of you!"
];

let eraserX = 0;
let eraserY = 0;


let roundNumber = 1;
let gameStarted = false;
let score = 0;


function drawBlock(row, col, color) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    ctx.fillStyle = color;

    ctx.fillRect(
        x,
        y,
        CELL_SIZE,
        CELL_SIZE
    );
}

//helper function to prevent overlapp
function isPositionUsed(blocks, row, col) {
    for (const block of blocks) {
        if (block.row === row && block.col === col) {
            return true;
        }
    }

    return false;
}

function createBlocks() {
    const blocks = [];

    const colors = [
        "lavender",
        "salmon",
        "lightblue",
        "olive",
        "pink",
        "beige",
        "coral"
    ];

    for (let i = 0; i < 5; i++) {

        let row;
        let col;

        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        } while (isPositionUsed(blocks, row, col));

        const random = Math.floor(Math.random() * colors.length);
        const color = colors[random];

        blocks.push({
            row: row,
            col: col,
            color: color
        });
    }

    return blocks;
}


let blocks = [];

function startRound() {
    blocks = createBlocks();

    document.getElementById("roundNumber").textContent =
        "Round: " + roundNumber;
}


//start and restart game  button
startButton.addEventListener("click", function() {
    gameStarted = true;

    roundNumber = 1;
    score = 0;

    showMessage("");

    startRound();

    document.getElementById("score").textContent =
        "Blocks cleaned: " + score;

    document.getElementById("blocksRemaining").textContent =
        "Blocks remaining: " + blocks.length;

    startButton.textContent = "Restart Game";

    draw();
});

//
function nextRound() {
    roundNumber++;

    const messageIndex = (roundNumber - 2) % messages.length;

    showMessage(messages[messageIndex]);

    startRound();
}


function draw() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const block of blocks) {
        drawBlock(
            block.row,
            block.col,
            block.color
        );
    }

    ctx.fillStyle = "pink";

    ctx.fillRect(
        eraserX,
        eraserY,
        ERASER_SIZE,
        ERASER_SIZE
    );
}


// mouse + touch handler
canvas.addEventListener("pointerdown", function(event) {
    if (!gameStarted) {
        return;
    }

    cleanAtPointer(event);
});

canvas.addEventListener("pointermove", function(event) {
    if (!gameStarted) {
        return;
    }

    if (event.buttons > 0 || event.pointerType === "touch") {
        cleanAtPointer(event);
    }
});

function cleanAtPointer(event) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    eraserX = (event.clientX - rect.left) * scaleX;
    eraserY = (event.clientY - rect.top) * scaleY;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (isColliding(block)) {
            blocks.splice(i, 1);

            score++;

            document.getElementById("score").textContent =
                "Blocks cleaned: " + score;

            break;
        }
    }

    if (blocks.length === 0) {
        nextRound();
    }

    document.getElementById("blocksRemaining").textContent =
        "Blocks remaining: " + blocks.length;

    draw();
}


draw();

//collision function
function isColliding(block) {
    const blockLeft = block.col * CELL_SIZE;
    const blockTop = block.row * CELL_SIZE;
    const blockRight = blockLeft + CELL_SIZE;
    const blockBottom = blockTop + CELL_SIZE;

    const eraserLeft = eraserX;
    const eraserTop = eraserY;
    const eraserRight = eraserX + ERASER_SIZE;
    const eraserBottom = eraserY + ERASER_SIZE;

    if (
        eraserRight < blockLeft ||
        eraserLeft > blockRight ||
        eraserBottom < blockTop ||
        eraserTop > blockBottom
    ) {
        return false;
    }

    return true;
}

//
function showMessage(text) {
    document.getElementById("message").textContent = text;
}

