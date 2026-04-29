// 🔐 CODIS VÀLIDS
const validCodes = ["2749", "5183", "9627", "3851"];

// --------------------
// LOGIN
// --------------------
function checkCode() {
    const code = document.getElementById("codeInput").value.trim();

    if (validCodes.includes(code)) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("instructions").classList.remove("hidden");
    } else {
        document.getElementById("error").textContent = "❌ Codi incorrecte";
    }
}

// --------------------
// INICI JOC
// --------------------
function startGame() {
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    createPuzzle();
    startTimer();
}

// --------------------
// TEMPORITZADOR
// --------------------
let time = 0;
let interval;

function startTimer() {
    time = 0;
    document.getElementById("timer").textContent = time;

    interval = setInterval(() => {
        time++;
        document.getElementById("timer").textContent = time;
    }, 1000);
}

// --------------------
// PUZZLE
// --------------------
const puzzle = document.getElementById("puzzle");
let pieces = [];
let dragged = null;

function createPuzzle() {
    puzzle.innerHTML = "";
    pieces = [];

    const cols = 5;
    const rows = 3;

    const width = 450;
    const height = 594; // formato DIN A4

    const pieceWidth = width / cols;
    const pieceHeight = height / rows;

    for (let i = 0; i < cols * rows; i++) {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        const x = (i % cols) * pieceWidth;
        const y = Math.floor(i / cols) * pieceHeight;

        piece.style.backgroundImage = "url('Poster/Poster.jpg')"; // ✔ ruta corregida
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        piece.style.backgroundSize = `${width}px ${height}px`;

        piece.setAttribute("draggable", true);
        piece.dataset.index = i; // ⭐ clave para comprobar victoria

        // Drag & drop
        piece.addEventListener("dragstart", () => dragged = piece);
        piece.addEventListener("dragover", (e) => e.preventDefault());
        piece.addEventListener("drop", () => swapPieces(dragged, piece));

        pieces.push(piece);
    }

    shufflePieces();
}

// --------------------
// MEZCLAR (Fisher-Yates)
// --------------------
function shufflePieces() {
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    pieces.forEach(p => puzzle.appendChild(p));
}

// --------------------
// INTERCAMBIO REAL
// --------------------
function swapPieces(p1, p2) {
    if (!p1 || !p2 || p1 === p2) return;

    const parent = p1.parentNode;

    const next1 = p1.nextSibling;
    const next2 = p2.nextSibling;

    parent.insertBefore(p1, next2);
    parent.insertBefore(p2, next1);

    // comprobar victoria
    setTimeout(checkWin, 100);
}

// --------------------
// CHECK VICTORIA
// --------------------
function checkWin() {
    const current = Array.from(puzzle.children);

    for (let i = 0; i < current.length; i++) {
        if (parseInt(current[i].dataset.index) !== i) {
            return;
        }
    }

    winGame();
}

// --------------------
// VICTORIA
// --------------------
function winGame() {
    clearInterval(interval);

    const winMessage = document.createElement("div");
    winMessage.innerHTML = "🎉 YUPIIII HAS GANADO 🎉";
    winMessage.style.fontSize = "30px";
    winMessage.style.marginTop = "20px";
    winMessage.style.color = "green";
    winMessage.style.fontWeight = "bold";

    document.getElementById("game").appendChild(winMessage);
}