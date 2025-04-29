/**
 * Funzione principale
 */
function runPlanner() {
    generateNextSevenDaysMoods();
}

/**
 * Funzione per generare i mood per i prossimi 7 giorni
 */
function generateNextSevenDaysMoods() {
    let currentTimeMs = Date.now();
    const container = document.getElementById('planner-body');
    const limitLoop = 1000; // Limite di sicurezza per evitare loop infiniti
    let loopCounter = 0;

    // Calcolo il tempo tra una settimana
    const endPeriod = new Date(currentTimeMs + 7 * 24 * 60 * 60 * 1000);

    while(currentTimeMs < endPeriod.getTime() && loopCounter < limitLoop) {
        const dateInput = new Date(currentTimeMs);
        const currentTimesliceDetails = getCurrentTimesliceDetails(dateInput.getTime());
        const moodValue = currentTimesliceDetails.activeMood;
        const day = dateInput.getDate();
        const month = dateInput.getMonth() + 1; // I mesi partono da 0
        const year = dateInput.getFullYear();
        const hours = dateInput.getHours();
        const minutes = dateInput.getMinutes();
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const moodRow = document.createElement('tr');
        const dateCell = document.createElement('td');
        const timeCell = document.createElement('td');
        const moodCell = document.createElement('td');
        const moonCell = document.createElement('td');
        const earthCell = document.createElement('td');
        const tideCell = document.createElement('td');

        dateCell.innerHTML = formattedDate;
        timeCell.innerHTML = formattedTime;
        moodCell.innerHTML = moods[moodValue - 1];
        moonCell.innerHTML = getMoonValue(dateInput.getTime());
        earthCell.innerHTML = getEarthValue(dateInput.getTime());
        tideCell.innerHTML = getTideValue(dateInput.getTime());

        moodRow.appendChild(dateCell);
        moodRow.appendChild(timeCell);
        moodRow.appendChild(moodCell);
        moodRow.appendChild(moonCell);
        moodRow.appendChild(earthCell);
        moodRow.appendChild(tideCell);
        
        container.appendChild(moodRow);

        currentTimeMs += currentTimesliceDetails.durationMs; // Avanza al prossimo periodo
        loopCounter++;
    }
}