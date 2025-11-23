// Kids Friendly Biodegradable Games JavaScript

// Biodegradable and Non-Biodegradable Waste Data
const biodegradableItems = [
    { name: 'Apple Core', emoji: '🍎', type: 'biodegradable' },
    { name: 'Banana Peel', emoji: '🍌', type: 'biodegradable' },
    { name: 'Orange', emoji: '🍊', type: 'biodegradable' },
    { name: 'Leaves', emoji: '🍃', type: 'biodegradable' },
    { name: 'Paper', emoji: '📄', type: 'biodegradable' },
    { name: 'Cardboard', emoji: '📦', type: 'biodegradable' },
    { name: 'Wood', emoji: '🪵', type: 'biodegradable' },
    { name: 'Eggshell', emoji: '🥚', type: 'biodegradable' },
    { name: 'Grass', emoji: '🌱', type: 'biodegradable' },
    { name: 'Flowers', emoji: '🌻', type: 'biodegradable' }
];

const nonBiodegradableItems = [
    { name: 'Plastic Bottle', emoji: '🍶', type: 'non-biodegradable' },
    { name: 'Battery', emoji: '🔋', type: 'non-biodegradable' },
    { name: 'Phone', emoji: '📱', type: 'non-biodegradable' },
    { name: 'Can', emoji: '🥫', type: 'non-biodegradable' },
    { name: 'Glass', emoji: '🪞', type: 'non-biodegradable' },
    { name: 'Styrofoam', emoji: '☁️', type: 'non-biodegradable' },
    { name: 'Plastic Bag', emoji: '🛍️', type: 'non-biodegradable' },
    { name: 'Aluminum', emoji: '🔧', type: 'non-biodegradable' },
    { name: 'Electronics', emoji: '💻', type: 'non-biodegradable' },
    { name: 'Rubber', emoji: '🎈', type: 'non-biodegradable' }
];

// Game state
let currentGame = null;
let gameTimer = null;
let gamePoints = 0;
let gameTimeLeft = 0;
let gameEnded = false;

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGameButtons();
    createGameContainers();
});

function initializeGameButtons() {
    // Biodegradable Sorting Game
    const sortingBtn = document.getElementById('biodegradable-sorting-btn');
    if (sortingBtn) {
        sortingBtn.addEventListener('click', startBiodegradableSorting);
    }

    // Waste Matching Game
    const matchingBtn = document.getElementById('waste-matching-btn');
    if (matchingBtn) {
        matchingBtn.addEventListener('click', startWasteMatching);
    }

    // Waste Spelling Game
    const spellingBtn = document.getElementById('waste-spelling-btn');
    if (spellingBtn) {
        spellingBtn.addEventListener('click', startWasteSpelling);
    }

    // Waste Puzzle Game
    const puzzleBtn = document.getElementById('waste-puzzle-btn');
    if (puzzleBtn) {
        puzzleBtn.addEventListener('click', startWastePuzzle);
    }

    // Waste Memory Game
    const memoryBtn = document.getElementById('waste-memory-btn');
    if (memoryBtn) {
        memoryBtn.addEventListener('click', startWasteMemory);
    }
}

