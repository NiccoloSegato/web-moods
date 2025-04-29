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
        const formattedDate = `${day}/${month}/${year}`;
        const startTime = new Date(currentTimesliceDetails.startTimeMs);
        const startFormattedTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
        const endTime = new Date(currentTimesliceDetails.endTimeMs);
        const endFormattedTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        const duration = currentTimesliceDetails.durationMinutes;
        
        const moodRow = document.createElement('tr');
        const dateCell = document.createElement('td');
        const startTimeCell = document.createElement('td');
        const endTimeCell = document.createElement('td');
        const durationCell = document.createElement('td');
        const moodCell = document.createElement('td');

        dateCell.innerHTML = formattedDate;
        startTimeCell.innerHTML = startFormattedTime;
        endTimeCell.innerHTML = endFormattedTime;
        durationCell.innerHTML = `${duration} min`;
        moodCell.innerHTML = moods[moodValue - 1];

        moodRow.appendChild(dateCell);
        moodRow.appendChild(startTimeCell);
        moodRow.appendChild(endTimeCell);
        moodRow.appendChild(durationCell);
        moodRow.appendChild(moodCell);
        
        container.appendChild(moodRow);

        currentTimeMs += currentTimesliceDetails.durationMs; // Avanza al prossimo periodo
        loopCounter++;
    }
}