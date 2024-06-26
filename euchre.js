//TODO 

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

// Stores the leading suit of the hand
var leadingSuit;

// Booleans to store which teams are going alone
var teamOneAlone = false;
var teamTwoAlone = false;

// Function to return the player to the left of given player
function getPlayerToLeft(currentDealer) {
    // Filters elements greater than the value of the current player
    const playersToLeft = playersInRound.filter(player => player > currentDealer);

    // If player is at the end of the playersInRound array, loops back to the beginning of the array
    if (playersToLeft.length == 0) return playersInRound[0];

    // Otherwise returns value right after player in playersInRound
    return playersToLeft[0];
}


// Function to set a new dealer at the beginning of each round
function setCurrentDealer() {
    currentDealer = playersInRound[currentRound % 4];
    currentPlayerTurn = getPlayerToLeft(currentDealer);
}

// Function to show a player's hand in a list format
function showPlayerHandAsList(playerHand) {
    for (let i = 0; i < playerHand.length; i++) {
        console.log(i, playerHand[i]);
    }
}

// Function to rotate whose turn it is clockwise
function rotatePlayerTurn() {
    currentPlayerTurn = getPlayerToLeft(currentPlayerTurn);
}

// Function to handle picking up the revealed card when picking trump
async function pickUpRevealedCard(card, currentPlayerTurn, playerHand) {
    let playerDecision = "";
    playerHand.push(card);

    do {
        try {
            showPlayerHandAsList(playerHand);
            
            playerDecision = await getInput("Pick a card to discard (by index): ");
            
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

// Function to set which players are going alone and remove their partners from playersInRound
async function determineGoingAlone() {
    let playerDecision = "";
    // Prompting for team 1
    console.log("\n\nTrump Suit: ", trumpSuit);
    console.log("\nPlayer 1 Hand:");
    console.log(player1.hand);
    console.log("\nPlayer 3 Hand:")
    console.log(player3.hand);

    playerDecision = await getInput("\nSelect player (1 or 3) from team 1 to go alone: ");
    if (playerDecision == "1") {
        teamOneAlone = true;
        playersInRound.splice(2, 1);
    } else if (playerDecision == "3") {
        teamOneAlone = true;
        playersInRound.splice(0, 1); 
    }

    // Prompting for team 2
    console.log("\n\nTrump Suit");
    console.log("\nPlayer 2 Hand:");
    console.log(player2.hand);
    console.log("\nPlayer 4 Hand:")
    console.log(player4.hand);

    playerDecision = await getInput("\nSelect player (2 or 4) from team 1 to go alone: ");
    if (playerDecision == "2") {
        teamTwoAlone = true;
        playersInRound.splice(3, 1);
    }
    else if (playerDecision == "4") {
        teamTwoAlone = true;
        playersInRound.splice(1, 1);
    }
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
                return;
            case "diamonds":
                trumpSuit = "Diamonds";
                return;
            case "clubs":
                trumpSuit = "Clubs";
                return;
            case "hearts":
                trumpSuit = "Hearts";
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
function handContainsLeadingSuit(playerHand) {
    return playerHand.some(card => card.suit == leadingSuit);
}

// Function to return the player that won the hand
function determineHandWinner() {
    // Define value order for non-trump and trump suits (excluding bowers for trumpValues)
    const valueOrder = ["9", "10", "Jack", "Queen", "King", "Ace"];
    const trumpValues = ["9", "10", "Q", "K", "A"];

    // Determine left bower suit given trump suit
    let leftBowerSuit;
    switch (trumpSuit) {
        case 'Hearts':
            leftBowerSuit = 'Diamonds';
            break;
        case 'Diamonds':
            leftBowerSuit = 'Hearts';
            break;
        case 'Clubs':
            leftBowerSuit = 'Spades';
            break;
        case 'Spades':
            leftBowerSuit = 'Clubs';
            break;
    }

    // Map each card to a value based on how strong it is (based on trump suit and leading suit)
    const playedCardValues = playedCards.map(card => {
        // Right bower (highest trump card)
        if (card.suit == trumpSuit && card.value == "Jack") return 13;
        // Left bower (second highest trump card)
        else if (card.suit == leftBowerSuit && card.value == 'Jack') return 12;
        // Other trump cards (adding 6 to make sure they have priority over non trump cards)
        else if (card.suit == trumpSuit) return 6 + trumpValues.indexOf(card.value);
        // Leading suit cards
        else if (card.suit == leadingSuit) return valueOrder.indexOf(card.value);
        // All other cards
        else return -1;
    });

    // Variables to track the best card in playedCards and its value
    let bestCardIndex = 0;
    let bestValue = playedCardValues[0];

    // Iterate through playedCardValues to find the highest one
    for (let i = 1; i < playedCards.length; i++) {
        if (playedCardValues[i] > bestValue) {
            bestCardIndex = i;
            bestValue = playedCardValues[i];
        }
    }

    // Rotated player array made to match playedCards with correct players
    let rotatedPlayerArray = playersInRound.slice(playerStartingHand).concat(playersInRound.slice(0, playerStartingHand));

    console.log("Player " + rotatedPlayerArray[bestCardIndex] + " won the hand with the " + playedCards[bestCardIndex].value + " of " + playedCards[bestCardIndex].suit + "!");

    // Return the player who played the best card
    return rotatedPlayerArray[bestCardIndex];

}

// Function to play and score one hand of Euchre
async function startHand() {

    let selectedCardIndex;
    let selectedCard;
    playedCards = [];

    // Reinitializing player turn
    currentPlayerTurn = getPlayerToLeft(currentDealer);
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
                } else if (selectedCard.suit !== leadingSuit && handContainsLeadingSuit(PLAYERS[currentPlayerTurn - 1].hand)) {
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

    determineHandWinner();
}

// Function to start a round of Euchre
async function startRound() {
    // Resetting variables
    teamOneAlone = false;
    teamTwoAlone = false;

    // Adding all players back to round
    playersInRound = [1, 2, 3, 4];

    // Does not start the hand until trump suit has been selected
    do {
        dealCards();
        setCurrentDealer();
        await pickTrumpSuit();
    } while (trumpSuit == null);

    await determineGoingAlone();
    startHand();
}

startRound();

