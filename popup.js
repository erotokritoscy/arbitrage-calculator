document.getElementById("calculate").addEventListener("click", function() {
    let totalStake = parseFloat(document.getElementById("totalStake").value);
    let odds = [
        parseFloat(document.getElementById("odd1").value),
        parseFloat(document.getElementById("odd2").value)
    ];

    if (document.getElementById("odd3").value) {
        odds.push(parseFloat(document.getElementById("odd3").value));
    }

    let { stakes, payouts } = calculateStakesAndPayouts(odds, totalStake);

    // Update the UI
    for (let i = 0; i < stakes.length; i++) {
        document.getElementById(`stake${i + 1}`).innerText = Math.round(stakes[i].toFixed(0));
        document.getElementById(`payout${i + 1}`).innerText = payouts[i].toFixed(2);
    }

    // If only two odds, clear the third stake and payout display
    if (stakes.length < 3) {
        document.getElementById(`stake3`).innerText = "";
        document.getElementById(`payout3`).innerText = "";
    }

    let dataToSave = {
        'totalStake': totalStake,
        'odds': odds,
        'stakes': stakes.map(stake => stake.toFixed(2)),
        'payouts': payouts.map(payout => payout.toFixed(2))
    };

    localStorage.setItem('arbitrage_calculator', JSON.stringify(dataToSave));
});

document.querySelectorAll('[data-clipboard-target]').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-clipboard-target');
        const targetElement = document.querySelector(targetId);
        const range = document.createRange();
        range.selectNode(targetElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    });
});

document.getElementById("clear").addEventListener("click", function() {
    // Clear input fields
    document.getElementById("totalStake").value = '';
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`odd${i}`).value = '';
        document.getElementById(`stake${i}`).innerText =  '0';
        document.getElementById(`payout${i}`).innerText = '0';
    }

    // Clear saved data in localStorage
    localStorage.removeItem('arbitrage_calculator');
});



function calculateStakesAndPayouts(odds, totalStake) {
    let stakes = [];
    let payouts = [];
    let sum = odds.reduce((acc, val) => acc + (1 / val), 0);

    for (let i = 0; i < odds.length; i++) {
        stakes[i] = Math.round((1 / odds[i]) * totalStake / sum);
        payouts[i] = stakes[i] * odds[i];
    }

    return { stakes, payouts };
}

function calculateArbitrageStakes(odds, totalStake) {
    const impliedProbabilities = odds.map(odd => 1 / odd);
    const totalImpliedProbability = impliedProbabilities.reduce((acc, prob) => acc + prob, 0);
    if (totalImpliedProbability >= 1) {
        return null;
    }
    const stakes = impliedProbabilities.map(prob => +(Math.round((totalStake * prob / totalImpliedProbability) + "e+2") + "e-2"));
    const payouts = stakes.map((stake, index) => +(Math.round(stake * odds[index] + "e+2") + "e-2"));
    return {
        stakes: stakes,
        payouts: payouts
    };
}

let savedData = JSON.parse(localStorage.getItem('arbitrage_calculator') || '{}');

if (savedData.totalStake) {
    document.getElementById("totalStake").value = savedData.totalStake;

    for (let i = 0; i < (savedData.odds || []).length; i++) {
        document.getElementById(`odd${i + 1}`).value = savedData.odds[i];
        document.getElementById(`stake${i + 1}`).innerText = Math.round(savedData.stakes[i]);
        document.getElementById(`payout${i + 1}`).innerText = savedData.payouts[i];
    }
}
