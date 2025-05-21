let DDC_moods = ['Nostalgia', 'Calma', 'Libertà', 'Solitudine', 'Focus'];
let DDC_gradients = [
    'linear-gradient(to right, #ffd89b, #19547b)',
    'linear-gradient(to right, #C9D6FF, #E2E2E2)',
    'linear-gradient(to right, #ff7e5f, #feb47b)',
    'linear-gradient(to right, #616161, #9bc5c3)',
    'linear-gradient(to right, #1A2A40, #3A5F8A)'
]

const DDC_INTERVAL_MOON = 7 * 24 * 60 * 60 * 1000; // 7 giorni
const DDC_INTERVAL_TIDE = 6 * 60 * 60 * 1000; // 6 ore
const DDC_INTERVAL_EARTH = 20 * 60 * 1000; // 20 minuti

const DDC_MIN_DURATION_MINUTES = 20;
const DDC_MAX_DURATION_MINUTES = 360;
const DDC_DURATION_RANGE_SIZE = DDC_MAX_DURATION_MINUTES - DDC_MIN_DURATION_MINUTES + 1;

const DDC_EPOCH_START_MS = new Date('1992-12-04T00:00:00Z').getTime();

function DDC_generateMood(DDC_dateInput = Date.now()) {
    // Combiniamo gli indici in un singolo valore intero a 32 bit.
    let DDC_hash = DDC_getEarthValue(DDC_dateInput) | 0; // Inizia con l'indice che cambia più spesso. '| 0' forza a intero 32bit.
    DDC_hash = Math.imul(DDC_hash ^ DDC_getTideValue(DDC_dateInput), 2654435761); // Moltiplica per una costante dopo XOR con la marea
    DDC_hash = Math.imul(DDC_hash ^ DDC_getMoonValue(DDC_dateInput), 2654435761); // Ripeti per la luna
  
    // Applichiamo ulteriori passaggi di mescolamento per aumentare la casualità apparente.
    DDC_hash = DDC_hash ^ (DDC_hash >>> 16); // XOR con se stesso shiftato a destra
    DDC_hash = Math.imul(DDC_hash, 2246822507); // Moltiplica per un primo grande
    DDC_hash = DDC_hash ^ (DDC_hash >>> 13); // Altro XOR shift
    DDC_hash = Math.imul(DDC_hash, 3266489909); // Altro primo grande
    DDC_hash = DDC_hash ^ (DDC_hash >>> 16); // XOR shift finale
  
    // A questo punto, 'hash' è un intero a 32 bit pseudo-casuale basato sugli indici iniziali.
  
    // Convertiamo l'hash intero (trattato come unsigned) in un numero decimale [0, 1).
    // `>>> 0` converte l'hash (potenzialmente negativo in JS) in un intero unsigned a 32 bit.
    // Dividiamo poi per 2^32 (4294967296).
    const DDC_randomValue = (DDC_hash >>> 0) / 4294967296;
  
    // Mappiamo il valore [0, 1) all'intervallo intero desiderato [1, 5].
    const DDC_resultD = Math.floor(DDC_randomValue * 5) + 1;
  
    return DDC_resultD;
}

function DDC_getDuration(DDC_dateInput = Date.now()) {
    // Usiamo una costante diversa (salt) all'inizio per differenziare l'output da quello della funzione di generazione dei mood, anche con gli stessi indici.
    const DDC_DURATION_SALT = 987654321; // Un numero arbitrario diverso da 0
    let DDC_hash = (DDC_getEarthValue(DDC_dateInput) ^ DDC_DURATION_SALT) | 0; // Inizia con l'indice che cambia più spesso. '| 0' forza a intero 32bit.
    DDC_hash = Math.imul(DDC_hash ^ DDC_getTideValue(DDC_dateInput), 2654435761); // Moltiplica per una costante dopo XOR con la marea
    DDC_hash = Math.imul(DDC_hash ^ DDC_getMoonValue(DDC_dateInput), 2654435761); // Ripeti per le fasi lunari
  
    DDC_hash = DDC_hash ^ (DDC_hash >>> 16);
    DDC_hash = Math.imul(DDC_hash, 2246822507);
    DDC_hash = DDC_hash ^ (DDC_hash >>> 13);
    DDC_hash = Math.imul(DDC_hash, 3266489909);
    DDC_hash = DDC_hash ^ (DDC_hash >>> 16);
  
    const DDC_randomValue = (DDC_hash >>> 0) / 4294967296; // Valore [0, 1)
  
    // Mappiamo il valore [0, 1) all'intervallo intero desiderato.
    // Moltiplichiamo per il numero di valori possibili (221) e aggiungiamo il minimo (20).
    return Math.floor(DDC_randomValue * DDC_DURATION_RANGE_SIZE) + DDC_MIN_DURATION_MINUTES;
}

