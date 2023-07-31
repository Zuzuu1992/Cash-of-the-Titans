const startingBalance = 100;
const maxBet = 100;
const minBet = 1;
const opponentsData = [
  { multiplier: 0, power: "NaN" },
  { multiplier: 0, power: "NaN" },
  { multiplier: 0, power: "NaN" },
];

let balance = startingBalance;
let currentBet = 0;
let gameStarted = false;
let currentRound = 1;

function parsePowerValue(power) {
  const parsedPower = parseInt(power);
  return isNaN(parsedPower) ? 0 : parsedPower;
}

function getRandomPower(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomMultiplier(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPowerWithMultiplier(basePower, multiplier) {
  const randomFactor = Math.random();
  const powerWithMultiplier = basePower + multiplier * randomFactor;
  return Math.floor(powerWithMultiplier);
}

function shuffleOpponentsData() {
  const minPower = 1 + currentRound * 1;
  const maxPower = 10 + currentRound * 5;
  const minMultiplier = 1 + currentRound;
  const maxMultiplier = 10 + currentRound * 2;
  const playerInitialPower = 10;

  for (let i = 0; i < opponentsData.length; i++) {
    const randomMultiplier = getRandomMultiplier(
      minMultiplier + i,
      maxMultiplier + i
    );
    const maxOpponentPower = playerInitialPower + currentRound * 2;
    const basePower = getRandomPower(minPower, maxOpponentPower);
    const powerWithMultiplier = getRandomPowerWithMultiplier(
      basePower,
      randomMultiplier
    );
    opponentsData[i].power = powerWithMultiplier;
    opponentsData[i].multiplier = randomMultiplier;
    console.log(
      `Opponent ${
        i + 1
      } - Power: ${powerWithMultiplier}, Multiplier: ${randomMultiplier}`
    );
  }
}

function showPlayerPower(playerPower) {
  const playerAvatar = document.getElementById("player-avatar");
  let powerIndicator = playerAvatar.querySelector(".power-indicator");
  if (!powerIndicator) {
    powerIndicator = document.createElement("div");
    powerIndicator.classList.add("power-indicator");
    playerAvatar.appendChild(powerIndicator);
  }
  powerIndicator.textContent = `Power: ${playerPower}`;
}

const playerAvatar = document.createElement("div");
playerAvatar.setAttribute("id", "player-avatar");
playerAvatar.classList.add("avatar");
const playerPower = 10;
playerAvatar.dataset.power = playerPower;

function createPlayerAvatar() {
  const gameWindow = document.getElementById("game-window");
  const previousPlayerAvatar = document.getElementById("player-avatar");
  playerAvatar.style.backgroundImage = "url('./assets/hector-ready.png')";
  if (previousPlayerAvatar) {
    previousPlayerAvatar.remove();
  }
  gameWindow.appendChild(playerAvatar);

  showPlayerPower(playerAvatar.dataset.power);
}

function createOpponentAvatars() {
  const gameWindow = document.getElementById("game-window");
  const opponentsContainer = document.createElement("div");
  opponentsContainer.classList.add("opponents-container");

  opponentsData.forEach((opponent, index) => {
    const opponentAvatar = document.createElement("div");
    opponentAvatar.classList.add("avatar", "opponent");
    opponentAvatar.dataset.index = index;
    opponentAvatar.dataset.multiplier = opponent.multiplier;
    opponentAvatar.dataset.power = opponent.power;
    opponentAvatar.style.backgroundImage = `url('./assets/opponent-${index}.png')`;
    opponentAvatar.textContent = opponent.multiplier + "x";
    opponentsContainer.appendChild(opponentAvatar);
  });

  const previousOpponentsContainer = gameWindow.querySelector(
    ".opponents-container"
  );
  if (previousOpponentsContainer) {
    previousOpponentsContainer.remove();
  }

  gameWindow.appendChild(opponentsContainer);

  const opponentsAvatars = document.querySelectorAll(".opponent");
  opponentsAvatars.forEach((avatar) => {
    avatar.addEventListener("click", function () {
      if (gameStarted) {
        selectOpponent(this);
      }
    });
  });
}

function showPowerIndicator(opponentAvatar, opponentPower) {
  if (opponentAvatar) {
    const powerIndicator = document.createElement("div");
    powerIndicator.classList.add("power-indicator");
    powerIndicator.textContent = `Power: ${opponentPower}`;
    opponentAvatar.appendChild(powerIndicator);
  }
}

let selectedOpponentIndex = null;

function selectOpponent(opponentAvatar) {
  const opponentsAvatars = document.querySelectorAll(".opponent");

  selectedOpponentIndex = parseInt(opponentAvatar.dataset.index);

  opponentAvatar.classList.add("fighting");
  const opponentPower = parsePowerValue(opponentAvatar.dataset.power);
  showPowerIndicator(opponentAvatar, opponentPower);

  animateAvatarFight(opponentAvatar.parentNode);

  setTimeout(() => {
    opponentsAvatars.forEach((avatar) => {
      avatar.style.pointerEvents = "auto";
    });

    opponentAvatar.classList.remove("fighting");
    opponentAvatar.removeChild(
      opponentAvatar.querySelector(".power-indicator")
    );

    const playerAvatar = document.getElementById("player-avatar");
    let playerPower = parsePowerValue(playerAvatar.dataset.power);
    console.log("playerPower", playerPower);
    console.log("opponentPower", opponentPower);

    if (playerPower >= opponentPower) {
      const opponentMultiplier = parseInt(opponentAvatar.dataset.multiplier);

      currentBet = opponentPower * opponentMultiplier;
      console.log(
        "currentBet",
        currentBet,
        "opponentMultiplier",
        opponentMultiplier
      );

      playerPower += opponentPower;
      showPlayerPower(playerPower);
    } else {
      balance -= currentBet;
    }

    if (balance < minBet) {
      console.log("balance", balance);
      console.log("minBet", minBet);
      alert("Game Over! You ran out of money.");
      resetGame();
    } else {
      gameStarted = false;
      updateUI();
    }
  }, 2000);
}

let previousPlayerImage = "";

function animateAvatarFight(selectedOpponent) {
  console.log("Fight animation started");
  const playerAvatar = document.getElementById("player-avatar");
  const opponentAvatars = selectedOpponent.querySelectorAll(".avatar");

  const opponentMultiplier = parseInt(selectedOpponent.dataset.multiplier);
  console.log(opponentMultiplier);

  previousPlayerImage = playerAvatar.style.backgroundImage;

  playerAvatar.style.backgroundImage = "url('./assets/Hector-fight.png')";

  opponentAvatars.forEach((opponentAvatar) => {
    const opponentIndex = parseInt(opponentAvatar.dataset.index);
    if (opponentIndex === selectedOpponentIndex) {
      opponentAvatar.style.backgroundImage = `url('./assets/opponent-fight-${selectedOpponentIndex}.png')`;
    } else {
      opponentAvatar.style.backgroundImage = `url('./assets/opponent-${opponentIndex}.png')`;
    }
  });

  playerAvatar.classList.add("fighting");
  opponentAvatars.forEach((opponentAvatar) => {
    opponentAvatar.classList.add("shake");
  });

  setTimeout(() => {
    playerAvatar.classList.remove("fighting");
    playerAvatar.style.backgroundImage = previousPlayerImage;
    opponentAvatars.forEach((opponentAvatar) => {
      opponentAvatar.classList.remove("shake");
    });
  }, 2000);
}

function startNewRound() {
  createPlayerAvatar();
  createOpponentAvatars();
  previousPlayerImage = "url('./assets/hector-ready.png')";

  const opponentsAvatars = document.querySelectorAll(".opponent");
  opponentsAvatars.forEach((avatar) => {
    avatar.addEventListener("click", function () {
      if (gameStarted) {
        selectOpponent(this);
      }
    });
  });
  currentRound++;
  gameStarted = true;
  updateUI();
}

function updateUI() {
  document.getElementById("balance").textContent = balance.toFixed(1);
  document.getElementById("bet-input").value = currentBet.toFixed(1);

  const betButton = document.getElementById("bet-button");
  const cashOutButton = document.getElementById("cash-out-button");

  if (gameStarted) {
    betButton.disabled = true;
    cashOutButton.disabled = false;
  } else {
    betButton.disabled = false;
    cashOutButton.disabled = true;
  }
}

function resetGame() {
  balance = startingBalance;
  currentBet = 0;
  gameStarted = false;
  updateUI();
  document.getElementById("game-window").innerHTML = "";
}

document.getElementById("bet-button").addEventListener("click", function () {
  const betInput = parseFloat(document.getElementById("bet-input").value);

  if (betInput >= minBet && betInput <= maxBet && balance >= betInput) {
    currentBet = betInput;
    balance -= currentBet;
    updateUI();

    shuffleOpponentsData();
    startNewRound();
    const textDiv = document.querySelector(".text");
    textDiv.style.display = "none";
  } else {
    alert("Invalid bet amount or insufficient balance!");
  }
});

document
  .getElementById("cash-out-button")
  .addEventListener("click", function () {
    if (currentBet > 0) {
      balance += currentBet;
      currentBet = 0;
      gameStarted = false;
      updateUI();
      document.getElementById("game-window").innerHTML = "";
    } else {
      alert("You have no active bet to cash out!");
    }
  });

updateUI();
