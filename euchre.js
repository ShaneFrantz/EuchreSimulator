//-------------------------------------
// Deck

// Card suits and values that will be used to create the deck
const suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
const values = ["9", "10", "Jack", "Queen", "King", "Ace"];

// Function to create the deck
function createDeck() {
    const deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
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
const deck = createDeck()
console.log(deck);