function createGameContainers() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    // Create game containers
    gameContainer.innerHTML = `
        <div id="biodegradable-sorting-game" class="game-content">
            <div class="game-header">
                <h2>🌈 Biodegradable Sorting Game 🌱</h2>
                <div class="game-info">
                    <p>Drag and drop items into the correct bins!</p>
                    <div class="game-stats">
                        <span>Points: <span id="sorting-points">0</span></span>
                        <span>Time: <span id="sorting-time">60</span>s</span>
                    </div>
                </div>
            </div>
            <div class="sorting-area">
                <div class="items-area" id="sorting-items"></div>
                <div class="bins-area">
                    <div class="bin biodegradable-bin" data-type="biodegradable">
                        <h3>🌱 Biodegradable</h3>
                        <div class="bin-content"></div>
                    </div>
                    <div class="bin non-biodegradable-bin" data-type="non-biodegradable">
                        <h3>🔧 Non-Biodegradable</h3>
                        <div class="bin-content"></div>
                    </div>
                </div>
            </div>
            <button class="rainbow-btn" onclick="endBiodegradableSorting()">End Game</button>
        </div>

        <div id="waste-matching-game" class="game-content">
            <div class="game-header">
                <h2>🎯 Waste Matching Game 🎪</h2>
                <div class="game-info">
                    <p>Match waste items with their correct disposal method!</p>
                    <div class="game-stats">
                        <span>Points: <span id="matching-points">0</span></span>
                        <span>Time: <span id="matching-time">60</span>s</span>
                    </div>
                </div>
            </div>
            <div class="matching-area" id="matching-area"></div>
            <button class="rainbow-btn" onclick="endWasteMatching()">End Game</button>
        </div>

        <div id="waste-spelling-game" class="game-content">
            <div class="game-header">
                <h2>✏️ Waste Word Spelling 📚</h2>
                <div class="game-info">
                    <p>Spell the waste disposal words correctly!</p>
                    <div class="game-stats">
                        <span>Points: <span id="spelling-points">0</span></span>
                        <span>Time: <span id="spelling-time">60</span>s</span>
                    </div>
                </div>
            </div>
            <div class="spelling-area">
                <div class="word-display" id="spelling-word"></div>
                <div class="letter-input-area" id="letter-input"></div>
                <div class="message" id="spelling-message"></div>
            </div>
            <button class="rainbow-btn" onclick="endWasteSpelling()">End Game</button>
        </div>

        <div id="waste-puzzle-game" class="game-content">
            <div class="game-header">
                <h2>🧩 Waste Disposal Puzzle 🌍</h2>
                <div class="game-info">
                    <p>Solve puzzles about proper waste disposal!</p>
                    <div class="game-stats">
                        <span>Points: <span id="puzzle-points">0</span></span>
                        <span>Time: <span id="puzzle-time">60</span>s</span>
                    </div>
                </div>
            </div>
            <div class="puzzle-area" id="puzzle-area"></div>
            <button class="rainbow-btn" onclick="endWastePuzzle()">End Game</button>
        </div>

        <div id="waste-memory-game" class="game-content">
            <div class="game-header">
                <h2>🧠 Waste Memory Game 🎮</h2>
                <div class="game-info">
                    <p>Match waste cards with their disposal methods!</p>
                    <div class="game-stats">
                        <span>Points: <span id="memory-points">0</span></span>
                        <span>Time: <span id="memory-time">60</span>s</span>
                    </div>
                </div>
            </div>
            <div class="memory-area" id="memory-area"></div>
            <button class="rainbow-btn" onclick="endWasteMemory()">End Game</button>
        </div>
    `;
}

// Biodegradable Sorting Game Functions
function startBiodegradableSorting() {
    hideAllGames();
    document.getElementById('biodegradable-sorting-game').style.display = 'block';
    
    gamePoints = 0;
    gameTimeLeft = 60;
    currentGame = 'sorting';
    gameEnded = false;
    
    updateGameDisplay('sorting');
    generateSortingItems();
    startGameTimer('sorting');
    initializeDragAndDrop();
}

function generateSortingItems() {
    const itemsArea = document.getElementById('sorting-items');
    if (!itemsArea) return;
    
    itemsArea.innerHTML = '';
    
    // Mix biodegradable and non-biodegradable items
    const allItems = [...biodegradableItems, ...nonBiodegradableItems];
    const shuffled = allItems.sort(() => Math.random() - 0.5).slice(0, 10);
    
    shuffled.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'waste-item';
        itemElement.draggable = true;
        itemElement.dataset.type = item.type;
        itemElement.innerHTML = `
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
        `;
        itemsArea.appendChild(itemElement);
    });
}