function DDC_getCurrentTimesliceDetails(DDC_targetTimeMs = Date.now()) {

    // Per il calcolo parto da una data più vicina del suo compleanno
    const DDC_REF_TIME = new Date('2025-04-25T00:00:00Z').getTime();
    if (DDC_targetTimeMs < DDC_REF_TIME) {
        return null;
    }
  
    let DDC_currentPeriodStartTimeMs = DDC_REF_TIME;
    let DDC_loopSafetyCounter = 0; // Per prevenire cicli infiniti imprevisti
    const DDC_MAX_LOOPS = 1000000; // Limite ragionevole, dipende da quanto è vecchia l'epoca
  
    while (DDC_currentPeriodStartTimeMs <= DDC_targetTimeMs && DDC_loopSafetyCounter < DDC_MAX_LOOPS) {
        DDC_loopSafetyCounter++;
    
        // 1. Calcola indici per l'INIZIO del periodo corrente
        const DDC_indices = {DDC_indexA: DDC_getEarthValue(DDC_currentPeriodStartTimeMs), DDC_indexB: DDC_getTideValue(DDC_currentPeriodStartTimeMs), DDC_indexC: DDC_getMoonValue(DDC_currentPeriodStartTimeMs)};
    
        // 2. Calcola Mood e Durata per questo periodo (usando gli indici di inizio)
        const DDC_periodMood = DDC_generateMood(DDC_currentPeriodStartTimeMs);
        const DDC_periodDurationMinutes = DDC_getDuration(DDC_currentPeriodStartTimeMs);
        const DDC_periodDurationMs = DDC_periodDurationMinutes * 60 * 1000;
    
        // Controllo di sicurezza per durata non valida
        if (DDC_periodDurationMs <= 0) {
            return null; // O gestisci diversamente
        }
    
        // 3. Calcola l'ora di fine di questo periodo
        const DDC_currentPeriodEndTimeMs = DDC_currentPeriodStartTimeMs + DDC_periodDurationMs;
    
        // 4. Verifica se il targetTimeMs cade DENTRO questo periodo [startTime, endTime)
        if (DDC_targetTimeMs < DDC_currentPeriodEndTimeMs) {
            // Trovato! Questo è il timeslice attivo.
            return {
                DDC_activeMood: DDC_periodMood,
                DDC_startTimeMs: DDC_currentPeriodStartTimeMs,
                DDC_endTimeMs: DDC_currentPeriodEndTimeMs,
                DDC_durationMinutes: DDC_periodDurationMinutes,
                DDC_durationMs: DDC_periodDurationMs,
                DDC_targetTimeMs: DDC_targetTimeMs, // Ora richiesta
                DDC_startTimestamp: new Date(DDC_currentPeriodStartTimeMs), // Ora di inizio come oggetto Date
                DDC_endTimestamp: new Date(DDC_currentPeriodEndTimeMs)      // Ora di fine come oggetto Date
            };
        }
  
        // 5. Se non è questo il periodo, avanza al prossimo
        // Il nuovo inizio è la fine del periodo appena calcolato
        DDC_currentPeriodStartTimeMs = DDC_currentPeriodEndTimeMs;
    }
  
    // Se usciamo dal ciclo while senza aver trovato il periodo (es. superato MAX_LOOPS)
    if (DDC_loopSafetyCounter >= DDC_MAX_LOOPS) {
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
function DDC_getMoonValue(DDC_dateInput = Date.now()) {
    const DDC_currentTimeMs = DDC_dateInput;
    const DDC_elapsedTimeMs = DDC_currentTimeMs - DDC_EPOCH_START_MS;
    return Math.floor(DDC_elapsedTimeMs / DDC_INTERVAL_MOON);
}

/**
 * Ottengo il valore letterale attuale della fase lunare basandosi sul giorno
 * @param {*} DDC_dateInput 
 * @returns 
 */
function DDC_getLiteralMoonValue(DDC_dateInput = Date.now()) {
    // Ottengo i componenti dell'orario basandomi sulla zona 'Europe/Rome'
    const DDC_options = {
        day: 'numeric',      // 'numeric' per ottenere il valore numerico (es. 9, 15)
        timeZone: 'Europe/Rome'
    };

    // Uso formatToParts per ottenere i singoli componenti (ora, minuti) in modo affidabile
    const DDC_parts = new Intl.DateTimeFormat('it-IT', DDC_options).formatToParts(DDC_dateInput);

    let DDC_dayOfMonth = 0;
    DDC_parts.forEach(DDC_part => {
        if (DDC_part.type === 'day') {
            DDC_dayOfMonth = parseInt(DDC_part.value, 10); // Converte la stringa dell'ora in numero intero
        }
    });

    if(DDC_dayOfMonth < 4) {
        return "Luna nuova";
    }
    else if(DDC_dayOfMonth < 8) {
        return "Luna crescente";
    }
    else if (DDC_dayOfMonth < 12) {
        return "Primo quarto";
    }
    else if(DDC_dayOfMonth < 16) {
        return "Gibbosa crescente";
    }
    else if(DDC_dayOfMonth < 20) {
        return "Luna piena";
    }
    else if(DDC_dayOfMonth < 24) {
        return "Gibbosa calante";
    }
    else if(DDC_dayOfMonth < 28) {
        return "Ultimo quarto";
    }
    else return "Luna calante";
}

/**
 * Funzione per ottenere il valore delle maree
 */
function DDC_getTideValue(DDC_dateInput = Date.now()) {
    const DDC_currentTimeMs = DDC_dateInput;
    const DDC_elapsedTimeMs = DDC_currentTimeMs - DDC_EPOCH_START_MS;
    return Math.floor(DDC_elapsedTimeMs / DDC_INTERVAL_TIDE);
}

/**
 * Ottengo il valore letterale attuale della marea basandosi sull'ora
 * @param {*} DDC_dateInput 
 * @returns 
 */
function DDC_getLiteralTideValue(DDC_dateInput = Date.now()) {
    // Ottengo i componenti dell'orario basandomi sulla zona 'Europe/Rome'
    const DDC_options = {
        hour: 'numeric',      // 'numeric' per ottenere il valore numerico (es. 9, 15)
        timeZone: 'Europe/Rome'
    };

    // Uso formatToParts per ottenere i singoli componenti (ora, minuti) in modo affidabile
    const DDC_parts = new Intl.DateTimeFormat('it-IT', DDC_options).formatToParts(DDC_dateInput);

    let DDC_hour = 0;
    // Calcolo l'ora attuale
    DDC_parts.forEach(DDC_part => {
        if (DDC_part.type === 'hour') {
            DDC_hour = parseInt(DDC_part.value, 10); // Converte la stringa dell'ora in numero intero
        }
    });

    // Se è notte o pomeriggio ho alta marea
    if(DDC_hour < 6 || (DDC_hour >= 12 && DDC_hour < 18)) {
        return "Alta marea";
    }
    return "Bassa marea";
}

/**
 * Funzione per ottenere il valore della terra
 */
function DDC_getEarthValue(DDC_dateInput = Date.now()) {
    const DDC_currentTimeMs = DDC_dateInput;
    const DDC_elapsedTimeMs = DDC_currentTimeMs - DDC_EPOCH_START_MS;
    return Math.floor(DDC_elapsedTimeMs / DDC_INTERVAL_EARTH);
}

/**
 * Funzione per ottenere il valore effettivo in parole della rotazione terrestre basandosi sull'orario attuale
 * @param {*} DDC_dateInput 
 * @returns 
 */
function DDC_getLiteralEarthValue(DDC_dateInput = Date.now()) {
    // Ottengo i componenti dell'orario basandomi sulla zona 'Europe/Rome'
    const DDC_options = {
        hour: 'numeric',      // 'numeric' per ottenere il valore numerico (es. 9, 15)
        minute: 'numeric',    // 'numeric' per ottenere il valore numerico (es. 5, 30)
        timeZone: 'Europe/Rome'
    };

    // Uso formatToParts per ottenere i singoli componenti (ora, minuti) in modo affidabile
    const DDC_parts = new Intl.DateTimeFormat('it-IT', DDC_options).formatToParts(DDC_dateInput);

    let DDC_hour = 0;
    let DDC_minute = 0;

    // Itero sui componenti per estrarre l'ora e i minuti
    DDC_parts.forEach(DDC_part => {
        if (DDC_part.type === 'hour') {
            DDC_hour = parseInt(DDC_part.value, 10); // Converte la stringa in numero intero
        } else if (DDC_part.type === 'minute') {
            DDC_minute = parseInt(DDC_part.value, 10); // Converte la stringa in numero intero
        }
    });

    // Calcolo i minuti totali trascorsi dall'inizio del giorno
    const DDC_totalMinutesToday = (DDC_hour * 60) + DDC_minute;
    // Calcolo il numero di rotazioni di 5 gradi dividendo per 20 (tempo in minuti per ruotare di 5 gradi)
    return Math.floor(DDC_totalMinutesToday / 20) * 5;
}