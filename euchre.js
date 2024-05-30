//TODO 
// Picking trump suit
// Hand logic
// Scoring logic

//-------------------------------------
// Imports/Libraries

const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input
function getInput(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

//-------------------------------------
// Players & Teams

// Creating player objects

const player1 = {
    id: 1,
    team: 1,
    hand: []
};

const player2 = {
    id: 2,
    team: 2,
    hand: []
};

const player3 = {
    id: 3,
    team: 1,
    hand: []
};

const player4 = {
    id: 4,
    team: 2,
    hand: []
};

// Adding player objects to player list

const PLAYERS = [player1, player2, player3, player4];

//-------------------------------------
// Deck

// Initializes global deck variable
var deck;

// Card suits and values that will be used to create the deck
const CARD_SUITS = ["Spades", "Diamonds", "Clubs", "Hearts"];
const CARD_VALUES = ["9", "10", "Jack", "Queen", "King", "Ace"];

// Function to shuffle deck in a true random manner
// Uses Fisher-Yates for O(N) time complexity
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        // Random number from 0 to i inclusive
        let j = Math.floor(Math.random() * (i + 1));

        // Swap arr[i] with element of random index
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Function to create a shuffled Euchre deck
function createDeck() {
    const deck = [];
    CARD_SUITS.forEach(suit => {
        CARD_VALUES.forEach(value => {
            // Creating card object
            const card = {
                value: value,
                suit: suit
            };
            // Adding card to deck
            deck.push(card);
        });
    });

    return shuffleDeck(deck);
}

// Function to deal five cards to each player

function dealCards() {
    // Ensures deck is full and shuffled before dealing cards to players
    deck = createDeck();

    for (let i = 0; i < 5; i++) {
        PLAYERS.forEach(player => player.hand.push(deck.pop()));
    }
}

//-------------------------------------
// Game Logic

// Stores which players are playing the round
var playersInRound = [1, 2, 3, 4];
var playedCards = [];
var trumpSuit;
var currentRound = 0;

// Initialized current dealer and player turn
var currentDealer = playersInRound[currentRound % 4];
var currentPlayerTurn = playersInRound[(currentRound + 1) % 4];
var playerStartingRound;

// Function to rotate whose turn it is clockwise
function rotatePlayerTurn() {
    let currentPlayerTurnIndex = playersInRound.indexOf(currentPlayerTurn);

    // Move to the next index, or loop back to beginning if at the end of the player list
    let nextPlayerTurnIndex = (currentPlayerTurnIndex + 1) % playersInRound.length;

    currentPlayerTurn = playersInRound[nextPlayerTurnIndex];
}

// Function to pick trump suit after cards have been dealt
async function pickTrumpSuit() {
    let playerDecision = "";
    playerStartingRound = currentPlayerTurn;
    playedCards.push(deck.pop());
    console.log(playedCards);
    // While loop to loop through all players once
    do {
        playerDecision = await getInput(`Player ${currentPlayerTurn}: Pass or Pick Up: `);
        if (playerDecision.trim().toLowerCase() === "pick up") {
            trumpSuit = playedCards[0].suit;
            console.log(trumpSuit);
            return;
        }
        else rotatePlayerTurn();
    } while (currentPlayerTurn !== playerStartingRound);
    console.log("Ending rotation");
    return;
}

dealCards();
pickTrumpSuit();