function initializeDragAndDrop() {
    const items = document.querySelectorAll('.waste-item');
    const bins = document.querySelectorAll('.bin');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    bins.forEach(bin => {
        bin.addEventListener('dragover', handleDragOver);
        bin.addEventListener('drop', handleDrop);
        bin.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.style.opacity = '';
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const itemType = e.dataTransfer.getData('text/plain');
    const binType = e.currentTarget.dataset.type;
    
    // Find the dragged element
    const draggedElement = document.querySelector('.dragging');
    
    if (draggedElement && itemType === binType) {
        gamePoints += 10;
        showSuccessMessage('Correct! +10 points 🎉');
        draggedElement.remove();
        
        updateGameDisplay('sorting');
        checkSortingComplete();
    } else if (draggedElement) {
        showErrorMessage('Try again! That\'s not the right bin 🤔');
    }
}

function checkSortingComplete() {
    const remainingItems = document.querySelectorAll('.waste-item');
    if (remainingItems.length === 0 && !gameEnded) {
        gameEnded = true;
        clearInterval(gameTimer);
        showSuccessMessage('🎉 All items sorted! Game Complete! Final Score: ' + gamePoints);
        setTimeout(() => {
            hideAllGames();
        }, 3000);
    }
}

// Waste Matching Game Functions
function startWasteMatching() {
    hideAllGames();
    document.getElementById('waste-matching-game').style.display = 'block';
    
    gamePoints = 0;
    gameTimeLeft = 60;
    currentGame = 'matching';
    gameEnded = false;
    
    updateGameDisplay('matching');
    generateMatchingCards();
    startGameTimer('matching');
}

function generateMatchingCards() {
    const matchingArea = document.getElementById('matching-area');
    if (!matchingArea) return;
    
    matchingArea.innerHTML = '';
    
    const matches = [
        { item: '🍎 Apple Core', method: '🌱 Compost Bin' },
        { item: '🍶 Plastic Bottle', method: '♻️ Recycling Bin' },
        { item: '🥫 Metal Can', method: '♻️ Recycling Bin' },
        { item: '🍃 Leaves', method: '🌱 Compost Bin' },
        { item: '🔋 Battery', method: '⚠️ Special Disposal' },
        { item: '📄 Paper', method: '♻️ Recycling Bin' }
    ];
    
    const cards = [];
    matches.forEach((match, index) => {
        cards.push({ id: `item-${index}`, content: match.item, pair: `method-${index}` });
        cards.push({ id: `method-${index}`, content: match.method, pair: `item-${index}` });
    });
    
    const shuffled = cards.sort(() => Math.random() - 0.5);
    
    shuffled.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'matching-card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.pair = card.pair;
        cardElement.innerHTML = card.content;
        cardElement.addEventListener('click', handleCardClick);
        matchingArea.appendChild(cardElement);
    });
}

let selectedCards = [];
function handleCardClick(e) {
    if (gameEnded) return;
    
    const card = e.currentTarget;
    
    if (card.classList.contains('matched') || selectedCards.includes(card)) {
        return;
    }
    
    card.classList.add('selected');
    selectedCards.push(card);
    
    if (selectedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;
    
    if (card1.dataset.pair === card2.dataset.id) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        gamePoints += 15;
        showSuccessMessage('Perfect match! +15 points 🎊');
        
        selectedCards = [];
        updateGameDisplay('matching');
        checkMatchingComplete();
    } else {
        setTimeout(() => {
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            selectedCards = [];
            showErrorMessage('Not a match, try again! 🤔');
        }, 1000);
    }
}

function checkMatchingComplete() {
    const matchedCards = document.querySelectorAll('.matching-card.matched');
    if (matchedCards.length === 12 && !gameEnded) {
        gameEnded = true;
        clearInterval(gameTimer);
        showSuccessMessage('🎉 All pairs matched! Game Complete! Final Score: ' + gamePoints);
        setTimeout(() => {
            hideAllGames();
        }, 3000);
    }
}

// Waste Spelling Game Functions
function startWasteSpelling() {
    hideAllGames();
    document.getElementById('waste-spelling-game').style.display = 'block';
    
    gamePoints = 0;
    gameTimeLeft = 60;
    currentGame = 'spelling';
    gameEnded = false;
    
    updateGameDisplay('spelling');
    nextSpellingWord();
    startGameTimer('spelling');
}

const spellingWords = [
    { word: 'RECYCLE', hint: 'Turn waste into new materials', emoji: '♻️' },
    { word: 'COMPOST', hint: 'Decompose organic waste', emoji: '🌱' },
    { word: 'BIODEGRADABLE', hint: 'Can break down naturally', emoji: '🍃' },
    { word: 'DISPOSAL', hint: 'Getting rid of waste', emoji: '🗑️' },
    { word: 'ENVIRONMENT', hint: 'Our natural surroundings', emoji: '🌍' }
];

