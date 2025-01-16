document.addEventListener('DOMContentLoaded', () => {
    let points = 5000;
    let selectedDice = [];
    let currentDice = [];
    const COST_TO_PLAY = 100; // Adjusted for fair expected value
    const NUM_DICE = 5;       // Reduced to 5 dice for better win rate
    const REROLLS_ALLOWED = 2;
    let rerollsRemaining = REROLLS_ALLOWED;
    const statistics = Array(6).fill(0); // Track occurrences of 0-5 fives

    // Revised prize structure for ~0 expected value
    const prizes = {
        0: 0,     // No fives: 0 chips
        1: 25,    // One five: 25 chips (small consolation)
        2: 75,    // Two fives: 75 chips
        3: 250,   // Three fives: 250 chips
        4: 1000,  // Four fives: 1000 chips
        5: 5000   // Five fives (jackpot): 5000 chips
    };

    const rollButton = document.getElementById('rollButton');
    const rerollButton = document.createElement('button');
    rerollButton.id = 'rerollButton';
    rerollButton.textContent = 'Reroll Selected (2 remaining)';
    rerollButton.style.display = 'none';
    rollButton.parentNode.appendChild(rerollButton);
    
    const playAgainButton = document.getElementById('playAgainButton');
    const pointsDisplay = document.getElementById('points');
    const diceContainer = document.getElementById('diceContainer');
    const resultDisplay = document.getElementById('result');
    const instructions = document.getElementById('instructions');

    function updatePoints(newPoints) {
        points = newPoints;
        pointsDisplay.textContent = points;
        if (points < COST_TO_PLAY) {
            rollButton.disabled = true;
            instructions.textContent = "Game Over! You're out of chips!";
            playAgainButton.style.display = 'inline-block';
        }
    }

    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function createDiceElements(isInitialRoll = true) {
        if (isInitialRoll) {
            diceContainer.innerHTML = '';
            currentDice = Array(NUM_DICE).fill(0).map(() => rollDie());
            selectedDice = Array(NUM_DICE).fill(false);
            rerollsRemaining = REROLLS_ALLOWED;
        } else {
            // Only reroll selected dice
            selectedDice.forEach((isSelected, index) => {
                if (isSelected) {
                    currentDice[index] = rollDie();
                }
            });
        }
        
        diceContainer.innerHTML = '';
        currentDice.forEach((value, index) => {
            const die = document.createElement('div');
            die.className = 'dice' + (selectedDice[index] ? ' selected' : '');
            die.dataset.index = index;
            die.textContent = value;
            
            if (value === 5) {
                die.style.color = '#ffd700';
                die.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
            }
            
            die.addEventListener('click', () => {
                if (rerollsRemaining > 0) {
                    selectedDice[index] = !selectedDice[index];
                    die.classList.toggle('selected');
                }
            });
            
            diceContainer.appendChild(die);
        });
        
        rerollButton.textContent = `Reroll Selected (${rerollsRemaining} remaining)`;
        rerollButton.style.display = rerollsRemaining > 0 ? 'inline-block' : 'none';
    }

    function countFives() {
        return currentDice.filter(value => value === 5).length;
    }

    function updateStatistics(numFives) {
        statistics[numFives]++;
        const tbody = document.querySelector('#scoreTable tbody');
        tbody.innerHTML = '';
        
        statistics.forEach((count, index) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = index;
            row.insertCell().textContent = count;
            row.insertCell().textContent = prizes[index];
        });
    }

    rollButton.addEventListener('click', () => {
        if (points >= COST_TO_PLAY) {
            updatePoints(points - COST_TO_PLAY);
            createDiceElements(true);
            rerollButton.style.display = 'inline-block';
            rollButton.disabled = true;
            instructions.textContent = "Select dice to reroll (click dice to select)";
        }
    });

    rerollButton.addEventListener('click', () => {
        if (rerollsRemaining > 0) {
            createDiceElements(false);
            rerollsRemaining--;
            
            if (rerollsRemaining === 0) {
                const numFives = countFives();
                const prize = prizes[numFives];
                updateStatistics(numFives);
                
                if (prize > 0) {
                    updatePoints(points + prize);
                    resultDisplay.textContent = `Congratulations! You got ${numFives} fives and won ${prize} chips!`;
                    resultDisplay.style.color = '#ffd700';
                } else {
                    resultDisplay.textContent = `You got ${numFives} fives. Better luck next time!`;
                    resultDisplay.style.color = '#fff';
                }
                
                rollButton.disabled = false;
                rerollButton.style.display = 'none';
                instructions.textContent = "Roll again to try your luck!";
            }
        }
    });

    playAgainButton.addEventListener('click', () => {
        points = 5000;
        statistics.fill(0);
        updatePoints(points);
        resultDisplay.textContent = '';
        diceContainer.innerHTML = '';
        rollButton.disabled = false;
        rerollButton.style.display = 'none';
        playAgainButton.style.display = 'none';
        instructions.textContent = "Welcome back! Click 'Roll Dice' to test your luck.";
        updateStatistics(0);
    });
});
