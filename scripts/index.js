/**
 * Funzione per l'esecuzione dello script
 */
function DDC_run() {
    DDC_renderMood();
    DDC_getNextChangeTime();
    DDC_getCurrentTimesliceDetails();
}

/**
 * Funzione per visualizzare il mood corrente
 */
function DDC_renderMood() {
    let DDC_moodValue = DDC_getCurrentTimesliceDetails().DDC_activeMood;

    document.getElementById('moonphase').innerHTML = DDC_getLiteralMoonValue();
    document.getElementById('tidephase').innerHTML = DDC_getLiteralTideValue();
    document.getElementById('earth').innerHTML = DDC_getLiteralEarthValue() + "°";

    document.getElementById('mood').innerHTML = DDC_moods[DDC_moodValue - 1];

    document.body.style.background = DDC_gradients[DDC_moodValue - 1];
}

/**
 * Calcola quanti minuti ad un multiplo di 20 minuti e lo inserisce come valore di nextchangelabel
 */
function DDC_getNextChangeTime() {
    const DDC_timesliceInfo = DDC_getCurrentTimesliceDetails();
    const DDC_startTime = new Date(DDC_timesliceInfo.DDC_startTimeMs);
    const DDC_endTime = new Date(DDC_timesliceInfo.DDC_endTimeMs);
    document.getElementById('nextchangelabel').innerHTML = `Inizio: <strong>${DDC_startTime.getHours()}:${DDC_startTime.getMinutes().toString().padStart(2, '0')}</strong> - Fine: <strong>${DDC_endTime.getHours()}:${DDC_endTime.getMinutes().toString().padStart(2, '0')}</strong>`;
}