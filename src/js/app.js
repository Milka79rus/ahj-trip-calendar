import { TripCalendarWidget } from "./TripCalendarWidget";


document.addEventListener("DOMContentLoaded", () => {
  const calendarContainer = document.getElementById("trip-calendar-container");
  if (calendarContainer) {
    // Создаем экземпляр класса. Метод init() отработает автоматически внутри конструктора.
    new TripCalendarWidget(calendarContainer);
  }
});
