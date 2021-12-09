"use strict";

const PAIRS_NUMBER = 18; // Nombre de paires à trouver
const tableScoreTh = document.getElementById("score-table").innerHTML; // On récupère les titres du tableau des scores

let cardsArray = []; // Tableau de cartes
let savedCardId = null; // Carte à comparer
let tryCounter = 0; // Compteur d'essai
let timerValue = 2400; // Temps restant
let remainingPairs = PAIRS_NUMBER; // Compteur de paires restantes

// On récupère les scores
getScores();

/**
 * On déclare la fonction d'initialisation du jeu
 */
function initGame() {
  // On réinitialise les variables
  cardsArray = [];
  savedCardId = null;
  tryCounter = 0;
  timerValue = 2400;
  remainingPairs = PAIRS_NUMBER;

  /**
   * On créer le tableau de cartes avec une boucle FOR
   * @link https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for
   */
  for (let i = 1; i <= PAIRS_NUMBER; i++) {
    cardsArray.push(i, i);
  }

  // On mélange le tableau de cartes
  shuffleCards(cardsArray);

  // On affiche le tableau des scores
  updateScore();

  /**
   * On construit le plateau de jeu via la création d'un élément de DOM.
   */
  const cardsBoardElement = document.getElementById("cards");
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  while (cardsBoardElement.firstChild) {
    cardsBoardElement.removeChild(cardsBoardElement.firstChild);
  }

  /**
   * On clone l'élément modele via une boucle FOR...IN et on l'ajoute dans l'index.html
   * @link https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for...in
   */
  for (const key in cardsArray) {
    if (Object.hasOwnProperty.call(cardsArray, key)) {
      const card = cardElement.cloneNode(true);

      card.id = key;
      cardsBoardElement.append(card);
    }
  }

  // On cache l'overlay
  document.getElementById("overlay").style.display = "none";

  // On lance le timer
  let timer = setInterval(() => {
    timerValue--;
    updateTimer(timerValue);
    if (timerValue <= 0) {
      endingGame();
      clearInterval(timer);
    }
  }, 100);
}

/**
 * Déclaration de la fonction de mélange de cartes.
 * @link https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 * @link https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function shuffleCards(array) {
  array.sort(() => Math.random() - 0.5);
}

/**
 * Déclaration de la fonction de comparaison des cartes retournées
 */
function compareCards(currentCardId) {
  // Fonction permettant de "cacher" une carte
  const hideCard = (id) => {
    const cardValue = cardsArray[id];
    document.getElementById(`${id}`).classList.remove(`image-${cardValue}`);
  };

  // Fonction permettant d'"afficher" une carte
  const showCard = (id) => {
    const cardValue = cardsArray[id];
    document.getElementById(currentCardId).classList.add(`image-${cardValue}`);
  };

  // On affiche la carte séléctionnée
  showCard(currentCardId);

  // On lance un timer pour garder les cartes visibles durant 800 millisecondes.
  setTimeout(() => {
    // On vérifie si on a déjà une carte à comparer
    if (savedCardId === null) {
      savedCardId = currentCardId;

      // On vérifie les cartes à comparer
    } else {
      // Fonction qui va comparer les valeurs des deux cartes, cette fonction
      // permet d'être plus compréhensible pour un tiers qui lit le code.
      const isPaire = () => {
        return cardsArray[savedCardId] === cardsArray[currentCardId];
      };
      // On vérifie si c'est une paire
      if (isPaire()) {
        // Fonction pour désactiver les cartes des paires trouvées.
        const addClassDisabled = (id) => {
          document.getElementById(`${id}`).classList.add("disabled");
        };
        // On désactive les deux cartes ciblées.
        addClassDisabled(savedCardId);
        addClassDisabled(currentCardId);
        // On enlève 1 au compteur de paires restantes.
        remainingPairs--;
      }

      // On "cache" les cartes
      hideCard(savedCardId);
      hideCard(currentCardId);

      // On ajoute 1 au compteur d'essai.
      tryCounter++;
      // On réinitialise la carte à comparer.
      savedCardId = null;

      // On met à jour le score
      updateScore();

      // On vérifie si on a trouvé toutes les paires.
      if (remainingPairs <= 0) {
        endingGame();
      }
    }
  }, 800);
}

/**
 * On déclare la fonction de mise à jour du tableau des scores
 */
function updateScore() {
  const tryCounterElement = document.getElementById("try-counter");
  const remainingPairsElement = document.getElementById("remaining-pairs");

  tryCounterElement.innerHTML = tryCounter;
  remainingPairsElement.innerHTML = remainingPairs;
}

/**
 * On déclare la fonction qui met à jour le timer
 */
function updateTimer(currentTime) {
  const countdownElement = document.getElementById("countdown");
  const progressBarElement = document.getElementById("progress-bar");

  countdown.innerHTML = Math.round(currentTime / 10);
  progressBarElement.value = currentTime;
}

/**
 * On déclare la fonction de fin de jeu.
 */
function endingGame() {
  // On vide le tableau des scores
  document.getElementById("score-table").innerHTML = tableScoreTh;

  // On affiche l'overlay
  document.getElementById("overlay").style.display = "initial";

  // On vérifie si c'est une victoire
  if (remainingPairs <= 0) {
    const playerName = prompt("Entrez votre nom");
    const time = 240 - Math.round(timerValue / 10);
    const data = {
      player_name: playerName,
      time: time,
      try: tryCounter,
    };
    postScore(data);
  }

  // On récupère les nouveaux scores
  getScores();
}

/**
 * On "écoute" le clic et on vérifie si il se trouve sur une carte, dans ce cas
 * on lance la comparaison de cartes.
 */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    compareCards(e.target.id);
  }
});

/**
 * 0n déclare la fonction qui va afficher le tableau des scores
 */
function updateScoreBoard(scores) {
  // On créer les éléments qui vont servir de patron
  const trElement = document.createElement("tr");
  const tdElement = document.createElement("td");
  const tableElement = document.getElementById("score-table");

  //
  /**
   * On affiche les scores un à un avec une boucle FOREACH
   * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/append
   */
  scores.forEach((score) => {
    // On créé les clones des éléments
    const tr = trElement.cloneNode(true);
    const playerNameElement = tdElement.cloneNode(true);
    const timeElement = tdElement.cloneNode(true);
    const tryElement = tdElement.cloneNode(true);

    // On ajoute les valeurs dans le tableau
    playerNameElement.innerHTML = score.player_name;
    timeElement.innerHTML = score.time;
    tryElement.innerHTML = score.try;

    // On construit le tableau
    tr.append(playerNameElement);
    tr.append(timeElement);
    tr.append(tryElement);
    tableElement.append(tr);
  });
}

/**
 * On déclare la fonction getScores pour récupérer les scores à afficher dans le score board
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
function getScores() {
  fetch("/getScores")
    .then((response) => response.json())
    .then((data) => updateScoreBoard(data));
}

/**
 * On déclare la fonction postScore pour enregistrer le nouveau score dans la base de données
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
 */
async function postScore(data) {
  //On construit notre requête asynchrone
  const response = await fetch("/postScore", {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
}
