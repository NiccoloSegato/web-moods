let moods = ['Nostalgia', 'Calma', 'Libertà', 'Solitudine'];
let gradients = [
    'linear-gradient(to right, #ffd89b, #19547b)',
    'linear-gradient(to right, #C9D6FF, #E2E2E2)',
    'linear-gradient(to right, #ff7e5f, #feb47b)',
    'linear-gradient(to right, #616161, #9bc5c3)'
]

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

function calculateDPseudoRandomCustom(dateInput = Date.now()) {

    // Combiniamo gli indici in un singolo valore intero a 32 bit.
    // Usiamo operazioni diverse per iniziare a mescolare. L'ordine conta.
    let hash = getEarthValue(dateInput) | 0; // Inizia con l'indice che cambia più spesso. '| 0' forza a intero 32bit.
    hash = Math.imul(hash ^ getTideValue(dateInput), 2654435761); // Moltiplica per una costante (golden ratio prime) dopo XOR con indexB
    hash = Math.imul(hash ^ getMoonValue(dateInput), 2654435761); // Ripeti per indexA
  
    // Applichiamo ulteriori passaggi di mescolamento per aumentare la casualità apparente.
    // Questa sequenza è un esempio; altre combinazioni di XOR, shift e moltiplicazioni possono funzionare.
    hash = hash ^ (hash >>> 16); // XOR con se stesso shiftato a destra
    hash = Math.imul(hash, 2246822507); // Moltiplica per un primo grande
    hash = hash ^ (hash >>> 13); // Altro XOR shift
    hash = Math.imul(hash, 3266489909); // Altro primo grande
    hash = hash ^ (hash >>> 16); // XOR shift finale
  
    // A questo punto, 'hash' è un intero a 32 bit pseudo-casuale basato sugli indici iniziali.
  
    // Convertiamo l'hash intero (trattato come unsigned) in un numero decimale [0, 1).
    // `>>> 0` converte l'hash (potenzialmente negativo in JS) in un intero unsigned a 32 bit.
    // Dividiamo poi per 2^32 (4294967296).
    const randomValue = (hash >>> 0) / 4294967296;
  
    // Mappiamo il valore [0, 1) all'intervallo intero desiderato [1, 4].
    const resultD = Math.floor(randomValue * 4) + 1;
  
    return resultD;
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