
// --- Helper Functions ---
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getDatesForWeek(weekId) {
    if (!weekId) return { start: null, end: null };
    const [year, weekNumber] = weekId.split('-').map(Number);
    if (!year || !weekNumber) return { start: null, end: null };

    const simple = new Date(Date.UTC(year, 0, 1 + (weekNumber - 1) * 7));
    const dayOfWeek = simple.getUTCDay();
    const isoWeekStart = simple;
    if (dayOfWeek <= 4) {
        isoWeekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
    } else {
        isoWeekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
    }
    
    const weekEnd = new Date(isoWeekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

    // Return dates in local time zone for display
    return { 
        start: new Date(isoWeekStart.getUTCFullYear(), isoWeekStart.getUTCMonth(), isoWeekStart.getUTCDate()), 
        end: new Date(weekEnd.getUTCFullYear(), weekEnd.getUTCMonth(), weekEnd.getUTCDate()) 
    };
}

function formatDate(date) {
    if (!date || isNaN(date)) return '';
    // Use UTC methods to avoid timezone shift issues when formatting the date string
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// --- Web Component: <month-calendar> ---
class MonthCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._year = new Date().getFullYear();
        this._month = 0;
        this._selectedWeek = null;
        this.isReady = false;
    }

    connectedCallback() {
        this.render();
        this.isReady = true;
        this.dispatchEvent(new CustomEvent('ready', { bubbles: true, composed: true }));
    }

    static get observedAttributes() {
        return ['year', 'month', 'selected-week'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'year') this._year = parseInt(newValue);
        if (name === 'month') this._month = parseInt(newValue);
        if (name === 'selected-week') this._selectedWeek = newValue;
        if (this.isReady) {
            this.render();
        }
    }

    render() {
        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        const monthName = monthNames[this._month];

        const krHolidays = holidays[this._year]?.KR || [];
        const holidayMap = new Map(krHolidays.map(h => [h.date, h.name]));

        // Use UTC dates for all calculations to prevent timezone-related offsets
        const firstDateOfMonth = new Date(Date.UTC(this._year, this._month, 1));
        const startDay = firstDateOfMonth.getUTCDay() === 0 ? 6 : firstDateOfMonth.getUTCDay() - 1;
        
        let currentDate = new Date(firstDateOfMonth);
        currentDate.setUTCDate(currentDate.getUTCDate() - startDay);

        let weeksHtml = '';
        let done = false;
        while (!done) {
            let weekRowHtml = '';
            let daysInWeek = [];
            
            const firstDayOfWeek = new Date(currentDate);
            daysInWeek.push(firstDayOfWeek);

            for (let i = 0; i < 7; i++) {
                const dayOfWeek = currentDate.getUTCDay();
                const dateString = formatDate(currentDate);
                
                let classes = [];
                if (currentDate.getUTCMonth() !== this._month) classes.push('muted');
                if (dayOfWeek === 6) classes.push('saturday');
                if (dayOfWeek === 0) classes.push('sunday');
                
                const holidayName = holidayMap.get(dateString);
                if (holidayName) classes.push('holiday');

                const holidayNameHtml = holidayName ? `<div class="holiday-name">${holidayName}</div>` : '';
                weekRowHtml += `<td class="${classes.join(' ')}"><div>${currentDate.getUTCDate()}</div>${holidayNameHtml}</td>`;
                
                if (i < 6) { // Add next day to daysInWeek array
                   currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                   daysInWeek.push(new Date(currentDate));
                }
            }
            
            const weekNumber = getISOWeek(firstDayOfWeek);
            const yearOfWeek = firstDayOfWeek.getUTCFullYear();
            const weekId = `${yearOfWeek}-${weekNumber}`;
            const isSelected = this._selectedWeek === weekId;

            if(this._month === 11 && weekNumber === 1) {
                // Skip rendering week 1 of next year in December
            } else {
                weeksHtml += `
                    <tr class="week-row ${isSelected ? 'selected' : ''}" data-week-id="${weekId}">
                        <td class="week-number">${weekNumber}</td>
                        ${weekRowHtml}
                    </tr>
                `;
            }
            
            // Move to the next day to start the new week
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);

            if (this._month === 11) { // December
                // Stop if the next week is in the next year and the month is January
                if (currentDate.getUTCFullYear() > this._year && currentDate.getUTCMonth() > 0) done = true;
                 if (currentDate.getUTCFullYear() > this._year && weekNumber === 1) done = true;
            } else {
                // Stop if the next week is in a future month
                if (currentDate.getUTCMonth() > this._month && currentDate.getUTCFullYear() >= this._year) done = true;
            }
             if (weeksHtml.length > 4000) done = true; // Safety break
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .calendar-card { font-size: 0.875rem; }
                .month-header { font-size: 1rem; font-weight: 600; text-align: center; margin-bottom: 1rem; color: var(--header-text-color); }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: center; padding: 0.4rem 0.2rem; vertical-align: top; height: 3.8em; }
                th { font-weight: 500; color: var(--muted-text-color); font-size: 0.75rem; }
                td > div:first-child { margin-bottom: 4px; }
                .week-number { 
                    color: var(--muted-text-color); 
                    font-weight: 500; 
                    vertical-align: top;
                    padding-top: 0.4rem;
                }
                .muted { color: var(--muted-text-color); opacity: 0.5; }
                .saturday { color: var(--saturday-color); }
                .sunday, .holiday > div:first-child { color: var(--sunday-holiday-color); font-weight: 600; }
                .holiday-name { font-size: 0.6rem; font-weight: 400; color: var(--sunday-holiday-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45px; margin: 0 auto; }
                .week-row { cursor: pointer; transition: background-color 0.15s; }
                .week-row:hover { background-color: var(--accent-color); }
                .week-row.selected { background-color: var(--primary-color); color: white; font-weight: 600; }
                .week-row.selected td, .week-row.selected .week-number, .week-row.selected .muted, .week-row.selected .saturday, .week-row.selected .sunday, .week-row.selected .holiday > div:first-child, .week-row.selected .holiday-name { color: white; }
                .week-row.selected .muted { opacity: 0.8; }
            </style>
            <div class="calendar-card">
                <h3 class="month-header">${monthName}</h3>
                <table>
                    <thead>
                        <tr><th>CW</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th><th>일</th></tr>
                    </thead>
                    <tbody>
                        ${weeksHtml}
                    </tbody>
                </table>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.week-row').forEach(row => {
            row.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('week-selected', { bubbles: true, composed: true, detail: { weekId: row.dataset.weekId } }));
            });
        });
    }
}
customElements.define('month-calendar', MonthCalendar);

// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const yearDisplay = document.getElementById('current-year-display');
    const weekDisplay = document.getElementById('selected-week-display');
    const prevYearBtn = document.getElementById('prev-year');
    const nextYearBtn = document.getElementById('next-year');
    const gridContainer = document.getElementById('calendar-grid-container');

    let currentYear = new Date().getFullYear();
    let selectedWeekId = null;

    function renderYear(year) {
        yearDisplay.textContent = year;
        gridContainer.innerHTML = '';
        const calendarPromises = [];
        for (let i = 0; i < 12; i++) {
            const monthCard = document.createElement('month-calendar');
            calendarPromises.push(new Promise(resolve => {
                monthCard.addEventListener('ready', () => resolve(monthCard), { once: true });
            }));
            monthCard.setAttribute('year', year);
            monthCard.setAttribute('month', i);
            if (selectedWeekId) {
                monthCard.setAttribute('selected-week', selectedWeekId);
            }
            gridContainer.appendChild(monthCard);
        }
        return Promise.all(calendarPromises);
    }

    function updateSelection(weekId) {
        if (!weekId) return;
        selectedWeekId = weekId;
        const [year, week] = weekId.split('-');
        const dates = getDatesForWeek(weekId);
        
        if (dates.start && dates.end) {
             weekDisplay.textContent = `선택: ${year}년 CW${week} · ${formatDate(dates.start)} ~ ${formatDate(dates.end)}`;
        } else {
             weekDisplay.textContent = '주를 선택하세요';
        }
        
        document.querySelectorAll('month-calendar').forEach(cal => {
            cal.setAttribute('selected-week', selectedWeekId);
        });
    }

    // --- Event Listeners ---
    prevYearBtn.addEventListener('click', () => { 
        currentYear--; 
        renderYear(currentYear);
    });
    nextYearBtn.addEventListener('click', () => { 
        currentYear++; 
        renderYear(currentYear);
    });
    gridContainer.addEventListener('week-selected', (e) => { 
        updateSelection(e.detail.weekId); 
    });

    // --- Initial Render & Selection ---
    async function initializeCalendar() {
        // Set initial selection without waiting for render to feel faster
        const today = new Date();
        const todayYear = today.getFullYear();
        if (currentYear === todayYear) {
            const currentWeekNumber = getISOWeek(today);
            const currentWeekId = `${todayYear}-${currentWeekNumber}`;
            updateSelection(currentWeekId);
        }
        
        await renderYear(currentYear);
    }

    initializeCalendar();
});
