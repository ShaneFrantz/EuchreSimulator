//TODO 
// Going alone
// Scoring logic for hand
// Scoring logic for round
// startHand()
// startRound()
// startGame()

// Random AI
// Smart AI
// Auto simulating
// Removing console logs on auto simulation
// Data logging 

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
var playedCards = [];

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

    // Empties player hands and played cards before dealing
    PLAYERS.forEach(player => player.hand = []);
    playedCards = [];

    for (let i = 0; i < 5; i++) {
        PLAYERS.forEach(player => player.hand.push(deck.pop()));
    }
}

//-------------------------------------
// Game Logic

// Stores which players are playing the round
var playersInRound = [1, 2, 3, 4];
var trumpSuit;
var currentRound = 0;

// Initialized current dealer and player turn
var currentDealer;
var currentPlayerTurn;
var playerStartingHand;

// Function to set a new dealer at the beginning of each round
function setCurrentDealer() {
    currentDealer = playersInRound[currentRound % 4];
    currentPlayerTurn = playersInRound[(currentRound + 1) % 4];
}

// Function to show a player's hand in a list format
function showPlayerHandAsList(playerHand) {
    for (let i = 0; i < playerHand.length; i++) {
        console.log(i, playerHand[i]);
    }
}

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

    do {
        try {
            showPlayerHandAsList(playerHand);
            
            let playerDecision = await getInput("Pick a card to discard (by index): ");
            
            // Convert input to an integer
            playerDecision = parseInt(playerDecision, 10);
            
            // Check if playerDecision is a number and is within the valid range
            if (isNaN(playerDecision) || playerDecision < 0 || playerDecision >= playerHand.length) {
                throw new Error("Invalid input: please enter a valid index.");
            }
            
            // If the input is valid, remove the card and update the player's hand
            playerHand.splice(playerDecision, 1);
            PLAYERS[currentPlayerTurn - 1].hand = playerHand;
            
            // Exit the loop
            break; 
        } catch (error) {
            console.log("An error occurred - try again: ", error.message);
        }
    } while (true);

    // Resets flag variable
    isValidInput = false;
}
// Function to pick trump suit after cards have been dealt
async function pickTrumpSuit() {
    let playerDecision = "";
    playerStartingHand = currentPlayerTurn;
    playedCards.push(deck.pop());
    // Do-while loop ask players to pick up or pass on the up card
    do {
        console.log("\n\n");
        console.log(playedCards);
        console.log("\n");
        console.log(PLAYERS[currentPlayerTurn - 1].hand);
        playerDecision = await getInput(`Player ${currentPlayerTurn}: Pass or Pick Up: `);
        if (playerDecision.trim().toLowerCase() == "pick up") {
            trumpSuit = playedCards[0].suit;
            console.log("Trump Suit: ", trumpSuit);
            await pickUpRevealedCard(playedCards[0], currentPlayerTurn, PLAYERS[currentPlayerTurn - 1].hand);
            return;
        } else {
            rotatePlayerTurn();
        }
    } while (currentPlayerTurn !== playerStartingHand);

    let invalidTrumpSuit = playedCards[0].suit.trim().toLowerCase();
    
    // Do-while loop to ask players to pick a trump suit
    do {
        console.log("\n\n");
        console.log(PLAYERS[currentPlayerTurn - 1].hand);
        while (true) {
            playerDecision = await getInput(`Player ${currentPlayerTurn}: Pick a trump suit or pass: `);
            playerDecision = playerDecision.trim().toLowerCase();
            if (playerDecision == invalidTrumpSuit) {
                console.log("Unable to pick suit of previously revealed card");
            } else {
                break;
            }
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
    } while (currentPlayerTurn !== playerStartingHand);
    console.log("No trump suit selected");
    currentRound++;
    return;
}

// Function to check if a player's hand contains the leading suit
function handContainsLeadingSuit(playerHand, leadingSuit) {
    return playerHand.some(card => card.suit == leadingSuit);
}

// Function to play and score one hand of Euchre
async function startHand() {
    // Stores the leading suit of the hand
    let leadingSuit;
    let selectedCardIndex;
    let selectedCard;
    playedCards = [];
    playerStartingHand = currentPlayerTurn;

    // Prompting player for the card they want to play
    console.log("\n\nStarting Hand...\n\n");

    do {
        // Prompts user for a valid card to play until conditions are met
        while (true) {
            try {
                console.log("Trump Suit: ", trumpSuit);
                console.log("Played Cards: ", playedCards);
                showPlayerHandAsList(PLAYERS[currentPlayerTurn - 1].hand);

                selectedCardIndex = await getInput(`Player ${currentPlayerTurn} Select A Card (by index): `);
                selectedCardIndex = parseInt(selectedCardIndex, 10);

                // Check if playerDecision is a number and is within the valid range
                if (isNaN(selectedCardIndex) || selectedCardIndex < 0 || selectedCardIndex >= PLAYERS[currentPlayerTurn - 1].hand.length) {
                    throw new Error("Invalid input: please enter a valid index.");
                }

                selectedCard = PLAYERS[currentPlayerTurn - 1].hand[selectedCardIndex];
                console.log("\n\n");

                // Logic to check if card played is valid
                if (currentPlayerTurn == playerStartingHand) {
                    leadingSuit = selectedCard.suit;
                    break;
                } else if (selectedCard.suit !== leadingSuit && handContainsLeadingSuit(PLAYERS[currentPlayerTurn - 1].hand, leadingSuit)) {
                    console.log("Must pick a card with the leading suit");
                } else {
                    break;
                }
            } catch (error) {
                console.log("An error occurred - try again: ", error.message);
            }
        }

        // Updating player hand and played cards
        playedCards.push(PLAYERS[currentPlayerTurn - 1].hand[selectedCardIndex]);
        PLAYERS[currentPlayerTurn - 1].hand.splice(selectedCardIndex, 1);

        rotatePlayerTurn();

    } while (currentPlayerTurn !== playerStartingHand);
}


// Function to start a round of Euchre
async function startRound() {
    // Does not start the hand until trump suit has been selected
    do {
        dealCards();
        setCurrentDealer();
        await pickTrumpSuit();
    } while (trumpSuit == null);

    startHand();
}

startRound();

