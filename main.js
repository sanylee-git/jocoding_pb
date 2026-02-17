// --- Helper Functions ---
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getDatesForWeek(weekId) {
    const [year, weekNumber] = weekId.split('-').map(Number);
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dayOfWeek = simple.getDay();
    const isoWeekStart = simple;
    if (dayOfWeek <= 4)
        isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    
    const weekEnd = new Date(isoWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return { start: isoWeekStart, end: weekEnd };
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// --- Web Component: <month-calendar> ---
class MonthCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._year = new Date().getFullYear();
        this._month = 0;
        this._selectedWeek = null;
    }

    static get observedAttributes() {
        return ['year', 'month', 'selected-week'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'year') this._year = parseInt(newValue);
        if (name === 'month') this._month = parseInt(newValue);
        if (name === 'selected-week') this._selectedWeek = newValue;
        this.render();
    }

    render() {
        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        const monthName = monthNames[this._month];

        // --- Calendar Logic ---
        const firstDateOfMonth = new Date(this._year, this._month, 1);
        const startDay = firstDateOfMonth.getDay() === 0 ? 6 : firstDateOfMonth.getDay() - 1; // 0=Mon, 6=Sun
        
        let currentDate = new Date(firstDateOfMonth);
        currentDate.setDate(currentDate.getDate() - startDay);

        let weeksHtml = '';
        let done = false;
        while (!done) {
            let weekRowHtml = '';
            let daysInWeek = [];
            
            for (let i = 0; i < 7; i++) {
                daysInWeek.push(new Date(currentDate));
                weekRowHtml += `<td class="${currentDate.getMonth() !== this._month ? 'muted' : ''}">${currentDate.getDate()}</td>`;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            const weekNumber = getISOWeek(daysInWeek[0]);
            const yearOfWeek = daysInWeek[0].getFullYear();
            const weekId = `${yearOfWeek}-${weekNumber}`;
            const isSelected = this._selectedWeek === weekId;

            weeksHtml += `
                <tr class="week-row ${isSelected ? 'selected' : ''}" data-week-id="${weekId}">
                    <td class="week-number">${weekNumber}</td>
                    ${weekRowHtml}
                </tr>
            `;

            if (currentDate.getMonth() > this._month && currentDate.getFullYear() >= this._year || (currentDate.getMonth() === 0 && this._month === 11)) {
                done = true;
            }
        }

        // --- Component HTML & CSS ---
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .calendar-card { font-size: 0.875rem; }
                .month-header { font-size: 1rem; font-weight: 600; text-align: center; margin-bottom: 1rem; color: var(--header-text-color); }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: center; padding: 0.5rem 0; }
                th { font-weight: 500; color: var(--muted-text-color); font-size: 0.75rem; }
                .week-number { color: var(--muted-text-color); font-weight: 500; }
                .muted { color: var(--muted-text-color); }
                .week-row { cursor: pointer; transition: background-color 0.15s; }
                .week-row:hover { background-color: rgba(0,0,0,0.05); }
                html[data-theme="dark"] .week-row:hover { background-color: rgba(255,255,255,0.05); }
                .week-row.selected {
                    background-color: var(--accent-color);
                    color: var(--accent-text-color);
                    font-weight: 600;
                }
                .week-row.selected .week-number, .week-row.selected .muted { color: var(--accent-text-color); }
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

        // --- Event Listeners ---
        this.shadowRoot.querySelectorAll('.week-row').forEach(row => {
            row.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('week-selected', {
                    bubbles: true,
                    composed: true,
                    detail: { weekId: row.dataset.weekId }
                }));
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
    const themeSwitcherBtns = document.querySelectorAll('[data-theme-switcher]');

    let currentYear = new Date().getFullYear();
    let selectedWeekId = null;

    function renderYear(year) {
        yearDisplay.textContent = year;
        gridContainer.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const monthCard = document.createElement('month-calendar');
            monthCard.setAttribute('year', year);
            monthCard.setAttribute('month', i);
            if (selectedWeekId) {
                monthCard.setAttribute('selected-week', selectedWeekId);
            }
            gridContainer.appendChild(monthCard);
        }
    }

    function updateSelection(weekId) {
        selectedWeekId = weekId;
        const [year, week] = weekId.split('-');
        const dates = getDatesForWeek(weekId);
        weekDisplay.textContent = `선택: ${year}년 CW${week} · ${formatDate(dates.start)} ~ ${formatDate(dates.end)}`;
        
        gridContainer.querySelectorAll('month-calendar').forEach(cal => {
            cal.setAttribute('selected-week', selectedWeekId);
        });
    }
    
    // --- Theme Logic ---
    function setTheme(theme) {
        const root = document.documentElement;
        if (theme === 'system') {
            root.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
        // Update active button
        themeSwitcherBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeSwitcher === theme);
        });
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = savedTheme || 'system';
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('system');
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === null) {
                 setTheme('system');
            }
        });
    }

    // --- Event Listeners ---
    prevYearBtn.addEventListener('click', () => { currentYear--; renderYear(currentYear); });
    nextYearBtn.addEventListener('click', () => { currentYear++; renderYear(currentYear); });
    gridContainer.addEventListener('week-selected', (e) => { updateSelection(e.detail.weekId); });
    themeSwitcherBtns.forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.themeSwitcher));
    });

    // --- Initial Render ---
    initializeTheme();
    renderYear(currentYear);

    // --- Formspree Verification (Temporary) ---
    async function verifyFormspreeSubmission() {
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('_replyto', 'test@example.com');
        formData.append('message', 'This is a test message from Gemini CLI.');

        try {
            const response = await fetch('https://formspree.io/f/xjgerzvd', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('Formspree verification response:', response);
            if (response.ok) {
                console.log('Formspree submission successful!');
            } else {
                console.error('Formspree submission failed:', await response.json());
            }
        } catch (error) {
            console.error('Error during Formspree verification:', error);
        }
    }
    verifyFormspreeSubmission();
});
