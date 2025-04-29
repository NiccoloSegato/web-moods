/**
 * Funzione per l'esecuzione dello script
 */
function run() {
    renderMood();
    getNextChangeTime();
}

/**
 * Funzione per visualizzare il mood corrente
 */
function renderMood() {
    let moodValue = calculateDPseudoRandomCustom();

    document.getElementById('moonphase').innerHTML = getMoonValue();
    document.getElementById('tidephase').innerHTML = getTideValue();
    document.getElementById('earth').innerHTML = getEarthValue();

    document.getElementById('mood').innerHTML = moods[moodValue - 1];

    document.body.style.background = gradients[moodValue - 1];
}

/**
 * Calcola quanti minuti ad un multiplo di 20 minuti e lo inserisce come valore di nextchangelabel
 */
function getNextChangeTime() {
    const currentTime = new Date();
    const minutes = currentTime.getMinutes();
    const nextChange = Math.ceil(minutes / 20) * 20;
    const nextChangeTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), nextChange);
    document.getElementById('nextchangelabel').innerHTML = `${nextChangeTime.getHours()}:${nextChangeTime.getMinutes().toString().padStart(2, '0')}`;
}