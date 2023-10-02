function calculateArbitrageStakes(odds, totalStake) {
    // Convert odds to implied probabilities
    const impliedProbabilities = odds.map(odd => 1 / odd);

    // Calculate the market's total implied probability
    const totalImpliedProbability = impliedProbabilities.reduce((acc, prob) => acc + prob, 0);

    // Check if there's an arbitrage opportunity
    if (totalImpliedProbability >= 1) {
        console.warn("There's no arbitrage opportunity with the given odds.");
        return null;
    }

    // Calculate individual stakes
    const stakes = impliedProbabilities.map(prob => roundToTwo((totalStake * prob) / totalImpliedProbability));

    // Calculate potential payouts
    const payouts = stakes.map((stake, index) => roundToTwo(stake * odds[index]));

    // Return the stakes and payouts
    return {
        stakes: stakes,
        payouts: payouts
    };
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}
// Example usage:
const odds = [2.1, 2.2];
const stake = 100;
const result = calculateArbitrageStakes(odds, stake);
console.log(result);  // {stakes: [..], payouts: [..]}