let currentSpellingWord = null;
let currentSpellingIndex = 0;

function nextSpellingWord() {
    if (gameEnded) return;
    
    if (currentSpellingIndex >= spellingWords.length) {
        currentSpellingIndex = 0;
    }
    
    currentSpellingWord = spellingWords[currentSpellingIndex];
    displaySpellingWord();
    currentSpellingIndex++;
}

function displaySpellingWord() {
    const wordDisplay = document.getElementById('spelling-word');
    const letterInput = document.getElementById('letter-input');
    
    if (!wordDisplay || !letterInput) return;
    
    wordDisplay.innerHTML = `
        <div class="hint">${currentSpellingWord.emoji} ${currentSpellingWord.hint}</div>
        <div class="word-slots">
            ${currentSpellingWord.word.split('').map(() => '<div class="letter-slot"></div>').join('')}
        </div>
    `;
    
    letterInput.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-btn';
        button.textContent = letter;
        button.onclick = () => addLetter(letter);
        letterInput.appendChild(button);
    });
}

let spelledLetters = [];
function addLetter(letter) {
    if (gameEnded) return;
    
    if (spelledLetters.length < currentSpellingWord.word.length) {
        spelledLetters.push(letter);
        updateSpellingDisplay();
        
        if (spelledLetters.length === currentSpellingWord.word.length) {
            checkSpelling();
        }
    }
}

function updateSpellingDisplay() {
    const slots = document.querySelectorAll('.letter-slot');
    spelledLetters.forEach((letter, index) => {
        if (slots[index]) {
            slots[index].textContent = letter;
        }
    });
}

function checkSpelling() {
    const spelled = spelledLetters.join('');
    if (spelled === currentSpellingWord.word) {
        gamePoints += 20;
        showSuccessMessage('Excellent spelling! +20 points ✨');
        spelledLetters = [];
        setTimeout(nextSpellingWord, 2000);
    } else {
        showErrorMessage('Not quite right, try again! 🤔');
        spelledLetters = [];
        updateSpellingDisplay();
    }
    updateGameDisplay('spelling');
}

// Waste Puzzle Game Functions
function startWastePuzzle() {
    hideAllGames();
    document.getElementById('waste-puzzle-game').style.display = 'block';
    
    gamePoints = 0;
    gameTimeLeft = 60;
    currentGame = 'puzzle';
    gameEnded = false;
    
    updateGameDisplay('puzzle');
    generatePuzzle();
    startGameTimer('puzzle');
}

const puzzles = [
    {
        question: 'Which of these is biodegradable?',
        options: ['Plastic Bottle', 'Apple Core', 'Battery', 'Glass Jar'],
        correct: 1
    },
    {
        question: 'Where should you put cardboard?',
        options: ['Trash', 'Compost', 'Recycling', 'Special Disposal'],
        correct: 2
    },
    {
        question: 'What does biodegradable mean?',
        options: ['Can be burned', 'Can break down naturally', 'Can be eaten', 'Can be reused'],
        correct: 1
    },
    {
        question: 'Which item goes in the compost bin?',
        options: ['Plastic bag', 'Banana peel', 'Metal can', 'Glass bottle'],
        correct: 1
    },
    {
        question: 'What should you do with batteries?',
        options: ['Throw in trash', 'Recycle normally', 'Special disposal', 'Compost them'],
        correct: 2
    }
];

let currentPuzzleIndex = 0;

function generatePuzzle() {
    if (gameEnded) return;
    
    const puzzleArea = document.getElementById('puzzle-area');
    if (!puzzleArea) return;
    
    const puzzle = puzzles[currentPuzzleIndex];
    
    puzzleArea.innerHTML = `
        <div class="puzzle-question">
            <h3>${puzzle.question}</h3>
        </div>
        <div class="puzzle-options">
            ${puzzle.options.map((option, index) => `
                <button class="puzzle-option" onclick="checkPuzzleAnswer(${index})">
                    ${option}
                </button>
            `).join('')}
        </div>
    `;
}

