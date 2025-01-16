document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const rollButton = document.getElementById('rollButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const result = document.getElementById('result');
    const pointsDisplay = document.getElementById('points');
    const diceContainer = document.getElementById('diceContainer');
    const scoreTable = document.getElementById('scoreTable').getElementsByTagName('tbody')[0];
    const instructionsDisplay = document.getElementById('instructions');
    
    // Game State
    let playerPoints = 5000;
    let selectedDice = [];
    let rerollsRemaining = 2;
    let currentDiceValues = [];
    const ROLL_COST = 25;

    // Initialize Game
    function initGame() {
        updateInstructions("Click 'Roll Dice' to start. Cost: 25 points per game.");
        updateDisplay();
    }

    // Event Listeners
    rollButton.addEventListener('click', handleRollClick);
    playAgainButton.addEventListener('click', resetGame);

    function handleRollClick() {
        if (rerollsRemaining === 2) {
            startNewGame();
        } else {
            handleReroll();
        }
    }

    // Game Flow Functions
    function startNewGame() {
        if (playerPoints < ROLL_COST) {
            updateResult("Game over. You don't have enough points to play.");
            rollButton.disabled = true;
            return;
        }

        playerPoints -= ROLL_COST;
        rerollsRemaining = 2;
        selectedDice = [];
        currentDiceValues = [];
        updateDisplay();
        rollDice();
    }

    function handleReroll() {
        if (selectedDice.length === 0) {
            updateInstructions("Select up to 2 dice to reroll first!");
            return;
        }

        rerollSelectedDice();
        selectedDice = [];
        rerollsRemaining--;
        
        if (rerollsRemaining === 0) {
            finishTurn();
        } else {
            updateInstructions(`Select up to 2 dice to reroll. Rerolls remaining: ${rerollsRemaining}`);
        }
        
        updateDisplay();
    }

    function finishTurn() {
        rollButton.textContent = "Roll Dice";
        playAgainButton.style.display = 'inline-block';
        updateInstructions("Turn complete! Roll again or start a new game.");
        const finalScore = calculateScore(currentDiceValues);
        updateScoreTable(finalScore.fives);
        awardPoints(finalScore.points);
    }

    // Dice Rolling Functions
    function rollDice() {
        clearDice();
        currentDiceValues = [];
        
        for (let i = 0; i < 7; i++) {
            const value = rollDie();
            currentDiceValues.push(value);
            createDiceElement(value, i);
        }

        animateDiceRoll(() => {
            rollButton.textContent = "Reroll Selected";
            makeAllDiceClickable();
            const score = calculateScore(currentDiceValues);
            updateResult(`You rolled ${score.fives} fives! ${formatPointsMessage(score.points)}`);
            updateInstructions("Select up to 2 dice to reroll, then click 'Reroll Selected'");
        });
    }

    function rollDie() {
        const random = Math.random();
        if (random < 0.15) return 5;  // 15% chance for 5
        return Math.floor(Math.random() * 6) + 1;  // Equal distribution for other numbers
    }

    function rerollSelectedDice() {
        selectedDice.forEach(index => {
            const newValue = rollDie();
            currentDiceValues[index] = newValue;
            updateDiceElement(index, newValue);
        });

        const score = calculateScore(currentDiceValues);
        updateResult(`You rolled ${score.fives} fives! ${formatPointsMessage(score.points)}`);
    }

    // UI Functions
    function createDiceElement(value, index) {
        const diceElement = document.createElement('div');
        diceElement.classList.add('dice');
        diceElement.dataset.index = index;
        diceElement.dataset.value = value;
        diceElement.textContent = value;
        diceContainer.appendChild(diceElement);
    }

    function updateDiceElement(index, value) {
        const diceElement = document.querySelector(`.dice[data-index="${index}"]`);
        if (diceElement) {
            diceElement.textContent = value;
            diceElement.dataset.value = value;
            diceElement.classList.remove('selected');
        }
    }

    function makeAllDiceClickable() {
        const dice = document.querySelectorAll('.dice');
        dice.forEach(die => {
            die.addEventListener('click', toggleDiceSelection);
            die.classList.add('clickable');
        });
    }

    function toggleDiceSelection(event) {
        if (rerollsRemaining === 0) return;
        
        const die = event.target;
        const index = parseInt(die.dataset.index);
        
        if (selectedDice.includes(index)) {
            selectedDice = selectedDice.filter(i => i !== index);
            die.classList.remove('selected');
        } else if (selectedDice.length < 2) {
            selectedDice.push(index);
            die.classList.add('selected');
        }
    }

    // Scoring Functions
    function calculateScore(diceValues) {
        const fives = diceValues.filter(value => value === 5).length;
        const points = calculatePoints(fives);
        return { fives, points };
    }

    function calculatePoints(numberOfFives) {
        const pointsTable = {
            0: -20,
            1: 15,
            2: 5,
            3: 20,
            4: 100,
            5: 500,
            6: 1000,
            7: 5000
        };
        return pointsTable[numberOfFives] || 0;
    }

    function awardPoints(points) {
        playerPoints += points;
        updateDisplay();
    }

    // Update Display Functions
    function updateDisplay() {
        pointsDisplay.textContent = playerPoints;
        rollButton.disabled = playerPoints < ROLL_COST;
    }

    function updateResult(message) {
        result.textContent = message;
    }

    function updateInstructions(message) {
        instructionsDisplay.textContent = message;
    }

    function formatPointsMessage(points) {
        return points >= 0 ? 
            `Points won: ${points}` : 
            `Points lost: ${Math.abs(points)}`;
    }

    // Animation Functions
    function animateDiceRoll(callback) {
        const dice = document.querySelectorAll('.dice');
        dice.forEach(die => die.classList.add('rolling'));
        
        setTimeout(() => {
            dice.forEach(die => die.classList.remove('rolling'));
            if (callback) callback();
        }, 1000);
    }

    // Reset Functions
    function resetGame() {
        playerPoints = 5000;
        rerollsRemaining = 2;
        selectedDice = [];
        currentDiceValues = [];
        rollButton.textContent = "Roll Dice";
        rollButton.disabled = false;
        playAgainButton.style.display = 'none';
        clearDice();
        resetScoreTable();
        updateDisplay();
        updateResult("");
        updateInstructions("Click 'Roll Dice' to start. Cost: 25 points per game.");
    }

    function clearDice() {
        diceContainer.innerHTML = '';
    }

    function resetScoreTable() {
        const rows = scoreTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[1].textContent = '0';
        }
    }

    function updateScoreTable(numberOfFives) {
        const row = scoreTable.rows[numberOfFives];
        const currentFrequency = parseInt(row.cells[1].textContent);
        row.cells[1].textContent = currentFrequency + 1;
    }

    // Initialize game on load
    initGame();
});
