/**
 * Funzione per l'esecuzione dello script
 */
function run() {
    renderMood();
}

/**
 * Funzione per visualizzare il mood corrente
 */
function renderMood() {
    let moodValue = generateMood();

    document.getElementById('moonphase').innerHTML = getMoonValue();
    document.getElementById('tidephase').innerHTML = getTideValue();
    document.getElementById('earth').innerHTML = getEarthValue();

    document.getElementById('mood').innerHTML = moods[moodValue - 1];

    document.body.style.background = gradients[moodValue - 1];
}