function checkPuzzleAnswer(selectedIndex) {
    if (gameEnded) return;
    
    const puzzle = puzzles[currentPuzzleIndex];
    
    if (selectedIndex === puzzle.correct) {
        gamePoints += 25;
        showSuccessMessage('Correct answer! +25 points 🎯');
        currentPuzzleIndex++;
        if (currentPuzzleIndex >= puzzles.length) {
            currentPuzzleIndex = 0;
        }
        setTimeout(generatePuzzle, 1500);
    } else {
        showErrorMessage('Wrong answer, try another option! 🤔');
    }
    
    updateGameDisplay('puzzle');
}

// Waste Memory Game Functions
function startWasteMemory() {
    hideAllGames();
    document.getElementById('waste-memory-game').style.display = 'block';
    
    gamePoints = 0;
    gameTimeLeft = 60;
    currentGame = 'memory';
    gameEnded = false;
    
    updateGameDisplay('memory');
    generateMemoryCards();
    startGameTimer('memory');
}

function generateMemoryCards() {
    const memoryArea = document.getElementById('memory-area');
    if (!memoryArea) return;
    
    memoryArea.innerHTML = '';
    
    const memoryPairs = [
        { front: '🍎', back: 'Biodegradable' },
        { front: '🍶', back: 'Recyclable' },
        { front: '🍃', back: 'Compostable' },
        { front: '🔋', back: 'Special Disposal' },
        { front: '🥫', back: 'Recyclable' },
        { front: '📄', back: 'Biodegradable' }
    ];
    
    const cards = [];
    memoryPairs.forEach((pair, index) => {
        cards.push({ id: `front-${index}`, content: pair.front, pair: `back-${index}`, type: 'front' });
        cards.push({ id: `back-${index}`, content: pair.back, pair: `front-${index}`, type: 'back' });
    });
    
    const shuffled = cards.sort(() => Math.random() - 0.5);
    
    shuffled.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.pair = card.pair;
        cardElement.innerHTML = `<div class="card-inner">${card.content}</div>`;
        cardElement.addEventListener('click', handleMemoryCardClick);
        memoryArea.appendChild(cardElement);
    });
}

let flippedMemoryCards = [];
function handleMemoryCardClick(e) {
    if (gameEnded) return;
    
    const card = e.currentTarget;
    
    if (card.classList.contains('matched') || card.classList.contains('flipped') || flippedMemoryCards.includes(card)) {
        return;
    }
    
    card.classList.add('flipped');
    flippedMemoryCards.push(card);
    
    if (flippedMemoryCards.length === 2) {
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedMemoryCards;
    
    if (card1.dataset.pair === card2.dataset.id) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        gamePoints += 30;
        showSuccessMessage('Memory match! +30 points 🧠');
        flippedMemoryCards = [];
        updateGameDisplay('memory');
        checkMemoryComplete();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedMemoryCards = [];
        }, 1500);
    }
}

function checkMemoryComplete() {
    const matchedCards = document.querySelectorAll('.memory-card.matched');
    if (matchedCards.length === 12 && !gameEnded) {
        gameEnded = true;
        clearInterval(gameTimer);
        showSuccessMessage('🎉 All pairs found! Game Complete! Final Score: ' + gamePoints);
        setTimeout(() => {
            hideAllGames();
        }, 3000);
    }
}

// Utility Functions
function hideAllGames() {
    const gameContents = document.querySelectorAll('.game-content');
    gameContents.forEach(game => {
        game.style.display = 'none';
    });
    const gamesGrid = document.querySelector('.games-grid');
    if (gamesGrid) {
        gamesGrid.style.display = 'grid';
    }
}

function startGameTimer(gameType) {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    gameTimer = setInterval(() => {
        if (gameEnded) {
            clearInterval(gameTimer);
            return;
        }
        
        gameTimeLeft--;
        const timeElement = document.getElementById(`${gameType}-time`);
        if (timeElement) {
            timeElement.textContent = gameTimeLeft;
        }
        
        if (gameTimeLeft <= 0) {
            endGame(gameType);
        }
    }, 1000);
}

function updateGameDisplay(gameType) {
    const pointsElement = document.getElementById(`${gameType}-points`);
    const timeElement = document.getElementById(`${gameType}-time`);
    
    if (pointsElement) {
        pointsElement.textContent = gamePoints;
    }
    if (timeElement) {
        timeElement.textContent = gameTimeLeft;
    }
}

