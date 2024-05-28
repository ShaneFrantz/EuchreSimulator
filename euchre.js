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
                suit: suit,
                id: `${value}-${suit}`
            };
            // Adding card to deck
            deck.push(card);
        });
    });
    return deck;
}

// Creating deck
const deck = createDeck();


