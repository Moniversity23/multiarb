document.getElementById('calculate').addEventListener('click', function () {
    const games = document.querySelectorAll('.game');
    const totalStake = parseFloat(document.getElementById('totalStake').value);

    if (isNaN(totalStake) || totalStake <= 0) {
        alert("Please enter a valid total stake.");
        return;
    }

    const odds = [];
    const gameNames = [];
    games.forEach(game => {
        const name = game.querySelector('.name').value.trim();
        const home = parseFloat(game.querySelector('.home').value);
        const draw = parseFloat(game.querySelector('.draw').value);
        const away = parseFloat(game.querySelector('.away').value);

        if (!name) {
            alert("Please enter a valid game name.");
            return;
        }
        if (isNaN(home) || isNaN(draw) || isNaN(away)) {
            alert("Please enter valid odds for all games.");
            return;
        }

        odds.push({ Home: home, Draw: draw, Away: away });
        gameNames.push(name);
    });

    // Generate all combinations
    const outcomes = ["Home", "Draw", "Away"];
    const combinations = outcomes.flatMap(o1 =>
        outcomes.flatMap(o2 =>
            outcomes.map(o3 => [o1, o2, o3])
        )
    );

    let stakes = [];
    let payouts = [];
    combinations.forEach(combo => {
        const comboOdds = odds[0][combo[0]] * odds[1][combo[1]] * odds[2][combo[2]];
        stakes.push(1 / comboOdds);
        payouts.push(comboOdds);
    });

    // Normalize stakes
    const totalInverseOdds = stakes.reduce((a, b) => a + b, 0);
    const normalizedStakes = stakes.map(stake => (stake / totalInverseOdds) * totalStake);
    const potentialPayouts = normalizedStakes.map((stake, i) => stake * payouts[i]);

    // Find the best payout
    const maxPayout = Math.max(...potentialPayouts);

    // Display results
    const results = document.getElementById('results');
    results.innerHTML = "";
    combinations.forEach((combo, i) => {
        const combinationNames = combo.map((outcome, idx) => `${gameNames[idx]} (${outcome})`);
        const div = document.createElement('div');
        div.className = "result-item";
        if (potentialPayouts[i] === maxPayout) div.classList.add('highlight');
        div.innerHTML = `
            <strong>Combination:</strong> ${combinationNames.join(", ")}<br>
            <strong>Stake:</strong> ₦${normalizedStakes[i].toFixed(2)}<br>
            <strong>Potential Payout:</strong> ₦${potentialPayouts[i].toFixed(2)}<br>
            <strong>Profit/Loss:</strong> ₦${(potentialPayouts[i] - totalStake).toFixed(2)}
        `;
        results.appendChild(div);
    });
});

// Add more games dynamically
document.getElementById('addGame').addEventListener('click', function () {
    const gameDiv = document.createElement('div');
    gameDiv.className = "game";
    gameDiv.innerHTML = `
        <label>Game Name: <input type="text" class="name" placeholder="e.g., NEW"></label>
        <label>Home Odds: <input type="number" step="0.01" class="home"></label>
        <label>Draw Odds: <input type="number" step="0.01" class="draw"></label>
        <label>Away Odds: <input type="number" step="0.01" class="away"></label>
    `;
    document.getElementById('games').appendChild(gameDiv);
});

