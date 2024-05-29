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

const players = [player1, player2, player3, player4];

//-------------------------------------
// Deck

// Card suits and values that will be used to create the deck
const CARD_SUITS = ["Spades", "Diamonds", "Clubs", "Hearts"];
const CARD_VALUES = ["9", "10", "Jack", "Queen", "King", "Ace"];

// Function to create the deck
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
    return deck;
}

// Function to shuffle deck in a true random manner
// Uses Fisher-Yates for O(N) time complexity
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        // Random number from 0 to i inclusive
        let j = Math.floor(Math.random() * (i + 1));

        // Swap arr[i] with element of random index
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Initializes deck variable
const deck = createDeck();
console.log(deck);

