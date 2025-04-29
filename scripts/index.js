/**
 * Funzione per l'esecuzione dello script
 */
function run() {
    renderMood();
    getNextChangeTime();
    getCurrentTimesliceDetails();
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

/**
 * Calcola quanti minuti ad un multiplo di 20 minuti e lo inserisce come valore di nextchangelabel
 */
function getNextChangeTime() {
    const timesliceInfo = getCurrentTimesliceDetails();
    const startTime = new Date(timesliceInfo.startTimeMs);
    const endTime = new Date(timesliceInfo.endTimeMs);
    document.getElementById('nextchangelabel').innerHTML = `Inizio: <strong>${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}</strong> - Fine: <strong>${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}</strong>`;
}