let lastMessageTime = 0;
let lastMessage = '';

function showSuccessMessage(message) {
    const now = Date.now();
    if (message === lastMessage && (now - lastMessageTime) < 2000) {
        return; // Prevent duplicate messages within 2 seconds
    }
    
    lastMessage = message;
    lastMessageTime = now;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    const now = Date.now();
    if (message === lastMessage && (now - lastMessageTime) < 2000) {
        return; // Prevent duplicate messages within 2 seconds
    }
    
    lastMessage = message;
    lastMessageTime = now;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function endGame(gameType) {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`⏰ Time's up! Final Score: ${gamePoints} points! 🏆`);
    
    // Dispatch game completion event for task system
    dispatchGameCompletionEvent(gameType, gamePoints);
    
    setTimeout(() => {
        hideAllGames();
    }, 3000);
}

// Dispatch game completion event for home task system
function dispatchGameCompletionEvent(gameType, score) {
    // Map game types to proper names
    const gameTypeMap = {
        'sorting': 'sorting',
        'biodegradable-sorting': 'sorting',
        'matching': 'matching',
        'waste-matching': 'matching',
        'spelling': 'spelling',
        'waste-spelling': 'spelling',
        'puzzle': 'puzzle',
        'waste-puzzle': 'puzzle',
        'memory': 'memory',
        'waste-memory': 'memory'
    };
    
    const normalizedGameType = gameTypeMap[gameType] || gameType;
    
    // Calculate accuracy based on points (max points per game varies)
    let accuracy = 100;
    let mistakes = 0;
    
    // Estimate accuracy based on score (this is simplified)
    if (normalizedGameType === 'sorting') {
        accuracy = Math.min(100, (score / 50) * 100);
        mistakes = Math.max(0, 10 - Math.floor(score / 10));
    } else if (normalizedGameType === 'matching') {
        accuracy = Math.min(100, (score / 60) * 100);
        mistakes = Math.max(0, 8 - Math.floor(score / 15));
    } else if (normalizedGameType === 'spelling') {
        accuracy = Math.min(100, (score / 40) * 100);
        mistakes = Math.max(0, 6 - Math.floor(score / 20));
    } else if (normalizedGameType === 'memory') {
        accuracy = Math.min(100, (score / 90) * 100);
        mistakes = Math.max(0, 12 - Math.floor(score / 30));
    }
    
    // Save game score to localStorage for total points tracking
    let gameScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    if (!gameScores[normalizedGameType]) {
        gameScores[normalizedGameType] = { points: 0, bestScore: 0, gamesPlayed: 0 };
    }
    gameScores[normalizedGameType].points += score;
    gameScores[normalizedGameType].bestScore = Math.max(gameScores[normalizedGameType].bestScore, score);
    gameScores[normalizedGameType].gamesPlayed += 1;
    gameScores[normalizedGameType].difficulty = 'easy';
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    // Dispatch the event
    window.dispatchEvent(new CustomEvent('gameCompleted', {
        detail: {
            type: normalizedGameType,
            score: score,
            difficulty: 'easy', // Default difficulty, can be enhanced
            mistakes: mistakes,
            accuracy: Math.round(accuracy),
            timestamp: Date.now()
        }
    }));
}

// End game functions
function endBiodegradableSorting() {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`Sorting Game Complete! You scored ${gamePoints} points! 🌱`);
    setTimeout(hideAllGames, 3000);
}

function endWasteMatching() {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`Matching Game Complete! You scored ${gamePoints} points! 🎯`);
    setTimeout(hideAllGames, 3000);
}

function endWasteSpelling() {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`Spelling Game Complete! You scored ${gamePoints} points! ✏️`);
    setTimeout(hideAllGames, 3000);
}

function endWastePuzzle() {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`Puzzle Game Complete! You scored ${gamePoints} points! 🧩`);
    setTimeout(hideAllGames, 3000);
}

function endWasteMemory() {
    if (gameEnded) return;
    
    gameEnded = true;
    clearInterval(gameTimer);
    showSuccessMessage(`Memory Game Complete! You scored ${gamePoints} points! 🧠`);
    setTimeout(hideAllGames, 3000);
}