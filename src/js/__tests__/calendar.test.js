import { TripCalendarEngine } from '../TripCalendarEngine';
import moment from 'moment';

describe('TripCalendarEngine Unit Tests', () => {
  let engine;

  beforeEach(() => {
    engine = new TripCalendarEngine();
  });

  test('should initialize with today and current month', () => {
    expect(engine.today.isSame(moment(), 'day')).toBe(true);
    expect(engine.currentMonth.isSame(moment(), 'month')).toBe(true);
  });

  test('should flip months next and prev correctly', () => {
    const initial = engine.currentMonth.clone();

    engine.changeMonth('next');
    expect(engine.currentMonth.month()).toBe((initial.month() + 1) % 12);

    engine.changeMonth('prev');
    expect(engine.currentMonth.month()).toBe(initial.month());
  });

  test('should identify past dates as disabled for departure', () => {
    const yesterday = moment().subtract(1, 'day');
    expect(engine.isDateDisabled(yesterday, null, false)).toBe(true);
  });

  test('should allow future dates for departure', () => {
    const tomorrow = moment().add(1, 'day');
    expect(engine.isDateDisabled(tomorrow, null, false)).toBe(false);
  });

  test('should block return dates that are earlier than departure date', () => {
    const departureDate = moment().add(5, 'days');
    const invalidReturnDate = moment().add(3, 'days');

    expect(engine.isDateDisabled(invalidReturnDate, departureDate, true)).toBe(true);
  });
});