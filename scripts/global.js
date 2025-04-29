let moods = ['Nostalgia', 'Calma', 'Libertà', 'Solitudine'];

const INTERVAL_MOON = 7 * 24 * 60 * 60 * 1000; // 7 giorni
const INTERVAL_TIDE = 6 * 60 * 60 * 1000; // 6 ore
const INTERVAL_EARTH = 20 * 60 * 1000; // 20 minuti

const EPOCH_START_MS = new Date('1992-12-04T00:00:00Z').getTime();

/**
 * Funzione per generare il mood della data fornita
 * @param {*} dateInput Data in millisecondi
 * @returns {number} Valore del mood
 */
function generateMood(dateInput = Date.now()) {
    const currentTimeMs = dateInput;

    const elapsedTimeMs = currentTimeMs - EPOCH_START_MS;

    const moonValue = Math.floor(elapsedTimeMs / INTERVAL_MOON);
    const tideValue = Math.floor(elapsedTimeMs / INTERVAL_TIDE);
    const earthValue = Math.floor(elapsedTimeMs / INTERVAL_EARTH);

    const combinedValue = (moonValue * 31 + tideValue * 17 + earthValue);

    return ((combinedValue % 4 + 4) % 4) + 1;
}

/**
 * Funzione per ottenere il valore della luna
 */
function getMoonValue(dateInput = Date.now()) {
    const currentTimeMs = dateInput;
    const elapsedTimeMs = currentTimeMs - EPOCH_START_MS;
    return Math.floor(elapsedTimeMs / INTERVAL_MOON);
}

/**
 * Funzione per ottenere il valore delle maree
 */
function getTideValue(dateInput = Date.now()) {
    const currentTimeMs = dateInput;
    const elapsedTimeMs = currentTimeMs - EPOCH_START_MS;
    return Math.floor(elapsedTimeMs / INTERVAL_TIDE);
}

/**
 * Funzione per ottenere il valore della terra
 */
function getEarthValue(dateInput = Date.now()) {
    const currentTimeMs = dateInput;
    const elapsedTimeMs = currentTimeMs - EPOCH_START_MS;
    return Math.floor(elapsedTimeMs / INTERVAL_EARTH);
}