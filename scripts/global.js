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

const MIN_DURATION_MINUTES = 20;
const MAX_DURATION_MINUTES = 360;
const DURATION_RANGE_SIZE = MAX_DURATION_MINUTES - MIN_DURATION_MINUTES + 1;

const EPOCH_START_MS = new Date('1992-12-04T00:00:00Z').getTime();

function generateMood(dateInput = Date.now()) {
    // Combiniamo gli indici in un singolo valore intero a 32 bit.
    let hash = getEarthValue(dateInput) | 0; // Inizia con l'indice che cambia più spesso. '| 0' forza a intero 32bit.
    hash = Math.imul(hash ^ getTideValue(dateInput), 2654435761); // Moltiplica per una costante dopo XOR con la marea
    hash = Math.imul(hash ^ getMoonValue(dateInput), 2654435761); // Ripeti per la luna
  
    // Applichiamo ulteriori passaggi di mescolamento per aumentare la casualità apparente.
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

function getDuration(dateInput = Date.now()) {
    // Usiamo una costante diversa (salt) all'inizio per differenziare l'output da quello della funzione di generazione dei mood, anche con gli stessi indici.
    const DURATION_SALT = 987654321; // Un numero arbitrario diverso da 0
    let hash = (getEarthValue(dateInput) ^ DURATION_SALT) | 0; // Inizia con l'indice che cambia più spesso. '| 0' forza a intero 32bit.
    hash = Math.imul(hash ^ getTideValue(dateInput), 2654435761); // Moltiplica per una costante dopo XOR con la marea
    hash = Math.imul(hash ^ getMoonValue(dateInput), 2654435761); // Ripeti per le fasi lunari
  
    hash = hash ^ (hash >>> 16);
    hash = Math.imul(hash, 2246822507);
    hash = hash ^ (hash >>> 13);
    hash = Math.imul(hash, 3266489909);
    hash = hash ^ (hash >>> 16);
  
    const randomValue = (hash >>> 0) / 4294967296; // Valore [0, 1)
  
    // Mappiamo il valore [0, 1) all'intervallo intero desiderato.
    // Moltiplichiamo per il numero di valori possibili (221) e aggiungiamo il minimo (20).
    const durationMinutes = Math.floor(randomValue * DURATION_RANGE_SIZE) + MIN_DURATION_MINUTES;
    return durationMinutes;
}

function getCurrentTimesliceDetails(targetTimeMs = Date.now()) {

    // Per il calcolo parto da una data più vicina del suo compleanno
    const REF_TIME = new Date('2025-04-25T00:00:00Z').getTime();
    if (targetTimeMs < REF_TIME) {
        return null;
    }
  
    let currentPeriodStartTimeMs = REF_TIME;
    let loopSafetyCounter = 0; // Per prevenire cicli infiniti imprevisti
    const MAX_LOOPS = 1000000; // Limite ragionevole, dipende da quanto è vecchia l'epoca
  
    while (currentPeriodStartTimeMs <= targetTimeMs && loopSafetyCounter < MAX_LOOPS) {
        loopSafetyCounter++;
    
        // 1. Calcola indici per l'INIZIO del periodo corrente
        const indices = {indexA: getEarthValue(currentPeriodStartTimeMs), indexB: getTideValue(currentPeriodStartTimeMs), indexC: getMoonValue(currentPeriodStartTimeMs)};
    
        // 2. Calcola Mood e Durata per questo periodo (usando gli indici di inizio)
        const periodMood = generateMood(currentPeriodStartTimeMs);
        const periodDurationMinutes = getDuration(currentPeriodStartTimeMs);
        const periodDurationMs = periodDurationMinutes * 60 * 1000;
    
        // Controllo di sicurezza per durata non valida
        if (periodDurationMs <= 0) {
            console.error(`Rilevata durata non positiva (${periodDurationMinutes} min) all'indice C ${indices.indexC}. Interruzione simulazione.`);
            return null; // O gestisci diversamente
        }
    
        // 3. Calcola l'ora di fine di questo periodo
        const currentPeriodEndTimeMs = currentPeriodStartTimeMs + periodDurationMs;
    
        // 4. Verifica se il targetTimeMs cade DENTRO questo periodo [startTime, endTime)
        if (targetTimeMs < currentPeriodEndTimeMs) {
            // Trovato! Questo è il timeslice attivo.
            return {
                activeMood: periodMood,
                startTimeMs: currentPeriodStartTimeMs,
                endTimeMs: currentPeriodEndTimeMs,
                durationMinutes: periodDurationMinutes,
                durationMs: periodDurationMs,
                targetTimeMs: targetTimeMs, // Ora richiesta
                startTimestamp: new Date(currentPeriodStartTimeMs), // Ora di inizio come oggetto Date
                endTimestamp: new Date(currentPeriodEndTimeMs)      // Ora di fine come oggetto Date
            };
        }
  
        // 5. Se non è questo il periodo, avanza al prossimo
        // Il nuovo inizio è la fine del periodo appena calcolato
        currentPeriodStartTimeMs = currentPeriodEndTimeMs;
    }
  
    // Se usciamo dal ciclo while senza aver trovato il periodo (es. superato MAX_LOOPS)
    if (loopSafetyCounter >= MAX_LOOPS) {
         console.error("Simulazione interrotta: raggiunto limite massimo di iterazioni.");
    } else {
        // Questo caso dovrebbe essere raro se targetTimeMs >= EPOCH_START_MS
        console.error("Simulazione terminata senza trovare un periodo attivo (caso imprevisto).");
    }
    return null;
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