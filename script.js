document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript file loaded");

  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const restartBtn = document.getElementById("restart-btn");
  const reward = document.getElementById("reward");
  const rewardText = document.getElementById("reward-text");
  const playAgainBtn = document.getElementById("play-again-btn");

  if (!gameBoard || !timerDisplay) {
    console.error("Game board or timer not found in DOM");
    return;
  }

  let cards = [];
  let firstCard, secondCard;
  let hasFlippedCard = false;
  let lockBoard = false;
  let timer = 0;
  let timerInterval;

  const cardData = [
    { name: "Hey Sexy", img: "images/3.jpg" },
    { name: "Oops!", img: "images/30a.jpg" },
    { name: "Hey There", img: "images/Just.jpg" },
    { name: "Eat Me", img: "images/RecklessSerenity.jpg" },
    { name: "Ride It", img: "images/25.jpg" },
    { name: "You Know You Want", img: "images/18.jpg" },
    { name: "Hey You", img: "images/4.jpg" },
    { name: "I'm Waiting", img: "images/JustDoIt.jpg" },
  ];

  function shuffleCards() {
    const doubledCards = [...cardData, ...cardData];
    return doubledCards.sort(() => Math.random() - 0.5);
  }

  function startGame() {
    cards = shuffleCards();
    renderBoard();
    startTimer();
  }

  function renderBoard() {
  gameBoard.innerHTML = ""; // Clear the board
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card.name;

    // Create front and back of the card
    const front = document.createElement("div");
    front.classList.add("front");
    front.style.backgroundImage = card.img
      ? `url(${card.img})`
      : "none"; // Handle missing images gracefully

    const back = document.createElement("div");
    back.classList.add("back");

    // Append front and back to card
    cardElement.append(front, back);
    gameBoard.appendChild(cardElement);

    console.log("Card added:", card); // Debugging log

    cardElement.addEventListener("click", flipCard);
  });
}


  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
    if (isGameWon()) showReward();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = `Time: ${timer} seconds`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function isGameWon() {
    return [...document.querySelectorAll(".card")].every((card) =>
      card.classList.contains("flip")
    );
  }

  function showReward() {
    stopTimer();
    rewardText.textContent = `You completed the game in ${timer} seconds!`;
    reward.classList.remove("hidden");
  }

  restartBtn.addEventListener("click", () => {
    reward.classList.add("hidden");
    startGame();
  });

  playAgainBtn.addEventListener("click", () => {
    reward.classList.add("hidden");
    startGame();
  });

  startGame();
});
