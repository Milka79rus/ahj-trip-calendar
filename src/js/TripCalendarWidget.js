import { TripCalendarEngine } from './TripCalendarEngine';

export class TripCalendarWidget {
    constructor(container) {
        this.container = container;
        this.engine = new TripCalendarEngine();

        this.departureDate = null; // Выбранная дата "Туда"
        this.returnDate = null; // Выбранная дата "Обратно"
        this.isRoundTrip = false; // Стоит ли галочка "Туда-обратно"

        this.init();
    }

    init() {
        this.renderStructure();
        this.bindEvents();
        this.renderCalendar();
    }

    renderStructure() {
        this.container.innerHTML = `
      <div class="trip-calendar-widget">
        <div class="form-group">
          <label>
            <input type="checkbox" id="round-trip-toggle"> Туда и обратно
          </label>
        </div>
        
        <div class="inputs-container">
          <div class="input-field">
            <label>Туда</label>
            <input type="text" id="departure-input" placeholder="Выберите дату" readonly>
            <div class="calendar-popover hidden" id="departure-calendar"></div>
          </div>
          
          <div class="input-field disabled" id="return-field">
            <label>Обратно</label>
            <input type="text" id="return-input" placeholder="Выберите дату" readonly disabled>
            <div class="calendar-popover hidden" id="return-calendar"></div>
          </div>
        </div>
      </div>
    `;
    }

    bindEvents() {
        const toggle = this.container.querySelector('#round-trip-toggle');
        const returnField = this.container.querySelector('#return-field');
        const returnInput = this.container.querySelector('#return-input');
        const depInput = this.container.querySelector('#departure-input');
        const depCalendar = this.container.querySelector('#departure-calendar');
        const retCalendar = this.container.querySelector('#return-calendar');

        // Переключатель "Туда и обратно"
        toggle.addEventListener('change', (e) => {
            this.isRoundTrip = e.target.checked;
            if (this.isRoundTrip) {
                returnField.classList.remove('disabled');
                returnInput.removeAttribute('disabled');
            } else {
                returnField.classList.add('disabled');
                returnInput.setAttribute('disabled', 'true');
                returnInput.value = '';
                this.returnDate = null;
                retCalendar.classList.add('hidden');
            }
        });

        // Открытие попапов при клике на инпуты
        depInput.addEventListener('click', () => {
            depCalendar.classList.remove('hidden');
            retCalendar.classList.add('hidden');
        });

        returnInput.addEventListener('click', () => {
            if (!this.isRoundTrip) return;
            retCalendar.classList.remove('hidden');
            depCalendar.classList.add('hidden');
        });

        // Закрытие при клике снаружи 
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                depCalendar.classList.add('hidden');
                retCalendar.classList.add('hidden');
            }
        });
    }

    renderCalendar() {
        const depCalendar = this.container.querySelector('#departure-calendar');
        const retCalendar = this.container.querySelector('#return-calendar');

        // Отрисовываем сетку для обоих календарей
        this.renderSingleCalendarGrid(depCalendar, false);
        this.renderSingleCalendarGrid(retCalendar, true);
    }

    renderSingleCalendarGrid(calendarElement, isReturnCalendar) {
        const monthGrid = this.engine.generateMonthGrid();
        const monthName = this.engine.currentMonth.format('MMMM YYYY');

        calendarElement.innerHTML = `
      <div class="calendar-header">
        <button class="prev-month-btn">&lt;</button>
        <span>${monthName}</span>
        <button class="next-month-btn">&gt;</button>
      </div>
      <div class="calendar-days-header">
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
      </div>
      <div class="calendar-grid"></div>
    `;

        const gridContainer = calendarElement.querySelector('.calendar-grid');

        monthGrid.forEach(date => {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-cell');

            if (!date) {
                dayCell.classList.add('empty');
            } else {
                dayCell.textContent = date.date();

                // Стилизация : сегодня, активный/неактивный
                if (this.engine.isToday(date)) {
                    dayCell.classList.add('today');
                }

                if (this.engine.isDateDisabled(date, this.departureDate, isReturnCalendar)) {
                    dayCell.classList.add('disabled');
                } else {
                    dayCell.addEventListener('click', () => {
                        if (!isReturnCalendar) {
                            this.departureDate = date;
                            this.container.querySelector('#departure-input').value = date.format('DD.MM.YYYY');
                            // Если дата "Обратно" вдруг оказалась раньше новой даты "Туда", сбрасываем её
                            if (this.returnDate && this.returnDate.isBefore(this.departureDate)) {
                                this.returnDate = null;
                                this.container.querySelector('#return-input').value = '';
                            }
                        } else {
                            this.returnDate = date;
                            this.container.querySelector('#return-input').value = date.format('DD.MM.YYYY');
                        }
                        calendarElement.classList.add('hidden');
                        this.renderCalendar();
                    });
                }
            }
            gridContainer.appendChild(dayCell);
        });

        // Навешиваем переключение месяцев
        calendarElement.querySelector('.prev-month-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.engine.changeMonth('prev');
            this.renderCalendar();
        });

        calendarElement.querySelector('.next-month-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.engine.changeMonth('next');
            this.renderCalendar();
        });
    }
}