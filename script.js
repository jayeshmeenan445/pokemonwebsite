let allPokemon = [];
let currentSuggestions = [];

// Fetch all Pokemon names when the page loads
async function fetchAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        allPokemon = data.results.map(pokemon => pokemon.name);
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
    }
}

// Show suggestions based on input
function showSuggestions(input) {
    const suggestionsContainer = document.getElementById('suggestions');
    const inputValue = input.toLowerCase();
    
    if (inputValue.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Filter Pokemon names that match the input
    currentSuggestions = allPokemon.filter(name => 
        name.toLowerCase().includes(inputValue)
    ).slice(0, 5); // Show only 5 suggestions

    if (currentSuggestions.length > 0) {
        suggestionsContainer.innerHTML = currentSuggestions
            .map(name => `<div class="suggestion-item">${name}</div>`)
            .join('');
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Handle suggestion click
function handleSuggestionClick(event) {
    if (event.target.classList.contains('suggestion-item')) {
        const selectedName = event.target.textContent;
        document.getElementById('pokemonInput').value = selectedName;
        document.getElementById('suggestions').style.display = 'none';
        searchPokemon();
    }
}

async function searchPokemon() {
    const pokemonInput = document.getElementById('pokemonInput').value.toLowerCase();
    const pokemonCard = document.getElementById('pokemonCard');
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        
        const data = await response.json();
        
        // Update Pokemon image
        document.getElementById('pokemonImage').src = data.sprites.front_default;
        
        // Update Pokemon name
        document.getElementById('pokemonName').textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        
        // Update Pokemon type
        const types = data.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1));
        document.getElementById('pokemonType').textContent = types.join(', ');
        
        // Update Pokemon height and weight
        document.getElementById('pokemonHeight').textContent = `${data.height / 10}m`;
        document.getElementById('pokemonWeight').textContent = `${data.weight / 10}kg`;
        
        // Update Pokemon abilities
        const abilities = data.abilities.map(ability => 
            ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
        );
        document.getElementById('pokemonAbilities').textContent = abilities.join(', ');
        
        // Show the card
        pokemonCard.style.display = 'block';
        
    } catch (error) {
        alert('Pokemon not found! Please try another name.');
        pokemonCard.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchAllPokemon();
    document.getElementById('suggestions').addEventListener('click', handleSuggestionClick);
});

document.getElementById('pokemonInput').addEventListener('input', (event) => {
    showSuggestions(event.target.value);
});

document.getElementById('pokemonInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (event) => {
    const suggestions = document.getElementById('suggestions');
    const input = document.getElementById('pokemonInput');
    
    if (!input.contains(event.target) && !suggestions.contains(event.target)) {
        suggestions.style.display = 'none';
    }
}); 