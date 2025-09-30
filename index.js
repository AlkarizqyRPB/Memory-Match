// --- Konfigurasi gambar (menggunakan emoji supaya tidak perlu asset eksternal) ---
const EMOJIS = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍑",
  "🍍",
  "🥝",
  "🍒",
  "🍉",
  "🥑",
  "🍋",
  "🍐",
  "🍊",
  "🍏",
  "🥥",
  "🍈",
  "🍓",
  "🍓",
];

const gridContainer = document.getElementById("gridContainer");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const pairCountEl = document.getElementById("pairCount");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetScoreBtn = document.getElementById("resetScore");
const sizeSelect = document.getElementById("size");

let gridCols = 4; // default
let backVisible = false;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let score = 0;
let moves = 0;
let matches = 0;
let totalPairs = 8;

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(cols) {
  gridContainer.innerHTML = "";
  gridContainer.classList.toggle("grid-4", cols === 4);
  gridContainer.style.gridTemplateColumns = `repeat(${cols},1fr)`;

  // calculate rows: for cols=4 we choose 4x4, for 6 choose 6x4
  const pairs = cols === 4 ? 8 : 12; // 4x4 -> 16 cards -> 8 pairs, 6x4 -> 24 cards -> 12 pairs
  totalPairs = pairs;

  // choose emojis
  const pool = EMOJIS.slice(0);
  shuffleArray(pool);
  const chosen = pool.slice(0, pairs);
  // make pairs and shuffle
  const cards = shuffleArray(chosen.concat(chosen)).map((emoji, idx) => ({
    id: idx + 1,
    emoji,
  }));

  cards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.emoji = card.emoji;
    el.dataset.id = card.id;
    el.innerHTML = `
          <div class="card-inner">
            <div class="card-face card-front">❓</div>
            <div class="card-face card-back">${card.emoji}</div>
          </div>
        `;
    el.addEventListener("click", onCardClick);
    gridContainer.appendChild(el);
  });

  // reset state
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  updateUI();
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (lockBoard) return;
  if (card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
  moves++;
  updateUI();

  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  setTimeout(() => {
    if (isMatch) {
      // leave flipped and mark as disabled
      firstCard.classList.add("disabled");
      secondCard.classList.add("disabled");
      score += 10; // beri 10 poin per pasangan
      matches++;
    } else {
      // balik kembali
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
    }

    // reset picks
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    updateUI();

    // check win
    if (matches === totalPairs) {
      setTimeout(() => {
        alert(
          `Selamat! Kamu menyelesaikan permainan. Skor: ${score}, Gerakan: ${moves}`
        );
      }, 200);
    }
  }, 650);
}

function updateUI() {
  scoreEl.textContent = score;
  movesEl.textContent = moves;
  pairCountEl.textContent = `${matches} / ${totalPairs} pasangan`;
}

// controls
shuffleBtn.addEventListener("click", () => {
  gridCols = parseInt(sizeSelect.value, 10);
  buildGrid(gridCols);
});

resetScoreBtn.addEventListener("click", () => {
  score = 0;
  updateUI();
});

// build initial grid
buildGrid(gridCols);
