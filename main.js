class CalendarView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._date = new Date();
        this._selectedDate = new Date();
    }

    connectedCallback() {
        this.render();
    }

    get date() {
        return this._date;
    }

    set date(val) {
        this._date = val;
        this.render();
    }
    
    get selectedDate() {
        return this._selectedDate;
    }

    set selectedDate(val) {
        this._selectedDate = val;
        this.render();
    }

    render() {
        const year = this._date.getFullYear();
        const month = this._date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

        let dayCells = '';
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            dayCells += `<div class="day-cell empty"></div>`;
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const currentDate = new Date(year, month, i);
            const isSelected = this._selectedDate && currentDate.toDateString() === this._selectedDate.toDateString();
            dayCells += `<div class="day-cell ${isSelected ? 'selected' : ''}" data-date="${currentDate.toISOString()}">${i}</div>`;
        }

        this.shadowRoot.innerHTML = `
            <style>
                /* Add all the component-specific styles here */
                :host {
                    display: block;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .calendar-header button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--primary-color, #4a69bd);
                }
                .month-display {
                    font-size: 1.2rem;
                    font-weight: 500;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0.5rem;
                }
                .day-header, .day-cell {
                    text-align: center;
                    padding: 0.5rem;
                }
                .day-header {
                    font-weight: 500;
                    color: var(--secondary-text-color, #65676b);
                    font-size: 0.8rem;
                }
                .day-cell {
                    cursor: pointer;
                    border-radius: 50%;
                    transition: background-color 0.2s, color 0.2s;
                }
                .day-cell:not(.empty):hover {
                    background-color: var(--highlight-color, #e7f3ff);
                }
                .day-cell.selected {
                    background-color: var(--primary-color, #4a69bd);
                    color: white;
                    font-weight: 500;
                }
            </style>
            <div class="calendar-container">
                <div class="calendar-header">
                    <button id="prev-month">&lt;</button>
                    <span class="month-display">${year}년 ${monthNames[month]}</span>
                    <button id="next-month">&gt;</button>
                </div>
                <div class="calendar-grid">
                    ${['일', '월', '화', '수', '목', '금', '토'].map(d => `<div class="day-header">${d}</div>`).join('')}
                    ${dayCells}
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('prev-month').onclick = () => {
            const newDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
            this.date = newDate;
            this.dispatchEvent(new CustomEvent('month-changed', { detail: newDate }));
        };
        this.shadowRoot.getElementById('next-month').onclick = () => {
            const newDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
            this.date = newDate;
            this.dispatchEvent(new CustomEvent('month-changed', { detail: newDate }));
        };

        this.shadowRoot.querySelectorAll('.day-cell:not(.empty)').forEach(cell => {
            cell.onclick = (e) => {
                const newSelectedDate = new Date(e.target.dataset.date);
                this.selectedDate = newSelectedDate;
                this.dispatchEvent(new CustomEvent('date-selected', { detail: newSelectedDate }));
            };
        });
    }
}
customElements.define('calendar-view', CalendarView);


// --- Main Application Logic ---

function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

document.addEventListener('DOMContentLoaded', () => {
    const cwDisplay = document.getElementById('cw-display');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const yearSelector = document.getElementById('year-selector');
    const calendarView = document.querySelector('calendar-view');

    let currentYear = new Date().getFullYear();

    function updateDisplay(date) {
        const week = getISOWeek(date);
        cwDisplay.textContent = `CW ${week}`;
        
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
             selectedDateDisplay.textContent = '오늘';
        } else {
             selectedDateDisplay.textContent = date.toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric' 
            });
        }
    }
    
    function setupYearSelector() {
        yearSelector.innerHTML = '';
        for (let i = -5; i <= 5; i++) {
            const year = currentYear + i;
            const btn = document.createElement('button');
            btn.textContent = year;
            btn.onclick = () => {
                const newDate = new Date(year, calendarView.date.getMonth(), 1);
                calendarView.date = newDate;
                document.querySelector('.year-selector button.active').classList.remove('active');
                btn.classList.add('active');
            };
            if (year === calendarView.date.getFullYear()) {
                btn.classList.add('active');
            }
            yearSelector.appendChild(btn);
        }
    }

    calendarView.addEventListener('date-selected', (e) => {
        updateDisplay(e.detail);
    });

    calendarView.addEventListener('month-changed', (e) => {
        const year = e.detail.getFullYear();
        const activeButton = document.querySelector('.year-selector button.active');
        if (activeButton) {
            activeButton.classList.remove('active');
        }
        const newActiveButton = Array.from(yearSelector.querySelectorAll('button')).find(btn => btn.textContent == year);
        if (newActiveButton) {
            newActiveButton.classList.add('active');
        }
    });

    // Initial setup
    const today = new Date();
    calendarView.date = today;
    calendarView.selectedDate = today;
    updateDisplay(today);
    setupYearSelector();
});
