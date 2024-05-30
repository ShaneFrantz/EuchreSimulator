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
    team: 1,
    hand: []
};

const player2 = {
    team: 2,
    hand: []
};

const player3 = {
    team: 1,
    hand: []
};

const player4 = {
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

// Function to handle picking up the revealed card when picking trump
async function pickUpRevealedCard(card, currentPlayerTurn, playerHand) {
    let playerDecision = "";
    playerHand.push(card);
    // Showing player hand to user in a list format
    for (let i = 0; i < playerHand.length; i++) {
        console.log(i, playerHand[i]);
    }
    
    playerDecision = await getInput("Pick a card to discard (by index): ");
    // Removes card at selected index
    playerHand.splice(playerDecision, 1);

    PLAYERS[currentPlayerTurn].hand = playerHand;

    console.log(PLAYERS[currentPlayerTurn].hand);
}

// Function to pick trump suit after cards have been dealt
async function pickTrumpSuit() {
    let playerDecision = "";
    playerStartingRound = currentPlayerTurn;
    playedCards.push(deck.pop());
    console.log(playedCards);
    // Do-while loop ask players to pick up or pass on the up card
    do {
        console.log(PLAYERS[currentPlayerTurn].hand);
        playerDecision = await getInput(`Player ${currentPlayerTurn}: Pass or Pick Up: `);
        if (playerDecision.trim().toLowerCase() == "pick up") {
            trumpSuit = playedCards[0].suit;
            console.log(trumpSuit);
            pickUpRevealedCard(playedCards[0], currentPlayerTurn, PLAYERS[currentPlayerTurn].hand);
            return;
        }
        else rotatePlayerTurn();
    } while (currentPlayerTurn !== playerStartingRound);

    let invalidTrumpSuit = playedCards[0].suit.trim().toLowerCase();
    
    // Do-while loop to ask players to pick a trump suit
    do {
        console.log(PLAYERS[currentPlayerTurn].hand);
        while (true) {
        playerDecision = await getInput(`Player ${currentPlayerTurn}: Pick a trump suit or pass : `);
        playerDecision = playerDecision.trim().toLowerCase();
        if (playerDecision == invalidTrumpSuit) console.log("Unable to pick suit of previously revealed card");
        else break;
        }
        switch (playerDecision) {
            case "spades":
                trumpSuit = "Spades";
                console.log(trumpSuit);
                return;
            case "diamonds":
                trumpSuit = "Diamonds";
                console.log(trumpSuit);
                return;
            case "clubs":
                trumpSuit = "Clubs";
                console.log(trumpSuit);
                return;
            case "hearts":
                trumpSuit = "Hearts";
                console.log(trumpSuit);
                return;
            default:
                rotatePlayerTurn();
                break;
        }
    } while (currentPlayerTurn !== playerStartingRound);
    console.log("No trump suit selected");
    return;
}

dealCards();
pickTrumpSuit();
