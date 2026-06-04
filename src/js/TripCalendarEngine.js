import moment from 'moment';

export class TripCalendarEngine {
    constructor() {
        this.today = moment().startOf('day');
        this.currentMonth = moment().startOf('month'); // Тот месяц, который сейчас открыт в календаре
    }

    // Переключение месяца вперед/назад
    changeMonth(direction) {
        if (direction === 'next') {
            this.currentMonth.add(1, 'month');
        } else if (direction === 'prev') {
            this.currentMonth.subtract(1, 'month');
        }
        return this.currentMonth;
    }

    // Получить массив дней для сетки календаря (включая пустые ячейки в начале недели)
    generateMonthGrid() {
        const startOfMonth = this.currentMonth.clone().startOf('month');
        const daysInMonth = this.currentMonth.daysInMonth();

        const startDayOfWeek = startOfMonth.isoWeekday();

        const grid = [];

        // Заполняем пустые ячейки до первого дня месяца
        for (let i = 1; i < startDayOfWeek; i++) {
            grid.push(null);
        }

        // Заполняем реальными датами
        for (let day = 1; day <= daysInMonth; day++) {
            const date = this.currentMonth.clone().date(day);
            grid.push(date);
        }

        return grid;
    }


    isDateDisabled(date, departureDate = null, isReturnCalendar = false) {
        if (!date) return true;

        // Для даты "Туда": не раньше сегодняшнего дня
        if (!isReturnCalendar) {
            return date.isBefore(this.today, 'day');
        }

        // Для даты "Обратно": не раньше сегодняшнего дня и не раньше даты "Туда"
        const minDate = departureDate ? moment(departureDate).startOf('day') : this.today;
        return date.isBefore(minDate, 'day');
    }

    // Проверка: является ли дата сегодняшним днем
    isToday(date) {
        if (!date) return false;
        return date.isSame(this.today, 'day');
    }
}