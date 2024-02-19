const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const cardData = [
    {
        id: 0,
        name: "Blue Eyed White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1],
    },
];

const players = {
    player1: "player-cards",
};

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    };

    return cardImage;
};

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showOrHideCardFieldDetails(true);

    await hideCardDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
};

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResult = "WIN";
        await playAudio(duelResult);
        state.score.playerScore++;
    };

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = "LOSE";
        await playAudio(duelResult);
        state.score.computerScore++;
    };

    return duelResult;
};

async function showOrHideCardFieldDetails(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    };
};

async function hideCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
};

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
};

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose:${state.score.computerScore}`
};

async function removeAllCardsImages() {
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
};

async function drawCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init()
};

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
};

function init() {
    showOrHideCardFieldDetails(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    // comando para iniciar música
    // const bgm = document.getElementById("bgm")
    // bgm.play();
};

init();