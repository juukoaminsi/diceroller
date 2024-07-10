document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const result = document.getElementById('result');
    const pointsDisplay = document.getElementById('points');
    const diceContainer = document.getElementById('diceContainer');
    const scoreTable = document.getElementById('scoreTable').getElementsByTagName('tbody')[0];
    let playerPoints = 5000;

    rollButton.addEventListener('click', () => {
        if (playerPoints < 20) {
            result.textContent = "Game over. You do not have enough points to roll again.";
            return;
        }

        playerPoints -= 20;
        pointsDisplay.textContent = playerPoints;

        rollDice();
    });

    playAgainButton.addEventListener('click', () => {
        resetGame();
    });

    function resetGame() {
        playerPoints = 5000;
        pointsDisplay.textContent = playerPoints;
        result.textContent = "";
        rollButton.style.display = 'inline-block';
        playAgainButton.style.display = 'none';
        clearDice();
        resetScoreTable();
    }

    function clearDice() {
        diceContainer.innerHTML = '';
    }

    function resetScoreTable() {
        const rows = scoreTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[1].textContent = 0;
        }
    }

    function rollDice() {
        clearDice();

        const diceResults = [];

        for (let i = 0; i < 7; i++) {
            const diceValue = rollDie();
            diceResults.push(diceValue);
            const diceElement = document.createElement('div');
            diceElement.classList.add('dice');
            diceElement.textContent = diceValue;
            diceContainer.appendChild(diceElement);
        }

        setTimeout(() => {
            const dice = document.querySelectorAll('.dice');
            dice.forEach(die => {
                die.classList.add('roll');
            });

            setTimeout(() => {
                calculateScore(diceResults);
                playAgainButton.style.display = 'inline-block';
            }, 2000);
        }, 200);
    }

    function rollDie() {
        const randomNumber = Math.random();
        if (randomNumber < 0.15) return 5;     // Adjusted probability for rolling a 5 to 15%
        else return Math.floor(Math.random() * 6) + 1;  // Normal dice roll
    }

    function calculateScore(diceResults) {
        let numberOfFives = 0;

        diceResults.forEach(diceValue => {
            if (diceValue === 5) {
                numberOfFives++;
            }
        });

        updateScoreTable(numberOfFives);
        const pointsWon = calculatePoints(numberOfFives);
        playerPoints += pointsWon;
        pointsDisplay.textContent = playerPoints;

        if (pointsWon >= 0) {
            result.textContent = `You rolled ${numberOfFives} fives! Points won: ${pointsWon}`;
        } else {
            result.textContent = `You rolled ${numberOfFives} fives! Points lost: ${-pointsWon}`;
        }
    }

    function updateScoreTable(numberOfFives) {
        const row = scoreTable.rows[numberOfFives];
        const currentFrequency = parseInt(row.cells[1].textContent);
        row.cells[1].textContent = currentFrequency + 1;
    }

    function calculatePoints(numberOfFives) {
        switch (numberOfFives) {
            case 0:
                return -25; // Adjusted negative points for zero fives
            case 1:
                return 10; // Adjusted positive points for one five
            case 2:
                return 0; // No change for two fives
            case 3:
                return -5; // Adjusted negative points for three fives
            case 4:
                return 50; // Adjusted positive points for four fives
            case 5:
                return 250; // Adjusted positive points for five fives
            case 6:
                return 500; // Adjusted positive points for six fives
            case 7:
                return 5000; // Adjusted very high positive points for seven fives
            default:
                return 0;
        }
    }
});
