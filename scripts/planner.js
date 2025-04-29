/**
 * Funzione principale
 */
function runPlanner() {
    generateNextPeriodDaysMoods();
    countStats();
}

/**
 * Funzione per generare i mood per i prossimi 7 giorni
 */
function generateNextPeriodDaysMoods(days = 7) {
    // Svuoto la tabella
    const container = document.getElementById('planner-body');
    container.innerHTML = ''; // Pulisci la tabella esistente
    let currentTimeMs = Date.now();
    const limitLoop = 1000; // Limite di sicurezza per evitare loop infiniti
    let loopCounter = 0;

    const endPeriod = new Date(currentTimeMs + days * 24 * 60 * 60 * 1000);

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
        moodCell.style.background = gradients[moodValue - 1];
        moodCell.style.color = 'white'; // Colore del testo per il mood

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

function countStats() {
    let averageDuration = 0;
    let moodCount = Array(moods.length).fill(0);

    const tableRows = document.querySelectorAll('#planner-body tr');
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const duration = parseInt(cells[3].innerText);
        const moodIndex = moods.indexOf(cells[4].innerText);

        averageDuration += duration;
        moodCount[moodIndex]++;
    });
    const statsTable = document.getElementById('stats-body');
    statsTable.innerHTML = ''; // Pulisci la tabella esistente
    const averageRow = document.createElement('tr');
    const averageCell = document.createElement('td');
    const mood1Cell = document.createElement('td');
    const mood2Cell = document.createElement('td');
    const mood3Cell = document.createElement('td');
    const mood4Cell = document.createElement('td');

    averageCell.innerHTML = `${Math.round(averageDuration / tableRows.length)} min`;
    mood1Cell.innerHTML = `${moodCount[0]} (${Math.round((moodCount[0] / tableRows.length) * 100)}%)`;
    mood2Cell.innerHTML = `${moodCount[1]} (${Math.round((moodCount[1] / tableRows.length) * 100)}%)`;
    mood3Cell.innerHTML = `${moodCount[2]} (${Math.round((moodCount[2] / tableRows.length) * 100)}%)`;
    mood4Cell.innerHTML = `${moodCount[3]} (${Math.round((moodCount[3] / tableRows.length) * 100)}%)`;

    averageRow.appendChild(averageCell);
    statsTable.appendChild(averageRow);
    averageRow.appendChild(mood1Cell);
    averageRow.appendChild(mood2Cell);
    averageRow.appendChild(mood3Cell);
    averageRow.appendChild(mood4Cell);
}

function removeButtonSelectedId() {
    const buttons = document.getElementsByClassName('period-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected');
    }
}

function getPeriodStats(days) {
    removeButtonSelectedId();
    generateNextPeriodDaysMoods(days);
    countStats();
    document.getElementById(`btn-${days}`).classList.add('selected');
}