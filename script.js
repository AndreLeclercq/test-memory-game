console.log("GAME LOADING...");
// STEP 1
// GAME MENU => PLAY

// STEP 2
// Init the game
const PAIRS_NUMBER = 18;
let cardsArray = [];
let savedCardId = null;
let tryCounter = 0;
let remainingPairs = PAIRS_NUMBER;

// On déclare la fonction de mélange de cartes
function shuffleCards(array) {
  array.sort(() => Math.random() - 0.5);
}

// On déclare la fonction de vérification de cartes
function compareCards(currentCardId) {
  const hideCard = (id) => {
    const cardValue = cardsArray[id];
    document.getElementById(`${id}`).classList.remove(`image-${cardValue}`);
  };

  const showCard = (id) => {
    const cardValue = cardsArray[id];
    document.getElementById(currentCardId).classList.add(`image-${cardValue}`);
  };

  showCard(currentCardId);

  setTimeout(() => {
    if (savedCardId === null) {
      savedCardId = currentCardId;
    } else {
      const isPaire = () => {
        return cardsArray[savedCardId] === cardsArray[currentCardId];
      };
      if (isPaire()) {
        const addClassDisabled = (id) => {
          document.getElementById(`${id}`).classList.add("disabled");
        };
        addClassDisabled(savedCardId);
        addClassDisabled(currentCardId);
        remainingPairs--;
        if (remainingPairs === 0) {
          endingGame();
        }
      }
      hideCard(savedCardId);
      hideCard(currentCardId);
      tryCounter++;
      savedCardId = null;
      console.log(`Try counter : ${tryCounter}`);
      console.log(`Remaining Pairs : ${remainingPairs}`);
    }
  }, 800);
}

function endingGame() {
  console.log("GAME IS OVER !");
}

// On créer le tableau de cartes avec une boucle FOR
for (let i = 1; i <= PAIRS_NUMBER; i++) {
  cardsArray.push(i, i);
}

// On mélange le tableau de cartes
shuffleCards(cardsArray);

// On construit le plateau de jeu
// On créé un élément DOM
const cardElement = document.createElement("div");

// On lui attribue une classe
cardElement.classList.add("card");

// Boucle FOR IN pour construire le board
for (const key in cardsArray) {
  if (Object.hasOwnProperty.call(cardsArray, key)) {
    const cardsBoardElement = document.getElementById("cards");
    const card = cardElement.cloneNode(true);

    card.id = key;
    cardsBoardElement.append(card);
  }
}

console.log(cardsArray);

// Start timer

// STEP 3
// Écoute du clic sur les cartes
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    e.target.classList.add("show");

    compareCards(e.target.id);
  }
});

// Show card and check value
