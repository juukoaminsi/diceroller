document.addEventListener('DOMContentLoaded', () => {
    let points = 5000;
    let selectedDice = [];
    let currentDice = [];
    const COST_TO_PLAY = 25;
    const NUM_DICE = 7;
    const statistics = Array(8).fill(0); // Track occurrences of 0-7 fives

    // Prize structure - carefully balanced for ~0 expected value
    const prizes = {
        0: 0,    // No fives: 0 chips
        1: 0,    // One five: 0 chips
        2: 20,   // Two fives: 20 chips (small consolation)
        3: 50,   // Three fives: 50 chips
        4: 150,  // Four fives: 150 chips
        5: 500,  // Five fives: 500 chips
        6: 2000, // Six fives: 2000 chips
        7: 5000  // Seven fives (jackpot): 5000 chips
    };

    const rollButton = document.getElementById('rollButton');
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

    function createDiceElements() {
        diceContainer.innerHTML = '';
        currentDice = Array(NUM_DICE).fill(0).map(() => rollDie());
        
        currentDice.forEach((value, index) => {
            const die = document.createElement('div');
            die.className = 'dice rolling';
            die.dataset.index = index;
            diceContainer.appendChild(die);
            
            // Animated roll effect
            setTimeout(() => {
                die.className = 'dice';
                die.textContent = value;
                
                // Make fives special
                if (value === 5) {
                    die.style.color = '#ffd700';
                    die.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                }
            }, 500);
        });
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
        });
    }

    rollButton.addEventListener('click', () => {
        if (points >= COST_TO_PLAY) {
            updatePoints(points - COST_TO_PLAY);
            createDiceElements();
            
            setTimeout(() => {
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
                
                instructions.textContent = "Roll again to try your luck!";
            }, 600);
        }
    });

    playAgainButton.addEventListener('click', () => {
        points = 5000;
        statistics.fill(0);
        updatePoints(points);
        resultDisplay.textContent = '';
        diceContainer.innerHTML = '';
        rollButton.disabled = false;
        playAgainButton.style.display = 'none';
        instructions.textContent = "Welcome back! Click 'Roll Dice' to test your luck.";
        updateStatistics(0);
    });
});
