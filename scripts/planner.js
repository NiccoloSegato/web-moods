/**
 * Funzione principale
 */
function DDC_runPlanner() {
    DDC_showIntervals();
    DDC_generateNextPeriodDaysMoods();
    DDC_countStats();
}

function DDC_showIntervals() {
    document.getElementById('min-interval').innerHTML = `${DDC_MIN_DURATION_MINUTES} min`;
    document.getElementById('max-interval').innerHTML = `${DDC_MAX_DURATION_MINUTES} min`;
}

/**
 * Funzione per generare i mood per i prossimi 7 giorni
 */
function DDC_generateNextPeriodDaysMoods(DDC_days = 7) {
    // Svuoto la tabella
    const DDC_container = document.getElementById('planner-body');
    DDC_container.innerHTML = ''; // Pulisci la tabella esistente
    let DDC_currentTimeMs = Date.now();
    const DDC_limitLoop = 1000; // Limite di sicurezza per evitare loop infiniti
    let DDC_loopCounter = 0;

    const DDC_endPeriod = new Date(DDC_currentTimeMs + DDC_days * 24 * 60 * 60 * 1000);

    while(DDC_currentTimeMs < DDC_endPeriod.getTime() && DDC_loopCounter < DDC_limitLoop) {
        const DDC_dateInput = new Date(DDC_currentTimeMs);
        const DDC_currentTimesliceDetails = DDC_getCurrentTimesliceDetails(DDC_dateInput.getTime());
        const DDC_moodValue = DDC_currentTimesliceDetails.DDC_activeMood;
        const DDC_day = DDC_dateInput.getDate();
        const DDC_month = DDC_dateInput.getMonth() + 1; // I mesi partono da 0
        const DDC_year = DDC_dateInput.getFullYear();
        const DDC_formattedDate = `${DDC_day}/${DDC_month}/${DDC_year}`;
        const DDC_startTime = new Date(DDC_currentTimesliceDetails.DDC_startTimeMs);
        const DDC_startFormattedTime = `${DDC_startTime.getHours()}:${DDC_startTime.getMinutes().toString().padStart(2, '0')}`;
        const DDC_endTime = new Date(DDC_currentTimesliceDetails.DDC_endTimeMs);
        const DDC_endFormattedTime = `${DDC_endTime.getHours()}:${DDC_endTime.getMinutes().toString().padStart(2, '0')}`;
        const DDC_duration = DDC_currentTimesliceDetails.DDC_durationMinutes;
        
        const DDC_moodRow = document.createElement('tr');
        const DDC_dateCell = document.createElement('td');
        const DDC_startTimeCell = document.createElement('td');
        const DDC_endTimeCell = document.createElement('td');
        const DDC_durationCell = document.createElement('td');
        const DDC_moodCell = document.createElement('td');

        DDC_dateCell.innerHTML = DDC_formattedDate;
        DDC_startTimeCell.innerHTML = DDC_startFormattedTime;
        DDC_endTimeCell.innerHTML = DDC_endFormattedTime;
        DDC_durationCell.innerHTML = `${DDC_duration} min`;
        DDC_moodCell.innerHTML = DDC_moods[DDC_moodValue - 1];
        DDC_moodCell.style.background = DDC_gradients[DDC_moodValue - 1];
        DDC_moodCell.style.color = 'white'; // Colore del testo per il mood

        DDC_moodRow.appendChild(DDC_dateCell);
        DDC_moodRow.appendChild(DDC_startTimeCell);
        DDC_moodRow.appendChild(DDC_endTimeCell);
        DDC_moodRow.appendChild(DDC_durationCell);
        DDC_moodRow.appendChild(DDC_moodCell);
        
        DDC_container.appendChild(DDC_moodRow);

        DDC_currentTimeMs += DDC_currentTimesliceDetails.DDC_durationMs; // Avanza al prossimo periodo
        DDC_loopCounter++;
    }
}

function DDC_countStats() {
    let DDC_averageDuration = 0;
    let DDC_moodCount = Array(DDC_moods.length).fill(0);

    const DDC_tableRows = document.querySelectorAll('#planner-body tr');
    DDC_tableRows.forEach(DDC_row => {
        const DDC_cells = DDC_row.querySelectorAll('td');
        const DDC_duration = parseInt(DDC_cells[3].innerText);
        const DDC_moodIndex = DDC_moods.indexOf(DDC_cells[4].innerText);

        DDC_averageDuration += DDC_duration;
        DDC_moodCount[DDC_moodIndex]++;
    });
    const DDC_statsTable = document.getElementById('stats-body');
    DDC_statsTable.innerHTML = ''; // Pulisci la tabella esistente
    const DDC_averageRow = document.createElement('tr');
    const DDC_averageCell = document.createElement('td');
    const DDC_mood1Cell = document.createElement('td');
    const DDC_mood2Cell = document.createElement('td');
    const DDC_mood3Cell = document.createElement('td');
    const DDC_mood4Cell = document.createElement('td');
    const DDC_mood5Cell = document.createElement('td');

    DDC_averageCell.innerHTML = `${Math.round(DDC_averageDuration / DDC_tableRows.length)} min`;
    DDC_mood1Cell.innerHTML = `${DDC_moodCount[0]} (${Math.round((DDC_moodCount[0] / DDC_tableRows.length) * 100)}%)`;
    DDC_mood2Cell.innerHTML = `${DDC_moodCount[1]} (${Math.round((DDC_moodCount[1] / DDC_tableRows.length) * 100)}%)`;
    DDC_mood3Cell.innerHTML = `${DDC_moodCount[2]} (${Math.round((DDC_moodCount[2] / DDC_tableRows.length) * 100)}%)`;
    DDC_mood4Cell.innerHTML = `${DDC_moodCount[3]} (${Math.round((DDC_moodCount[3] / DDC_tableRows.length) * 100)}%)`;
    DDC_mood5Cell.innerHTML = `${DDC_moodCount[4]} (${Math.round((DDC_moodCount[4] / DDC_tableRows.length) * 100)}%)`;

    DDC_averageRow.appendChild(DDC_averageCell);
    DDC_statsTable.appendChild(DDC_averageRow);
    DDC_averageRow.appendChild(DDC_mood1Cell);
    DDC_averageRow.appendChild(DDC_mood2Cell);
    DDC_averageRow.appendChild(DDC_mood3Cell);
    DDC_averageRow.appendChild(DDC_mood4Cell);
    DDC_averageRow.appendChild(DDC_mood5Cell);
}

function DDC_removeButtonSelectedId() {
    const DDC_buttons = document.getElementsByClassName('period-button');
    for (let DDC_i = 0; DDC_i < DDC_buttons.length; i++) {
        DDC_buttons[DDC_i].classList.remove('selected');
    }
}

function DDC_getPeriodStats(days) {
    DDC_removeButtonSelectedId();
    DDC_generateNextPeriodDaysMoods(days);
    DDC_countStats();
    document.getElementById(`btn-${days}`).classList.add('selected');
}